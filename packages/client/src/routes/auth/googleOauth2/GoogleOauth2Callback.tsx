import { useState, useEffect } from "react";
import { CenteredSpinner } from "~/components/spinner";

import { Csrf } from "~/utils/csrf";
import { CSRF_TOKEN_KEY } from "./utils";
import { api } from "~/api";
import { useAuthContext } from "~/utils/authContext";
import { useNavigate } from "@tanstack/react-router";
import { BrowserToServerEvent } from "@compose/ts";
import { NEW_USER_STAGE } from "~/routes/newUserFlow";
import Button from "~/components/button";
import { theme } from "~/utils/theme";

function GoogleOauth2Callback() {
  const navigate = useNavigate({ from: "/auth/google-oauth/redirect" });

  const { isAuthenticated, checkAuth } = useAuthContext();

  const [error, setError] = useState<string | null>(null);
  const [redirect, setRedirect] = useState<string | null>(null);

  theme.use();

  useEffect(() => {
    if (isAuthenticated) {
      Csrf.clear(CSRF_TOKEN_KEY);

      if (redirect) {
        window.location.href = redirect;
      } else {
        navigate({ to: "/" });
      }
    }
  }, [isAuthenticated, navigate, redirect]);

  useEffect(() => {
    async function validate() {
      const hash = window.location.hash.substring(1);
      const urlSearchParams = new URLSearchParams(hash);

      const error = urlSearchParams.get("error");

      if (error) {
        setError(error);
        return;
      }

      const accessToken = urlSearchParams.get("access_token");

      const state = urlSearchParams.get("state");
      const returnedState = state === null ? null : JSON.parse(state);

      setRedirect(returnedState.redirect || null);
      const newAccount = returnedState.newAccount || false;

      if (accessToken === null) {
        setError("Invalid data received from sender.");
        return;
      }

      const isValidCsrf = Csrf.validate(CSRF_TOKEN_KEY, returnedState.csrf);

      if (!isValidCsrf) {
        setError("Cannot validate sender identity.");
        return;
      }

      await api.routes.logout();
      const response = await api.routes.googleOAuth2Callback(
        accessToken,
        newAccount,
        returnedState.environmentId || null,
        returnedState.appRoute || null
      );

      if (response.didError) {
        setError(response.data.message);
        return;
      }

      if (
        response.data.type ===
        BrowserToServerEvent.GoogleOauthCallback.RESPONSE_TYPE.NEW_USER
      ) {
        navigate({
          to: "/new-user-flow",
          search: {
            accessToken: accessToken,
            email: response.data.email,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            stage: NEW_USER_STAGE.userInfo,
            inviteCode: returnedState.inviteCode,
            inviteExpiresAt: returnedState.inviteExpiresAt,
          },
        });
      }

      checkAuth();
    }

    validate();
  }, [checkAuth, navigate]);

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-80 space-y-12">
          <div className="space-y-2">
            <p>Received an error while trying to log in.</p>
            <p className="text-brand-neutral-2">
              Reach out to atul@composehq.com if the issue persists.
            </p>
          </div>
          <div className="p-4 rounded-brand border-brand border-brand-neutral space-y-2">
            <p className="text-brand-error">Error:</p>
            <p className="text-brand-error">{error}</p>
          </div>
          <div className="w-full space-y-4 flex flex-col">
            <Button
              variant="primary"
              onClick={() => navigate({ to: "/auth/signup" })}
              className="w-full"
            >
              Create account
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                navigate({ to: "/auth/login", search: { redirect: null } })
              }
              className="w-full"
            >
              Return to login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <CenteredSpinner />;
}

export default GoogleOauth2Callback;
