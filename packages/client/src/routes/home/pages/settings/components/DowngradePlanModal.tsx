import Button from "~/components/button";
import { Modal } from "~/components/modal";

export default function DowngradePlanModal({
  isOpen,
  close,
}: {
  isOpen: boolean;
  close: () => void;
}) {
  return (
    <Modal.Root isOpen={isOpen} width="md" onClose={close}>
      <Modal.CloseableHeader onClose={close}>
        Downgrade to Hobby
      </Modal.CloseableHeader>
      <Modal.Body>
        <p>
          Please reach out to us at atul@composehq.com to downgrade your plan.
          We'll process the request within 24 hours.
        </p>
        <p>
          We don't want to make it hard to downgrade - but just haven't made
          this feature self-service yet due to complexities with billing edge
          cases.
        </p>
        <Button variant="primary" onClick={close} className="w-full !mt-8">
          Got it
        </Button>
      </Modal.Body>
    </Modal.Root>
  );
}
