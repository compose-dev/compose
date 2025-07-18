export const route = "api/v1/log";

export const method = "POST";

export type RequestBody = {
  event: string;
  data: Record<string, any>;
};

export type Response = {
  success: true;
};

export type ErrorData = {
  message: string;
};
