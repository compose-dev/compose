import { Modal } from "~/components/modal";
import { useBilling } from "../useBilling";
import { IOComponent } from "~/components/io-component";
import { NumberInput } from "~/components/input";
import Button from "~/components/button";

export default function ProvisionProModal({
  billingFlow,
}: {
  billingFlow: ReturnType<typeof useBilling>;
}) {
  return (
    <Modal.Root
      isOpen={
        billingFlow.activeModal === billingFlow.ACTIVE_MODAL.PROVISION_PRO
      }
      width="lg"
      onClose={() => {
        billingFlow.setActiveModal(billingFlow.ACTIVE_MODAL.NONE);
      }}
    >
      <Modal.Header className="flex flex-col gap-0">
        <div className="flex flex-row items-center gap-4 justify-between w-full">
          <Modal.Title>Upgrade to Pro</Modal.Title>
          <Modal.CloseIcon
            onClick={() =>
              billingFlow.setActiveModal(billingFlow.ACTIVE_MODAL.NONE)
            }
          />
        </div>
        <p className="text-brand-neutral-2">
          Provision seats for your organization.
        </p>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col">
          <IOComponent.Label>Standard users</IOComponent.Label>
          <IOComponent.Description className="text-xs mb-2">
            Team members within your organization with full access to the
            Compose platform, depending on the permissions they are assigned.
          </IOComponent.Description>
          <div className="flex flex-row justify-between items-center">
            <NumberInput
              value={billingFlow.standardSeats}
              setValue={billingFlow.setStandardSeats}
              right={null}
              label={null}
              rootClassName="w-96 max-w-96"
              allowDecimals={false}
            />
            <p>${billingFlow.standardSeatsCost}.00</p>
          </div>
        </div>
        <div className="flex flex-col">
          <IOComponent.Label>External users</IOComponent.Label>
          <IOComponent.Description className="text-xs mb-2">
            Users outside of your organization who can be given access by email
            to use individual apps.
          </IOComponent.Description>
          <div className="flex flex-row justify-between items-center">
            <NumberInput
              value={billingFlow.externalSeats}
              setValue={billingFlow.setExternalSeats}
              right={null}
              label={null}
              rootClassName="w-96 max-w-96"
              allowDecimals={false}
            />
            <p>${billingFlow.externalSeatsCost}.00</p>
          </div>
        </div>
        <div className="w-full border-b border-brand-neutral !mt-8 !mb-4"></div>
        <div className="flex flex-row justify-between items-center">
          <p className="font-medium">Monthly cost</p>
          <p className="font-medium">${billingFlow.totalCost}.00</p>
        </div>
        <div className="flex flex-row justify-end !mt-8 gap-4">
          <Button
            variant="ghost"
            onClick={() => {
              billingFlow.clearForm();
              billingFlow.setActiveModal(billingFlow.ACTIVE_MODAL.NONE);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="warning"
            onClick={billingFlow.continueToCheckout}
            className="bg-orange-600 hover:bg-orange-700"
            loading={billingFlow.loadingCheckoutSession}
            disabled={billingFlow.totalCost <= 0}
          >
            Continue to checkout
          </Button>
        </div>
      </Modal.Body>
    </Modal.Root>
  );
}
