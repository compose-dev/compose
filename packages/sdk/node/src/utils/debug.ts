const TERMINAL_ORANGE = "\u001b[38;5;208m";
const TERMINAL_RESET = "\u001b[0m";

/**
 * Logs a message to the console with a timestamp.
 * @param type - The type of event.
 * @param message - The message to log.
 * @param options - Optional parameters.
 * @param options.duration_ms - Duration in milliseconds.
 * @param options.warning_threshold_ms - Threshold in milliseconds for warning coloration.
 */
function log(
  type: string,
  message: string,
  options?: {
    durationMs?: number;
    warningThresholdMs?: number;
  }
) {
  const { durationMs = 0, warningThresholdMs = 50 } = options || {};

  let logMessage = `${type} event | ${message} | ${new Date().toISOString()}`;

  if (durationMs > warningThresholdMs) {
    logMessage = `${TERMINAL_ORANGE}${logMessage}${TERMINAL_RESET}`;
  }

  console.log(logMessage);
}

/**
 * Measures the duration of a function and logs the result.
 * @param fn - The function to measure.
 * @param message - The message to log.
 * @returns The result of the function.
 */
function measureDuration<T>(
  fn: () => T,
  message: (elapsed: number) => void
): T {
  const start = performance.now();
  try {
    return fn();
  } finally {
    message(parseFloat((performance.now() - start).toFixed(2)));
  }
}

/**
 * Measures the duration of an asynchronous function and logs the result.
 * @param asyncFn - The asynchronous function to measure.
 * @param message - The message to log.
 * @returns The result of the asynchronous function.
 */
async function asyncMeasureDuration<T>(
  asyncFn: () => Promise<T>,
  message: (elapsed: number) => void
): Promise<T> {
  const start = performance.now();
  try {
    return await asyncFn();
  } finally {
    message(parseFloat((performance.now() - start).toFixed(2)));
  }
}

export { log, measureDuration, asyncMeasureDuration };
