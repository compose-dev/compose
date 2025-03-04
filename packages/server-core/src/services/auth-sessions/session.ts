import { IncomingMessage } from "http";

import { m } from "@compose/ts";
import { FastifyReply, FastifyRequest } from "fastify";
import { Cookie, Lucia, verifyRequestOrigin } from "lucia";

import { db } from "../../models";
import { Postgres } from "../postgres";

interface DatabaseSession {
  id: string;
  userId: string;
  expiresAt: Date;
  attributes: { companyId: string | null; email: string; isExternal: boolean };
}

interface DatabaseUser {
  id: string;
  attributes: { companyId: string | null; email: string; isExternal: boolean };
}

const FAKE_USER_ID = m.User.FAKE_ID;

const ERROR_MESSAGE = {
  MAX_LOOP_ITERATIONS:
    "Unauthorized to access app. Max loop iterations reached.",
  ENVIRONMENT_DOES_NOT_EXIST:
    "Unauthorized to access app. Environment does not exist.",
  UNAUTHORIZED: "Unauthorized to access app.",
} as const;

interface Adapter {
  deleteExpiredSessions(): Promise<void>;
  deleteSession(sessionId: string): Promise<void>;
  deleteUserSessions(userId: string): Promise<void>;
  getSessionAndUser(
    sessionId: string
  ): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]>;
  getUserSessions(userId: string): Promise<DatabaseSession[]>;
  setSession(session: DatabaseSession): Promise<void>;
  updateSessionExpiration(sessionId: string, expiresAt: Date): Promise<void>;
}

class LuciaDatabaseAdapter {
  private adapter: Adapter;

  constructor(pg: Postgres) {
    this.adapter = {
      deleteExpiredSessions: async () => await db.session.deleteExpired(pg),
      deleteSession: async (sessionId: string) =>
        await db.session.deleteById(pg, sessionId),
      deleteUserSessions: async (userId) =>
        await db.session.deleteByUserId(pg, userId),
      getSessionAndUser: async (sessionId: string) => {
        const response = await db.session.selectById(pg, sessionId);

        if (response === null) {
          return [null, null];
        }

        return [
          {
            id: response.id,
            userId: response.userId || FAKE_USER_ID,
            expiresAt: response.expiresAt,
            attributes: {
              companyId: response.companyId,
              email: response.email,
              isExternal: response.isExternal,
            },
          },
          {
            id: response.userId || FAKE_USER_ID,
            attributes: {
              companyId: response.companyId,
              email: response.email,
              isExternal: response.isExternal,
            },
          },
        ];
      },
      getUserSessions: async (userId: string) => {
        const response = await db.session.selectByUserId(pg, userId);

        return response.map((session) => ({
          id: session.id,
          userId: session.userId || FAKE_USER_ID,
          expiresAt: session.expiresAt,
          attributes: {
            companyId: session.companyId,
            email: session.email,
            isExternal: session.isExternal,
          },
        }));
      },
      setSession: async (session: DatabaseSession) => {
        await db.session.insert(
          pg,
          session.id,
          session.userId === FAKE_USER_ID ? null : session.userId,
          session.attributes.companyId,
          session.attributes.email,
          session.attributes.isExternal,
          session.expiresAt
        );
        return;
      },
      updateSessionExpiration: async (sessionId: string, expiresAt: Date) => {
        await db.session.updateExpiration(pg, sessionId, expiresAt);
        return;
      },
    };
  }

  getAdapter() {
    return this.adapter;
  }
}

class Session {
  private lucia: Lucia;
  private pg: Postgres;

  ERROR_MESSAGE = ERROR_MESSAGE;

  constructor(pg: Postgres) {
    this.pg = pg;
    const DBAdapter = new LuciaDatabaseAdapter(pg);

    this.lucia = new Lucia(DBAdapter.getAdapter(), {
      sessionCookie: {
        attributes: {
          // set to `true` when using HTTPS
          secure: process.env.NODE_ENV === "production",
        },
      },
      getUserAttributes: (attributes) => ({
        // @ts-expect-error Not typed yet
        companyId: attributes.companyId,
        // @ts-expect-error Not typed yet
        email: attributes.email,
        // @ts-expect-error Not typed yet
        isExternal: attributes.isExternal,
      }),
    });

    this.attachSessionCookie = this.attachSessionCookie.bind(this);
    this.clearSessionCookieIfExists =
      this.clearSessionCookieIfExists.bind(this);
    this.validateRequestOrigin = this.validateRequestOrigin.bind(this);
    this.createExternalUserSession = this.createExternalUserSession.bind(this);
    this.createUserSession = this.createUserSession.bind(this);
    this.createAndAttachSessionCookie =
      this.createAndAttachSessionCookie.bind(this);
    this.clearSession = this.clearSession.bind(this);
    this.validateSession = this.validateSession.bind(this);
    this.validateWsSession = this.validateWsSession.bind(this);
    this.validateAppUser = this.validateAppUser.bind(this);
  }

