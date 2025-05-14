import { describe, expect, test } from "vitest";
import { guessTagColors } from "./tags";
import { UI } from "@composehq/ts-public";

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
      success: { color: UI.Table.TAG_COLOR.green, originalValue: "success" },
      error: { color: UI.Table.TAG_COLOR.red, originalValue: "error" },
      pending: { color: UI.Table.TAG_COLOR.gray, originalValue: "pending" },
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
    expect(result.active.color).toBe(UI.Table.TAG_COLOR.green);
    expect(result.active.originalValue).toBe("active");
    expect(result.online.color).toBe(UI.Table.TAG_COLOR.green);
    expect(result.online.originalValue).toBe("online");
    expect(result.offline.color).toBe(UI.Table.TAG_COLOR.red);
    expect(result.offline.originalValue).toBe("offline");
  });

  test("assigns semantic colors when available", () => {
    const presets = {};
    const data = [
      { status: "success" },
      { status: "error" },
      { status: "warning" },
    ];
    const result = guessTagColors(presets, data, "status");
    expect(result.success.color).toBe(UI.Table.TAG_COLOR.green);
    expect(result.success.originalValue).toBe("success");
    expect(result.error.color).toBe(UI.Table.TAG_COLOR.red);
    expect(result.error.originalValue).toBe("error");
    expect(result.warning.color).toBe(UI.Table.TAG_COLOR.orange);
    expect(result.warning.originalValue).toBe("warning");
  });

  test("distributes colors evenly when no presets or semantic matches", () => {
    const presets = {};
    const data = [{ category: "a" }, { category: "b" }, { category: "c" }];
    const result = guessTagColors(presets, data, "category");
    const usedColors = new Set(Object.values(result).map((r) => r.color));
    expect(usedColors.size).toBe(3); // Should use different colors
    // Verify all used colors are valid TAG_COLORs
    for (const color of usedColors) {
      expect(Object.values(UI.Table.TAG_COLOR)).toContain(color);
    }
    // Verify originalValues are preserved
    expect(result.a.originalValue).toBe("a");
    expect(result.b.originalValue).toBe("b");
    expect(result.c.originalValue).toBe("c");
  });

  test("handles boolean values", () => {
    const presets = {
      [UI.Table.TAG_COLOR.green]: true,
      [UI.Table.TAG_COLOR.red]: false,
    };
    const data = [{ active: true }, { active: false }];
    const result = guessTagColors(presets, data, "active");
    expect(result["true"].color).toBe(UI.Table.TAG_COLOR.green);
    expect(result["true"].originalValue).toBe(true);
    expect(result["false"].color).toBe(UI.Table.TAG_COLOR.red);
    expect(result["false"].originalValue).toBe(false);
  });

  test("handles array values in data", () => {
    const presets = {
      [UI.Table.TAG_COLOR.blue]: ["tag1", "tag2"],
      [UI.Table.TAG_COLOR.green]: "tag3",
    };
    const data = [{ tags: ["tag1", "tag3"] }, { tags: ["tag2"] }];
    const result = guessTagColors(presets, data, "tags");
    expect(result.tag1.color).toBe(UI.Table.TAG_COLOR.blue);
    expect(result.tag1.originalValue).toBe("tag1");
    expect(result.tag2.color).toBe(UI.Table.TAG_COLOR.blue);
    expect(result.tag2.originalValue).toBe("tag2");
    expect(result.tag3.color).toBe(UI.Table.TAG_COLOR.green);
    expect(result.tag3.originalValue).toBe("tag3");
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
    expect(result.active.color).toBe(UI.Table.TAG_COLOR.green);
    expect(result.active.originalValue).toBe("active");
    expect(result.pending.color).toBe(UI.Table.TAG_COLOR.gray);
    expect(result.pending.originalValue).toBe("pending");
    expect(result.unknown.color).toBe(UI.Table.TAG_COLOR.gray);
    expect(result.unknown.originalValue).toBe("unknown");
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
    expect(result.active.color).toBe(UI.Table.TAG_COLOR.green);
    expect(result.active.originalValue).toBe("active");
  });

  test("preserves numeric originalValues", () => {
    const presets = {
      [UI.Table.TAG_COLOR.green]: 1,
      [UI.Table.TAG_COLOR.red]: 2,
    };
    const data = [{ count: 1 }, { count: 2 }, { count: 3 }];
    const result = guessTagColors(presets, data, "count");
    expect(result["1"].color).toBe(UI.Table.TAG_COLOR.green);
    expect(result["1"].originalValue).toBe(1);
    expect(result["2"].color).toBe(UI.Table.TAG_COLOR.red);
    expect(result["2"].originalValue).toBe(2);
    expect(result["3"]).toBeDefined();
    expect(result["3"].originalValue).toBe(3);
  });

  test("preserves boolean originalValues", () => {
    const presets = {};
    const data = [{ isActive: true }, { isActive: false }];
    const result = guessTagColors(presets, data, "isActive");
    expect(result["true"].originalValue).toBe(true);
    expect(typeof result["true"].originalValue).toBe("boolean");
    expect(result["false"].originalValue).toBe(false);
    expect(typeof result["false"].originalValue).toBe("boolean");
  });
});
