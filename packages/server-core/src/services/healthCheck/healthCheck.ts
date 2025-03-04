class HealthCheck {
  private returnHealthy: boolean;

  constructor() {
    this.returnHealthy = true;
  }

  set healthy(healthy: boolean) {
    this.returnHealthy = healthy;
  }

  get healthy() {
    return this.returnHealthy;
  }
}

export default HealthCheck;
