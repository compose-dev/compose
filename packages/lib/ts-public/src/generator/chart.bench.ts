import { bench, describe } from "vitest";
import { faker } from "@faker-js/faker";
import { buttonGenerator } from "./buttonInteraction";

const generateWorkout = () => {
  return {
    type: faker.helpers.arrayElement(["strength", "cardio", "yoga"]),
    date: faker.date.between({
      from: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000),
      to: Date.now(),
    }),
  };
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
