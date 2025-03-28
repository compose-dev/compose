import { m, u } from "@compose/ts";
import { FastifyInstance } from "fastify";

import { db } from "../../models";

async function insert(
  server: FastifyInstance,
  companyId: string,
  firstName: string,
  lastName: string,
  email: string,
  developmentEnvironmentId: string | null,
  permission: m.User.DB["permission"]
) {
  const user = await db.user.insert(
    server.pg,
    companyId,
    firstName,
    lastName,
    email,
    developmentEnvironmentId,
    permission
  );

  const accountType: m.User.AccountType = developmentEnvironmentId
    ? m.User.ACCOUNT_TYPE.DEVELOPER
    : m.User.ACCOUNT_TYPE.USER_ONLY;

  try {
    server.analytics.capture(
      server.analytics.event.USER_CREATED,
      user.id,
      user.companyId,
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType,
        permission: user.permission,
      }
    );

    server.analytics.identifyUser(
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.companyId,
      accountType,
      user.permission
    );
  } catch (error) {
    db.errorLog.insert(server.pg, {
      type: m.ErrorLog.ENTRY_TYPE.FAILED_TO_CREATE_USER,
      message: (error as Error).message,
      notes: "Failed in analytics step",
      userEmail: email,
    });
  }

  try {
    const company = await db.company.selectById(server.pg, user.companyId);

    if (!company) {
      throw new Error(
        "Company not found in DB while creating user in email service"
      );
    }

    server.email
      .createContact(
        user.id,
        user.email,
        user.firstName,
        user.lastName,
        user.companyId,
        company.name,
        accountType,
        user.permission,
        u.email.ATTRIBUTION.CREATE_ACCOUNT
      )
      .catch((error) => {
        db.errorLog.insert(server.pg, {
          type: m.ErrorLog.ENTRY_TYPE.FAILED_TO_CREATE_USER,
          message: (error as Error).message,
          notes: "Failed in email service step",
          userEmail: email,
        });
      });
  } catch (error) {
    db.errorLog.insert(server.pg, {
      type: m.ErrorLog.ENTRY_TYPE.FAILED_TO_CREATE_USER,
      message: (error as Error).message,
      notes: "Failed in email service step",
      email,
    });
  }

  return user;
}

export { insert };
