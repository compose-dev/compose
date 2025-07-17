import { Modal } from "~/components/modal";
import { CenteredSpinner } from "~/components/spinner";
import { useSettingsQuery } from "~/utils/queries/useSettingsQuery";
import { m, u } from "@compose/ts";
import { useState } from "react";
import DropdownMenu from "~/components/dropdown-menu";
import Icon from "~/components/icon";
import Button from "~/components/button";
import { ComboboxMulti } from "~/components/combobox";
import { useShareReportMutation } from "~/utils/mutations/useShareReportMutation";
import { useUnshareReportMutation } from "~/utils/mutations/useUnshareReportMutation";
import { useFetchReportSharedWithQuery } from "~/utils/queries/useFetchReportSharedWithQuery";
import { Alert } from "~/components/alert";
import { Divider } from "~/components/divider";
import { toast } from "~/utils/toast";

function formatUsers(
  users: m.User.DB[] | undefined,
  reportUsers: m.ReportUser.DB[] | undefined
) {
  if (users === undefined || reportUsers === undefined) {
    return [];
  }

  return users
    .map((user) => {
      const reportUser = reportUsers.find(
        (reportUser) => reportUser.userId === user.id
      );

      return {
        name: `${user.firstName} ${user.lastName}`,
        id: user.id,
        email: user.email,
        hasFullAccess: u.permission.isAllowed(
          u.permission.FEATURE.VIEW_REPORT,
          user.permission
        ),
        canViewReport: reportUser && reportUser.permission.canView,
        permission: user.permission,
      };
    })
    .sort((a, b) => {
      return (
        m.User.PERMISSION_ORDER_DESCENDING.indexOf(a.permission) -
        m.User.PERMISSION_ORDER_DESCENDING.indexOf(b.permission)
      );
    });
}

