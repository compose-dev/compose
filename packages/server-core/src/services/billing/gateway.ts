abstract class BillingGatewayService {
  constructor() {}

  abstract createCustomerWithHobbySubscription(
    name: string,
    email: string,
    id: string
  ): Promise<{ id: string }>;

  abstract deleteCustomer(id: string): Promise<void>;

  get DEFAULT_STANDARD_SEAT_ALLOWANCE() {
    return 1;
  }

  get DEFAULT_EXTERNAL_SEAT_ALLOWANCE() {
    return 0;
  }

  get FREE_UNLIMITED_STANDARD_SEAT_ALLOWANCE() {
    return 100;
  }

  get FREE_UNLIMITED_EXTERNAL_SEAT_ALLOWANCE() {
    return 100;
  }
}

class BillingGatewayServiceStub extends BillingGatewayService {
  async createCustomerWithHobbySubscription(
    name: string,
    email: string,
    id: string
  ): Promise<{ id: string }> {
    return { id };
  }

  async deleteCustomer(): Promise<void> {
    return;
  }
}

export { BillingGatewayService, BillingGatewayServiceStub };
