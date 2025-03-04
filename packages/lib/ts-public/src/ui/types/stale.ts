const STALE = {
  /**
   * The component is not stale.
   */
  FALSE: false,

  /**
   * The component is being loaded for the first time.
   */
  INITIALLY_STALE: "INITIALLY_STALE",

  /**
   * The component is stale due to an update, and further actions on the
   * component are disabled until the stale state has changed.
   */
  UPDATE_DISABLED: "UPDATE_DISABLED",

  /**
   * The component is stale due to an update, but actions on the component are
   * not disabled.
   */
  UPDATE_NOT_DISABLED: "UPDATE_NOT_DISABLED",
} as const;

type Stale = (typeof STALE)[keyof typeof STALE];

export { type Stale as Option, STALE as OPTION };
