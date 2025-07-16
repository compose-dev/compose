import { CenteredSpinner } from "~/components/spinner";
import UnknownError from "../../components/errors/UnknownError";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useFetchReportQuery } from "~/utils/queries/useFetchReportQuery";
import { useReportData } from "../../utils/useReportData";
import { CustomReport } from "../../components/custom-report";
import { Page } from "~/routes/home/components/page";
import DropdownMenu from "~/components/dropdown-menu";
import Icon from "~/components/icon";
import { useDeleteReportMutation } from "~/utils/mutations/useDeleteReportMutation";
import { ConfirmDialog } from "~/components/confirm-dialog";
import { useState } from "react";
import { toast } from "~/utils/toast";
import { useQueryClient } from "@tanstack/react-query";

function ViewCustomReport() {
  const queryClient = useQueryClient();
  const { addToast } = toast.useStore();

  const [showConfirmDeletionDialog, setShowConfirmDeletionDialog] =
    useState(false);

  const navigate = useNavigate({
    from: "/home/activity-logs/view-custom-report/$reportId",
  });

  const { reportId } = useParams({
    from: "/home/activity-logs/view-custom-report/$reportId",
  });

  const {
    data: report,
    status: reportStatus,
    error: reportError,
  } = useFetchReportQuery(reportId);

  const reportData = useReportData(report ? report.report.data : {});

  const { mutate: deleteReport } = useDeleteReportMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      navigate({ to: "/home/activity-logs" });
    },
    onError: (error) => {
      addToast({
        message: error.message,
        appearance: toast.APPEARANCE.error,
        title: "Failed to delete report",
      });
    },
  });

  if (reportStatus === "pending") {
    return <CenteredSpinner />;
  }

  if (reportStatus === "error") {
    return <UnknownError errorMessage={reportError.message} />;
  }

  return (
    <>
      <CustomReport
        report={reportData}
        viewOnly
        header={
          <div className="flex flex-row items-center justify-between w-full">
            <Page.Subtitle>{report.report.title}</Page.Subtitle>
            <div className="flex flex-row items-center gap-2">
              <DropdownMenu
                label={
                  <div className="flex flex-row items-center gap-x-2 border border-brand-neutral rounded-brand p-1 px-2 hover:bg-brand-overlay shadow-sm">
                    <p>Actions</p>
                    <Icon name="chevron-down" size="0.75" />
                  </div>
                }
                labelVariant="ghost"
                options={[
                  {
                    label: "Edit Report",
                    onClick: () => {
                      navigate({
                        to: "/home/activity-logs/edit-custom-report",
                        search: {
                          reportId,
                        },
                      });
                    },
                    left: <Icon name="pencil" />,
                  },
                  {
                    label: "Delete Report",
                    onClick: () => setShowConfirmDeletionDialog(true),
                    left: <Icon name="trash" color="brand-error" />,
                    variant: "error",
                  },
                ]}
              />
            </div>
          </div>
        }
      />
      {showConfirmDeletionDialog && (
        <ConfirmDialog
          onConfirm={() => {
            deleteReport(reportId);
            setShowConfirmDeletionDialog(false);
          }}
          onCancel={() => setShowConfirmDeletionDialog(false)}
          title="Delete Report"
          message="Are you sure you want to delete this report? This action cannot be undone."
          appearance="danger"
        />
      )}
    </>
  );
}

export default ViewCustomReport;
