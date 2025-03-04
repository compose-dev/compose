import { describe, it, expect } from "vitest";
import { removeNullAndUndefined } from "./object";

describe("removeNullAndUndefined", () => {
  it("removes null and undefined values", () => {
    expect(removeNullAndUndefined({ a: null, b: undefined, c: "d" })).toEqual({
      c: "d",
    });
  });

  it("handles an empty object", () => {
    expect(removeNullAndUndefined({})).toEqual({});
  });

  it("handles an object with only null and undefined values", () => {
    expect(removeNullAndUndefined({ a: null, b: undefined })).toEqual({});
  });

  it("preserves non-null and non-undefined values", () => {
    const input = { a: 1, b: "string", c: false, d: 0, e: "", f: [], g: {} };
    expect(removeNullAndUndefined(input)).toEqual(input);
  });

  it("handles arrays", () => {
    const input = { arr: [1, null, 3, undefined, 5] };
    expect(removeNullAndUndefined(input)).toEqual({
      arr: [1, null, 3, undefined, 5],
    });
  });

  it("preserves falsy values that are not null or undefined", () => {
    const input = { a: false, b: 0, c: "", d: NaN };
    expect(removeNullAndUndefined(input)).toEqual(input);
  });

  it("handles objects with prototype properties", () => {
    const proto = { inheritedProp: "keep" };
    const obj = Object.create(proto);
    obj.ownProp = "also keep";
    obj.nullProp = null;

    const result = removeNullAndUndefined(obj);
    expect(result).toEqual({ ownProp: "also keep" });
    expect(result.inheritedProp).toBe(undefined);
  });
});
