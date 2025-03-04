import { useEffect, useState } from "react";
import { Modal } from "~/components/modal";
import { TextInput } from "~/components/input";
import Button from "~/components/button";

const APPEARANCE = {
  PRIMARY: "primary",
  DANGER: "danger",
  WARNING: "warning",
  OUTLINE: "outline",
} as const;

type Appearance = (typeof APPEARANCE)[keyof typeof APPEARANCE];

export default function ConfirmDialog({
  onConfirm,
  onCancel,
  title = "Confirm",
  message = "Are you sure you want to do this?",
  appearance = APPEARANCE.PRIMARY,
  typeToConfirmText = null,
  confirmButtonLabel = "Yes",
  cancelButtonLabel = "No",
  loading = false,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  appearance?: Appearance;
  typeToConfirmText?: string | null;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  loading?: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState<boolean>(false);

  const [typeToConfirmValue, setTypeToConfirmValue] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (
      typeToConfirmText !== null &&
      typeToConfirmValue !== typeToConfirmText
    ) {
      setError(`Please type "${typeToConfirmText}" to confirm`);
    } else {
      setError(null);
    }
  }, [typeToConfirmText, typeToConfirmValue]);

  function handleConfirm() {
    if (error) {
      setShowError(true);
    } else {
      onConfirm();
    }
  }

  return (
    <Modal.Root isOpen={true} width="sm" onClose={onCancel}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
        {typeToConfirmText && (
          <TextInput
            label={null}
            placeholder={`Type "${typeToConfirmText}" to confirm`}
            value={typeToConfirmValue}
            setValue={setTypeToConfirmValue}
            errorMessage={error}
            hasError={showError}
          />
        )}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant={appearance}
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmButtonLabel}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            {cancelButtonLabel}
          </Button>
        </div>
      </Modal.Body>
    </Modal.Root>
  );
}
