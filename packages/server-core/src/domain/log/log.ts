import { m } from "@compose/ts";
import { u as uPublic } from "@composehq/ts-public";
import { FastifyInstance } from "fastify";

import { db } from "../../models";

async function writeLogIfValid(
  server: FastifyInstance,
  message: string,
  data: Record<string, any> | null,
  severity: uPublic.log.Severity,
  type: uPublic.log.Type,
  companyId: string,
  environmentId: string,
  environmentType: m.Environment.Type,
  userId: string | null,
  userEmail: string | null,
  appRoute: string,
  companyPlan: m.Company.DB["plan"]
) {
  try {
    if (companyPlan !== m.Company.PLANS["PRO"]) {
      throw new Error(
        "Failed to write to audit log. Must be on a Pro plan to write to audit log."
      );
    }

    // will throw an error if the log is invalid
    uPublic.log.validateLog(message, data, severity);
  } catch (error) {
    await db.errorLog.insert(server.pg, {
      type: m.ErrorLog.ENTRY_TYPE.AUDIT_LOG_WRITE_ERROR,
      message: error instanceof Error ? error.message : String(error),
      auditLog: {
        message: message.slice(0, uPublic.log.MAX_LOG_MESSAGE_LENGTH_IN_CHARS),
        companyId,
        environmentId,
        userId,
        userEmail,
        appRoute,
      },
    });

    throw error;
  }

  await db.log.insert(
    server.pg,
    companyId,
    environmentId,
    environmentType,
    userId,
    userEmail,
    appRoute,
    message,
    data,
    severity,
    type
  );

  return { success: true };
}

export { writeLogIfValid };
