import { BrowserToServerEvent, m } from "@compose/ts";
import { useEffect, useState } from "react";
import Button from "~/components/button";
import { ComboboxSingle } from "~/components/combobox";
import { Modal } from "~/components/modal";

function ChangeUserRoleModal({
  isOpen,
  user,
  onClose,
  onSuccess,
  submitting,
}: {
  isOpen: boolean;
  user: BrowserToServerEvent.GetSettings.Response["users"][number] | null;
  onClose: () => void;
  onSuccess: (newPermission: m.User.Permission) => void;
  submitting: boolean;
}) {
  const [newPermission, setNewPermission] = useState<m.User.Permission | null>(
    user?.permission ?? null
  );

  useEffect(() => {
    setNewPermission(user?.permission ?? null);
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <Modal.Root isOpen={isOpen} width="md" onClose={onClose}>
      <Modal.CloseableHeader onClose={onClose}>
        Change Role for {user.firstName} {user.lastName}
      </Modal.CloseableHeader>
      <Modal.Body>
        <div className="flex flex-col gap-4">
          <ComboboxSingle
            label="New Role"
            options={[
              {
                label: m.User.PERMISSION_TO_LABEL[m.User.PERMISSION.MEMBER],
                value: m.User.PERMISSION.MEMBER,
                description:
                  m.User.PERMISSION_TO_SUMMARY[m.User.PERMISSION.MEMBER],
              },
              {
                label:
                  m.User.PERMISSION_TO_LABEL[m.User.PERMISSION.APP_MANAGER],
                value: m.User.PERMISSION.APP_MANAGER,
                description:
                  m.User.PERMISSION_TO_SUMMARY[m.User.PERMISSION.APP_MANAGER],
              },
              {
                label: m.User.PERMISSION_TO_LABEL[m.User.PERMISSION.ADMIN],
                value: m.User.PERMISSION.ADMIN,
                description:
                  m.User.PERMISSION_TO_SUMMARY[m.User.PERMISSION.ADMIN],
              },
              {
                label: m.User.PERMISSION_TO_LABEL[m.User.PERMISSION.OWNER],
                value: m.User.PERMISSION.OWNER,
                description:
                  m.User.PERMISSION_TO_SUMMARY[m.User.PERMISSION.OWNER],
              },
            ]}
            value={newPermission}
            setValue={(value) => setNewPermission(value as m.User.Permission)}
            id="permission"
            disabled={false}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="primary"
              onClick={() => {
                // ADD CODE HERE
                if (!newPermission) {
                  return;
                }

                onSuccess(newPermission);
              }}
              disabled={!newPermission}
              loading={submitting}
            >
              Save Changes
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal.Root>
  );
}

export default ChangeUserRoleModal;
