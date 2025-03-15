import { useNavigate, useSearch } from "@tanstack/react-router";
import { NEW_USER_STAGE } from "./utils";
import { UserInfo } from "./userInfo";
import { OrgInfo } from "./orgInfo";
import { useState } from "react";
import { BrowserToServerEvent, m } from "@compose/ts";
import { api } from "~/api";
import { toast } from "~/utils/toast";
import { useAuthContext } from "~/utils/authContext";
import { DashedWrapper } from "~/components/dashed-wrapper";
import { fetcher } from "~/utils/fetcher";
import Button from "~/components/button";
import { theme } from "~/utils/theme";

function NewUserFlow() {
  const { checkAuth } = useAuthContext();

  const navigate = useNavigate({ from: "/new-user-flow" });

  const { addToast } = toast.useStore();

  theme.use();

  const {
    firstName: initialFirstName,
    lastName: initialLastName,
    email,
    accessToken,
    stage,
    inviteCode,
  } = useSearch({
    from: "/new-user-flow",
    select: (search) => ({
      firstName: search.firstName,
      lastName: search.lastName,
      email: search.email,
      accessToken: search.accessToken,
      stage: search.stage,
      inviteCode: search.inviteCode,
      inviteExpiresAt: search.inviteExpiresAt,
    }),
  });

  if (!accessToken) {
    navigate({
      to: "/auth/signup",
    });
  }

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [userType, setUserType] = useState<m.User.AccountType | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const { data: inviteCodeData, error: inviteCodeError } = fetcher.use<
    BrowserToServerEvent.GetInviteCode.Response | null,
    BrowserToServerEvent.GetInviteCode.ErrorData
  >(async () => {
    if (inviteCode) {
      return await api.routes.getInviteCode(inviteCode);
    }

    return {
      didError: false,
      data: null,
      statusCode: 200,
    };
  });

  const isExpiredInvite =
    inviteCodeData &&
    new Date(inviteCodeData.expiresAt).getTime() < new Date().getTime();

  const isIncorrectEmailForInvite =
    inviteCodeData && inviteCodeData.email !== email;

  const onContinue = async () => {
    if (!firstName || !lastName) {
      return;
    }

    const isValidInvite =
      inviteCodeData && !isExpiredInvite && !isIncorrectEmailForInvite;

    if (isValidInvite) {
      setSubmitting(true);

      const response = await api.routes.completeSignUpToOrg(accessToken, {
        inviteCode: inviteCodeData.id,
        firstName,
        lastName,
      });

      setSubmitting(false);

      if (response.didError) {
        addToast({
          title: "Error",
          message: response.data.message,
          appearance: toast.APPEARANCE.error,
          duration: toast.DURATION.longest,
        });
      } else {
        const isAuthenticated = await checkAuth();

        if (isAuthenticated) {
          navigate({
            to: "/home",
            search: {
              newUser: true,
              newOrganization: false,
            },
          });
        } else {
          addToast({
            title: "Authentication Error",
            message: `Signup was successful, but there was an error authenticating you. Try logging in (https://${window.location.host}/auth/login) and if you continue to experience issues, please email atul@composehq.com for support.`,
            appearance: toast.APPEARANCE.error,
            duration: toast.DURATION.longest,
          });
        }
      }
    } else {
      navigate({
        search: (prev) => ({
          ...prev,
          stage: NEW_USER_STAGE.workspaceInfo,
        }),
      });
    }
  };

  const onSubmit = async (orgName: string) => {
    if (!firstName || !lastName || !userType) {
      return;
    }

    setSubmitting(true);

    const response = await api.routes.completeSignUp(accessToken, {
      firstName,
      lastName,
      email,
      orgName,
      accountType: userType,
    });

    if (response.didError) {
      addToast({
        title: "Error",
        message: response.data.message,
        appearance: toast.APPEARANCE.error,
        duration: toast.DURATION.longest,
      });
    } else {
      const isAuthenticated = await checkAuth();

      if (isAuthenticated) {
        if (userType === m.User.ACCOUNT_TYPE.DEVELOPER) {
          navigate({
            to: "/start",
            search: {
              step: "lang-select",
              lang: null,
              projectType: null,
            },
          });
        } else {
          navigate({
            to: "/home",
            search: {
              newUser: true,
              newOrganization: true,
            },
          });
        }
      } else {
        addToast({
          title: "Authentication Error",
          message: `Signup was successful, but there was an error authenticating you. Try logging in (https://${window.location.host}/auth/login) and if you continue to experience issues, please email atul@composehq.com for support.`,
          appearance: toast.APPEARANCE.error,
          duration: toast.DURATION.longest,
        });
      }
    }

    setSubmitting(false);
  };

  const error = isExpiredInvite || isIncorrectEmailForInvite || inviteCodeError;

  return (
    <>
      {error && (
        <DashedWrapper>
          <div className="flex flex-col space-y-8 max-w-md items-center justify-center">
            <p className="text-brand-error text-center">
              {isExpiredInvite &&
                "This invite has expired. Please request an admin to invite you again!"}
              {isIncorrectEmailForInvite &&
                "This invite is for a different email. Please request an admin to invite you again, or try signing up with the correct email."}
              {inviteCodeError &&
                "There was an error processing your invite. Please request an admin to invite you again."}
            </p>
            <Button
              onClick={() => navigate({ to: "/auth/signup" })}
              variant="outline"
            >
              Return to sign up
            </Button>
          </div>
        </DashedWrapper>
      )}
      {stage === NEW_USER_STAGE.userInfo && (
        <UserInfo
          firstName={firstName}
          lastName={lastName}
          email={email}
          userType={userType}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setUserType={setUserType}
          onContinue={onContinue}
          inviteCodeData={inviteCodeData}
          submitting={submitting}
        />
      )}
      {stage === NEW_USER_STAGE.workspaceInfo && (
        <OrgInfo onSubmit={onSubmit} submitting={submitting} />
      )}
    </>
  );
}

export default NewUserFlow;
