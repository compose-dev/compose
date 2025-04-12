/**
 * This is the base set of appearance types that are used for most components,
 * e.g. buttons, cards, confirmation modals, etc.
 */
const BASE = {
  PRIMARY: "primary",
  OUTLINE: "outline",
  WARNING: "warning",
  DANGER: "danger",
} as const;
type Base = (typeof BASE)[keyof typeof BASE];

/**
 * Colors for both text and headers.
 */
const TEXT = {
  TEXT: "text",
  TEXT_SECONDARY: "text-secondary",
  PRIMARY: "primary",
  BACKGROUND: "background",
  WARNING: "warning",
  DANGER: "danger",
  SUCCESS: "success",
} as const;
type Text = (typeof TEXT)[keyof typeof TEXT];

const DIVIDER = {
  PRIMARY: "primary",
  NEUTRAL: "neutral",
  WARNING: "warning",
  DANGER: "danger",
} as const;
type Divider = (typeof DIVIDER)[keyof typeof DIVIDER];

export { TEXT, type Text, DIVIDER, type Divider };
