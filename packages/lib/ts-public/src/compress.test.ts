import { describe, expect, test } from "vitest";
import * as Generator from "./generator";
import * as compress from "./compress";

describe("compress", () => {
  test("non-table component is not compressed", () => {
    const layout = Generator.display.text("YO");
    const compressed = compress.uiTree(layout);
    expect(JSON.stringify(compressed)).toEqual(JSON.stringify(layout));
  });

  test("doesn't error on empty table", () => {
    const layout = Generator.input.table("table", []);

    const compressed = compress.uiTree(layout);

    const precompressedLayout = Generator.input.table("table", []);

    expect(JSON.stringify(compressed)).toEqual(
      JSON.stringify(precompressedLayout)
    );
  });

  test("table component keys are compressed", () => {
    const layout = Generator.input.table("table", [
      {
        id: "1",
        name: "row 1",
      },
      {
        id: "2",
        name: "row 2",
      },
    ]);

    const compressed = compress.uiTree(layout);

    const precompressedLayout = Generator.input.table("table", [
      {
        "0": "1",
        "1": "row 1",
      },
      {
        "0": "2",
        "1": "row 2",
      },
    ]);

    expect(JSON.stringify(compressed.model.properties.data)).toEqual(
      JSON.stringify(precompressedLayout.model.properties.data)
    );
  });

  test("compresses table with string columns", () => {
    const layout = Generator.input.table(
      "table",
      [
        { id: "1", name: "row 1" },
        { id: "2", name: "row 2" },
      ],
      {
        columns: ["id"],
      }
    );

    const compressed = compress.uiTree(layout);

    const precompressedLayout = Generator.input.table(
      "table",
      [{ "0": "1" }, { "0": "2" }],
      {
        columns: ["id"],
      }
    );

    expect(JSON.stringify(compressed.model.properties.data)).toEqual(
      JSON.stringify(precompressedLayout.model.properties.data)
    );
  });

  test("compresses table with different keys across rows", () => {
    const layout = Generator.input.table(
      "table",
      [{ id: "1", name: "row 1" }, { name: "row 2" }],
      {
        columns: ["id"],
      }
    );

    const compressed = compress.uiTree(layout);

    const precompressedLayout = Generator.input.table(
      "table",
      [{ "0": "1" }, {}],
      {
        columns: ["id"],
      }
    );

    expect(JSON.stringify(compressed.model.properties.data)).toEqual(
      JSON.stringify(precompressedLayout.model.properties.data)
    );
  });

  test("compresses table with advanced columns", () => {
    const layout = Generator.input.table(
      "table",
      [
        { id: "1", name: "row 1" },
        { id: "2", name: "row 2" },
      ],
      {
        columns: [{ key: "id" }],
      }
    );

    const compressed = compress.uiTree(layout);

    const precompressedLayout = Generator.input.table(
      "table",
      [{ "0": "1" }, { "0": "2" }],
      {
        columns: [
          {
            key: "id",
          },
        ],
      }
    );

    expect(JSON.stringify(compressed.model.properties.data)).toEqual(
      JSON.stringify(precompressedLayout.model.properties.data)
    );
  });

  test("compresses table when nested", () => {
    const layout = Generator.input.table(
      "table",
      [
        { id: "1", name: "row 1" },
        { id: "2", name: "row 2" },
      ],
      {
        columns: [{ key: "id" }],
      }
    );

    const nestedLayout = Generator.layout.row([Generator.layout.stack(layout)]);
    nestedLayout.model.id = "row";
    nestedLayout.model.children[0].model.id = "stack";

    const compressed = compress.uiTree(nestedLayout);

    const precompressedLayout = Generator.input.table(
      "table",
      [{ "0": "1" }, { "0": "2" }],
      {
        columns: [
          {
            key: "0",
            // @ts-expect-error original is an internal property that's not
            // exposed to the user.
            original: "id",
          },
        ],
      }
    );

    const precompressedNestedLayout = Generator.layout.row([
      Generator.layout.stack(precompressedLayout),
    ]);

    precompressedNestedLayout.model.id = "row";
    precompressedNestedLayout.model.children[0].model.id = "stack";

    expect(JSON.stringify(compressed)).toEqual(
      JSON.stringify(precompressedNestedLayout)
    );
  });
});

describe("compress without recursion", () => {
  test("does not compress table when nested", () => {
    const layout = Generator.input.table(
      "table",
      [
        { id: "1", name: "row 1" },
        { id: "2", name: "row 2" },
      ],
      {
        columns: [{ key: "id" }],
      }
    );

    const nestedLayout = Generator.layout.row([Generator.layout.stack(layout)]);
    nestedLayout.model.id = "row";
    nestedLayout.model.children[0].model.id = "stack";

    const compressed = compress.uiTreeWithoutRecursion(nestedLayout);

    const precompressedLayout = Generator.input.table(
      "table",
      [
        { id: "1", name: "row 1" },
        { id: "2", name: "row 2" },
      ],
      {
        columns: [
          {
            key: "id",
          },
        ],
      }
    );

    const precompressedNestedLayout = Generator.layout.row([
      Generator.layout.stack(precompressedLayout),
    ]);

    precompressedNestedLayout.model.id = "row";
    precompressedNestedLayout.model.children[0].model.id = "stack";

    expect(JSON.stringify(compressed)).toEqual(
      JSON.stringify(precompressedNestedLayout)
    );
  });
});
