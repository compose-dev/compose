export const INTERACTION_TYPE = {
  INPUT: "input",
  BUTTON: "button",
  DISPLAY: "display",
  LAYOUT: "layout",
  PAGE: "page",
} as const;

export type InteractionType =
  (typeof INTERACTION_TYPE)[keyof typeof INTERACTION_TYPE];
