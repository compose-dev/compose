import { Modal } from "~/components/modal";
import { useInviteUser } from "../useInviteUser";
import { BrowserToServerEvent, m } from "@compose/ts";
import { TextInput } from "~/components/input";
import { ComboboxSingle } from "~/components/combobox";
import Button from "~/components/button";
import { IOComponent } from "~/components/io-component";
import { useBilling } from "../useBilling";
import { Alert } from "~/components/alert";

function BillingNotice({
  standardSeatsAvailable,
  freeUnlimited,
}: {
  standardSeatsAvailable: number;
  freeUnlimited: boolean;
}) {
  if (freeUnlimited === true) {
    return null;
  }

  if (standardSeatsAvailable <= 0) {
    return (
      <Alert appearance="neutral" iconName="coin" className="!mt-4">
        You've used all of your standard user seats. Adding a new user will
        update your subscription to include one additional standard user.
      </Alert>
    );
  }

  return (
    <Alert appearance="neutral" iconName="coin" className="!mt-4">
      Adding a user will use 1 of {standardSeatsAvailable} unfilled
      {standardSeatsAvailable === 1 ? " seat" : " seats"} available on your
      plan.
    </Alert>
  );
}

function ModalBody({
  inviteFlow,
  billingFlow,
  billingData,
}: {
  inviteFlow: ReturnType<typeof useInviteUser>;
  billingFlow: ReturnType<typeof useBilling>;
  billingData: BrowserToServerEvent.BillingDetails.Response;
}) {
  if (
    billingData.company.plan === m.Company.PLANS.HOBBY &&
    !billingData.FREE_UNLIMITED_USAGE
  ) {
    return (
      <div className="flex flex-col gap-4">
        <p className="mb-4">
          You're on the Hobby plan, which allows up to 1 user. Upgrade to Pro to
          invite more users.
        </p>
        <Button
          variant="brand"
          onClick={() => {
            inviteFlow.closeModal();
            billingFlow.clearForm();
            billingFlow.setActiveModal(billingFlow.ACTIVE_MODAL.PROVISION_PRO);
          }}
        >
          Upgrade to Pro
        </Button>
        <Button variant="outline" onClick={inviteFlow.closeModal}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p>Invite a user to your organization by entering their email below.</p>

      <TextInput
        placeholder="john.doe@example.com"
        label="Email"
        value={inviteFlow.email}
        setValue={inviteFlow.setEmail}
      />
      <ComboboxSingle
        label="Is this user a developer?"
        description="Developers will be assigned a personal development key."
        options={[
          {
            label: "Yes",
            value: m.User.ACCOUNT_TYPE.DEVELOPER,
            description: "They will build and use apps.",
          },
          {
            label: "No",
            value: m.User.ACCOUNT_TYPE.USER_ONLY,
            description: "They will only use apps.",
          },
        ]}
        value={inviteFlow.accountType}
        setValue={inviteFlow.setAccountType}
        id="user-type"
        disabled={false}
      />
      <ComboboxSingle
        label="Role"
        description="Control what features the user can access."
        options={[
          {
            label: m.User.PERMISSION_TO_LABEL[m.User.PERMISSION.MEMBER],
            value: m.User.PERMISSION.MEMBER,
            description: m.User.PERMISSION_TO_SUMMARY[m.User.PERMISSION.MEMBER],
          },
          {
            label: m.User.PERMISSION_TO_LABEL[m.User.PERMISSION.APP_MANAGER],
            value: m.User.PERMISSION.APP_MANAGER,
            description:
              m.User.PERMISSION_TO_SUMMARY[m.User.PERMISSION.APP_MANAGER],
          },
          {
            label: m.User.PERMISSION_TO_LABEL[m.User.PERMISSION.ADMIN],
            value: m.User.PERMISSION.ADMIN,
            description: m.User.PERMISSION_TO_SUMMARY[m.User.PERMISSION.ADMIN],
          },
          {
            label: m.User.PERMISSION_TO_LABEL[m.User.PERMISSION.OWNER],
            value: m.User.PERMISSION.OWNER,
            description: m.User.PERMISSION_TO_SUMMARY[m.User.PERMISSION.OWNER],
          },
        ]}
        value={inviteFlow.permission}
        setValue={inviteFlow.setPermission}
        id="permission"
        disabled={false}
      />
      <BillingNotice
        standardSeatsAvailable={
          billingData.standardSeats - billingData.standardSeatsUsed
        }
        freeUnlimited={billingData.FREE_UNLIMITED_USAGE}
      />
      <div className="flex flex-col">
        <Button
          variant="primary"
          onClick={inviteFlow.onInviteUser}
          className="mt-2"
        >
          Add User
        </Button>
        {inviteFlow.formError && (
          <IOComponent.Error>{inviteFlow.formError}</IOComponent.Error>
        )}
      </div>
    </div>
  );
}

export default function InviteUserFormModal({
  inviteFlow,
  billingFlow,
  billingData,
}: {
  inviteFlow: ReturnType<typeof useInviteUser>;
  billingData: BrowserToServerEvent.BillingDetails.Response;
  billingFlow: ReturnType<typeof useBilling>;
}) {
  return (
    <Modal.Root
      isOpen={inviteFlow.activeModal === inviteFlow.ACTIVE_MODAL.FORM}
      width="md"
      onClose={() => inviteFlow.closeModal()}
    >
      <Modal.CloseableHeader onClose={() => inviteFlow.closeModal()}>
        Add User
      </Modal.CloseableHeader>
      <ModalBody
        inviteFlow={inviteFlow}
        billingFlow={billingFlow}
        billingData={billingData}
      />
    </Modal.Root>
  );
}
