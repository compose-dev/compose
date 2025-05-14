import { describe, expect, test } from "vitest";
import tableGenerator from "./table";

function generateData(rows: number) {
  return Array.from({ length: rows }, (_, i) => ({
    uuid: i,
  }));
}

const tenRows = generateData(10);
const twentyFiveHundredOneRows = generateData(2501);

describe("test table is selectable", () => {
  test("table is not selectable by default", () => {
    const table = tableGenerator("table", tenRows);

    expect(table.model.properties.allowSelect).toBe(false);
  });

  test("table is selectable if explicitly set to true", () => {
    const table = tableGenerator("table", tenRows, {
      selectable: true,
    });

    expect(table.model.properties.allowSelect).toBe(true);
  });

  test("table is selectable if deprecated allowSelect is set to true", () => {
    const table = tableGenerator("table", tenRows, {
      allowSelect: true,
    });

    expect(table.model.properties.allowSelect).toBe(true);
  });

  test("table is selectable if onChange is set", () => {
    const table = tableGenerator("table", tenRows, {
      onChange: () => {},
    });

    expect(table.model.properties.allowSelect).toBe(true);
  });

  test("table is not selectable if set true but paged", () => {
    const table = tableGenerator("table", twentyFiveHundredOneRows, {
      selectable: true,
    });
    expect(table.model.properties.allowSelect).toBe(false);

    const deprecatedTable = tableGenerator("table", twentyFiveHundredOneRows, {
      allowSelect: true,
    });
    expect(deprecatedTable.model.properties.allowSelect).toBe(false);
  });

  test("table is selectable if set true and paged and has id return type", () => {
    const table = tableGenerator("table", twentyFiveHundredOneRows, {
      selectable: true,
      selectionReturnType: "id",
    });
    expect(table.model.properties.allowSelect).toBe(true);

    const deprecatedTable = tableGenerator("table", twentyFiveHundredOneRows, {
      allowSelect: true,
      selectionReturnType: "id",
    });
    expect(deprecatedTable.model.properties.allowSelect).toBe(true);
  });

  test("table is selectable if set true and paged and has index return type", () => {
    const table = tableGenerator("table", twentyFiveHundredOneRows, {
      selectable: true,
      selectionReturnType: "index",
    });
    expect(table.model.properties.allowSelect).toBe(true);

    const deprecatedTable = tableGenerator("table", twentyFiveHundredOneRows, {
      allowSelect: true,
      selectionReturnType: "index",
    });
    expect(deprecatedTable.model.properties.allowSelect).toBe(true);
  });

  test("table is not selectable if not set and paged and has id return type", () => {
    const table = tableGenerator("table", twentyFiveHundredOneRows, {
      selectionReturnType: "id",
    });
    expect(table.model.properties.allowSelect).toBe(false);
  });

  test("table is not selectable if not set and paged and has index return type", () => {
    const table = tableGenerator("table", twentyFiveHundredOneRows, {
      selectionReturnType: "index",
    });
    expect(table.model.properties.allowSelect).toBe(false);
  });
});
