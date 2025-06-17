import { m } from "@compose/ts";
import { useState } from "react";
import { api } from "~/api";
import Button from "~/components/button";
import Icon from "~/components/icon";
import { InlineLink } from "~/components/inline-link";
import { TextInput } from "~/components/input";
import { IOComponent } from "~/components/io-component";
import { Modal } from "~/components/modal";
import { toast } from "~/utils/toast";

export default function NewEnvironmentModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { addToast } = toast.useStore();

  const [name, setName] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [key, setKey] = useState<string | null>(null);

  async function onClickCreate() {
    setError(null);
    setNameError(null);

    if (!name) {
      setNameError("Please enter an environment name");
      return;
    }

    if (name.length < 3 || name.length > 75) {
      setNameError("Environment name must be between 3 and 75 characters");
      return;
    }

    setSubmitting(true);

    const response = await api.routes.createEnvironment({
      name,
      type: m.Environment.TYPE.prod,
    });

    if (response.didError) {
      setError(response.data.message);
    } else {
      setKey(response.data.key);
    }

    setSubmitting(false);
  }

  return (
    <Modal.Root isOpen={isOpen} width="md" onClose={onClose}>
      <Modal.CloseableHeader onClose={onClose}>
        New Production Environment
      </Modal.CloseableHeader>
      <Modal.Body>
        {!key && (
          <>
            <Modal.Subtitle>
              Share apps with your whole organization. Learn more by reading the{" "}
              <InlineLink url="https://docs.composehq.com/guides/deployment">
                deployment guide.
              </InlineLink>
            </Modal.Subtitle>
            <TextInput
              label="Environment Name"
              value={name}
              setValue={setName}
              placeholder="Production Environment"
              errorMessage={nameError}
              hasError={!!nameError}
            />
          </>
        )}
        {key && (
          <>
            <p>
              <span className="text-brand-primary">Success!</span> Copy the key
              below. This is the only time you will be able to see it.
            </p>
            <div className="flex items-center gap-2 justify-between">
              <TextInput
                label={null}
                value={key}
                setValue={() => {}}
                disabled={true}
              />
              <Button
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(key);
                  addToast({
                    message: "Copied API key to clipboard",
                    appearance: "success",
                  });
                }}
              >
                <Icon name="copy" color="brand-neutral-2" />
              </Button>
            </div>
          </>
        )}
        <div className="flex items-center justify-end gap-2 pt-2">
          {!key && (
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            onClick={key ? onSuccess : onClickCreate}
            loading={submitting}
          >
            {key ? "Got it" : "Create"}
          </Button>
        </div>
        {error && <IOComponent.Error>{error}</IOComponent.Error>}
      </Modal.Body>
    </Modal.Root>
  );
}
