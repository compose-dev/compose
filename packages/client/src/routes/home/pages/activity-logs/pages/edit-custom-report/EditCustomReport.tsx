import { Page } from "~/routes/home/components/page";
import { CustomReport } from "../../components/custom-report";
import { useEffect, useState } from "react";
import Button from "~/components/button";
import Icon from "~/components/icon";
import { EditReportTitleModal } from "./modals/EditReportTitleModal";
import { SaveReportModal } from "./modals/SaveReportModal";
import { useReportData } from "../../utils/useReportData";
import { useDistinctLogMessagesQuery } from "~/utils/queries/useDistinctLogMessagesQuery";
import { getDefaultReportName } from "./utils";
import { CenteredSpinner } from "~/components/spinner";
import UnknownError from "../../components/errors/UnknownError";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { STEPS } from "./utils";
import PickTrackedEventsStep from "./pick-tracked-events/PickTrackedEventsStep";
import { useFetchReportQuery } from "~/utils/queries/useFetchReportQuery";

function EditCustomReport() {
  const { step, reportId } = useSearch({
    from: "/home/activity-logs/edit-custom-report",
  });
  const navigate = useNavigate({
    from: "/home/activity-logs/edit-custom-report",
  });

  const {
    data: distinctLogMessages,
    status: distinctLogMessagesStatus,
    error: distinctLogMessagesError,
  } = useDistinctLogMessagesQuery();

  const {
    data: existingReport,
    status: existingReportStatus,
    error: existingReportError,
  } = useFetchReportQuery(reportId);

  const report = useReportData(
    existingReport ? existingReport.report.data : undefined
  );

  const [showEditReportNameModal, setShowEditReportNameModal] = useState(false);
  const [showSaveReportModal, setShowSaveReportModal] = useState(false);

  const [reportName, setReportName] = useState(
    getDefaultReportName(report.reportData.trackedEventModel)
  );

  useEffect(() => {
    if (existingReport) {
      setReportName(existingReport.report.title);
    }
  }, [existingReport]);

  if (
    distinctLogMessagesStatus === "pending" ||
    (reportId && existingReportStatus === "pending")
  ) {
    return <CenteredSpinner />;
  }

  if (distinctLogMessagesStatus === "error") {
    return <UnknownError errorMessage={distinctLogMessagesError.message} />;
  }

  if (reportId && existingReportStatus === "error") {
    return <UnknownError errorMessage={existingReportError.message} />;
  }

  if (step === STEPS.PICK_TRACKED_EVENTS) {
    return (
      <PickTrackedEventsStep
        distinctLogMessages={distinctLogMessages}
        toggleTrackedEventRule={(rule) => {
          report.toggleTrackedEventRule(rule);

          navigate({
            to: "/home/activity-logs/edit-custom-report",
            search: (prev) => ({
              ...prev,
              step: undefined,
            }),
          });

          setReportName(getDefaultReportName(rule));
        }}
        clearTrackedEventModel={report.clearTrackedEventModel}
      />
    );
  }

  return (
    <>
      <CustomReport
        report={report}
        header={
          <div className="w-full flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <Page.Subtitle>{reportName}</Page.Subtitle>
              <Button
                variant="ghost"
                onClick={() => setShowEditReportNameModal(true)}
              >
                <Icon name="pencil" color="brand-neutral-2" />
              </Button>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowSaveReportModal(true)}
            >
              {reportId ? "Save Changes" : "Save Report"}
            </Button>
          </div>
        }
      />
      <EditReportTitleModal
        isOpen={showEditReportNameModal}
        onClose={() => setShowEditReportNameModal(false)}
        reportName={reportName}
        setReportName={setReportName}
      />
      <SaveReportModal
        isOpen={showSaveReportModal}
        onClose={() => setShowSaveReportModal(false)}
        title={reportName}
        reportData={report.reportData}
        setReportData={report.setReportData}
        reportId={reportId}
      />
    </>
  );
}

export default EditCustomReport;
