import { describe, expect, test } from "vitest";
import { capitalize, prettifyKey } from "./string";

describe("capitalize", () => {
  test("handles empty string", () => {
    expect(capitalize("")).toBe("");
  });

  test("handles non-string input", () => {
    // @ts-expect-error - Testing invalid input
    expect(capitalize(123)).toBe(123);
  });

  test("capitalizes first letter of single word", () => {
    expect(capitalize("name")).toBe("Name");
  });

  test("only capitalizes first word if titleCase is false", () => {
    expect(capitalize("first name")).toBe("First name");
  });
});

describe("prettifyKey", () => {
  test("handles empty string", () => {
    expect(prettifyKey("")).toBe("");
  });

  test("handles non-string input", () => {
    // @ts-expect-error - Testing invalid input
    expect(prettifyKey(123)).toBe(123);
    // @ts-expect-error - Testing invalid input
    expect(prettifyKey(null)).toBe(null);
  });

  test("capitalizes first letter of single word", () => {
    expect(prettifyKey("name")).toBe("Name");
    expect(prettifyKey("name", false)).toBe("Name");
  });

  test("handles camelCase", () => {
    expect(prettifyKey("firstName")).toBe("First Name");
    expect(prettifyKey("firstName", false)).toBe("First name");
    expect(prettifyKey("lastLoginDate")).toBe("Last Login Date");
    expect(prettifyKey("lastLoginDate", false)).toBe("Last login date");
  });

  test("handles snake_case", () => {
    expect(prettifyKey("user_name")).toBe("User Name");
    expect(prettifyKey("user_name", false)).toBe("User name");
    expect(prettifyKey("last_login_time")).toBe("Last Login Time");
    expect(prettifyKey("last_login_time", false)).toBe("Last login time");
  });

  test("handles dash-case", () => {
    expect(prettifyKey("user-email")).toBe("User Email");
    expect(prettifyKey("created-at-date")).toBe("Created At Date");
  });

  test("handles ID fields", () => {
    expect(prettifyKey("id")).toBe("ID");
    expect(prettifyKey("id", false)).toBe("ID");

    expect(prettifyKey("userId")).toBe("User ID");
    expect(prettifyKey("userId", false)).toBe("User ID");

    expect(prettifyKey("user_id")).toBe("User ID");
    expect(prettifyKey("user-id")).toBe("User ID");
    expect(prettifyKey("ID")).toBe("ID");
    expect(prettifyKey("ID", false)).toBe("ID");

    expect(prettifyKey("UUID")).toBe("UUID");
    expect(prettifyKey("UUID", false)).toBe("UUID");

    expect(prettifyKey("userUuid")).toBe("User UUID");
    expect(prettifyKey("userUuid", false)).toBe("User UUID");
  });

  test("handles mixed cases", () => {
    expect(prettifyKey("user_firstName")).toBe("User First Name");
    expect(prettifyKey("user_firstName", false)).toBe("User first name");
    expect(prettifyKey("last-login_dateTime")).toBe("Last Login Date Time");
    expect(prettifyKey("last-login_dateTime", false)).toBe(
      "Last login date time"
    );
  });

  test("preserves acronyms", () => {
    expect(prettifyKey("HTMLContent")).toBe("HTML Content");
    expect(prettifyKey("HTMLContent", false)).toBe("HTML content");
    expect(prettifyKey("APIKey")).toBe("API Key");
    expect(prettifyKey("APIKey", false)).toBe("API key");
  });

  test("handles edge cases", () => {
    expect(prettifyKey("a")).toBe("A");
    expect(prettifyKey("alreadyFormattedProperly")).toBe(
      "Already Formatted Properly"
    );
    expect(prettifyKey("ALLCAPS")).toBe("ALLCAPS");
    expect(prettifyKey("")).toBe("");
  });

  test("preserves normal strings", () => {
    expect(prettifyKey("normal string")).toBe("Normal String");
    expect(prettifyKey("normal string", false)).toBe("Normal string");
    expect(prettifyKey("First Name")).toBe("First Name");
    expect(prettifyKey("First Name", false)).toBe("First name");
    expect(prettifyKey("First name", false)).toBe("First name");
  });
});
