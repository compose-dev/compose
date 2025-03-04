const BUTTON_APPEARANCE = {
  PRIMARY: "primary",
  OUTLINE: "outline",
  WARNING: "warning",
  DANGER: "danger",
} as const;

type ButtonAppearance =
  (typeof BUTTON_APPEARANCE)[keyof typeof BUTTON_APPEARANCE];

export { BUTTON_APPEARANCE as TYPE, ButtonAppearance as Type };
