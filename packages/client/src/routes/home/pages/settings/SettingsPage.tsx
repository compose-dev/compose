import Button from "~/components/button";
import { useNavigate } from "@tanstack/react-router";
import Icon from "~/components/icon";
import { useHomeStore } from "~/routes/home/utils/useHomeStore";
import { api } from "~/api";

import { fetcher } from "~/utils/fetcher";
import { Spinner } from "~/components/spinner";

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
import { Page } from "~/routes/home/components/page";
import { useBillingQuery } from "../../utils/useBillingQuery";
import { useEffect } from "react";

export default function Settings() {
  const { addToast } = toast.useStore();
  const navigate = useNavigate();

  const { user } = useHomeStore();

  const {
    data: settingsData,
    loading,
    refetch: refetchSettings,
  } = fetcher.use(api.routes.getSettings);

  const billing = useBillingQuery();

  useEffect(() => {
    if (billing.isPending && !billing.isFetching) {
      billing.refetch();
    }
  }, [billing]);

  const inviteFlow = useInviteUser(refetchSettings);
  const billingFlow = useBilling(billing.data);

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

  if (billing.error) {
    return (
      <div className="py-16 px-4 flex justify-center bg-brand-page">
        <div className="flex flex-col w-full max-w-5xl items-start justify-start gap-12">
          <Button variant="outline" onClick={() => navigate({ to: "/home" })}>
            <Icon name="arrow-back-up" color="brand-neutral" />
            Back to home
          </Button>
          <p className="text-brand-error">
            Error fetching billing data: {billing.error?.message}. Please reach
            out to support: atul@composehq.com
          </p>
        </div>
      </div>
    );
  }

  if (loading || billing.isPending || !settingsData) {
    return (
      <Page.Root>
        <Page.Title>Settings</Page.Title>
        <div className="w-full border-b border-brand-neutral" />
        <Spinner />
      </Page.Root>
    );
  }

  return (
    <Page.Root>
      <Page.Title>Settings</Page.Title>
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
          refetchBilling={billing.refetch}
          refetchSettings={refetchSettings}
        />
      </SettingsSection>
      <div className="w-full border-b border-brand-neutral"></div>
      <SettingsSection>
        <BillingSection
          settings={settingsData}
          billing={billing.data}
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
        billingData={billing.data}
        billingFlow={billingFlow}
      />
      <InviteUserSuccessModal inviteFlow={inviteFlow} copyText={copyText} />
      <ProvisionProModal billingFlow={billingFlow} />
      <DowngradePlanModal
        isOpen={
          billingFlow.activeModal === billingFlow.ACTIVE_MODAL.DOWNGRADE_HOBBY
        }
        close={() => billingFlow.setActiveModal(billingFlow.ACTIVE_MODAL.NONE)}
      />
    </Page.Root>
  );
}
