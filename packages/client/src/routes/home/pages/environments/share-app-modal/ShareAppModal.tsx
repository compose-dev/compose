import { m } from "@compose/ts";
import { useState } from "react";
import Button from "~/components/button";
import { Modal } from "~/components/modal";
import { Spinner } from "~/components/spinner";
import { useHomeStore } from "~/routes/home/utils/useHomeStore";
import { useBillingQuery } from "~/utils/queries/useBillingQuery";
import { classNames } from "~/utils/classNames";
import { useSettingsQuery } from "~/utils/queries/useSettingsQuery";
import { useRunOnce } from "~/utils/useRunOnce";
import OrganizationTab from "./OrganizationTab";
import ExternalTab from "./ExternalTab";
import PublicTab from "./PublicTab";

const TAB = {
  ORGANIZATION: "organization",
  EXTERNAL: "external",
  PUBLIC: "public",
} as const;

type Tab = (typeof TAB)[keyof typeof TAB];

function Tab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button variant="ghost" onClick={onClick}>
      <div className="flex flex-col space-y-2">
        <p
          className={classNames({
            "text-brand-neutral-2": !active,
          })}
        >
          {label}
        </p>
        <p
          className={classNames("h-px w-full z-10", {
            "border-brand-text border-b-2": active,
            "pb-0.5": !active,
          })}
        ></p>
      </div>
    </Button>
  );
}

function TabPicker({
  activeTab,
  setActiveTab,
  onClose,
}: {
  activeTab: "organization" | "external" | "public";
  setActiveTab: (tab: "organization" | "external" | "public") => void;
  onClose: () => void;
}) {
  return (
    <Modal.Header>
      <div className="relative">
        <div className="flex self-stretch h-px border-b border-brand-neutral absolute bottom-0 left-0 right-0 " />
        <div className="flex flex-space justify-between items-start">
          <div className="flex flex-row gap-x-4">
            <Tab
              label="Organization"
              active={activeTab === TAB.ORGANIZATION}
              onClick={() => setActiveTab(TAB.ORGANIZATION)}
            />
            <Tab
              label="External"
              active={activeTab === TAB.EXTERNAL}
              onClick={() => setActiveTab(TAB.EXTERNAL)}
            />
            <Tab
              label="Public"
              active={activeTab === TAB.PUBLIC}
              onClick={() => setActiveTab(TAB.PUBLIC)}
            />
          </div>
          <div className="mt-px">
            <Modal.CloseIcon onClick={onClose} />
          </div>
        </div>
      </div>
    </Modal.Header>
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
  environmentType,
}: {
  isOpen: boolean;
  onClose: () => void;
  environmentId: string;
  appRoute: string;
  environmentApps: Record<string, m.Environment.DB["apps"][number]>;
  externalUsers: m.ExternalAppUser.DB[] | undefined;
  refetchExternalUsers: () => void;
  environmentType: m.Environment.DB["type"];
}) {
  const appLink = `${window.location.origin}/app/${environmentId}/${appRoute}`;

  const { user } = useHomeStore();

  const publicPermission =
    externalUsers &&
    externalUsers.find(
      (user) =>
        user.email === m.ExternalAppUser.EMAIL_FIELD_VALUE_FOR_PUBLIC_APP
    );

  const [activeTab, setActiveTab] = useState<Tab>(
    publicPermission ? TAB.PUBLIC : TAB.ORGANIZATION
  );

  const billing = useBillingQuery();
  const settings = useSettingsQuery();

  useRunOnce(
    () => {
      if (billing.isPending && !billing.isFetching) {
        billing.refetch();
      }
    },
    {
      waitUntil: isOpen,
    }
  );

  function modalBody() {
    if (!billing.data || !user) {
      return (
        <Modal.Body className="!space-y-8">
          <div className="w-full flex justify-center items-center">
            <Spinner />
          </div>
        </Modal.Body>
      );
    }

    if (billing.error) {
      return (
        <Modal.Body className="!space-y-8">
          <p className="text-brand-error">
            Error loading data: {billing.error.message}
          </p>
        </Modal.Body>
      );
    }

    if (activeTab === TAB.ORGANIZATION) {
      return (
        <Modal.Body className="!space-y-8 mt-4">
          <OrganizationTab
            billing={billing.data}
            environmentType={environmentType}
            appLink={appLink}
            settings={settings.data}
          />
        </Modal.Body>
      );
    }

    if (activeTab === TAB.EXTERNAL) {
      return (
        <Modal.Body className="!space-y-8 mt-4">
          <ExternalTab
            billing={billing.data}
            appRoute={appRoute}
            environmentId={environmentId}
            refetchBilling={billing.refetch}
            refetchExternalUsers={refetchExternalUsers}
            externalUsers={externalUsers}
            appLink={appLink}
            environmentApps={environmentApps}
          />
        </Modal.Body>
      );
    }

    if (activeTab === TAB.PUBLIC) {
      return (
        <Modal.Body className="!space-y-8 mt-4">
          <PublicTab
            billing={billing.data}
            appLink={appLink}
            appRoute={appRoute}
            environmentId={environmentId}
            publicPermission={publicPermission}
            refetchExternalUsers={refetchExternalUsers}
            environmentApps={environmentApps}
            externalUsers={externalUsers}
          />
        </Modal.Body>
      );
    }

    return null;
  }

  return (
    <Modal.Root isOpen={isOpen} width="md" onClose={onClose}>
      <TabPicker
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onClose={onClose}
      />
      {modalBody()}
    </Modal.Root>
  );
}
