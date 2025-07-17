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
import { useEffect, useState } from "react";
import { toast } from "~/utils/toast";
import { useQueryClient } from "@tanstack/react-query";
import { ShareReportModal } from "./modals/ShareReportModal";
import Button from "~/components/button";
import { u } from "@compose/ts";
import { useHomeStore } from "~/routes/home/utils/useHomeStore";

function ViewCustomReport() {
  const queryClient = useQueryClient();
  const { addToast } = toast.useStore();
  const { user } = useHomeStore();

  const [showConfirmDeletionDialog, setShowConfirmDeletionDialog] =
    useState(false);
  const [showShareReportModal, setShowShareReportModal] = useState(false);

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

  const reportData = useReportData();
  const { setReportData } = reportData;

  useEffect(() => {
    if (report) {
      setReportData(report.report.data);
    }
  }, [report, setReportData]);

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

  const canShareReport =
    user &&
    u.permission.isAllowed(
      u.permission.FEATURE.VIEW_REPORT_SHARED_WITH,
      user.permission
    );

  const canEditReport =
    user &&
    u.permission.isAllowed(u.permission.FEATURE.UPDATE_REPORT, user.permission);

  const canDeleteReport =
    user &&
    u.permission.isAllowed(u.permission.FEATURE.DELETE_REPORT, user.permission);

  function getDropdownMenuOptions() {
    const options: Parameters<typeof DropdownMenu>[0]["options"] = [];

    if (canEditReport) {
      options.push({
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
      });
    }

    if (canDeleteReport) {
      options.push({
        label: "Delete Report",
        onClick: () => setShowConfirmDeletionDialog(true),
        left: <Icon name="trash" color="brand-error" />,
        variant: "error",
      });
    }

    return options;
  }

  return (
    <>
      <CustomReport
        report={reportData}
        reportId={reportId}
        viewOnly
        header={
          <div className="flex flex-col gap-3 w-full">
            <div className="w-full flex flex-row items-center justify-between">
              <Page.Subtitle>{report.report.title}</Page.Subtitle>
              <div className="flex flex-row items-center gap-2">
                {canShareReport && (
                  <Button
                    onClick={() => setShowShareReportModal(true)}
                    variant="outline"
                    className="!p-1 !px-2"
                  >
                    <Icon name="users" />
                    Share Report
                  </Button>
                )}
                {(canEditReport || canDeleteReport) && (
                  <DropdownMenu
                    label={
                      <div className="flex flex-row items-center gap-x-2 border border-brand-neutral rounded-brand p-1 px-2 hover:bg-brand-overlay shadow-sm">
                        <p>Actions</p>
                        <Icon name="chevron-down" size="0.75" />
                      </div>
                    }
                    labelVariant="ghost"
                    options={getDropdownMenuOptions()}
                  />
                )}
              </div>
            </div>
            {report.report.description && (
              <div className="flex flex-row items-center gap-2">
                <p className="text-brand-neutral-2 whitespace-pre-wrap">
                  {report.report.description}
                </p>
              </div>
            )}
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
      <ShareReportModal
        isOpen={showShareReportModal}
        onClose={() => setShowShareReportModal(false)}
        reportId={reportId}
      />
    </>
  );
}

export default ViewCustomReport;
