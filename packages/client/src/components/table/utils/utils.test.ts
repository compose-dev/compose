import { describe, expect, test } from "vitest";
import { guessColumnFormat, guessTagColors } from "./utils";
import { UI } from "@composehq/ts-public";

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

describe("guessTagColors", () => {
  test("uses preset colors when provided", () => {
    const presets = {
      [UI.Table.TAG_COLOR.green]: "success",
      [UI.Table.TAG_COLOR.red]: "error",
      _default: UI.Table.TAG_COLOR.gray,
    };

    const data = [
      { status: "success" },
      { status: "error" },
      { status: "pending" },
    ];

    const result = guessTagColors(presets, data, "status");

    expect(result).toEqual({
      success: UI.Table.TAG_COLOR.green,
      error: UI.Table.TAG_COLOR.red,
      pending: UI.Table.TAG_COLOR.gray,
    });
  });

  test("handles array values in presets", () => {
    const presets = {
      [UI.Table.TAG_COLOR.green]: ["active", "online"],
      [UI.Table.TAG_COLOR.red]: "offline",
    };
    const data = [
      { status: "active" },
      { status: "offline" },
      { status: "online" },
    ];
    const result = guessTagColors(presets, data, "status");
    expect(result.active).toBe(UI.Table.TAG_COLOR.green);
    expect(result.online).toBe(UI.Table.TAG_COLOR.green);
    expect(result.offline).toBe(UI.Table.TAG_COLOR.red);
  });

  test("assigns semantic colors when available", () => {
    const presets = {};
    const data = [
      { status: "success" },
      { status: "error" },
      { status: "warning" },
    ];
    const result = guessTagColors(presets, data, "status");
    expect(result.success).toBe(UI.Table.TAG_COLOR.green);
    expect(result.error).toBe(UI.Table.TAG_COLOR.red);
    expect(result.warning).toBe(UI.Table.TAG_COLOR.orange);
  });

  test("distributes colors evenly when no presets or semantic matches", () => {
    const presets = {};
    const data = [{ category: "a" }, { category: "b" }, { category: "c" }];
    const result = guessTagColors(presets, data, "category");
    const usedColors = new Set(Object.values(result));
    expect(usedColors.size).toBe(3); // Should use different colors
    // Verify all used colors are valid TAG_COLORs
    for (const color of usedColors) {
      expect(Object.values(UI.Table.TAG_COLOR)).toContain(color);
    }
  });

  test("handles boolean values", () => {
    const presets = {
      [UI.Table.TAG_COLOR.green]: true,
      [UI.Table.TAG_COLOR.red]: false,
    };
    const data = [{ active: true }, { active: false }];
    const result = guessTagColors(presets, data, "active");
    expect(result["true"]).toBe(UI.Table.TAG_COLOR.green);
    expect(result["false"]).toBe(UI.Table.TAG_COLOR.red);
  });

  test("handles array values in data", () => {
    const presets = {
      [UI.Table.TAG_COLOR.blue]: ["tag1", "tag2"],
      [UI.Table.TAG_COLOR.green]: "tag3",
    };
    const data = [{ tags: ["tag1", "tag3"] }, { tags: ["tag2"] }];
    const result = guessTagColors(presets, data, "tags");
    expect(result.tag1).toBe(UI.Table.TAG_COLOR.blue);
    expect(result.tag2).toBe(UI.Table.TAG_COLOR.blue);
    expect(result.tag3).toBe(UI.Table.TAG_COLOR.green);
  });

  test("uses default color when specified", () => {
    const presets = {
      _default: UI.Table.TAG_COLOR.gray,
      [UI.Table.TAG_COLOR.green]: "active",
    };
    const data = [
      { status: "active" },
      { status: "pending" },
      { status: "unknown" },
    ];
    const result = guessTagColors(presets, data, "status");
    expect(result.active).toBe(UI.Table.TAG_COLOR.green);
    expect(result.pending).toBe(UI.Table.TAG_COLOR.gray);
    expect(result.unknown).toBe(UI.Table.TAG_COLOR.gray);
  });
  test("handles null values in data", () => {
    const presets = {};
    const data = [{ status: null }, { status: "active" }];
    const result = guessTagColors(presets, data, "status");
    expect(result.active).toBeDefined();
    // Null values should be ignored
    expect(result.null).toBeUndefined();
  });

  test("handles undefined values in data", () => {
    const presets = {};
    const data = [{ status: undefined }, { status: "active" }];
    const result = guessTagColors(presets, data, "status");
    expect(result.active).toBeDefined();
    // Undefined values should be ignored
    expect(result.undefined).toBeUndefined();
  });

  test("handles object values in data", () => {
    const presets = {};
    const data = [{ status: { foo: "bar" } }, { status: "active" }];
    const result = guessTagColors(presets, data, "status");
    expect(result.active).toBeDefined();
    // Object values should be ignored
    expect(result["[object Object]"]).toBeUndefined();
  });

  test("handles missing keys in data", () => {
    const presets = {
      [UI.Table.TAG_COLOR.green]: "active",
    };
    const data = [{ otherKey: "value" }, { status: "active" }];
    const result = guessTagColors(presets, data, "status");
    expect(result.active).toBe(UI.Table.TAG_COLOR.green);
  });
});
