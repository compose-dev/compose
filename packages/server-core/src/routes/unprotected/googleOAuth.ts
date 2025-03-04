import { BrowserToServerEvent } from "@compose/ts";
import { FastifyInstance } from "fastify";

import { d } from "../../domain";
import { db } from "../../models";
import { GoogleOAuth } from "../../services/auth-google-oauth2/googleOauth";

const GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_OAUTH_RESPONSE_TYPE = "token";
/**
 * Space delimited list of scopes
 * https://developers.google.com/identity/protocols/oauth2/scopes
 */
const GOOGLE_OAUTH_SCOPE =
  "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid";
const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;

async function routes(server: FastifyInstance) {
  server.post<{
    Body: BrowserToServerEvent.OauthLogin.RequestBody;
    Reply:
      | BrowserToServerEvent.OauthLogin.SuccessResponseBody
      | BrowserToServerEvent.OauthLogin.ErrorResponseBody;
  }>(`/${BrowserToServerEvent.OauthLogin.route}`, async (req, reply) => {
    const body = req.body;

    if (
      body.provider === BrowserToServerEvent.OauthLogin.OAUTH_PROVIDER.GOOGLE
    ) {
      if (!GOOGLE_OAUTH_CLIENT_ID) {
        d.errorLog.log(server, "Google OAuth client ID is not set.");
        return reply.status(500).send({
          message: "Google OAuth client ID is not set.",
        });
      }

      const url = new URL(GOOGLE_OAUTH_URL);
      url.searchParams.set("client_id", GOOGLE_OAUTH_CLIENT_ID);
      url.searchParams.set("response_type", GOOGLE_OAUTH_RESPONSE_TYPE);
      url.searchParams.set("scope", GOOGLE_OAUTH_SCOPE);
      url.searchParams.set("redirect_uri", body.redirect);

      return reply.status(200).send({
        url: url.toString(),
      });
    }

    return reply.status(400).send({
      message: "Invalid provider.",
    });
  });
  server.post(
    `/${BrowserToServerEvent.GoogleOauthCallback.route}`,
    async (req, reply) => {
      const accessToken = req.headers["x-compose-goog-oauth2-access-token"];
      const body =
        req.body as BrowserToServerEvent.GoogleOauthCallback.RequestBody;

      const verificationResponse =
        await GoogleOAuth.verifyAccessToken(accessToken);

      if (verificationResponse.success === false) {
        return reply.status(400).send({
          message: "Something went wrong trying to login.",
          internalCode:
            BrowserToServerEvent.GoogleOauthCallback.ErrorCode.UNKNOWN_ERROR,
        });
      }

      const email = verificationResponse.data.email;

      if (!email) {
        return reply.status(400).send({
          message:
            "Google authentication returned an invalid response. Please try again.",
          internalCode:
            BrowserToServerEvent.GoogleOauthCallback.ErrorCode.UNKNOWN_ERROR,
        });
      }

      const dbUser = await db.user.selectByEmail(server.pg, email);

      // If the user is not found and the newAccount flag is set,
      // then go through the new user flow. If the user is found,
      // just log them in normally.
      if (dbUser === null && body.newAccount === true) {
        const userInfoResponse = await GoogleOAuth.getUserInfo(
          accessToken as string
        );

        if (userInfoResponse.success === false) {
          return reply.status(400).send({
            message:
              "Something went wrong trying to fetch the user profile information.",
            internalCode:
              BrowserToServerEvent.GoogleOauthCallback.ErrorCode.UNKNOWN_ERROR,
          });
        }

        const firstName = userInfoResponse.data.given_name || null;
        const lastName = userInfoResponse.data.family_name || null;

        return reply.code(200).send({
          firstName,
          lastName,
          email,
          type: BrowserToServerEvent.GoogleOauthCallback.RESPONSE_TYPE.NEW_USER,
        });
      }

      // This is a direct app login - check if the user has permissions to access the app
      if (body.environmentId !== null && body.appRoute !== null) {
        const response = await server.session.validateAppUser(
          body.appRoute,
          body.environmentId,
          dbUser === null ? null : dbUser.companyId,
          email,
          dbUser === null
        );

        if (response.isValid === false) {
          return reply.status(response.code).send({
            message: response.message,
            internalCode:
              BrowserToServerEvent.GoogleOauthCallback.ErrorCode.UNKNOWN_ERROR,
          });
        }
      } else {
        // This is a normal login - check if the user exists
        if (dbUser === null) {
          return reply.status(400).send({
            message: "User not found.",
            internalCode:
              BrowserToServerEvent.GoogleOauthCallback.ErrorCode.USER_NOT_FOUND,
          });
        }
      }

      const session = dbUser
        ? await server.session.createUserSession(
            dbUser.id,
            dbUser.companyId,
            dbUser.email
          )
        : await server.session.createExternalUserSession(email);

      server.session.createAndAttachSessionCookie(session.id, reply);

      return reply.code(200).send({
        type: BrowserToServerEvent.GoogleOauthCallback.RESPONSE_TYPE
          .EXISTING_USER,
      });
    }
  );
}

export { routes as googleOAuthRoutes };
