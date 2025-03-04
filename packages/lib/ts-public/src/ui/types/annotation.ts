interface Annotation {
  /**
   * The x coordinate of the top left corner of the annotation.
   */
  x1: number;
  /**
   * The y coordinate of the top left corner of the annotation.
   */
  y1: number;
  /**
   * The x coordinate of the bottom right corner of the annotation.
   */
  x2: number;
  /**
   * The y coordinate of the bottom right corner of the annotation.
   */
  y2: number;
  /**
   * The appearance of the annotation.
   * @default "highlight"
   */
  appearance?: "box" | "highlight";
  /**
   * Optional label for the annotation.
   */
  label?: string;
  /**
   * Which page number of the PDF the annotation is on.
   * @default 1
   */
  page?: number;
  /**
   * The color of the annotation.
   * @default "blue"
   */
  color?: "blue" | "yellow" | "green" | "red" | "purple" | "orange" | "gray";
}

export { type Annotation };
