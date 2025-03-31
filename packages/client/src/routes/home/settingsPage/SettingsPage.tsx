import Button from "~/components/button";
import { useNavigate } from "@tanstack/react-router";
import Icon from "~/components/icon";
import { useHomeStore } from "../useHomeStore";
import { api } from "~/api";

import { fetcher } from "~/utils/fetcher";
import { CenteredSpinner } from "~/components/spinner";

import { toast } from "~/utils/toast";

import { useBilling } from "./useBilling";
import { useInviteUser } from "./useInviteUser";
import {
  BillingSection,
  DowngradePlanModal,
  InviteUserFormModal,
  InviteUserSuccessModal,
  ProvisionProModal,
  SettingsSection,
  UserProfileSection,
  UsersSection,
} from "./components";

function SettingsPage() {
  const { addToast } = toast.useStore();
  const navigate = useNavigate();

  const { user } = useHomeStore();

  const {
    data: settingsData,
    loading,
    refetch: refetchSettings,
  } = fetcher.use(api.routes.getSettings);

  const {
    data: billingData,
    loading: loadingBilling,
    error: billingError,
    refetch: refetchBilling,
  } = fetcher.use(api.routes.getBillingData);

  const inviteFlow = useInviteUser(refetchSettings);
  const billingFlow = useBilling(billingData);

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    addToast({
      message: "Copied to clipboard",
      appearance: toast.APPEARANCE.success,
    });
  }

  if (!user) {
    return null;
  }

  if (billingError) {
    return (
      <div className="py-16 px-4 flex justify-center bg-brand-page">
        <div className="flex flex-col w-full max-w-5xl items-start justify-start gap-12">
          <Button variant="outline" onClick={() => navigate({ to: "/home" })}>
            <Icon name="arrow-back-up" color="brand-neutral" />
            Back to home
          </Button>
          <p className="text-brand-error">
            Error fetching billing data: {billingError.data.message}. Please
            reach out to support: atul@composehq.com
          </p>
        </div>
      </div>
    );
  }

  if (loading || loadingBilling || !settingsData || !billingData) {
    return (
      <div className="py-16 px-4 flex justify-center bg-brand-page">
        <div className="flex flex-col w-full max-w-5xl items-start justify-start gap-12">
          <div className="flex flex-row items-center justify-between w-full">
            <h2>Settings</h2>
            <Button variant="outline" onClick={() => navigate({ to: "/home" })}>
              <Icon name="arrow-back-up" color="brand-neutral" />
              Back to home
            </Button>
          </div>
          <div className="w-full border-b border-brand-neutral" />

          <CenteredSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 flex justify-center bg-brand-page">
      <div className="flex flex-col w-full max-w-5xl items-start justify-start gap-12">
        <div className="flex flex-row items-center justify-between w-full">
          <h2>Settings</h2>
          <Button variant="outline" onClick={() => navigate({ to: "/home" })}>
            <Icon name="arrow-back-up" color="brand-neutral" />
            Back to home
          </Button>
        </div>
        <div className="w-full border-b border-brand-neutral" />
        <SettingsSection title="User Profile">
          <UserProfileSection />
        </SettingsSection>
        <div className="w-full border-b border-brand-neutral"></div>
        <SettingsSection title="Organization">
          <UsersSection
            settings={settingsData}
            inviteFlow={inviteFlow}
            copyText={copyText}
            refetchBilling={refetchBilling}
            refetchSettings={refetchSettings}
          />
        </SettingsSection>
        <div className="w-full border-b border-brand-neutral"></div>
        <SettingsSection>
          <BillingSection
            settings={settingsData}
            billing={billingData}
            billingFlow={billingFlow}
          />
        </SettingsSection>
        <div className="w-full border-b border-brand-neutral"></div>
        <SettingsSection title="Support">
          <p>
            If you ever have any issues, please feel free to reach out to us at
            <span className="font-medium"> atul@composehq.com</span>.
          </p>
        </SettingsSection>
        <InviteUserFormModal
          inviteFlow={inviteFlow}
          billingData={billingData}
          billingFlow={billingFlow}
        />
        <InviteUserSuccessModal inviteFlow={inviteFlow} copyText={copyText} />
        <ProvisionProModal billingFlow={billingFlow} />
        <DowngradePlanModal
          isOpen={
            billingFlow.activeModal === billingFlow.ACTIVE_MODAL.DOWNGRADE_HOBBY
          }
          close={() =>
            billingFlow.setActiveModal(billingFlow.ACTIVE_MODAL.NONE)
          }
        />
      </div>
    </div>
  );
}

export default SettingsPage;
