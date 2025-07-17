import { Popover } from "~/components/popover";
import PopoverTrigger from "./PopoverTrigger";
import { m } from "@compose/ts";
import { Checkbox } from "~/components/checkbox";
import { useSettingsQuery } from "~/utils/queries/useSettingsQuery";
import { Divider } from "~/components/divider";
import { ComboboxSingle } from "~/components/combobox";
import Button from "~/components/button";
import Icon from "~/components/icon";

function UserPickerPopover({
  selectedUserEmails,
  setSelectedUserEmails,
  includeAnonymousUsers,
  setIncludeAnonymousUsers,
  disabled,
  viewOnly = false,
}: {
  selectedUserEmails: m.Report.DB["data"]["selectedUserEmails"];
  setSelectedUserEmails: (
    userEmails: m.Report.DB["data"]["selectedUserEmails"]
  ) => void;
  includeAnonymousUsers: m.Report.DB["data"]["includeAnonymousUsers"];
  setIncludeAnonymousUsers: (
    includeAnonymousUsers: m.Report.DB["data"]["includeAnonymousUsers"]
  ) => void;
  disabled: boolean;
  viewOnly: boolean;
}) {
  const { data: settings } = useSettingsQuery();

  const label =
    selectedUserEmails.length === 0
      ? "All Users"
      : selectedUserEmails.length === 1
        ? selectedUserEmails[0]
        : `${selectedUserEmails.length} Users`;

  const selectedUsers = selectedUserEmails.map((email) => {
    const user = settings?.users.find((user) => user.email === email);

    return {
      name: user ? `${user.firstName} ${user.lastName}` : undefined,
      email,
    };
  });

  const unselectedUsers = settings
    ? settings.users.filter((user) => !selectedUserEmails.includes(user.email))
    : [];

  const handleUserSelect = (userEmail: string | null) => {
    if (userEmail && !selectedUserEmails.includes(userEmail)) {
      setSelectedUserEmails([...selectedUserEmails, userEmail]);
    }
  };

  return (
    <Popover.Root>
      <PopoverTrigger label={label} icon="users" viewOnly={viewOnly} />
      <Popover.Panel anchor="bottom start">
        <div className="flex flex-col gap-4 w-full min-w-32 max-w-96">
          <div className="flex flex-row items-center justify-between">
            <h5>Users</h5>
            {!viewOnly && (
              <Button
                variant="bare-secondary"
                size="sm"
                onClick={() => {
                  setSelectedUserEmails([]);
                  setIncludeAnonymousUsers(true);
                }}
                disabled={disabled || selectedUserEmails.length === 0}
              >
                Reset to all users
              </Button>
            )}
          </div>

          {selectedUsers.length > 0 && (
            <p className="text-brand-neutral-2 text-sm -mt-0.5">
              Activity from {selectedUsers.length}{" "}
              {selectedUsers.length === 1 ? "user" : "users"} is being included.
            </p>
          )}

          {selectedUsers.length > 0 &&
            selectedUsers.map((user) => (
              <div
                key={user.email}
                className="flex flex-row justify-between items-center"
              >
                <div className="flex flex-col">
                  <p>{user.name || user.email}</p>
                  <p className="text-brand-neutral-2 text-sm">
                    {user.name ? user.email : "No name found"}
                  </p>
                </div>
                {!viewOnly && (
                  <Button
                    variant="bare-secondary"
                    size="sm"
                    onClick={() =>
                      setSelectedUserEmails(
                        selectedUserEmails.filter(
                          (email) => email !== user.email
                        )
                      )
                    }
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          {selectedUsers.length === 0 && (
            <div className="flex flex-row gap-x-4">
              <Icon name="checkmark" color="brand-neutral" />
              <div className="flex flex-col">
                <p>Activity from all users is being included</p>
                {settings && (
                  <div className="flex flex-row gap-x-2 text-sm items-center">
                    <p className="text-brand-neutral-2 text-sm">
                      {settings.users.length}{" "}
                      {settings.users.length === 1 ? "user" : "users"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          {settings && !viewOnly && (
            <ComboboxSingle
              value={null}
              setValue={handleUserSelect}
              id="user-picker"
              label={
                selectedUserEmails.length === 0
                  ? "Filter by users"
                  : "Add users"
              }
              options={unselectedUsers.map((user) => ({
                label: `${user.firstName} ${user.lastName}`,
                description: user.email,
                value: user.email,
              }))}
              disabled={disabled}
            />
          )}
          <Divider />
          <Checkbox
            label="Include Anonymous Users"
            checked={includeAnonymousUsers}
            setChecked={setIncludeAnonymousUsers}
            description="Include activity from users that have not signed in, which is possible for apps that have been shared publicly."
            disabled={disabled || viewOnly}
            descriptionAlignment="below"
          />
        </div>
      </Popover.Panel>
    </Popover.Root>
  );
}

export default UserPickerPopover;
