import { Alert } from "~/components/alert";
import Button from "~/components/button";
import { Checkbox } from "~/components/checkbox";
import { Modal } from "~/components/modal";
import { useCreateReportMutation } from "~/utils/mutations/useCreateReportMutation";
import { useReportData } from "../../../utils/useReportData";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateReportMutation } from "~/utils/mutations/useUpdateReportMutation";

function SaveReportModal({
  isOpen,
  onClose,
  title,
  description,
  reportData,
  setReportData,
  reportId,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string | null;
  reportData: ReturnType<typeof useReportData>["reportData"];
  setReportData: ReturnType<typeof useReportData>["setReportData"];
  reportId: string | undefined;
}) {
  const queryClient = useQueryClient();

  const navigate = useNavigate({
    from: "/home/activity-logs/edit-custom-report",
  });

  const {
    mutate: createReport,
    isPending,
    isError,
    error,
  } = useCreateReportMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      navigate({
        to: "/home/activity-logs/view-custom-report/$reportId",
        params: {
          reportId: data.reportId,
        },
      });
    },
  });

  const {
    mutate: updateReport,
    isPending: isUpdatePending,
    isError: isUpdateError,
    error: updateError,
  } = useUpdateReportMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["report", data.report.id] });

      navigate({
        to: "/home/activity-logs/view-custom-report/$reportId",
        params: {
          reportId: data.report.id,
        },
      });
    },
  });

  function handleSubmit() {
    if (reportId) {
      updateReport({
        body: {
          title,
          description,
          data: reportData,
        },
        params: {
          reportId,
        },
      });
    } else {
      createReport({
        title,
        description,
        data: reportData,
      });
    }
  }

  return (
    <Modal.Root isOpen={isOpen} onClose={onClose} width="md">
      <Modal.CloseableHeader onClose={onClose}>
        {reportId ? "Update Report" : "Save Report"}
      </Modal.CloseableHeader>
      <Modal.Body>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col gap-4 mt-4">
            <p className="font-medium">Report Settings</p>
            <Checkbox
              label="Allow viewers to change date range"
              checked={reportData.timeFrameIsEditable}
              setChecked={() =>
                setReportData((prev) => ({
                  ...prev,
                  timeFrameIsEditable: !prev.timeFrameIsEditable,
                }))
              }
              description="Viewers can pick a different range while viewing. Your saved default stays the same."
              descriptionAlignment="below"
            />
            <Checkbox
              label="Allow viewers to change included environments"
              checked={
                reportData.includeDevelopmentLogsIsEditable ||
                reportData.includeProductionLogsIsEditable
              }
              setChecked={(isChecked) =>
                setReportData((prev) => ({
                  ...prev,
                  includeDevelopmentLogsIsEditable: isChecked,
                  includeProductionLogsIsEditable: isChecked,
                }))
              }
              description="Viewers can toggle whether production logs, development logs, or both are included. Your saved default stays the same."
              descriptionAlignment="below"
            />
            <Checkbox
              label="Allow viewers to change included apps"
              checked={reportData.selectedAppsIsEditable}
              setChecked={(isChecked) =>
                setReportData((prev) => ({
                  ...prev,
                  selectedAppsIsEditable: isChecked,
                }))
              }
              description="Viewers can change which apps are included in the report. Your saved default stays the same."
              descriptionAlignment="below"
            />
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-medium">Report Sharing</p>
            <p className="text-brand-neutral-2">
              Any users with admin or above permissions will be able to view
              this report. You can add additional viewers after saving the
              report.
            </p>
          </div>
          <div className="flex flex-row justify-end items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              onClick={() => {}}
              loading={isPending || isUpdatePending}
            >
              {reportId ? "Update Report" : "Save Report"}
            </Button>
          </div>
          {isError && (
            <Alert appearance="danger" iconName="exclamation-circle">
              {error.message}
            </Alert>
          )}
          {isUpdateError && (
            <Alert appearance="danger" iconName="exclamation-circle">
              {updateError.message}
            </Alert>
          )}
        </form>
      </Modal.Body>
    </Modal.Root>
  );
}

export { SaveReportModal };
