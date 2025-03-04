const MODAL_WIDTH = {
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
  "2xl": "2xl",
} as const;

type ModalWidth = (typeof MODAL_WIDTH)[keyof typeof MODAL_WIDTH];

export { MODAL_WIDTH, type ModalWidth };
