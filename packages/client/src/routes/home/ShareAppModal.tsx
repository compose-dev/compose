import { m, u } from "@compose/ts";
import { useEffect, useMemo, useState } from "react";
import { api } from "~/api";
import Button from "~/components/button";
import Icon from "~/components/icon";
import { EmailInput, TextInput } from "~/components/input";
import { Modal } from "~/components/modal";
import { toast } from "~/utils/toast";
import { InlineLink } from "~/components/inline-link";
import { fetcher } from "~/utils/fetcher";
import { useNavigate } from "@tanstack/react-router";
import { CenteredSpinner, Spinner } from "~/components/spinner";
import { BillingNotice as BillingNoticeUI } from "~/components/billing-notice";
import { useHomeStore } from "./useHomeStore";

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
    return (
      <BillingNoticeUI className="!mt-4">
        You're on the friends and family plan, which allows you and your team
        full access to Compose for free. Thanks for being a user!
      </BillingNoticeUI>
    );
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
        You're good for now! You currently have {externalSeatsRemaining}{" "}
        additional external seats available on your plan.
      </BillingNoticeUI>
    );
  }

  return (
    <BillingNoticeUI className="!mt-4">
      You've filled your external seats allowance. Don't worry - you can still
      add external users. Upon inviting, we'll automatically update your
      subscription and pro-rate for the days remaining in the current billing
      cycle.
    </BillingNoticeUI>
  );
}

