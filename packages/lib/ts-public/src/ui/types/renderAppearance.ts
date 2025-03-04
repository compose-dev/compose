const RENDER_APPEARANCE = {
  DEFAULT: "default",
  MODAL: "modal",
} as const;

type RenderAppearance =
  (typeof RENDER_APPEARANCE)[keyof typeof RENDER_APPEARANCE];

export { RENDER_APPEARANCE, type RenderAppearance };
