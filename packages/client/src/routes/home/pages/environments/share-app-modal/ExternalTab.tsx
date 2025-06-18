import { BrowserToServerEvent, m, u } from "@compose/ts";
import { useMemo, useState } from "react";
import { useHomeStore } from "~/routes/home/utils/useHomeStore";
import { toast } from "~/utils/toast";
import Button from "~/components/button";
import { EmailInput } from "~/components/input";
import { api } from "~/api";
import ProPlanNotice from "./components/ProPlanNotice";
import { useNavigate } from "@tanstack/react-router";
import { BillingNotice as BillingNoticeUI } from "~/components/billing-notice";
import { Spinner } from "~/components/spinner";
import CopyAppLinkButton from "./components/CopyAppLinkButton";
import ChildAppNotice from "./components/ChildAppNotice";

function BillingNotice({
  plan,
  externalSeatsRemaining,
  freeUnlimited,
}: {
  plan: m.Company.DB["plan"];
  externalSeatsRemaining: number;
  freeUnlimited: boolean;
}) {
  const navigate = useNavigate();

  if (freeUnlimited === true) {
    return null;
  }

  if (plan === m.Company.PLANS["HOBBY"]) {
    return (
      <div className="flex flex-col space-y-2 p-4 rounded bg-brand-overlay !mt-4">
        <p>
          External users are a pro feature. Please upgrade within settings to
          access this feature.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate({ to: "/home/settings" })}
        >
          Go to settings
        </Button>
      </div>
    );
  }

  if (externalSeatsRemaining > 0) {
    return (
      <BillingNoticeUI className="!mt-4">
        Inviting a new external user will use one of {externalSeatsRemaining}{" "}
        unused external user credits remaining on your plan.
      </BillingNoticeUI>
    );
  }

  return (
    <BillingNoticeUI className="!mt-4">
      You've used all of your external user credits. Adding a new user will
      update your subscription to include one additional external user credit.
    </BillingNoticeUI>
  );
}

