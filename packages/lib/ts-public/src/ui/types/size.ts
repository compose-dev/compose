/**
 * Used for text sizes.
 */
const TEXT = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
} as const;
type Text = (typeof TEXT)[keyof typeof TEXT];

/**
 * Used for header sizes.
 */
const HEADER = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
} as const;
type Header = (typeof HEADER)[keyof typeof HEADER];

export { TEXT, type Text, HEADER, type Header };
