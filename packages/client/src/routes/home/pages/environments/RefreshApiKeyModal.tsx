import { ConfirmDialog } from "~/components/confirm-dialog";
import { FormattedEnvironment, useHomeStore } from "../../utils/useHomeStore";
import { useRefreshEnvironmentApiKeyMutation } from "~/utils/mutations/useRefreshEnvironmentApiKeyMutation";
import { useState } from "react";
import { m } from "@compose/ts";
import { Modal } from "~/components/modal";
import { TextInput } from "~/components/input";
import Button from "~/components/button";
import { toast } from "~/utils/toast";
import Icon from "~/components/icon";

export default function RefreshApiKeyModal({
  onClose,
  environment,
}: {
  onClose: () => void;
  environment: FormattedEnvironment;
}) {
  const { addToast } = toast.useStore();
  const mutation = useRefreshEnvironmentApiKeyMutation();
  const [newKey, setNewKey] = useState<string | null>(null);

  const { environments, setEnvironments } = useHomeStore();

  return (
    <>
      {!newKey && (
        <ConfirmDialog
          onCancel={onClose}
          onConfirm={async () => {
            try {
              const response = await mutation.mutateAsync(environment.id);

              if (environment.type === m.Environment.TYPE.dev) {
                const newEnvironments = { ...environments };
                newEnvironments[environment.id] = {
                  ...environment,
                  key: response.environment.key,
                };
                setEnvironments(newEnvironments);
              }

              setNewKey(response.environment.key);
            } catch (error) {
              // do nothing
            }
          }}
          confirmButtonLabel="Refresh API key"
          cancelButtonLabel="Cancel"
          title="Generate new API key"
          message="This will invalidate the current API key and generate a new one. Any active connections to this environment will not be disconnected, but new connections will require the new key."
          loading={mutation.isPending}
          appearance="primary"
          typeToConfirmText={environment.name}
          errorMessage={mutation.error?.message}
        />
      )}
      <Modal.Root isOpen={!!newKey} onClose={onClose}>
        <Modal.CloseableHeader onClose={onClose}>
          Your new API key
        </Modal.CloseableHeader>
        <Modal.Body>
          <>
            {environment.type === m.Environment.TYPE.prod && (
              <p>
                <span className="text-brand-primary">Success!</span> Copy the
                key below. This is the only time you will be able to see it.
              </p>
            )}
            {environment.type === m.Environment.TYPE.dev && (
              <p>
                <span className="text-brand-primary">Success!</span> Copy the
                key below.
              </p>
            )}
            <div className="flex items-center gap-2 justify-between">
              <TextInput
                label={null}
                value={newKey}
                setValue={() => {}}
                disabled={true}
              />
              <Button
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(newKey || "");
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
        </Modal.Body>
      </Modal.Root>
    </>
  );
}
