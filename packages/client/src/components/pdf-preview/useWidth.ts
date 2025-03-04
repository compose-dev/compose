import { useEffect, useMemo, useState } from "react";

/**
 * This should pretty much never be used as we first default
 * to the container width (i.e. 100% of the width of the parent),
 * and then fallback to this if there was an issue getting the
 * container width.
 */
const DEFAULT_FALLBACK_WIDTH = 800;
const DEFAULT_FALLBACK_HEIGHT = 800;

function useWidth(
  userWidth: string | undefined,
  userHeight: string | undefined,
  scroll: "vertical" | "horizontal" | undefined
) {
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  const [ignoreWidth, setIgnoreWidth] = useState(false);
  const [ignoreHeight, setIgnoreHeight] = useState(true);

  useEffect(() => {
    if (scroll === "horizontal") {
      setIgnoreWidth(true);
      setIgnoreHeight(false);
    } else if (scroll === "vertical") {
      setIgnoreWidth(false);
      setIgnoreHeight(true);
    }
  }, [userWidth, userHeight, scroll]);

  const width = useMemo(() => {
    const fallbackWidth = containerWidth
      ? containerWidth
      : DEFAULT_FALLBACK_WIDTH;

    if (userWidth) {
      const int = parseInt(userWidth);

      if (isNaN(int)) {
        return fallbackWidth;
      }

      if (userWidth.endsWith("%")) {
        return (fallbackWidth * int) / 100;
      }

      if (userWidth.endsWith("rem")) {
        return int * 16;
      }

      // Default to px
      return int;
    }

    return fallbackWidth;
  }, [containerWidth, userWidth]);

  const height = useMemo(() => {
    const fallbackHeight = containerHeight
      ? containerHeight
      : DEFAULT_FALLBACK_HEIGHT;

    if (userHeight) {
      const int = parseInt(userHeight);

      if (isNaN(int)) {
        return fallbackHeight;
      }

      if (userHeight.endsWith("%")) {
        return (fallbackHeight * int) / 100;
      }

      if (userHeight.endsWith("rem")) {
        return int * 16;
      }

      // Default to px
      return int;
    }

    return fallbackHeight;
  }, [containerHeight, userHeight]);

  return {
    width,
    setContainerWidth,
    height,
    setContainerHeight,
    ignoreWidth,
    ignoreHeight,
  };
}

export default useWidth;
