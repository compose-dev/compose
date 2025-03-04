export const route = "api/v1/billing/checkout-session";

export const method = "POST";

export type RequestBody = {
  standardSeats: number;
  externalSeats: number;
  cancelUrl: string;
  successUrl: string;
};

export type Response = {
  checkoutUrl: string;
};

export type ErrorData = {
  message: string;
};
