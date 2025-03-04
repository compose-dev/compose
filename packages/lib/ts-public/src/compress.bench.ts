import { bench, describe } from "vitest";
import * as compress from "./compress";
import * as Generator from "./generator";

const favoriteFoods = [
  "Pizza",
  "Burger",
  "Pasta",
  "Sushi",
  "Tacos",
  "Salad",
  "Steak",
  "Ice Cream",
  "Chocolate",
  "Sandwich",
  "Soup",
  "Fries",
  "Curry",
  "Dumplings",
  "Ramen",
  "BBQ",
  "Pancakes",
  "Waffles",
  "Cheese",
  "Fruit",
];

const favoriteDrinks = [
  "Water",
  "Coffee",
  "Tea",
  "Soda",
  "Juice",
  "Milk",
  "Beer",
  "Wine",
  "Whiskey",
  "Vodka",
  "Smoothie",
  "Lemonade",
  "Iced Tea",
  "Hot Chocolate",
  "Milkshake",
  "Energy Drink",
  "Cocktail",
  "Mocktail",
  "Cider",
  "Champagne",
];

function getRandomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function getRandomBoolean() {
  return Math.random() < 0.5;
}

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomName() {
  const firstNames = ["John", "Jane", "Alex", "Emily", "Chris", "Katie"];
  const lastNames = ["Doe", "Smith", "Johnson", "Brown", "Davis", "Miller"];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

function getRandomEmail() {
  const domains = ["example.com", "test.com", "sample.com"];
  const name = getRandomName().toLowerCase().replace(" ", ".");
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${name}@${domain}`;
}

function createFakeData(index: number) {
  const dataObject = {
    id: index,
    name: getRandomName(),
    email: getRandomEmail(),
    age: getRandomNumber(15, 60),
    someBoolean: getRandomBoolean(),
    createdAt: getRandomDate(
      new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000),
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ),
    data: {
      favFood: favoriteFoods[Math.floor(Math.random() * favoriteFoods.length)],
      favDrink:
        favoriteDrinks[Math.floor(Math.random() * favoriteDrinks.length)],
      allergies: {
        peanuts: getRandomBoolean(),
        almonds: getRandomBoolean(),
        cashews: getRandomBoolean(),
      },
    },
  };

  return dataObject;
}

function createFakeDataArray(length: number) {
  return Array.from({ length }, (_, index) => createFakeData(index));
}

describe("compress benchmarks", () => {
  const data = createFakeDataArray(100000);

  const table = Generator.input.table("table", data);

  const tableSizeMB =
    new TextEncoder().encode(JSON.stringify(table)).length / 1024 / 1024;

  bench(`compress 100k rows (${tableSizeMB.toFixed(2)}MB) table`, () => {
    compress.uiTree(table);
  });

  const tableWithColumns = Generator.input.table("table", data, {
    columns: ["id", "name", "email", "createdAt"],
  });

  bench(
    `compress 100k rows (${tableSizeMB.toFixed(2)}MB) table with columns property`,
    () => {
      compress.uiTree(tableWithColumns);
    }
  );
});
