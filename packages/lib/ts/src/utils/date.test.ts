import { toString, SerializedFormat, isValidISODateString } from "./date";
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

describe("isValidISODateString", () => {
  const validDates = [
    // naive ISO (no fractional, no offset)
    "2025-01-04T21:56:48",
    // fractional seconds 1–6 digits
    "2025-01-04T21:56:48.1",
    "2025-01-04T21:56:48.12",
    "2025-01-04T21:56:48.123",
    "2025-01-04T21:56:48.1234",
    "2025-01-04T21:56:48.12345",
    "2025-01-04T21:56:48.123456",
    // with Z
    "2025-01-04T21:56:48Z",
    "2025-01-04T21:56:48.123Z",
    "2025-01-04T21:56:48.123456Z",
    // with offsets
    "2025-01-04T21:56:48+00:00",
    "2025-01-04T21:56:48-05:30",
    "2025-01-04T21:56:48.123+05:45",
    // leap year
    "2020-02-29T12:00:00",
  ];

  const invalidDates = [
    // wrong separators or missing parts
    "20250104T215648Z",
    "2025-01-04 21:56:48",
    "2025-01-04T21:56",
    "2025-01-04",
    "21:56:48Z",
    // US style
    "10-20-2024",
    // out-of-range month/day/hour/min/sec
    "2025-13-01T00:00:00",
    "2025-00-01T00:00:00",
    "2025-01-32T00:00:00",
    "2025-04-31T00:00:00",
    "2025-01-04T24:00:00",
    "2025-01-04T23:60:00",
    "2025-01-04T23:59:60",
    // feb 29 on non-leap year
    "2025-02-29T00:00:00",
    // fractional seconds edge cases
    "2025-01-04T21:56:48.",
    "2025-01-04T21:56:48.1234567", // >6 digits
    // offset format wrong or out-of-range
    "2025-01-04T21:56:48+0000",
    "2025-01-04T21:56:48+24:00", // hour > 23
    "2025-01-04T21:56:48+05:60", // min > 59
    // random garbage
    "not-a-date",
    "",
  ];

  test("returns true for all valid ISO‐8601 date strings", () => {
    for (const dt of validDates) {
      expect(isValidISODateString(dt), `expected true for "${dt}"`).toBe(true);
    }
  });

  test("returns false for all invalid or non-ISO strings", () => {
    for (const dt of invalidDates) {
      expect(isValidISODateString(dt), `expected false for "${dt}"`).toBe(
        false
      );
    }
  });

  test("returns false for non-string inputs", () => {
    expect(isValidISODateString(null)).toBe(false);
    expect(isValidISODateString(undefined)).toBe(false);
    expect(isValidISODateString(12345)).toBe(false);
    expect(isValidISODateString({})).toBe(false);
    expect(isValidISODateString([])).toBe(false);
    expect(isValidISODateString(true)).toBe(false);
  });
});
