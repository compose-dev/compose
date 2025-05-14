import { useRef, useEffect, useCallback } from "react";

/**
 * Custom hook that throttles a value with a specified delay
 * @param initialValue The initial value to throttle
 * @param throttleDelay The delay in milliseconds (defaults to 150ms)
 * @returns The throttled value
 */
function useThrottledCallback<T extends unknown[]>(
  callback: (...args: T) => void,
  throttleDelay: number = 150
): {
  throttledCallback: (...args: T) => void;
} {
  const lastExecutionRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const updateThrottledCallback = useCallback(
    (...args: T) => {
      const now = Date.now();
      const timeSinceLastExecution = now - lastExecutionRef.current;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (timeSinceLastExecution >= throttleDelay) {
        callback(...args);
        lastExecutionRef.current = now;
      } else {
        timerRef.current = setTimeout(() => {
          callback(...args);
          lastExecutionRef.current = Date.now();
        }, throttleDelay - timeSinceLastExecution);
      }
    },
    [callback, throttleDelay]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { throttledCallback: updateThrottledCallback };
}

export { useThrottledCallback };