function ShareReportModal({
  isOpen,
  onClose,
  reportId,
}: {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
}) {
  const { addToast } = toast.useStore();
  const [copiedReportLink, setCopiedReportLink] = useState(false);

  const {
    data: settings,
    isPending: settingsIsPending,
    error: settingsError,
  } = useSettingsQuery();

  const {
    data: reportSharedWith,
    isPending: reportSharedWithIsPending,
    error: reportSharedWithError,
    refetch: refetchReportSharedWith,
  } = useFetchReportSharedWithQuery(reportId);

  const {
    mutate: shareReport,
    isPending: shareReportIsPending,
    error: shareReportError,
  } = useShareReportMutation({
    onSuccess: () => {
      // ignore
    },
  });
  const {
    mutate: unshareReport,
    isPending: unshareReportIsPending,
    error: unshareReportError,
  } = useUnshareReportMutation({
    onSuccess: () => {
      // ignore
    },
  });

  const users = formatUsers(settings?.users, reportSharedWith?.reportUsers);

  const usersWithAccess = users.filter(
    (user) => user.canViewReport || user.hasFullAccess
  );
  const usersWithoutAccess = users.filter(
    (user) => !user.canViewReport && !user.hasFullAccess
  );

  const [usersToAdd, setUsersToAdd] = useState<string[]>([]);

  const handleAddUsers = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (usersToAdd.length === 0) {
      return;
    }

    for (const userId of usersToAdd) {
      shareReport(
        {
          reportId,
          userId,
        },
        {
          onSuccess: () => {
            refetchReportSharedWith();
            setUsersToAdd([]);
            addToast({
              title: "Success",
              message: `Successfully shared report with ${usersToAdd.length} user${
                usersToAdd.length === 1 ? "" : "s"
              }.`,
              appearance: "success",
            });
          },
        }
      );
    }
  };

  function copyLinkToReport() {
    navigator.clipboard.writeText(
      `${window.location.origin}/home/activity-logs/view-custom-report/${reportId}`
    );
    setCopiedReportLink(true);
    setTimeout(() => {
      setCopiedReportLink(false);
    }, 2000);
  }

  const isPending = settingsIsPending || reportSharedWithIsPending;
  const isError = settingsError || reportSharedWithError;

  return (
    <Modal.Root isOpen={isOpen} onClose={onClose} width="lg">
      <Modal.CloseableHeader onClose={onClose}>
        Share Report
      </Modal.CloseableHeader>
      <Modal.Body>
        {isPending && <CenteredSpinner />}
        {settingsError && (
          <Alert appearance="danger" iconName="exclamation-circle">
            {settingsError.message}
          </Alert>
        )}
        {reportSharedWithError && (
          <Alert appearance="danger" iconName="exclamation-circle">
            {reportSharedWithError.message}
          </Alert>
        )}
        {!isPending && !isError && (
          <>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-brand-neutral">
                  <th className="py-2 text-left font-medium">Name</th>
                  <th className="py-2 text-left font-medium">Role</th>
                  <th className="py-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersWithAccess.map((user) => (
                  <tr key={user.id} className="border-b border-brand-neutral">
                    <td className="py-2">
                      <div className="flex flex-col">
                        <p>{user.name}</p>
                        <p className="text-sm text-brand-neutral-2">
                          {user.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-2">
                      {m.User.PERMISSION_TO_LABEL[user.permission]}
                    </td>
                    <td className="py-2 text-right">
                      {user.hasFullAccess ? (
                        <div className="flex flex-row items-center gap-x-2 text-brand-neutral-2 justify-end">
                          <p>Full Access</p>
                          <Icon
                            name="lock"
                            size="0.75"
                            color="brand-neutral-2"
                          />
                        </div>
                      ) : (
                        <DropdownMenu
                          labelVariant="ghost"
                          label={
                            <div className="flex flex-row items-center gap-x-2 text-brand-neutral-2 justify-end">
                              Can View
                              <Icon
                                name="chevron-down"
                                size="0.75"
                                color="brand-neutral-2"
                              />
                            </div>
                          }
                          options={[
                            {
                              label: "Remove Access",
                              onClick: () => {
                                unshareReport(
                                  {
                                    reportId,
                                    userId: user.id,
                                  },
                                  {
                                    onSuccess: () => {
                                      refetchReportSharedWith();
                                      addToast({
                                        title: "Success",
                                        message: `Successfully removed access to report for ${user.name}.`,
                                        appearance: "success",
                                      });
                                    },
                                  }
                                );
                              },
                              variant: "error",
                              left: (
                                <Icon
                                  name="x"
                                  size="0.75"
                                  color="brand-error"
                                />
                              ),
                            },
                          ]}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <form
              className="flex flex-row gap-x-2 items-end w-full"
              onSubmit={handleAddUsers}
            >
              <div className="flex flex-col items-stretch flex-1">
                <ComboboxMulti
                  label="Add Viewers"
                  options={usersWithoutAccess.map((user) => ({
                    label: user.name,
                    description: user.email,
                    value: user.id,
                  }))}
                  value={usersToAdd}
                  setValue={setUsersToAdd}
                  id="add-viewers"
                  disabled={false}
                />
              </div>
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  onClick={() => {}}
                  loading={shareReportIsPending || unshareReportIsPending}
                  disabled={usersToAdd.length === 0}
                >
                  Add
                </Button>
              </div>
            </form>
            <Divider />
            <div className="flex flex-row items-center justify-end gap-x-2">
              {copiedReportLink && (
                <div className="flex flex-row items-center gap-x-2 text-brand-neutral-2">
                  <Icon name="checkmark" size="0.75" color="brand-neutral-2" />
                  <p>Copied</p>
                </div>
              )}
              <Button variant="outline" onClick={copyLinkToReport}>
                <Icon name="copy" />
                Copy Link to Report
              </Button>
            </div>
            {shareReportError && (
              <Alert appearance="danger" iconName="exclamation-circle">
                {shareReportError.message}
              </Alert>
            )}
            {unshareReportError && (
              <Alert appearance="danger" iconName="exclamation-circle">
                {unshareReportError.message}
              </Alert>
            )}
          </>
        )}
      </Modal.Body>
    </Modal.Root>
  );
}

export { ShareReportModal };
