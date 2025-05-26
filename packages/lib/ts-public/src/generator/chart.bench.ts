import { bench, describe } from "vitest";
import { buttonGenerator } from "./buttonInteraction";
import { faker } from "@composehq/faker";

const generateWorkout = () => {
  return faker.record({
    type: {
      type: "arrayElement",
      options: ["strength", "cardio", "yoga"] as const,
    },
    date: {
      type: "date",
      min: faker.helpers.date.daysFromNow(-365),
      max: new Date(),
    },
  });
};

function createFakeDataArray(length: number) {
  return Array.from({ length }, (_, index) => generateWorkout());
}

describe("compress benchmarks", () => {
  const data = createFakeDataArray(50000);
  const sorted = data.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  bench(`bar chart: group and aggregate 50k rows`, () => {
    buttonGenerator.barChart("test-bar-chart", sorted, {
      group: (row) => {
        return row.date.getMonth();
      },
      series: [
        {
          label: "Strength",
          value: (row) => (row.type === "strength" ? 1 : 0),
        },
        {
          label: "Cardio",
          value: (row) => (row.type === "cardio" ? 1 : 0),
        },
        {
          label: "Yoga",
          value: (row) => (row.type === "yoga" ? 1 : 0),
        },
      ],
      aggregate: "sum",
    });
  });
});
