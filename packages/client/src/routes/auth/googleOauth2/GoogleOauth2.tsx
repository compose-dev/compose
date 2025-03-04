import { useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { getNodeEnvironment } from "~/utils/nodeEnvironment";
import { Csrf } from "~/utils/csrf";
import { useAuthContext } from "~/utils/authContext";

import { CSRF_TOKEN_KEY } from "./utils";
import { BrowserToServerEvent, u } from "@compose/ts";
import { api } from "~/api";

const environment = getNodeEnvironment();

function getRedirectURI() {
  if (environment === "development") {
    return "http://localhost:5173/auth/google-oauth/redirect";
  }

  return `https://${window.location.host}/auth/google-oauth/redirect`;
}

function GoogleOauth2() {
  const { isAuthenticated } = useAuthContext();

  const {
    inviteCode,
    inviteExpiresAt,
    redirect,
    newAccount,
    environmentId,
    appRoute,
  } = useSearch({
    from: "/auth/google-oauth",
  });

  useEffect(() => {
    async function loginWithGoogle() {
      if (isAuthenticated) {
        await api.routes.logout();
      }

      const response = await api.routes.oauthLogin({
        provider: BrowserToServerEvent.OauthLogin.OAUTH_PROVIDER.GOOGLE,
        redirect: getRedirectURI(),
      });

      if (response.didError) {
        console.error(response.data.message);
        alert(`Received error from server: ${response.data.message}`);
        return;
      }

      const url = new URL(response.data.url);

      // Generate a csrf token
      const csrf = Csrf.generateAndSet(CSRF_TOKEN_KEY);

      const search = u.object.removeNullAndUndefined({
        redirect,
        newAccount,
        csrf,
        inviteCode,
        inviteExpiresAt,
        environmentId,
        appRoute,
      });

      url.searchParams.set("state", JSON.stringify(search));

      window.location.href = url.toString();
    }

    loginWithGoogle();
  }, [
    redirect,
    isAuthenticated,
    newAccount,
    inviteCode,
    inviteExpiresAt,
    environmentId,
    appRoute,
  ]);

  return null;
}

export default GoogleOauth2;
