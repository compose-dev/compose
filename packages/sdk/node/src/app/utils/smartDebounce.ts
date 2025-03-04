/**
 * Will immediately run the callback, then start a batching period where
 * subsequent calls are debounced for the debounce interval (ms).
 */
class SmartDebounce {
  private isBatching: boolean = false;
  private debounceTimer: NodeJS.Timeout | null = null;
  private readonly debounceInterval: number;
  private callback: (() => Promise<void> | void) | null = null;

  constructor(debounceIntervalMs: number = 25) {
    this.debounceInterval = debounceIntervalMs;

    this.cleanup = this.cleanup.bind(this);
    this.run = this.run.bind(this);
    this.startDebounceTimer = this.startDebounceTimer.bind(this);
    this.resetDebounceTimer = this.resetDebounceTimer.bind(this);
  }

  public run(callback: () => Promise<void> | void): void {
    if (!this.isBatching) {
      this.callback = null;

      // Start batching mode
      this.isBatching = true;
      this.startDebounceTimer();

      // Run the callback immediately
      callback();
    } else {
      this.callback = callback;

      // During batching, debounce the subsequent updates
      this.resetDebounceTimer();
    }
  }

  public hasQueuedUpdate(): boolean {
    return this.isBatching && this.callback !== null;
  }

  public cleanup(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }

  private startDebounceTimer(): void {
    this.debounceTimer = setTimeout(() => {
      this.isBatching = false;
      if (this.callback) {
        this.callback();
        this.callback = null;
      }
    }, this.debounceInterval);
  }

  private resetDebounceTimer(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.startDebounceTimer();
  }
}

export { SmartDebounce };
