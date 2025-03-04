const LAYOUT_APPEARANCE = {
  CARD: "card",
  DEFAULT: "default",
} as const;

type LayoutAppearance =
  (typeof LAYOUT_APPEARANCE)[keyof typeof LAYOUT_APPEARANCE];

export { LAYOUT_APPEARANCE as TYPE, LayoutAppearance as Type };
