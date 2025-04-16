import { expect, describe, it } from "vitest";
import { correctFloatingPoint } from "./number";

describe("correctFloatingPoint", () => {
  it("does not change a number that is already correct", () => {
    expect(correctFloatingPoint(1)).toEqual(1);
    expect(correctFloatingPoint(0.5)).toEqual(0.5);
    expect(correctFloatingPoint(73.5)).toEqual(73.5);
  });

  it("corrects floating point arithmetic imprecision", () => {
    // 0.1 + 0.2 typically results in 0.30000000000000004
    expect(correctFloatingPoint(0.1 + 0.2)).toEqual(0.3);
  });

  it("corrects imprecise trailing digits", () => {
    expect(correctFloatingPoint(0.30000000004)).toEqual(0.3);
    expect(correctFloatingPoint(73.499999999999)).toEqual(73.5);
  });

  it("handles zero correctly", () => {
    expect(correctFloatingPoint(0)).toEqual(0);
  });

  it("corrects negative imprecise numbers", () => {
    expect(correctFloatingPoint(-0.30000000004)).toEqual(-0.3);
    expect(correctFloatingPoint(-73.499999999999)).toEqual(-73.5);
  });

  it("leaves numbers unchanged when no imprecision is present", () => {
    expect(correctFloatingPoint(1.234567)).toEqual(1.234567);
    expect(correctFloatingPoint(42)).toEqual(42);
  });

  it("is idempotent", () => {
    // Correcting an already corrected number should yield the same value.
    const corrected = correctFloatingPoint(0.1 + 0.2);
    expect(correctFloatingPoint(corrected)).toEqual(corrected);
  });

  it("handles very small numbers correctly", () => {
    // For very small numbers, if there is no significant imprecision the original value should be returned.
    const smallNumber = 1e-12 + 1e-12; // Typically no floating point error here
    expect(correctFloatingPoint(smallNumber)).toEqual(smallNumber);
  });

  it("does not over-correct numbers that are sufficiently precise", () => {
    // Even though the algorithm checks for imprecision, it should not change values that appear precise
    const preciseNumber = 0.123456789;
    expect(correctFloatingPoint(preciseNumber)).toEqual(preciseNumber);
  });
});
