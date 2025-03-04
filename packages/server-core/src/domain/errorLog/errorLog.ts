import { m } from "@compose/ts";
import { FastifyInstance } from "fastify";

import { db } from "../../models";

/**
 * Logs an error string to the database.
 * @param server - The Fastify instance.
 * @param error - The error string to log.
 */
function logStringError(server: FastifyInstance, error: string) {
  db.errorLog.insert(server.pg, {
    type: m.ErrorLog.ENTRY_TYPE.UNCATEGORIZED,
    message: error,
  });
}

export { logStringError as log };