export default function ExternalTab({
  billing,
  appRoute,
  environmentId,
  refetchBilling,
  refetchExternalUsers,
  externalUsers,
  appLink,
  environmentApps,
}: {
  billing: BrowserToServerEvent.BillingDetails.Response;
  appRoute: string;
  environmentId: string;
  refetchBilling: () => void;
  refetchExternalUsers: () => void;
  externalUsers: m.ExternalAppUser.DB[] | undefined;
  appLink: string;
  environmentApps: Record<string, m.Environment.DB["apps"][number]>;
}) {
  const { user } = useHomeStore();
  const { addToast } = toast.useStore();

  const [email, setEmail] = useState<string | null>(null);
  const [submittingExternalUser, setSubmittingExternalUser] = useState(false);
  const [submittingDeleteExternalUser, setSubmittingDeleteExternalUser] =
    useState(false);

  const canViewExternalUsers = u.permission.isAllowed(
    u.permission.FEATURE.VIEW_EXTERNAL_USERS,
    user?.permission
  );

  const emailExternalUsers = useMemo(() => {
    if (!externalUsers) {
      return [];
    }

    return externalUsers.filter(
      (permission) =>
        permission.email !==
          m.ExternalAppUser.EMAIL_FIELD_VALUE_FOR_PUBLIC_APP &&
        !permission.email.startsWith(
          m.ExternalAppUser.INHERIT_PERMISSIONS_FROM_APP_PREFIX
        )
    );
  }, [externalUsers]);

  async function onClickShare() {
    if (!email || !u.string.isValidEmail(email)) {
      return;
    }

    if (
      !u.permission.isAllowed(
        u.permission.FEATURE.SHARE_APP_EXTERNAL_EMAIL,
        user?.permission
      )
    ) {
      addToast({
        message:
          "You are not authorized to share this app with external users. Please ask an admin to change your permissions.",
        appearance: toast.APPEARANCE.error,
      });
      return;
    }

    setSubmittingExternalUser(true);
    const response = await api.routes.insertExternalAppUser({
      appRoute,
      environmentId,
      email,
    });
    setSubmittingExternalUser(false);

    if (response.didError) {
      addToast({
        message: response.data.message,
        appearance: toast.APPEARANCE.error,
        duration: "long",
      });
      return;
    } else {
      addToast({
        message: "Invited user successfully!",
        appearance: toast.APPEARANCE.success,
      });
    }

    setEmail(null);
    refetchExternalUsers();
    refetchBilling();
  }

  async function onClickRemoveEmailUser(id: string) {
    if (
      !u.permission.isAllowed(
        u.permission.FEATURE.UNSHARE_APP_EXTERNAL_EMAIL,
        user?.permission
      )
    ) {
      addToast({
        message:
          "You are not authorized to remove external users. Please ask an admin to change your permissions.",
        appearance: toast.APPEARANCE.error,
      });
      return;
    }

    setSubmittingDeleteExternalUser(true);
    const response = await api.routes.deleteExternalAppUser(id);
    setSubmittingDeleteExternalUser(false);

    if (response.didError) {
      addToast({
        message: response.data.message,
        appearance: toast.APPEARANCE.error,
        duration: "long",
      });
      return;
    }

    addToast({
      message: "Removed user from sharing options",
      appearance: toast.APPEARANCE.info,
    });
    if (!billing.FREE_UNLIMITED_USAGE) {
      addToast({
        message: "Removed external seat from billing.",
        appearance: toast.APPEARANCE.success,
      });
    }
    refetchExternalUsers();
    refetchBilling();
  }

  if (
    billing.company.plan === m.Company.PLANS.HOBBY &&
    !billing.FREE_UNLIMITED_USAGE
  ) {
    return (
      <ProPlanNotice label="Securely share apps with users outside your organization with a pro plan." />
    );
  }

  if (!canViewExternalUsers) {
    return (
      <p className="text-brand-error">
        You are not authorized to view external users for this app. Please ask
        an admin to change your permissions.
      </p>
    );
  }

  return (
    <>
      <ChildAppNotice
        externalUsers={externalUsers}
        environmentApps={environmentApps}
        shareBehaviorLabel="You can still share this app with additional external users. Sharing this app will not affect the parent app's sharing settings."
      />
      <div className="flex flex-col space-y-1">
        <div className="flex flex-row space-x-2">
          <EmailInput
            label={null}
            setValue={setEmail}
            value={email}
            placeholder={"john.doe@gmail.com"}
            disabled={!billing.allowInvitingExternalUsers}
          />
          <Button
            variant="primary"
            disabled={
              !email ||
              !u.string.isValidEmail(email) ||
              !billing.allowInvitingExternalUsers
            }
            onClick={onClickShare}
            loading={submittingExternalUser}
          >
            Share
          </Button>
        </div>
        <BillingNotice
          plan={billing.company.plan}
          externalSeatsRemaining={
            billing.externalSeats - billing.externalSeatsUsed
          }
          freeUnlimited={billing.FREE_UNLIMITED_USAGE}
        />
      </div>
      {emailExternalUsers.length > 0 && (
        <ul className="space-y-4">
          {emailExternalUsers.map((user) => (
            <div key={user.id} className="flex flex-row space-x-2">
              <li className="flex-1">{user.email}</li>
              <Button
                variant="subtle-secondary"
                onClick={() => onClickRemoveEmailUser(user.id)}
                disabled={submittingDeleteExternalUser}
                size="sm"
              >
                Delete
              </Button>
            </div>
          ))}
        </ul>
      )}
      {emailExternalUsers.length === 0 && (
        <p className="text-brand-neutral-2">
          No external users have been added yet.
        </p>
      )}
      {submittingDeleteExternalUser && (
        <div className="w-full flex justify-end items-center">
          <Spinner text="Deleting external user..." size="sm" />
        </div>
      )}
      <CopyAppLinkButton link={appLink} />
    </>
  );
}
