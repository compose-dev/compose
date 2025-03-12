import { BrowserToServerEvent, m } from "@compose/ts";
import { FastifyInstance } from "fastify";

import { d } from "../../domain";
import { db } from "../../models";
import { apiKeyService } from "../../services/apiKey";
import { GoogleOAuth } from "../../services/auth-google-oauth2/googleOauth";
import { parseCookieHeader } from "../../utils/cookie";

function getPersonalEnvironmentName(firstName: string): string {
  const possessiveForm = firstName.endsWith("s")
    ? `${firstName}'`
    : `${firstName}'s`;
  return `${possessiveForm} Dev Environment`;
}

async function routes(server: FastifyInstance) {
  // Create a new organization and user.
  server.post(
    `/${BrowserToServerEvent.CompleteSignUp.route}`,
    async (req, reply) => {
      const accessToken = req.headers["x-compose-goog-oauth2-access-token"];
      const body = req.body as BrowserToServerEvent.CompleteSignUp.RequestBody;

      const cookies = parseCookieHeader(req.headers.cookie);
      const affiliate: string | undefined = cookies["compose-affiliate-code"];

      const verificationResponse =
        await GoogleOAuth.verifyAccessToken(accessToken);

      if (verificationResponse.success === false) {
        return reply.status(400).send({
          message: "Something went wrong trying to login.",
          internalCode:
            BrowserToServerEvent.authUtils.SignUpErrorCode.UNKNOWN_ERROR,
        });
      }

      const email = verificationResponse.data.email;

      if (!email) {
        return reply.status(400).send({
          message:
            "Google authentication returned an invalid response. Please try again.",
          code: BrowserToServerEvent.GoogleOauthCallback.ErrorCode
            .UNKNOWN_ERROR,
        });
      }

      if (email !== body.email) {
        return reply.status(400).send({
          message: "Email mismatch.",
          code: BrowserToServerEvent.authUtils.SignUpErrorCode.EMAIL_MISMATCH,
        });
      }

      const existingUser = await db.user.selectByEmail(server.pg, email);

      if (existingUser) {
        return reply.status(400).send({
          message: "User already exists.",
          code: BrowserToServerEvent.authUtils.SignUpErrorCode
            .USER_ALREADY_EXISTS,
        });
      }

      const company = await d.company.insert(
        server,
        body.orgName,
        m.Company.PLANS.HOBBY,
        "",
        {
          ...m.Company.DEFAULT_FLAGS,
          [m.Company.FLAG_KEYS.AFFILIATE_CODE]: affiliate,
        }
      );

      try {
        const customer =
          await server.billing.gateway.createCustomerWithHobbySubscription(
            body.orgName,
            body.email,
            company.id
          );

        await db.company.addBillingId(server.pg, company.id, customer.id);
      } catch (e) {
        await db.company.deleteById(server.pg, company.id);
        return reply.status(500).send({
          message: "Failed to create customer within payments provider.",
          code: BrowserToServerEvent.authUtils.SignUpErrorCode.BILLING_ERROR,
        });
      }

      let devEnvironmentId: string | null = null;
      if (body.accountType === m.User.ACCOUNT_TYPE.DEVELOPER) {
        const environmentName = getPersonalEnvironmentName(body.firstName);

        const key = apiKeyService.generate("development");

        const devEnvironment = await db.environment.insert(
          server.pg,
          company.id,
          environmentName,
          m.Environment.TYPE.dev,
          key.oneWayHash,
          key.twoWayHash
        );

        if (devEnvironment) {
          devEnvironmentId = devEnvironment.id;
        } else {
          await db.errorLog.insert(server.pg, {
            type: m.ErrorLog.ENTRY_TYPE
              .FAILED_TO_CREATE_DEVELOPMENT_ENVIRONMENT,
            companyId: company.id,
            email: body.email,
          });
        }
      }

      const user = await d.user.insert(
        server,
        company.id,
        body.firstName,
        body.lastName,
        body.email,
        devEnvironmentId,
        // This route creates a new organization, so we automatically make the
        // user the owner of the organization.
        m.User.PERMISSION.OWNER
      );

      const session = await server.session.createUserSession(
        user.id,
        user.companyId,
        user.email
      );

      server.session.createAndAttachSessionCookie(session.id, reply);

      return reply.status(200).send({
        success: true,
      });
    }
  );

  // Create a new user in an existing organization.
  server.post(
    `/${BrowserToServerEvent.CompleteSignUpToOrg.route}`,
    async (req, reply) => {
      const accessToken = req.headers["x-compose-goog-oauth2-access-token"];
      const body =
        req.body as BrowserToServerEvent.CompleteSignUpToOrg.RequestBody;

      const verificationResponse =
        await GoogleOAuth.verifyAccessToken(accessToken);

      if (verificationResponse.success === false) {
        return reply.status(400).send({
          message: "Something went wrong trying to login.",
          internalCode:
            BrowserToServerEvent.authUtils.SignUpErrorCode.UNKNOWN_ERROR,
        });
      }

      const email = verificationResponse.data.email;

      if (!email) {
        return reply.status(400).send({
          message:
            "Google authentication returned an invalid response. Please try again.",
          code: BrowserToServerEvent.GoogleOauthCallback.ErrorCode
            .UNKNOWN_ERROR,
        });
      }

      const emailCode = await db.emailCode.selectByIdWithCompany(
        server.pg,
        body.inviteCode
      );

      if (!emailCode) {
        return reply.status(400).send({
          message: "Invalid invite code.",
          code: BrowserToServerEvent.authUtils.SignUpErrorCode.UNKNOWN_ERROR,
        });
      }

      if (emailCode.metadata.purpose !== m.EmailCode.PURPOSE.JOIN_COMPANY) {
        return reply.status(400).send({
          message: "Invalid invite code.",
          code: BrowserToServerEvent.authUtils.SignUpErrorCode.UNKNOWN_ERROR,
        });
      }

      if (!emailCode.companyId) {
        return reply.status(400).send({
          message: "Invalid invite code.",
          code: BrowserToServerEvent.authUtils.SignUpErrorCode.UNKNOWN_ERROR,
        });
      }

      if (Date.now() > new Date(emailCode.expiresAt).getTime()) {
        return reply.status(400).send({
          message: "Invite code expired.",
          code: BrowserToServerEvent.authUtils.SignUpErrorCode.UNKNOWN_ERROR,
        });
      }

      if (email !== emailCode.email) {
        return reply.status(400).send({
          message: "Email mismatch.",
          code: BrowserToServerEvent.authUtils.SignUpErrorCode.EMAIL_MISMATCH,
        });
      }

      const existingUser = await db.user.selectByEmail(server.pg, email);

      if (existingUser) {
        return reply.status(400).send({
          message: "User already exists.",
          code: BrowserToServerEvent.authUtils.SignUpErrorCode
            .USER_ALREADY_EXISTS,
        });
      }

      const company = await db.company.selectById(
        server.pg,
        emailCode.companyId
      );

      if (!company) {
        return reply.status(400).send({
          message: "Company not found.",
          code: BrowserToServerEvent.authUtils.SignUpErrorCode.UNKNOWN_ERROR,
        });
      }

      const customerBilling = await server.billing.fetchCustomer(
        server,
        company,
        server.pg
      );

      if (customerBilling.standardSeatsRemaining <= 0) {
        await customerBilling.updateSubscriptionStandardSeatQuantity(
          customerBilling.standardSeatsUsed + 1
        );
      }

      const environmentName = getPersonalEnvironmentName(body.firstName);

      const key = apiKeyService.generate("development");

      let devEnvironmentId: string | null = null;
      if (emailCode.metadata.accountType === m.User.ACCOUNT_TYPE.DEVELOPER) {
        const devEnvironment = await db.environment.insert(
          server.pg,
          emailCode.companyId,
          environmentName,
          m.Environment.TYPE.dev,
          key.oneWayHash,
          key.twoWayHash
        );

        devEnvironmentId = devEnvironment.id;
      }

      const permission = emailCode.metadata.permission;

      if (!permission) {
        await db.errorLog.insert(server.pg, {
          type: m.ErrorLog.ENTRY_TYPE.PERMISSION_NOT_FOUND_FOR_INVITE_CODE,
          emailCodeId: emailCode.id,
        });
      }

      const user = await d.user.insert(
        server,
        emailCode.companyId,
        body.firstName,
        body.lastName,
        email,
        devEnvironmentId,
        permission || m.User.PERMISSION.MEMBER
      );

      const session = await server.session.createUserSession(
        user.id,
        user.companyId,
        user.email
      );

      server.session.createAndAttachSessionCookie(session.id, reply);

      await db.emailCode.deleteById(server.pg, body.inviteCode);

      return reply.status(200).send({
        success: true,
      });
    }
  );
  server.get<{
    Params: {
      id: string;
    };
  }>(`/${BrowserToServerEvent.GetInviteCode.route}`, async (req, reply) => {
    const inviteCodeId = req.params.id;

    const inviteCode = await db.emailCode.selectByIdWithCompany(
      server.pg,
      inviteCodeId
    );

    if (!inviteCode) {
      return reply.status(404).send({
        message: "Invite code not found.",
      });
    }

    const response: BrowserToServerEvent.GetInviteCode.Response = inviteCode;

    return reply.status(200).send(response);
  });
}

export { routes as signupRoutes };
