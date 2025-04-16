const NUMBER_FORMAT = {
  STANDARD: "standard",
  CURRENCY: "currency",
  PERCENT: "percent",
} as const;

type NumberFormat = (typeof NUMBER_FORMAT)[keyof typeof NUMBER_FORMAT];

export { NUMBER_FORMAT as OPTION, type NumberFormat as Option };
