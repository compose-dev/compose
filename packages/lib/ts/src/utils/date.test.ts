import { toString, SerializedFormat } from "./date";
import { describe, test, expect } from "vitest";

describe("date.toString", () => {
  // Test L/d format - should format month/day correctly
  test("L/d format", () => {
    const date = new Date("2023-10-15T12:00:00Z");
    expect(toString(date, SerializedFormat["L/d"])).toBe("10/15");
  });

  // Test L/d/yyyy format - should include full year
  test("L/d/yyyy format", () => {
    const date = new Date("2023-10-15T12:00:00Z");
    expect(toString(date, SerializedFormat["L/d/yyyy"])).toBe("10/15/2023");
  });

  // Test L/d/yy format - should show abbreviated 2-digit year
  test("L/d/yy format", () => {
    const date = new Date("2023-10-15T12:00:00Z");
    expect(toString(date, SerializedFormat["L/d/yy"])).toBe("10/15/23");
  });

  // Test LLL d format - should show abbreviated month name
  test("LLL d format", () => {
    const date = new Date("2023-10-15T12:00:00Z");
    expect(toString(date, SerializedFormat["LLL d"])).toBe("Oct 15");
  });

  // Test LLL d, yyyy format - should show abbreviated month with full year
  test("LLL d, yyyy format", () => {
    const date = new Date("2023-10-15T12:00:00Z");
    expect(toString(date, SerializedFormat["LLL d, yyyy"])).toBe(
      "Oct 15, 2023"
    );
  });

  // Test h:mm a format - should show 12-hour time with AM/PM
  test("h:mm a format", () => {
    const morning = new Date("2023-10-15T09:30:00Z");
    const evening = new Date("2023-10-15T21:30:00Z");
    expect(toString(morning, SerializedFormat["h:mm a"], true)).toBe("9:30 AM");
    expect(toString(evening, SerializedFormat["h:mm a"], true)).toBe("9:30 PM");
  });

  // Test LLL d, yyyy h:mm a format - should show full date and 12-hour time
  test("LLL d, yyyy h:mm a format", () => {
    const date = new Date("2023-10-15T14:30:00Z");
    expect(toString(date, SerializedFormat["LLL d, yyyy h:mm a"], true)).toBe(
      "Oct 15, 2023 2:30 PM"
    );
  });

  // Test UTC flag behavior - should respect UTC when true
  test("UTC flag behavior", () => {
    const date = new Date("2023-10-15T14:30:00Z");
    expect(toString(date, SerializedFormat["LLL d, yyyy h:mm a"], true)).toBe(
      "Oct 15, 2023 2:30 PM"
    );
  });

  // Test edge cases - midnight/noon hour display
  test("edge cases - midnight and noon", () => {
    const midnight = new Date("2023-10-15T00:00:00Z");
    const noon = new Date("2023-10-15T12:00:00Z");
    expect(toString(midnight, SerializedFormat["h:mm a"], true)).toBe(
      "12:00 AM"
    );
    expect(toString(noon, SerializedFormat["h:mm a"], true)).toBe("12:00 PM");
  });
});
