/**
 * The root page configuration.
 */
interface Config {
  /**
   * The width of the page.
   *
   * default: `"72rem"`
   */
  width: string;
  /**
   * The padding at the top of the page. Supersedes paddingY.
   *
   * default: `"4rem"`
   */
  paddingTop: string;
  /**
   * The padding at the bottom of the page. Supersedes paddingY.
   *
   * default: `"4rem"`
   */
  paddingBottom: string;
  /**
   * The padding at the left of the page. Supersedes paddingX.
   *
   * default: `"1rem"`
   */
  paddingLeft: string;
  /**
   * The padding at the right of the page. Supersedes paddingX.
   *
   * default: `"1rem"`
   */
  paddingRight: string;
  /**
   * The padding at the left and right of the page.
   *
   * default: `"1rem"`
   */
  paddingX: string;
  /**
   * The padding at the top and bottom of the page.
   *
   * default: `"4rem"`
   */
  paddingY: string;
  /**
   * Vertical spacing between page.add() renders.
   *
   * default: `"2rem"`
   */
  spacingY: string;
}

type MinConfig = Omit<
  Config,
  "paddingTop" | "paddingBottom" | "paddingLeft" | "paddingRight"
>;

const DEFAULT_CONFIG: MinConfig = {
  width: "72rem",
  paddingX: "1rem",
  paddingY: "4rem",
  spacingY: "2rem",
} as const;

export { DEFAULT_CONFIG, type Config, type MinConfig };
