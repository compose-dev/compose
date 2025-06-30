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

  test("infers columns from data when columns is null and table is not paged", () => {
    const layout = Generator.input.table(
      "table",
      [
        { id: "1", name: "row 1", email: "test1@example.com" },
        { id: "2", name: "row 2", phone: "123-456-7890" },
        {
          id: "3",
          name: "row 3",
          email: "test3@example.com",
          address: "123 Main St",
        },
      ],
      {
        columns: null,
        paginate: false,
      }
    );

    const compressed = compress.uiTree(layout);

    // Should infer columns from all unique keys in the data
    const expectedColumns = [
      { key: "0", original: "id" },
      { key: "1", original: "name" },
      { key: "2", original: "email" },
      { key: "3", original: "phone" },
      { key: "4", original: "address" },
    ];

    const expectedData = [
      {
        "0": "1",
        "1": "row 1",
        "2": "test1@example.com",
        "3": undefined,
        "4": undefined,
      },
      {
        "0": "2",
        "1": "row 2",
        "2": undefined,
        "3": "123-456-7890",
        "4": undefined,
      },
      {
        "0": "3",
        "1": "row 3",
        "2": "test3@example.com",
        "3": undefined,
        "4": "123 Main St",
      },
    ];

    expect(compressed.model.properties.columns).toEqual(expectedColumns);
    expect(compressed.model.properties.data).toEqual(expectedData);
  });

  test("does not infer columns when table is paged", () => {
    const layout = Generator.input.table(
      "table",
      [
        { id: "1", name: "row 1" },
        { id: "2", name: "row 2" },
      ],
      {
        columns: null,
        paginate: true,
      }
    );

    const compressed = compress.uiTree(layout);

    // Should not modify the table when paged and columns is null
    expect(compressed.model.properties.columns).toBeNull();
    expect(compressed.model.properties.data).toEqual([
      { id: "1", name: "row 1" },
      { id: "2", name: "row 2" },
    ]);
  });

  test("does not infer columns when data is empty", () => {
    const layout = Generator.input.table("table", [], {
      columns: null,
      paginate: false,
    });

    const compressed = compress.uiTree(layout);

    // Should not modify the table when data is empty
    expect(compressed.model.properties.columns).toBeNull();
    expect(compressed.model.properties.data).toEqual([]);
  });

  test("infers columns from first 5 rows only", () => {
    const layout = Generator.input.table(
      "table",
      [
        { id: "1", name: "row 1" },
        { id: "2", name: "row 2" },
        { id: "3", name: "row 3" },
        { id: "4", name: "row 4" },
        { id: "5", name: "row 5" },
        { id: "6", name: "row 6", newColumn: "should not be included" },
        { id: "7", name: "row 7", anotherColumn: "also not included" },
      ],
      {
        columns: null,
        paginate: false,
      }
    );

    const compressed = compress.uiTree(layout);

    // Should only infer columns from first 5 rows
    const expectedColumns = [
      { key: "0", original: "id" },
      { key: "1", original: "name" },
    ];

    expect(compressed.model.properties.columns).toEqual(expectedColumns);
    expect(compressed.model.properties.data[5]).toEqual({
      "0": "6",
      "1": "row 6",
    });
    expect(compressed.model.properties.data[6]).toEqual({
      "0": "7",
      "1": "row 7",
    });
  });

  test("handles primary key correctly when inferring columns", () => {
    const layout = Generator.input.table(
      "table",
      [
        { userId: "1", name: "row 1", email: "test1@example.com" },
        { userId: "2", name: "row 2", email: "test2@example.com" },
      ],
      {
        columns: null,
        paginate: false,
        primaryKey: "userId",
      }
    );

    const compressed = compress.uiTree(layout);

    // Primary key column should get the special ID
    const expectedColumns = [
      { key: "i", original: "userId" },
      { key: "1", original: "name" },
      { key: "2", original: "email" },
    ];

    const expectedData = [
      { i: "1", "1": "row 1", "2": "test1@example.com" },
      { i: "2", "1": "row 2", "2": "test2@example.com" },
    ];

    expect(compressed.model.properties.columns).toEqual(expectedColumns);
    expect(compressed.model.properties.data).toEqual(expectedData);
    expect(compressed.model.properties.primaryKey).toBe("i");
  });

  test("handles primary key not present in inferred columns", () => {
    const layout = Generator.input.table(
      "table",
      [
        { id: "1", name: "row 1" },
        { id: "2", name: "row 2" },
      ],
      {
        columns: null,
        paginate: false,
        // @ts-expect-error primaryKey is not present in inferred columns
        primaryKey: "hiddenId",
      }
    );

    // Add hiddenId to data but it won't be in first 5 rows' keys
    layout.model.properties.data.forEach((row, index) => {
      (row as any).hiddenId = `hidden-${index + 1}`;
    });

    const compressed = compress.uiTree(layout);

    // Should separately assign primary key
    const expectedData = [
      { "0": "1", "1": "row 1", i: "hidden-1" },
      { "0": "2", "1": "row 2", i: "hidden-2" },
    ];

    expect(compressed.model.properties.data).toEqual(expectedData);
    expect(compressed.model.properties.primaryKey).toBe("i");
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
