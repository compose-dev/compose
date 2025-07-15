import { Page } from "~/routes/home/components/page";
import { TrackedEvent } from "../../../utils/useTrackedEvents";
import { CustomReport } from "../../custom-report";
import { useState } from "react";
import Button from "~/components/button";
import Icon from "~/components/icon";
import { EditReportTitleModal } from "./EditReportTitleModal";

function getDefaultReportName(trackedEvents: TrackedEvent[]) {
  if (trackedEvents.length === 0) {
    return "New Custom Report";
  }

  const defaultMessage = trackedEvents[0].message;
  const shortenedMessage =
    defaultMessage.length > 20
      ? defaultMessage.substring(0, 20) + "..."
      : defaultMessage;

  return `${shortenedMessage} Report`;
}

function EditCustomReportTab({
  now,
  trackedEvents,
}: {
  now: React.MutableRefObject<Date>;
  trackedEvents: TrackedEvent[];
}) {
  const [showEditReportNameModal, setShowEditReportNameModal] = useState(false);

  const [reportName, setReportName] = useState(
    getDefaultReportName(trackedEvents)
  );

  return (
    <>
      <CustomReport
        trackedEvents={trackedEvents}
        now={now}
        header={
          <div className="w-full flex flex-row items-center">
            <div className="flex flex-row items-center gap-2">
              <Page.Subtitle>{reportName}</Page.Subtitle>
              <Button
                variant="ghost"
                onClick={() => setShowEditReportNameModal(true)}
              >
                <Icon name="pencil" color="brand-neutral-2" />
              </Button>
            </div>
          </div>
        }
      />
      <EditReportTitleModal
        isOpen={showEditReportNameModal}
        onClose={() => setShowEditReportNameModal(false)}
        reportName={reportName}
        setReportName={setReportName}
      />
    </>
  );
}

export default EditCustomReportTab;