  private attachSessionCookie(cookie: Cookie, reply: FastifyReply) {
    reply.header("set-cookie", cookie.serialize());
  }

  private clearSessionCookieIfExists(reply: FastifyReply) {
    const sessionCookie = this.lucia.createBlankSessionCookie();
    this.attachSessionCookie(sessionCookie, reply);
  }

  private validateRequestOrigin(
    origin: string | undefined,
    host: string | undefined
  ) {
    if (!origin || !host) {
      return false;
    }

    const allowedHosts =
      process.env.NODE_ENV === "development" ? [origin] : [host];

    if (!verifyRequestOrigin(origin, allowedHosts)) {
      return false;
    }

    return true;
  }

  createExternalUserSession(email: string) {
    return this.lucia.createSession(FAKE_USER_ID, {
      companyId: null,
      email,
      isExternal: true,
    });
  }

  createUserSession(userId: string, companyId: string, email: string) {
    return this.lucia.createSession(userId, {
      companyId,
      email,
      isExternal: false,
    });
  }

  createSessionCookie(sessionId: string) {
    return this.lucia.createSessionCookie(sessionId);
  }

  createAndAttachSessionCookie(sessionId: string, reply: FastifyReply) {
    const sessionCookie = this.createSessionCookie(sessionId);
    this.attachSessionCookie(sessionCookie, reply);
  }

  async clearSession(req: FastifyRequest, reply: FastifyReply) {
    const cookieHeader = req.headers["cookie"];
    const sessionId = this.lucia.readSessionCookie(cookieHeader ?? "");

    this.clearSessionCookieIfExists(reply);

    if (!sessionId) {
      return;
    }

    await this.lucia.invalidateSession(sessionId);
  }

  async fetchUserDataIfExists(req: FastifyRequest) {
    const cookieHeader = req.headers["cookie"];
    const sessionId = this.lucia.readSessionCookie(cookieHeader ?? "");

    if (!sessionId) {
      return null;
    }

    const { session, user } = await this.lucia.validateSession(sessionId);
    if (!session || !user) {
      return null;
    }

    return {
      id: user.id,
      // @ts-expect-error Not typed yet
      companyId: user.companyId,
      // @ts-expect-error Not typed yet
      email: user.email,
      // @ts-expect-error Not typed yet
      isExternal: user.isExternal,
    } as
      | {
          id: string;
          companyId: string;
          email: string;
          isExternal: false;
        }
      | {
          id: null;
          companyId: null;
          email: string;
          isExternal: true;
        };
  }

