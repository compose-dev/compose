import { m } from "@compose/ts";
import { describe, it, beforeAll, afterEach, afterAll, expect } from "vitest";

import TestRunner from "../../testRunner.testUtils";
import * as company from "../company";
import { externalAppUser, user } from "../db";

import * as environment from "./index";

describe("environment DB queries", () => {
  let runner: TestRunner;

  beforeAll(async () => {
    runner = await TestRunner.create();
  });

  afterEach(async () => {
    await runner.afterEach();
  });

  afterAll(async () => {
    await runner.afterAll();
  });

  it("should return empty external app users list when none exist", async () => {
    const c = await company.insert(
      runner.server.pg,
      "test",
      m.Company.PLANS.HOBBY,
      "",
      m.Company.DEFAULT_FLAGS
    );
    await environment.insert(
      runner.server.pg,
      c.id,
      "test-env",
      "development",
      "test-api-key",
      "test-decryptable-key"
    );

    const result =
      await environment.selectByCompanyIdWithDecryptableKeyAndExternalUsers(
        runner.server.pg,
        c.id
      );

    expect(Array.isArray(result[0].externalAppUsers)).toBe(true);
    expect(result[0].externalAppUsers.length).toBe(0);
  });

  it("should return empty external app users list when none exist", async () => {
    const c = await company.insert(
      runner.server.pg,
      "test",
      m.Company.PLANS.HOBBY,
      "",
      m.Company.DEFAULT_FLAGS
    );

    const env = await environment.insert(
      runner.server.pg,
      c.id,
      "test-env",
      "development",
      "test-api-key",
      "test-decryptable-key"
    );

    const result = await environment.selectByIdWithExternalUsers(
      runner.server.pg,
      env.id
    );

    expect(result).not.toBeNull();

    if (!result) {
      throw new Error("Result is null");
    }

    expect(Array.isArray(result!.externalAppUsers)).toBe(true);
    expect(result!.externalAppUsers.length).toBe(0);
  });

  it("should return an external app user when one exists", async () => {
    const c = await company.insert(
      runner.server.pg,
      "test",
      m.Company.PLANS.HOBBY,
      "",
      m.Company.DEFAULT_FLAGS
    );

    const env = await environment.insert(
      runner.server.pg,
      c.id,
      "test-env",
      "development",
      "test-api-key",
      "test-decryptable-key"
    );

    if (!env) {
      throw new Error("Environment is null");
    }

    const u = await user.insert(
      runner.server.pg,
      c.id,
      "Atul",
      "Jalan",
      "atul@composehq.com",
      env.id,
      m.User.PERMISSION.OWNER,
      {}
    );

    await externalAppUser.insert(
      runner.server.pg,
      c.id,
      "test-user@test.com",
      env.id,
      u.id,
      "test-app-route"
    );

    const result = await environment.selectByIdWithExternalUsers(
      runner.server.pg,
      env.id
    );

    if (!result) {
      throw new Error("Result is null");
    }

    expect(Array.isArray(result!.externalAppUsers)).toBe(true);
    expect(result!.externalAppUsers.length).toBe(1);
    expect(result!.externalAppUsers[0].email).toBe("test-user@test.com");
    expect(result!.externalAppUsers[0].appRoute).toBe("test-app-route");
  });
});
