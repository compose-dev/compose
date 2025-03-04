export type ErrorData = {
  message: string;
};

export type RequestBody = {
  appRoute: string;
  environmentId: string;
};

export type Response =
  | {
      success: true;
      requiresLogin: false;
    }
  | {
      success: false;
      requiresLogin: true;
    };

export const route = "api/v1/auth/login-to-app";
