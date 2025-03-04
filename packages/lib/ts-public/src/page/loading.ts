// For now, this is only a true/false value. Eventually, it will also include a
// number value to represent a progress bar input (i.e. 0 through 100) and
// possibly also some additional text values to signal various completion states
// e.g. failed, success, etc.
type Value = boolean;

interface Properties {
  text?: string;
  disableInteraction?: boolean;
}

export { Properties, Value };
