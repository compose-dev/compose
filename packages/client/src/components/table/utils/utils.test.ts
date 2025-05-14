import { describe, expect, test } from "vitest";
import { guessColumnFormat } from "./utils";

describe("guessColumnFormat", () => {
  const mockDate = "2023-05-01T12:00:00.000Z";

  test("returns undefined for empty data", () => {
    expect(guessColumnFormat([], "anyKey")).toBeUndefined();
  });

  test("detects boolean format", () => {
    const data = [{ isActive: true }, { isActive: false }];
    expect(guessColumnFormat(data, "isActive")).toBe("boolean");
  });

  test("detects date format", () => {
    const data = [
      { createdAt: mockDate },
      { createdAt: "2023-06-15T09:30:00.000Z" },
    ];
    expect(guessColumnFormat(data, "createdAt")).toBe("date");
  });

  test("detects number format", () => {
    const data = [{ count: 1 }, { count: 2 }, { count: 3 }];
    expect(guessColumnFormat(data, "count")).toBe("number");
  });

  test("returns undefined for string format", () => {
    const data = [{ name: "John" }, { name: "Jane" }];
    expect(guessColumnFormat(data, "name")).toBeUndefined();
  });

  test("returns undefined for mixed types", () => {
    const data = [{ value: 1 }, { value: "string" }];
    expect(guessColumnFormat(data, "value")).toBeUndefined();
  });

  test("handles missing keys", () => {
    const data = [{ a: 1 }, { b: 2 }];
    expect(guessColumnFormat(data, "c")).toBeUndefined();
  });

  test("checks only first 10 rows for large datasets", () => {
    const data = Array(20)
      .fill(0)
      .map((_, i) => ({ num: i }));
    // @ts-expect-error - Testing invalid input
    data[15].num = "not a number";
    expect(guessColumnFormat(data, "num")).toBe("number");
  });

  test("only returns date format if all dates are ISO strings", () => {
    const data = [
      { date: "2023-05-01T12:00:00Z" },
      { date: "2023-06-15" },
      { date: "2023-07-20T15:30:00+02:00" },
    ];
    expect(guessColumnFormat(data, "date")).toBeUndefined();
  });

  test("returns undefined for invalid date strings", () => {
    const data = [{ date: "2023-05-01T12:00:00Z" }, { date: "invalid date" }];
    expect(guessColumnFormat(data, "date")).toBeUndefined();
  });

  test("handles edge cases", () => {
    expect(guessColumnFormat([{ a: null }], "a")).toBeUndefined();
    expect(guessColumnFormat([{ a: undefined }], "a")).toBeUndefined();
    expect(guessColumnFormat([{}], "a")).toBeUndefined();
  });
});
