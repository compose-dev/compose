import { BrowserToServerEvent, m, u } from "@compose/ts";
import { useState } from "react";
import { useHomeStore } from "~/routes/home/utils/useHomeStore";
import { toast } from "~/utils/toast";
import Button from "~/components/button";
import Icon from "~/components/icon";
import { TextInput } from "~/components/input";
import { api } from "~/api";
import CopyAppLinkButton from "./components/CopyAppLinkButton";
import ProPlanNotice from "./components/ProPlanNotice";
import ChildAppNotice from "./components/ChildAppNotice";

export default function PublicTab({
  billing,
  appRoute,
  environmentId,
  refetchExternalUsers,
  publicPermission,
  appLink,
  externalUsers,
  environmentApps,
}: {
  billing: BrowserToServerEvent.BillingDetails.Response;
  appRoute: string;
  environmentId: string;
  refetchExternalUsers: () => void;
  publicPermission: m.ExternalAppUser.DB | undefined;
  appLink: string;
  externalUsers: m.ExternalAppUser.DB[] | undefined;
  environmentApps: Record<string, m.Environment.DB["apps"][number]>;
}) {
  const { user } = useHomeStore();

  const { addToast } = toast.useStore();
  const [publicInput, setPublicInput] = useState<string | null>(null);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [removeConfirmationInput, setRemoveConfirmationInput] = useState<
    string | null
  >(null);

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

  async function onClickRemovePublicAccess() {
    if (removeConfirmationInput !== "remove" || !publicPermission) {
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

    setShowRemoveConfirmation(false);
    setRemoveConfirmationInput(null);
    refetchExternalUsers();
  }

  if (publicPermission) {
    return (
      <>
        <div className="flex flex-row gap-x-4">
          <Icon name="checkmark" color="brand-neutral" />
          <p>This app is public. Anyone with the link can access it.</p>
        </div>
        {showRemoveConfirmation && (
          <div className="flex flex-col space-y-4">
            <TextInput
              label={null}
              placeholder={"Type 'remove' to confirm your choice"}
              setValue={setRemoveConfirmationInput}
              value={removeConfirmationInput}
            />
            <div className="flex flex-row space-x-2 items-center">
              <Button
                variant="outline"
                onClick={() => setShowRemoveConfirmation(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={onClickRemovePublicAccess}
                disabled={removeConfirmationInput !== "remove"}
                className="flex-1"
              >
                Confirm removal
              </Button>
            </div>
          </div>
        )}
        {!showRemoveConfirmation && (
          <div className="flex flex-row space-x-2 items-center">
            <CopyAppLinkButton link={appLink} />
            <Button
              variant="danger"
              onClick={() => setShowRemoveConfirmation(true)}
            >
              <Icon name="x" color="white-btn" size="0.75" stroke="bold" />
              Remove public access
            </Button>
          </div>
        )}
      </>
    );
  }

  if (
    billing.company.plan === m.Company.PLANS.HOBBY &&
    !billing.FREE_UNLIMITED_USAGE
  ) {
    return (
      <ProPlanNotice label="Publish apps to the public with a pro plan." />
    );
  }

  return (
    <>
      <ChildAppNotice
        externalUsers={externalUsers}
        environmentApps={environmentApps}
        shareBehaviorLabel="You can still make this app public. This will not affect the parent app's sharing settings."
      />
      <p>
        Publish this app to the public. Anyone with the link will be able to
        access it.
      </p>
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
    </>
  );
}
