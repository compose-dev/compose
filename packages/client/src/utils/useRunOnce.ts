import { useEffect, useRef } from "react";

export function useRunOnce(
  callback: () => void,
  options?: { waitUntil?: boolean }
) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) {
      return;
    }

    const finishedWaiting =
      options?.waitUntil === undefined || options?.waitUntil === true;

    if (finishedWaiting) {
      hasRun.current = true;
      callback();
    }
  }, [callback, options?.waitUntil]);
}
