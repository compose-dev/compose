import { useEffect, useState } from "react";
import Button from "~/components/button";
import { TextInput } from "~/components/input";
import { Modal } from "~/components/modal";

function EditReportTitleModal({
  isOpen,
  onClose,
  reportName,
  setReportName,
}: {
  isOpen: boolean;
  onClose: () => void;
  reportName: string;
  setReportName: (reportName: string) => void;
}) {
  const [tempName, setTempName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setTempName(reportName);
    }
  }, [reportName, isOpen]);

  function handleSubmit() {
    if (!tempName || tempName.length < 2) {
      setError("Report title must be at least 2 characters long");
      return;
    }

    setError(null);
    setReportName(tempName);
    onClose();
  }

  return (
    <Modal.Root isOpen={isOpen} onClose={onClose} width="sm">
      <Modal.CloseableHeader onClose={onClose}>
        Edit Report Title
      </Modal.CloseableHeader>
      <Modal.Body>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <TextInput
            label={null}
            value={tempName}
            setValue={setTempName}
            hasError={!!error}
            errorMessage={error}
          />
          <div className="flex flex-row justify-end items-center gap-2">
            <Button variant="subtle-secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal.Root>
  );
}

export { EditReportTitleModal };
