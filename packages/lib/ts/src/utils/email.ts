export const ATTRIBUTION = {
  BLOG: "blog",
  CREATE_ACCOUNT: "create-account",
} as const;

export type Attribution = (typeof ATTRIBUTION)[keyof typeof ATTRIBUTION];
