import fs from "fs";
import path from "path";

import { m } from "@compose/ts";
import { FastifyInstance, InjectOptions } from "fastify";
import { Cookie, Session } from "lucia";
import { vi } from "vitest";

import { createServer } from "./createServer";
import { db } from "./models";
import { analyticsFastifyPlugin } from "./services/analytics";
import { apiKeyService } from "./services/apiKey";
import { sessionFastifyPlugin } from "./services/auth-sessions";
import { billingFastifyPlugin } from "./services/billing";
import { emailFastifyPlugin } from "./services/email";
import { postgresFastifyPlugin } from "./services/postgres";

class TestRunner {
  private _server: FastifyInstance;
  private _seed: {
    company: m.Company.DB;
    user: m.User.DB;
    developmentEnvironment: m.Environment.ApiAndDecryptableKeyOmittedDB;
    productionEnvironment: m.Environment.ApiAndDecryptableKeyOmittedDB;
    session: Session;
    sessionCookie: Cookie;
    billingSubscriptionId: string;
  } | null = null;

  private constructor(server: FastifyInstance) {
    this._server = server;
    this._seed = null;
  }

  static async create() {
    const { server } = await createServer([
      // Always register postgres then session plugin first and second.
      [
        postgresFastifyPlugin,
        {
          user: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
          host: process.env.POSTGRES_HOSTNAME,
          port: parseInt(process.env.TEST_POSTGRES_CONTAINER_PORT || "5433"),
        },
      ],
      [sessionFastifyPlugin, {}],
      [analyticsFastifyPlugin, {}],
      [emailFastifyPlugin, {}],
      [billingFastifyPlugin, {}],
    ]);

    await TestRunner.runDatabaseMigrations(server);
    vi.clearAllMocks();

    return new TestRunner(server);
  }

  get server() {
    return this._server;
  }

  /**
   * Does nothing.
   */
  async beforeEach() {
    return;
  }

  async afterEach() {
    await TestRunner.clearAllTables(this._server);
    await this.clearSeed();
  }

  async afterAll() {
    await TestRunner.teardownDatabase(this._server);
    await this.clearSeed();
    await this._server.close();
  }

  /**
   * Seed the database with the following: Company, User, Development Environment, Production Environment, User Session, Session Cookie, Billing Service
   *
   * @param options.plan - The plan to seed the company with. Defaults to hobby.
   * @param options.freeUnlimitedUsage - Whether to seed the company with free unlimited usage flag set to true. Defaults to false.
   * @param options.userPermission - The permission to seed the user with. Defaults to owner.
   */
  async seedDatabase(
    options: Partial<{
      plan: m.Company.DB["plan"];
      freeUnlimitedUsage: boolean;
      userPermission: m.User.DB["permission"];
    }> = {}
  ) {
    const plan = options.plan ?? m.Company.PLANS.HOBBY;
    const freeUnlimitedUsage = options.freeUnlimitedUsage ?? false;
    const userPermission = options.userPermission ?? m.User.PERMISSION.OWNER;

    const fakeBillingCustomerId = "fake-billing-customer-id";

    const flags: m.Company.DB["flags"] = {
      ...m.Company.DEFAULT_FLAGS,
      FRIENDS_AND_FAMILY_FREE: freeUnlimitedUsage,
    };

    const company = await db.company.insert(
      this._server.pg,
      "Test Company",
      plan,
      fakeBillingCustomerId,
      flags
    );

    const developmentKey = apiKeyService.generate("development");
    const productionKey = apiKeyService.generate("production");

    const developmentEnvironment = await db.environment.insert(
      this._server.pg,
      company.id,
      "Development",
      m.Environment.TYPE.dev,
      developmentKey.oneWayHash,
      developmentKey.twoWayHash
    );

    const productionEnvironment = await db.environment.insert(
      this._server.pg,
      company.id,
      "Production",
      m.Environment.TYPE.prod,
      productionKey.oneWayHash,
      productionKey.twoWayHash
    );

    const user = await db.user.insert(
      this._server.pg,
      company.id,
      "Atul",
      "Jalan",
      "atul@composehq.com",
      developmentEnvironment.id,
      userPermission,
      {}
    );

    const session = await this._server.session.createUserSession(
      user.id,
      user.companyId,
      user.email
    );

    const sessionCookie = this._server.session.createSessionCookie(session.id);

    const billingSubscriptionId = "fake-subscription-id";

    this._seed = {
      company,
      user,
      developmentEnvironment,
      productionEnvironment,
      session,
      sessionCookie,
      billingSubscriptionId,
    };

    return this._seed;
  }

  async clearSeed() {
    vi.clearAllMocks();
    this._seed = null;
  }

  get seed() {
    return this._seed;
  }

  async makeApiRequest(
    options: InjectOptions &
      Partial<{
        verifyOrigin: boolean;
        useSessionCookie: boolean;
      }>
  ) {
    const useSessionCookie = options.useSessionCookie ?? true;
    const verifyOrigin = options.verifyOrigin ?? true;

    if (useSessionCookie && this._seed?.sessionCookie) {
      options.cookies = {
        [this._seed.sessionCookie.name]: this._seed.sessionCookie.value,
      };
    }

    if (verifyOrigin) {
      options.headers = {
        ...(options.headers || {}),
        origin: "https://app.composehq.com",
        host: "https://app.composehq.com",
      };
    }

    const response = await this._server.inject({ ...options });

    return {
      raw: response,
      payload: response.payload
        ? JSON.parse(response.payload)
        : response.payload,
      statusCode: response.statusCode,
    };
  }

  static async runDatabaseMigrations(server: FastifyInstance) {
    // Drop everything just to be safe.
    await TestRunner.teardownDatabase(server);

    // Read the all.sql file
    const allSqlPath = path.join(__dirname, "../../../db-migrations/all.sql");
    const allSql = fs.readFileSync(allSqlPath, "utf8");
    const allSqlLines = allSql
      .split("\n")
      .filter((line) => line.trim()) // Remove empty lines
      .map((line) => line.replace("\\i ", ""));

    for (const line of allSqlLines) {
      const filePath = path.join(__dirname, `../../../db-migrations/${line}`);
      const fileContent = fs.readFileSync(filePath, "utf8");
      await server.pg.query(fileContent);
    }
  }

  /**
   * Clear all tables in the database.
   */
  static async clearAllTables(server: FastifyInstance) {
    const tables = await server.pg.query<{ tablename: string }>(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public'"
    );

    for (const { tablename } of tables.rows) {
      await server.pg.query(`DELETE FROM "${tablename}"`);
    }
  }

  /**
   * Drop all tables, indexes, and types in the public schema of the database.
   */
  static async teardownDatabase(server: FastifyInstance) {
    await server.pg.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO public;
    `);
  }
}

export default TestRunner;
