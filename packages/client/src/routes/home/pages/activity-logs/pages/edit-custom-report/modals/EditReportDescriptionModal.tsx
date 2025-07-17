import { useEffect, useState } from "react";
import Button from "~/components/button";
import { TextAreaInput } from "~/components/input";
import { Modal } from "~/components/modal";

function EditReportDescriptionModal({
  isOpen,
  onClose,
  reportDescription,
  setReportDescription,
}: {
  isOpen: boolean;
  onClose: () => void;
  reportDescription: string | null;
  setReportDescription: (reportDescription: string | null) => void;
}) {
  const [tempDescription, setTempDescription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setTempDescription(reportDescription);
    }
  }, [reportDescription, isOpen]);

  function handleSubmit() {
    setError(null);
    setReportDescription(tempDescription);
    onClose();
  }

  return (
    <Modal.Root isOpen={isOpen} onClose={onClose} width="sm">
      <Modal.CloseableHeader onClose={onClose}>
        Edit Report Description
      </Modal.CloseableHeader>
      <Modal.Body>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <TextAreaInput
            label={null}
            value={tempDescription}
            setValue={setTempDescription}
            hasError={!!error}
            errorMessage={error}
          />
          <div className="flex flex-row justify-end items-center gap-2">
            <Button variant="subtle-secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" onClick={() => {}}>
              Save
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal.Root>
  );
}

export { EditReportDescriptionModal };
