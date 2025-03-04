export const OAUTH_PROVIDER = {
  GOOGLE: "google",
} as const;
export type OauthProvider =
  (typeof OAUTH_PROVIDER)[keyof typeof OAUTH_PROVIDER];

export type RequestBody = {
  provider: OauthProvider;
  redirect: string;
};

export type ErrorResponseBody = {
  message: string;
};

export type SuccessResponseBody = { url: string };

export const route = "api/v1/auth/oauth/login";
export const method = "POST";
