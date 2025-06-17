import { useHomeStore } from "~/routes/home/utils/useHomeStore";
import { BrowserToServerEvent, m, u } from "@compose/ts";
import Button from "~/components/button";
import { useInviteUser } from "../useInviteUser";
import { toast } from "~/utils/toast";
import Icon from "~/components/icon";
import DropdownMenu from "~/components/dropdown-menu";
import { useState } from "react";
import { ConfirmDialog } from "~/components/confirm-dialog";
import ChangeUserRoleModal from "./ChangeUserRoleModal";
import { api } from "~/api";

function UsersSection({
  settings,
  copyText,
  inviteFlow,
  refetchBilling,
  refetchSettings,
}: {
  settings: BrowserToServerEvent.GetSettings.Response;
  copyText: (text: string) => void;
  inviteFlow: ReturnType<typeof useInviteUser>;
  refetchBilling: () => void;
  refetchSettings: () => void;
}) {
  const { addToast } = toast.useStore();
  const { user: actingUser } = useHomeStore();
  const [userToDelete, setUserToDelete] = useState<
    (typeof settings.users)[number] | null
  >(null);
  const [userToChangeRole, setUserToChangeRole] = useState<
    (typeof settings.users)[number] | null
  >(null);

  const [submittingChangeUserRole, setSubmittingChangeUserRole] =
    useState(false);
  const [submittingDeleteUser, setSubmittingDeleteUser] = useState(false);

  if (!actingUser) {
    return null;
  }

  if (
    !u.permission.isAllowed(
      u.permission.FEATURE.VIEW_ORGANIZATION_USERS,
      actingUser.permission
    )
  ) {
    return (
      <p className="text-brand-neutral-2">
        You are not authorized to view users in your organization. Please reach
        out to an admin to make changes, or email support: atul@composehq.com.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 w-full">
        {settings.pendingInvites.length > 0 && <h5>Users</h5>}
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-brand-neutral">
              <th className="py-2 text-left font-medium">First Name</th>
              <th className="py-2 text-left font-medium">Last Name</th>
              <th className="py-2 text-left font-medium">Email</th>
              <th className="py-2 text-left font-medium">Role</th>
              <th className="py-2 text-left font-medium">Is Developer</th>
              <th className="py-2 text-left font-medium">User Since</th>
              <th className="py-2 text-right font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {settings.users.map((user) => (
              <tr key={user.id} className="border-b border-brand-neutral">
                <td className="py-2">{user.firstName}</td>
                <td className="py-2">{user.lastName}</td>
                <td className="py-2">{user.email}</td>
                <td className="py-2">
                  {m.User.PERMISSION_TO_LABEL[user.permission]}
                </td>
                <td className="py-2">
                  {user.developmentEnvironmentId ? "Yes" : "No"}
                </td>
                <td className="py-2">
                  {u.date.toString(
                    user.createdAt,
                    u.date.SerializedFormat["LLL d, yyyy"]
                  )}
                </td>
                <td className="py-3 flex justify-end">
                  <DropdownMenu
                    label={
                      <Icon
                        name="dots-vertical"
                        color="brand-neutral-2"
                        size="1.25"
                      />
                    }
                    labelVariant="ghost"
                    options={[
                      {
                        label: "Change Role",
                        onClick: () => {
                          const { remove } =
                            u.permission.isAllowedToChangePermission({
                              actingUserPermission: actingUser.permission,
                              oldPermission: user.permission,
                              newPermission: m.User.PERMISSION.MEMBER,
                            });

                          if (!remove) {
                            addToast({
                              message:
                                "You are not authorized to change this user's role. Please ask an admin to change your permissions.",
                              appearance: toast.APPEARANCE.error,
                            });
                            return;
                          }

                          setUserToChangeRole(user);
                        },
                      },
                      {
                        label: "Delete",
                        onClick: () => {
                          if (
                            !u.permission.isAllowedToDeleteUser({
                              actingUserPermission: actingUser.permission,
                              targetUserPermission: user.permission,
                            })
                          ) {
                            addToast({
                              message:
                                "You are not authorized to delete this user. Please ask an admin/owner to change your permissions.",
                              appearance: toast.APPEARANCE.error,
                            });
                            return;
                          }

                          if (user.id === actingUser.id) {
                            addToast({
                              message: "You cannot delete yourself.",
                              appearance: toast.APPEARANCE.error,
                            });
                            return;
                          }

                          setUserToDelete(user);
                        },
                        variant: "error",
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {settings.pendingInvites.length > 0 && (
        <div className="flex flex-col gap-1 my-4">
          <h5>Pending Invites</h5>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-brand-neutral">
                <th className="py-2 text-left font-medium">Email</th>
                <th className="py-2 text-left font-medium">Expires In</th>
                <th className="py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {settings.pendingInvites.map((invite) => (
                <tr key={invite.id} className="border-b border-brand-neutral">
                  <td className="py-2">{invite.email}</td>
                  <td className="py-2">
                    {Math.ceil(
                      (invite.expiresAt.getTime() - Date.now()) /
                        (1000 * 60 * 60)
                    )}{" "}
                    hours
                  </td>
                  <td className="py-2 flex justify-end gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        copyText(
                          inviteFlow.getInviteLink(invite.id, invite.expiresAt)
                        );
                      }}
                    >
                      Copy invite link
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => {
                        if (
                          !u.permission.isAllowed(
                            u.permission.FEATURE.REMOVE_PENDING_INVITE,
                            actingUser.permission
                          )
                        ) {
                          addToast({
                            message:
                              "You are not authorized to delete pending invites. Please ask an admin to change your permissions.",
                            appearance: toast.APPEARANCE.error,
                          });
                          return;
                        }
                        inviteFlow.onDeleteInviteCode(invite.id);
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex flex-row justify-end">
        <Button
          variant="primary"
          onClick={() => {
            if (
              !u.permission.isAllowed(
                u.permission.FEATURE.ADD_USER,
                actingUser.permission
              )
            ) {
              addToast({
                message:
                  "You are not authorized to invite users. Please ask an admin to change your permissions.",
                appearance: toast.APPEARANCE.error,
              });
              return;
            }
            inviteFlow.clearForm();
            inviteFlow.setActiveModal(inviteFlow.ACTIVE_MODAL.FORM);
          }}
        >
          Add User
        </Button>
      </div>
      {userToDelete && (
        <ConfirmDialog
          title="Delete User"
          message={`Are you sure you want to delete ${userToDelete.firstName} ${userToDelete.lastName}?`}
          appearance="danger"
          typeToConfirmText={userToDelete.email}
          confirmButtonLabel="Delete"
          cancelButtonLabel="Cancel"
          onCancel={() => setUserToDelete(null)}
          onConfirm={async () => {
            setSubmittingDeleteUser(true);
            const response = await api.routes.deleteUser(userToDelete.id);
            setSubmittingDeleteUser(false);

            if (response.didError) {
              addToast({
                message: response.data.message,
                appearance: toast.APPEARANCE.error,
              });
              return;
            } else {
              addToast({
                message: "User deleted successfully",
                appearance: toast.APPEARANCE.success,
              });
            }

            refetchSettings();
            refetchBilling();

            setUserToDelete(null);
          }}
          loading={submittingDeleteUser}
        />
      )}
      <ChangeUserRoleModal
        user={userToChangeRole}
        onSuccess={async (newPermission: m.User.Permission) => {
          if (!userToChangeRole) {
            return;
          }

          setSubmittingChangeUserRole(true);
          const response = await api.routes.changeUserPermission(
            userToChangeRole.id,
            {
              newPermission,
            }
          );
          setSubmittingChangeUserRole(false);

          if (response.didError) {
            addToast({
              message: response.data.message,
              appearance: toast.APPEARANCE.error,
            });

            return;
          } else {
            addToast({
              message: "User role updated successfully",
              appearance: toast.APPEARANCE.success,
            });
          }

          refetchSettings();

          setUserToChangeRole(null);
        }}
        isOpen={!!userToChangeRole}
        onClose={() => setUserToChangeRole(null)}
        submitting={submittingChangeUserRole}
      />
    </div>
  );
}

export default UsersSection;