export default function ShareAppModal({
  isOpen,
  onClose,
  environmentId,
  appRoute,
  environmentApps,
  externalUsers,
  refetchExternalUsers,
}: {
  isOpen: boolean;
  onClose: () => void;
  environmentId: string;
  appRoute: string;
  environmentApps: Record<string, m.Environment.DB["apps"][number]>;
  externalUsers: m.ExternalAppUser.DB[] | undefined;
  refetchExternalUsers: () => void;
}) {
  const { user } = useHomeStore();
  const { addToast } = toast.useStore();

  const [email, setEmail] = useState<string | null>(null);
  const [publicInput, setPublicInput] = useState<string | null>(null);
  const [submittingExternalUser, setSubmittingExternalUser] = useState(false);
  const [submittingDeleteExternalUser, setSubmittingDeleteExternalUser] =
    useState(false);

  const [revokePublicAccess, setRevokePublicAccess] = useState<string | null>(
    null
  );

  const {
    data: billingData,
    error: billingError,
    refetch: refetchBilling,
    didInitialFetch: didInitialBillingFetch,
  } = fetcher.use(api.routes.getBillingData, { fetchOnMount: false });

  useEffect(() => {
    if (!didInitialBillingFetch.current && isOpen) {
      refetchBilling();
    }
  }, [isOpen, refetchBilling, didInitialBillingFetch]);

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

  async function onClickMakePublic() {
    if (publicInput !== "public") {
      return;
    }

    if (
      !u.permission.isAllowed(
        u.permission.FEATURE.SHARE_APP_PUBLICLY,
        user?.permission
      )
    ) {
      addToast({
        message:
          "You are not authorized to make this app public. Please ask an admin to change your permissions.",
        appearance: toast.APPEARANCE.error,
      });
      return;
    }

    const response = await api.routes.insertExternalAppUser({
      appRoute,
      environmentId,
      email: m.ExternalAppUser.EMAIL_FIELD_VALUE_FOR_PUBLIC_APP,
    });

    if (response.didError) {
      addToast({
        message: response.data.message,
        appearance: toast.APPEARANCE.error,
      });
      return;
    }

    setPublicInput(null);
    refetchExternalUsers();
  }

  const publicPermission =
    externalUsers &&
    externalUsers.find(
      (user) =>
        user.email === m.ExternalAppUser.EMAIL_FIELD_VALUE_FOR_PUBLIC_APP
    );

  const inheritingFrom = useMemo(() => {
    if (!externalUsers) {
      return null;
    }

    const parentPermission = externalUsers.find((user) =>
      user.email.startsWith(
        m.ExternalAppUser.INHERIT_PERMISSIONS_FROM_APP_PREFIX
      )
    );

    if (!parentPermission) {
      return null;
    }

    const parentAppRoute = parentPermission.email.slice(
      m.ExternalAppUser.INHERIT_PERMISSIONS_FROM_APP_PREFIX.length
    );

    if (!environmentApps[parentAppRoute]) {
      return null;
    }

    return environmentApps[parentAppRoute].name;
  }, [environmentApps, externalUsers]);

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

  async function onClickRevokePublicAccess() {
    if (revokePublicAccess !== "revoke" || !publicPermission) {
      return;
    }

    if (
      !u.permission.isAllowed(
        u.permission.FEATURE.UNSHARE_APP_PUBLICLY,
        user?.permission
      )
    ) {
      addToast({
        message:
          "You are not authorized to remove public access. Please ask an admin to change your permissions.",
        appearance: toast.APPEARANCE.error,
      });
      return;
    }

    const response = await api.routes.deleteExternalAppUser(
      publicPermission.id
    );

    if (response.didError) {
      addToast({
        message: response.data.message,
        appearance: toast.APPEARANCE.error,
      });
      return;
    }

    addToast({
      message: "Removed public access",
      appearance: toast.APPEARANCE.success,
    });

    setRevokePublicAccess(null);
    refetchExternalUsers();
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
    if (billingData && !billingData.FREE_UNLIMITED_USAGE) {
      addToast({
        message: "Removed external seat from billing.",
        appearance: toast.APPEARANCE.success,
      });
    }
    refetchExternalUsers();
    refetchBilling();
  }

  const canViewExternalUsers = u.permission.isAllowed(
    u.permission.FEATURE.VIEW_EXTERNAL_USERS,
    user?.permission
  );

  function modalBody() {
    if (!billingData || !user) {
      return (
        <Modal.Body className="!space-y-8">
          <CenteredSpinner />
        </Modal.Body>
      );
    }

    if (billingError) {
      return (
        <Modal.Body className="!space-y-8">
          <p className="text-brand-error">
            Error loading data: {billingError.data.message}
          </p>
        </Modal.Body>
      );
    }

    if (!canViewExternalUsers) {
      return (
        <Modal.Body className="!space-y-8">
          <p className="text-brand-error">
            You are not authorized to view external users. Please ask an admin
            to change your permissions.
          </p>
        </Modal.Body>
      );
    }

    return (
      <Modal.Body className="!space-y-8">
        {(publicPermission || inheritingFrom) && (
          <div className="flex flex-col space-y-4">
            {publicPermission && (
              <div className="flex flex-row p-4 rounded bg-brand-overlay space-x-2">
                <div>
                  <Icon name="world" color="brand-primary" size="1.5" />
                </div>
                <div className="flex flex-col space-y-6">
                  <p>
                    This app is public and available to anyone with the link.
                    <br />
                    <br />
                    Any other sharing options set for this app will be
                    superseded by the public access setting.
                  </p>
                  <div className="flex flex-row space-x-2 items-center">
                    <TextInput
                      label={null}
                      placeholder={"Type 'revoke' to remove public access"}
                      setValue={setRevokePublicAccess}
                      value={revokePublicAccess}
                    />
                    <Button
                      variant={
                        revokePublicAccess !== "revoke" ? "outline" : "danger"
                      }
                      disabled={revokePublicAccess !== "revoke"}
                      onClick={onClickRevokePublicAccess}
                    >
                      Revoke
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {inheritingFrom && (
              <div className="flex flex-row p-4 rounded bg-brand-overlay space-x-2">
                <div>
                  <Icon name="stack" color="brand-success" size="1.5" />
                </div>
                <p>
                  This app is inheriting permissions from the following app:{" "}
                  <span className="font-medium">{inheritingFrom}</span>.
                  <br />
                  <br />
                  This setting was set programmatically inside the SDK by
                  declaring{" "}
                  <span className="font-medium">{inheritingFrom}</span> as the
                  parent app for this app, which is usually done when creating{" "}
                  <InlineLink
                    url="https://docs.composehq.com/guides/multipage-apps"
                    appearance="success"
                  >
                    multipage applications
                  </InlineLink>
                  .
                  <br />
                  <br />
                  Additional sharing options set on this page will be merged
                  with the parent app's settings.
                </p>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-1">
            <p>Share via email:</p>
            <div className="flex flex-row space-x-2">
              <EmailInput
                label={null}
                setValue={setEmail}
                value={email}
                placeholder={"john.doe@gmail.com"}
                disabled={!billingData.allowInvitingExternalUsers}
              />
              <Button
                variant="primary"
                disabled={
                  !email ||
                  !u.string.isValidEmail(email) ||
                  !billingData.allowInvitingExternalUsers
                }
                onClick={onClickShare}
                loading={submittingExternalUser}
              >
                Share
              </Button>
            </div>
            <BillingNotice
              plan={billingData.company.plan}
              externalSeatsRemaining={
                billingData.externalSeats - billingData.externalSeatsUsed
              }
              freeUnlimited={billingData.FREE_UNLIMITED_USAGE}
            />
          </div>
          {emailExternalUsers.length > 0 && (
            <ul className="space-y-4">
              {emailExternalUsers.map((user) => (
                <div key={user.id} className="flex flex-row space-x-2">
                  <li className="flex-1">{user.email}</li>
                  <Button
                    variant="ghost"
                    onClick={() => onClickRemoveEmailUser(user.id)}
                    disabled={submittingDeleteExternalUser}
                  >
                    <Icon name="x" color="brand-neutral-2" size="0.75" />
                  </Button>
                </div>
              ))}
            </ul>
          )}
          {submittingDeleteExternalUser && (
            <div className="w-full flex justify-end items-center">
              <Spinner text="Deleting external user..." size="sm" />
            </div>
          )}
        </div>
        {!publicPermission && (
          <div className="flex w-full border-b border-brand-neutral" />
        )}

        {!publicPermission && (
          <div className="flex flex-col space-y-1">
            <p>Or, make the app public:</p>
            <div className="flex flex-row space-x-2">
              <TextInput
                label={null}
                placeholder={`Type "public" to confirm your choice`}
                setValue={setPublicInput}
                value={publicInput}
              />
              <Button
                variant="primary"
                disabled={publicInput !== "public"}
                onClick={onClickMakePublic}
              >
                Submit
              </Button>
            </div>
          </div>
        )}

        <div className="flex w-full border-b border-brand-neutral" />
        <div className="flex flex-col items-start">
          <div className="flex flex-col mb-1">
            <p>Shareable link (give this to external users):</p>
          </div>
          <div className="flex flex-row items-center space-x-2 w-full">
            <TextInput
              label={null}
              setValue={() => {}}
              value={`${window.location.origin}/app/${environmentId}/${appRoute}`}
              disabled
            />
            <Button
              variant="ghost"
              onClick={() => {
                // copy to clipboard
                navigator.clipboard.writeText(
                  `${window.location.origin}/app/${environmentId}/${appRoute}`
                );

                addToast({
                  message: "Copied link to clipboard",
                  appearance: toast.APPEARANCE.success,
                });
              }}
            >
              <Icon name="copy" color="brand-neutral-2" />
            </Button>
          </div>
        </div>
      </Modal.Body>
    );
  }

  return (
    <Modal.Root isOpen={isOpen} width="md" onClose={onClose}>
      <Modal.Header className="flex items-center justify-between">
        <Modal.Title>Share App</Modal.Title>
        <Modal.CloseIcon onClick={onClose} />
      </Modal.Header>
      {modalBody()}
    </Modal.Root>
  );
}
