import { BrowserToServerEvent, m } from "@compose/ts";
import {
  describe,
  beforeAll,
  afterEach,
  afterAll,
  expect,
  it,
  beforeEach,
  vi,
} from "vitest";

import { db } from "../../models";
import TestRunner from "../../testRunner.testUtils";

describe("External App User Routes", () => {
  let runner: TestRunner;

  beforeAll(async () => {
    runner = await TestRunner.create();
  });

  beforeEach(async () => {
    await runner.beforeEach();
  });

  afterEach(async () => {
    await runner.afterEach();
  });

  afterAll(async () => {
    await runner.afterAll();
  });

  describe("POST: Get External App Users", () => {
    it("should return empty for non-existent app", async () => {
      const seed = await runner.seedDatabase();

      const response = await runner.makeApiRequest({
        method: "POST",
        url: `/${BrowserToServerEvent.GetExternalAppUsers.route}`,
        payload: {
          appRoute: "test-app",
          environmentId: seed.developmentEnvironment.id,
        },
      });

      expect(Array.isArray(response.payload)).toBe(true);
      expect(response.payload.length).toBe(0);
    });

    it("should return empty for app without external users", async () => {
      const seed = await runner.seedDatabase();

      await db.environment.updateConfiguration(
        runner.server.pg,
        seed.developmentEnvironment.id,
        [
          {
            name: "test-app",
            route: "test-app",
            description: "test-app",
          },
        ],
        null,
        {}
      );

      const response = await runner.makeApiRequest({
        method: "POST",
        url: `/${BrowserToServerEvent.GetExternalAppUsers.route}`,
        payload: {
          appRoute: "test-app",
          environmentId: seed.developmentEnvironment.id,
        },
      });

      expect(Array.isArray(response.payload)).toBe(true);
      expect(response.payload.length).toBe(0);
    });

    it("should return external users for app with external users", async () => {
      const seed = await runner.seedDatabase();

      await db.environment.updateConfiguration(
        runner.server.pg,
        seed.developmentEnvironment.id,
        [
          {
            name: "test-app",
            route: "test-app",
            description: "test-app",
          },
        ],
        null,
        {}
      );

      await db.externalAppUser.insert(
        runner.server.pg,
        seed.company.id,
        "external-user@gmail.com",
        seed.developmentEnvironment.id,
        seed.user.id,
        "test-app"
      );

      const response = await runner.makeApiRequest({
        method: "POST",
        url: `/${BrowserToServerEvent.GetExternalAppUsers.route}`,
        payload: {
          appRoute: "test-app",
          environmentId: seed.developmentEnvironment.id,
        },
      });

      expect(Array.isArray(response.payload)).toBe(true);
      expect(response.payload.length).toBe(1);
      expect(response.payload[0].email).toBe("external-user@gmail.com");
    });
  });

  describe("POST: Insert External App User", () => {
    it("should insert external app user", async () => {
      await runner.seedDatabase({ plan: m.Company.PLANS.PRO });

      if (!runner.seed) {
        throw new Error("No seed found");
      }

      const response = await runner.makeApiRequest({
        method: "POST",
        url: `/${BrowserToServerEvent.InsertExternalAppUser.route}`,
        payload: {
          appRoute: "test-app",
          environmentId: runner.seed.developmentEnvironment.id,
          email: "external-user@gmail.com",
        },
      });

      expect(response.statusCode).toBe(200);

      const externalAppUsers =
        await db.externalAppUser.selectByAppRouteAndEnvironmentId(
          runner.server.pg,
          "test-app",
          runner.seed.developmentEnvironment.id
        );

      expect(externalAppUsers.length).toBe(1);
      expect(externalAppUsers[0].email).toBe("external-user@gmail.com");
    });

    it("should refuse to insert on hobby plan", async () => {
      await runner.seedDatabase({ plan: m.Company.PLANS.HOBBY });

      if (!runner.seed) {
        throw new Error("No seed found");
      }

      const response = await runner.makeApiRequest({
        method: "POST",
        url: `/${BrowserToServerEvent.InsertExternalAppUser.route}`,
        payload: {
          appRoute: "test-app",
          environmentId: runner.seed.developmentEnvironment.id,
          email: "external-user@gmail.com",
        },
      });

      expect(response.statusCode).toBeGreaterThanOrEqual(400);
      expect(response.payload.message.toLowerCase()).toContain(
        "cannot edit external seats for hobby subscriptions"
      );

      const externalAppUsers =
        await db.externalAppUser.selectByAppRouteAndEnvironmentId(
          runner.server.pg,
          "test-app",
          runner.seed.developmentEnvironment.id
        );

      expect(externalAppUsers.length).toBe(0);
    });

    it("should not allow sharing with themselves", async () => {
      await runner.seedDatabase();

      if (!runner.seed) {
        throw new Error("No seed found");
      }

      const response = await runner.makeApiRequest({
        method: "POST",
        url: `/${BrowserToServerEvent.InsertExternalAppUser.route}`,
        payload: {
          appRoute: "test-app",
          environmentId: runner.seed.developmentEnvironment.id,
          email: runner.seed.user.email,
        },
      });

      expect(response.statusCode).toBeGreaterThanOrEqual(400);
      expect(response.payload.message.toLowerCase()).toContain(
        "cannot share the app with yourself"
      );

      const externalAppUsers =
        await db.externalAppUser.selectByAppRouteAndEnvironmentId(
          runner.server.pg,
          "test-app",
          runner.seed.developmentEnvironment.id
        );

      expect(externalAppUsers.length).toBe(0);
    });

    it("should not allow sharing with organization user on production environment", async () => {
      await runner.seedDatabase();

      const otherEmail = "other-user@gmail.com";

      if (!runner.seed) {
        throw new Error("No seed found");
      }

      await db.user.insert(
        runner.server.pg,
        runner.seed.company.id,
        "Other",
        "User",
        otherEmail,
        null,
        m.User.PERMISSION.MEMBER,
        {}
      );

      const response = await runner.makeApiRequest({
        method: "POST",
        url: `/${BrowserToServerEvent.InsertExternalAppUser.route}`,
        payload: {
          appRoute: "test-app",
          environmentId: runner.seed.productionEnvironment.id,
          email: otherEmail,
        },
      });

      expect(response.statusCode).toBeGreaterThanOrEqual(400);
      expect(response.payload.message.toLowerCase()).toContain(
        "this user is part of your organization"
      );

      const externalAppUsers =
        await db.externalAppUser.selectByAppRouteAndEnvironmentId(
          runner.server.pg,
          "test-app",
          runner.seed.productionEnvironment.id
        );

      expect(externalAppUsers.length).toBe(0);
    });

    it("should allow sharing with organization user on development environment", async () => {
      await runner.seedDatabase({ freeUnlimitedUsage: true });

      const otherEmail = "other-user@gmail.com";

      if (!runner.seed) {
        throw new Error("No seed found");
      }

      await db.user.insert(
        runner.server.pg,
        runner.seed.company.id,
        "Other",
        "User",
        otherEmail,
        null,
        m.User.PERMISSION.MEMBER,
        {}
      );

      const response = await runner.makeApiRequest({
        method: "POST",
        url: `/${BrowserToServerEvent.InsertExternalAppUser.route}`,
        payload: {
          appRoute: "test-app",
          environmentId: runner.seed.developmentEnvironment.id,
          email: otherEmail,
        },
      });

      expect(response.statusCode).toBe(200);

      const externalAppUsers =
        await db.externalAppUser.selectByAppRouteAndEnvironmentId(
          runner.server.pg,
          "test-app",
          runner.seed.developmentEnvironment.id
        );

      expect(externalAppUsers.length).toBe(1);
      expect(externalAppUsers[0].email).toBe(otherEmail);
    });

    it("should not allow to share with same user twice", async () => {
      await runner.seedDatabase({ freeUnlimitedUsage: true });

      const externalUserEmail = "external-user@gmail.com";

      if (!runner.seed) {
        throw new Error("No seed found");
      }

      await db.externalAppUser.insert(
        runner.server.pg,
        runner.seed.company.id,
        externalUserEmail,
        runner.seed.developmentEnvironment.id,
        runner.seed.user.id,
        "test-app"
      );

      const response = await runner.makeApiRequest({
        method: "POST",
        url: `/${BrowserToServerEvent.InsertExternalAppUser.route}`,
        payload: {
          appRoute: "test-app",
          environmentId: runner.seed.developmentEnvironment.id,
          email: externalUserEmail,
        },
      });

      expect(response.statusCode).toBeGreaterThanOrEqual(400);
      expect(response.payload.message.toLowerCase()).toContain(
        `already been shared with ${externalUserEmail}`
      );
    });

    it("should not allow below app manager permission to share", async () => {
      await runner.seedDatabase({
        userPermission: m.User.PERMISSION.MEMBER,
        freeUnlimitedUsage: true,
      });

      if (!runner.seed) {
        throw new Error("No seed found");
      }

      const response = await runner.makeApiRequest({
        method: "POST",
        url: `/${BrowserToServerEvent.InsertExternalAppUser.route}`,
        payload: {
          appRoute: "test-app",
          environmentId: runner.seed.developmentEnvironment.id,
          email: "external-user@gmail.com",
        },
      });

      expect(response.statusCode).toBeGreaterThanOrEqual(400);
      expect(response.payload.message.toLowerCase()).toContain(
        "not authorized to share this app with external users"
      );
    });

    it("should allow app manager permission to share", async () => {
      await runner.seedDatabase({
        userPermission: m.User.PERMISSION.APP_MANAGER,
        freeUnlimitedUsage: true,
      });

      if (!runner.seed) {
        throw new Error("No seed found");
      }

      const response = await runner.makeApiRequest({
        method: "POST",
        url: `/${BrowserToServerEvent.InsertExternalAppUser.route}`,
        payload: {
          appRoute: "test-app",
          environmentId: runner.seed.developmentEnvironment.id,
          email: "external-user@gmail.com",
        },
      });

      expect(response.statusCode).toBe(200);

      const externalAppUsers =
        await db.externalAppUser.selectByAppRouteAndEnvironmentId(
          runner.server.pg,
          "test-app",
          runner.seed.developmentEnvironment.id
        );

      expect(externalAppUsers.length).toBe(1);
      expect(externalAppUsers[0].email).toBe("external-user@gmail.com");
    });

    it("should not increment external seat count if making app public", async () => {
      await runner.seedDatabase();

      if (!runner.seed) {
        throw new Error("No seed found");
      }

      vi.spyOn(runner.server.billing, "fetchCustomer").mockImplementation(
        () => {
          throw new Error("This should not be called!");
        }
      );

      const response = await runner.makeApiRequest({
        method: "POST",
        url: `/${BrowserToServerEvent.InsertExternalAppUser.route}`,
        payload: {
          appRoute: "test-app",
          environmentId: runner.seed.developmentEnvironment.id,
          email: m.ExternalAppUser.EMAIL_FIELD_VALUE_FOR_PUBLIC_APP,
        },
      });

      expect(response.statusCode).toBe(200);

      const externalAppUsers =
        await db.externalAppUser.selectByAppRouteAndEnvironmentId(
          runner.server.pg,
          "test-app",
          runner.seed.developmentEnvironment.id
        );

      expect(externalAppUsers.length).toBe(1);
      expect(externalAppUsers[0].email).toBe(
        m.ExternalAppUser.EMAIL_FIELD_VALUE_FOR_PUBLIC_APP
      );
    });
  });

  describe("DELETE: Delete External App User", () => {
    it("should not decrement external seat count if making app public", async () => {
      await runner.seedDatabase();

      if (!runner.seed) {
        throw new Error("No seed found");
      }

      vi.spyOn(runner.server.billing, "fetchCustomer").mockImplementation(
        () => {
          throw new Error("This should not be called!");
        }
      );

      const externalAppUser = await db.externalAppUser.insert(
        runner.server.pg,
        runner.seed.company.id,
        m.ExternalAppUser.EMAIL_FIELD_VALUE_FOR_PUBLIC_APP,
        runner.seed.developmentEnvironment.id,
        runner.seed.user.id,
        "test-app"
      );

      const response = await runner.makeApiRequest({
        method: "DELETE",
        url: `/${BrowserToServerEvent.DeleteExternalAppUser.route.replace(":id", externalAppUser.id)}`,
      });

      expect(response.statusCode).toBe(200);

      const externalAppUsers =
        await db.externalAppUser.selectByAppRouteAndEnvironmentId(
          runner.server.pg,
          "test-app",
          runner.seed.developmentEnvironment.id
        );

      expect(externalAppUsers.length).toBe(0);
    });
  });
});
