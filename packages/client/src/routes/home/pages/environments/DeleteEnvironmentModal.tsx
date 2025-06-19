import { ConfirmDialog } from "~/components/confirm-dialog";
import { FormattedEnvironment, useHomeStore } from "../../utils/useHomeStore";
import { useDeleteEnvironmentMutation } from "~/utils/mutations/useDeleteEnvironmentMutation";

export default function DeleteEnvironmentModal({
  onClose,
  environment,
}: {
  onClose: () => void;
  environment: FormattedEnvironment;
}) {
  const mutation = useDeleteEnvironmentMutation();

  const { environments, setEnvironments } = useHomeStore();

  return (
    <ConfirmDialog
      onCancel={onClose}
      onConfirm={async () => {
        try {
          await mutation.mutateAsync(environment.id);
          const newEnvironments = { ...environments };
          delete newEnvironments[environment.id];
          setEnvironments(newEnvironments);
          onClose();
        } catch (error) {
          // do nothing
        }
      }}
      confirmButtonLabel="Delete environment"
      cancelButtonLabel="Cancel"
      title="Delete Environment"
      message="Are you sure you want to delete this environment? This action cannot be undone."
      loading={mutation.isPending}
      appearance="danger"
      typeToConfirmText={environment.name}
      errorMessage={mutation.error?.message}
    />
  );
}