  async validateSession(req: FastifyRequest, reply: FastifyReply) {
    const method = req.method.toUpperCase();

    if (
      method !== "GET" &&
      !this.validateRequestOrigin(req.headers["origin"], req.headers["host"])
    ) {
      this.clearSessionCookieIfExists(reply);
      return reply.status(403).send({ message: "Forbidden" });
    }

    const cookieHeader = req.headers["cookie"];
    const sessionId = this.lucia.readSessionCookie(cookieHeader ?? "");
    if (!sessionId) {
      this.clearSessionCookieIfExists(reply);
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const { session, user } = await this.lucia.validateSession(sessionId);
    if (!session) {
      this.clearSessionCookieIfExists(reply);
    }

    if (session && session.fresh) {
      this.createAndAttachSessionCookie(session.id, reply);
    }

    if (!user) {
      this.clearSessionCookieIfExists(reply);
      return reply.status(400).send({ message: "User not found" });
    }

    req.user = {
      id: user.id,
      // @ts-expect-error Not typed yet
      companyId: user.companyId,
      // @ts-expect-error Not typed yet
      email: user.email,
      // @ts-expect-error Not typed yet
      isExternal: user.isExternal,
    } as
      | {
          id: string;
          companyId: string;
          email: string;
          isExternal: false;
        }
      | {
          id: null;
          companyId: null;
          email: string;
          isExternal: true;
        };

    return;
  }

  async validateWsSession(
    req: IncomingMessage,
    appRoute: string | null,
    environmentId: string | null
  ) {
    if (
      !this.validateRequestOrigin(req.headers["origin"], req.headers["host"])
    ) {
      return false;
    }

    const cookieHeader = req.headers["cookie"];
    const sessionId = this.lucia.readSessionCookie(cookieHeader ?? "");

    if (!sessionId) {
      return false;
    }

    const { session, user } = await this.lucia.validateSession(sessionId);

    if (!session || !user) {
      return false;
    }

    const userId = user.id as string | null;
    // @ts-expect-error Not typed yet
    const companyId = user.companyId as string | null;
    // @ts-expect-error Not typed yet
    const email = user.email as string;
    // @ts-expect-error Not typed yet
    const isExternal = user.isExternal as boolean;

    if (appRoute || environmentId) {
      // If one is defined, the other should be too.
      if (!appRoute || !environmentId) {
        return false;
      }

      const { isValid } = await this.validateAppUser(
        appRoute,
        environmentId,
        companyId,
        email,
        isExternal
      );

      if (!isValid) {
        return false;
      }
    }

    return {
      id: userId,
      companyId: companyId,
      email: email,
      isExternal: isExternal,
    };
  }

  async validateAppUser(
    appRoute: string,
    environmentId: string,
    userCompanyId: string | null,
    userEmail: string,
    userIsExternal: boolean
  ): Promise<
    | {
        isValid: false;
        code: number;
        message: (typeof ERROR_MESSAGE)[keyof typeof ERROR_MESSAGE];
      }
    | {
        isValid: true;
        environment: m.Environment.ApiAndDecryptableKeyOmittedDB;
      }
  > {
    const environment = await db.environment.selectById(this.pg, environmentId);
    if (!environment) {
      return {
        isValid: false,
        code: 400,
        message: this.ERROR_MESSAGE.ENVIRONMENT_DOES_NOT_EXIST,
      };
    }

    // Option 1: Actual user using one of their org's apps.
    if (!userIsExternal && environment.companyId === userCompanyId) {
      return { isValid: true, environment };
    }

    let externalAppUsers =
      await db.externalAppUser.selectByAppRouteAndEnvironmentId(
        this.pg,
        appRoute,
        environmentId
      );

    let numUsersSearched = 0;
    let isAuthorized = false;

    // Since app routes can inherit permissions from other app routes, we need to
    // keep track of the app routes we've already searched so we don't do the
    // same search multiple times (which could lead to an infinite loop).
    const searchedAppRoutes: string[] = [appRoute];

    // Prevent infinite loops. Max loop iterations is 1 million.
    const maxLoopIterations = 1000 * 1000;

    // Instead of iterating over the externalAppUsers array, we iterate over the
    // numUsersSearched variable. This is because the externalAppUsers array
    // could increase in size as we search for permissions.
    while (numUsersSearched < externalAppUsers.length) {
      if (numUsersSearched > maxLoopIterations) {
        return {
          isValid: false,
          code: 401,
          message: this.ERROR_MESSAGE.MAX_LOOP_ITERATIONS,
        };
      }

      const externalAppUser = externalAppUsers[numUsersSearched];
      numUsersSearched++;

      // Option 2: Public app
      if (
        externalAppUser.email ===
        m.ExternalAppUser.EMAIL_FIELD_VALUE_FOR_PUBLIC_APP
      ) {
        isAuthorized = true;
        break;
      }

      // Option 3: Inherit permissions from another app. Grab the
      // parent app sharing permissions and add to list of app users to search.
      if (
        externalAppUser.email.startsWith(
          m.ExternalAppUser.INHERIT_PERMISSIONS_FROM_APP_PREFIX
        )
      ) {
        const parentAppRoute = externalAppUser.email.slice(
          m.ExternalAppUser.INHERIT_PERMISSIONS_FROM_APP_PREFIX.length
        );

        if (!searchedAppRoutes.includes(parentAppRoute)) {
          searchedAppRoutes.push(parentAppRoute);

          const parentExternalAppUsers =
            await db.externalAppUser.selectByAppRouteAndEnvironmentId(
              this.pg,
              parentAppRoute,
              environmentId
            );

          externalAppUsers = [...externalAppUsers, ...parentExternalAppUsers];
        }
      }

      // Option 4: Shared externally by email
      // Check's that the user's email is either an exact match against
      // the external app user's email (e.g. user@company.com matches user@company.com),
      // or a valid user against the external app user's email domain
      // (e.g. user@company.com matches company.com). The latter case is not yet
      // implemented fully as a feature, but the functionality exists here when it's
      // implemented.
      if (userEmail.endsWith(externalAppUser.email)) {
        isAuthorized = true;
        break;
      }
    }

    if (!isAuthorized) {
      return {
        isValid: false,
        code: 401,
        message: this.ERROR_MESSAGE.UNAUTHORIZED,
      };
    }

    return { isValid: true, environment };
  }
}

export { Session };
