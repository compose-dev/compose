/**
 * A simple rate limiter that rate limits based on a fixed window, instead of
 * a more advanced sliding window.
 */
class RateLimiter {
  maxInvocationsPerInterval: number;
  private intervalLengthMs: number;

  private windowStart: number;
  private invocationCount: number;

  constructor(maxInvocationsPerInterval: number, intervalLengthMs: number) {
    this.maxInvocationsPerInterval = maxInvocationsPerInterval;
    this.intervalLengthMs = intervalLengthMs;

    // Initialize the window start time and counter.
    this.windowStart = Date.now();
    this.invocationCount = 0;
  }

  public async invoke(
    onSuccess: () => unknown | Promise<unknown>,
    onError: () => unknown | Promise<unknown>
  ): Promise<void> {
    const now = Date.now();

    // Check if a minute has passed since the current window started.
    if (now - this.windowStart >= this.intervalLengthMs) {
      // Reset the window.
      this.windowStart = now;
      this.invocationCount = 0;
    }

    if (this.invocationCount < this.maxInvocationsPerInterval) {
      this.invocationCount++;
      try {
        await onSuccess();
      } catch (error) {
        throw error;
      }
    } else {
      await onError();
    }
  }
}

export { RateLimiter };
