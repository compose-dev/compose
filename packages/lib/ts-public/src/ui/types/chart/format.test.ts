// import { faker } from "@faker-js/faker";
import { describe, it, expect } from "vitest";
import { formatSeriesData } from "./format";
import * as chartConstants from "./constants";

// const generateWorkout = () => {
//   return {
//     type: faker.helpers.arrayElement(["strength", "cardio", "yoga"]),
//     date: faker.date.between({
//       from: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000),
//       to: Date.now(),
//     }),
//   };
// };

// function generateWorkouts(count: number) {
//   return Array.from({ length: count }, generateWorkout);
// }

const SALES_BY_MONTH = [
  { group: "January", west_coast_sales: 100, east_coast_sales: 200 },
  { group: "February", west_coast_sales: 150, east_coast_sales: 250 },
  { group: "March", west_coast_sales: 120, east_coast_sales: 220 },
];

const SALES_BY_MONTH_WITH_INTERNAL_KEY = SALES_BY_MONTH.map((row) => ({
  west_coast_sales: row.west_coast_sales,
  east_coast_sales: row.east_coast_sales,
  [chartConstants.LABEL_SERIES_KEY]: row.group,
}));

describe("formatSeriesData", () => {
  it("base case", async () => {
    const formatted = await formatSeriesData(SALES_BY_MONTH, {});
    expect(formatted).toEqual(SALES_BY_MONTH_WITH_INTERNAL_KEY);
  });

  it("custom group key", async () => {
    const withRandomKey = SALES_BY_MONTH.map((row) => ({
      west_coast_sales: row.west_coast_sales,
      east_coast_sales: row.east_coast_sales,
      random_key: row.group,
    }));

    const formatted = await formatSeriesData(withRandomKey, {
      group: "random_key",
    });

    expect(formatted).toEqual(SALES_BY_MONTH_WITH_INTERNAL_KEY);
  });

  it("custom group function", async () => {
    const withRandomKey = SALES_BY_MONTH.map((row) => ({
      west_coast_sales: row.west_coast_sales,
      east_coast_sales: row.east_coast_sales,
      random_key: row.group,
    }));

    const formatted = await formatSeriesData(withRandomKey, {
      group: (row) => row.random_key,
      series: ["west_coast_sales", "east_coast_sales"],
    });

    expect(formatted).toEqual(SALES_BY_MONTH_WITH_INTERNAL_KEY);
  });

  it("excludes null/undefined group", async () => {
    const withRandomKey = SALES_BY_MONTH.map((row) => ({
      west_coast_sales: row.west_coast_sales,
      east_coast_sales: row.east_coast_sales,
      random_key: row.group,
    }));

    const formatted = await formatSeriesData(withRandomKey, {
      group: (row, idx) => (idx === 0 ? row.random_key : null),
      series: ["west_coast_sales", "east_coast_sales"],
    });

    expect(formatted).toEqual(SALES_BY_MONTH_WITH_INTERNAL_KEY.slice(0, 1));
  });

  it("custom series keys", async () => {
    const formatted = await formatSeriesData(SALES_BY_MONTH, {
      series: ["west_coast_sales"],
    });

    const mapped = SALES_BY_MONTH_WITH_INTERNAL_KEY.map((row) => ({
      [chartConstants.LABEL_SERIES_KEY]: row[chartConstants.LABEL_SERIES_KEY],
      west_coast_sales: row.west_coast_sales,
    }));

    expect(formatted).toEqual(mapped);
  });

  it("custom aggregate", async () => {
    const formatted = await formatSeriesData(SALES_BY_MONTH, {
      aggregate: "count",
    });

    const mapped = SALES_BY_MONTH_WITH_INTERNAL_KEY.map((row) => ({
      [chartConstants.LABEL_SERIES_KEY]: row[chartConstants.LABEL_SERIES_KEY],
      east_coast_sales: 1,
      west_coast_sales: 1,
    }));

    expect(formatted).toEqual(mapped);
  });

  it("custom series labels", async () => {
    const formatted = await formatSeriesData(SALES_BY_MONTH, {
      series: [
        { value: "west_coast_sales", label: "West Coast Sales" },
        { value: "east_coast_sales", label: "East Coast Sales" },
      ],
    });

    const mapped = SALES_BY_MONTH_WITH_INTERNAL_KEY.map((row) => ({
      [chartConstants.LABEL_SERIES_KEY]: row[chartConstants.LABEL_SERIES_KEY],
      "West Coast Sales": row.west_coast_sales,
      "East Coast Sales": row.east_coast_sales,
    }));

    expect(formatted).toEqual(mapped);
  });

  it("custom series value", async () => {
    const formatted = await formatSeriesData(SALES_BY_MONTH, {
      series: [
        {
          label: "West Coast Sales",
          value: (row, idx) => idx,
        },
        {
          label: "East Coast Sales",
          value: (row, idx) => idx,
        },
      ],
    });

    const mapped = SALES_BY_MONTH_WITH_INTERNAL_KEY.map((row, idx) => ({
      [chartConstants.LABEL_SERIES_KEY]: row[chartConstants.LABEL_SERIES_KEY],
      "West Coast Sales": idx,
      "East Coast Sales": idx,
    }));

    expect(formatted).toEqual(mapped);
  });

  it("custom series aggregate", async () => {
    const formatted = await formatSeriesData(SALES_BY_MONTH, {
      series: [
        {
          label: "West Coast Sales",
          value: (row, idx) => idx,
        },
        {
          label: "East Coast Sales",
          value: (row, idx) => idx,
          aggregate: "count",
        },
      ],
      aggregate: "sum",
    });

    const mapped = SALES_BY_MONTH_WITH_INTERNAL_KEY.map((row, idx) => ({
      [chartConstants.LABEL_SERIES_KEY]: row[chartConstants.LABEL_SERIES_KEY],
      "West Coast Sales": idx,
      "East Coast Sales": 1,
    }));

    expect(formatted).toEqual(mapped);
  });

  it("multiple rows per group", async () => {
    const formatted = await formatSeriesData(
      [...SALES_BY_MONTH, ...SALES_BY_MONTH],
      {}
    );

    const mapped = SALES_BY_MONTH_WITH_INTERNAL_KEY.map((row, idx) => ({
      [chartConstants.LABEL_SERIES_KEY]: row[chartConstants.LABEL_SERIES_KEY],
      west_coast_sales: row.west_coast_sales * 2,
      east_coast_sales: row.east_coast_sales * 2,
    }));

    expect(formatted).toEqual(mapped.slice(0, 3));
  });
  it("exclude null rows", async () => {
    const copy = [...SALES_BY_MONTH];
    copy[0] = {
      ...copy[0],
      // @ts-expect-error testing
      west_coast_sales: null,
    };
    const formatted = await formatSeriesData(copy, {});

    const copyResult = [...SALES_BY_MONTH_WITH_INTERNAL_KEY];
    copyResult[0] = {
      ...copyResult[0],
      west_coast_sales: 0,
    };

    expect(formatted).toEqual(copyResult);
  });
  it("account for missing rows", async () => {
    const copy = [...SALES_BY_MONTH];
    // @ts-expect-error testing
    copy[1] = {
      group: copy[1].group,
      west_coast_sales: copy[1].west_coast_sales,
    };
    const formatted = await formatSeriesData(copy, {});

    const copyResult = [...SALES_BY_MONTH_WITH_INTERNAL_KEY];
    copyResult[1] = {
      ...copyResult[1],
      east_coast_sales: 0,
    };

    expect(formatted).toEqual(copyResult);
  });
  it("works for async group fn", async () => {
    async function asyncGroup(row: any, idx: number): Promise<string> {
      return new Promise((resolve) => resolve(row.group));
    }

    const formatted = await formatSeriesData(SALES_BY_MONTH, {
      group: asyncGroup,
      series: ["west_coast_sales", "east_coast_sales"],
    });

    expect(formatted).toEqual(SALES_BY_MONTH_WITH_INTERNAL_KEY);
  });
  it("works for async series value", async () => {
    async function asyncSeriesValue(row: any, idx: number): Promise<number> {
      return new Promise((resolve) => resolve(idx));
    }

    const formatted = await formatSeriesData(SALES_BY_MONTH, {
      series: [{ value: asyncSeriesValue, label: "West Coast Sales" }],
    });

    const mapped = SALES_BY_MONTH_WITH_INTERNAL_KEY.map((row, idx) => ({
      [chartConstants.LABEL_SERIES_KEY]: row[chartConstants.LABEL_SERIES_KEY],
      "West Coast Sales": idx,
    }));

    expect(formatted).toEqual(mapped);
  });
});
