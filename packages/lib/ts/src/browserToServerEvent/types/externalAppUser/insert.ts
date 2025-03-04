export const route = "api/v1/external-app-user";

export const method = "POST";

export type RequestBody = {
  email: string;
  environmentId: string;
  appRoute: string;
};

export type ErrorData = {
  message: string;
};
