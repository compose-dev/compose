import { CenteredSpinner } from "~/components/spinner";
import { useDistinctLogMessagesQuery } from "~/utils/queries/useDistinctLogMessagesQuery";
import UnknownError from "../../errors/UnknownError";
import { TrackedEvent } from "../../../utils/useTrackedEvents";
import { TrackedEventPicker } from "./TrackedEventPicker";
import { useEffect } from "react";

function CreateCustomReport({
  toggleTrackedEvent,
  clearTrackedEvents,
}: {
  toggleTrackedEvent: (
    message: TrackedEvent["message"],
    type: TrackedEvent["type"]
  ) => void;
  clearTrackedEvents: () => void;
}) {
  const {
    data: distinctLogMessages,
    status: distinctLogMessagesStatus,
    error: distinctLogMessagesError,
  } = useDistinctLogMessagesQuery();

  useEffect(() => {
    clearTrackedEvents();
  }, [clearTrackedEvents]);

  if (distinctLogMessagesStatus === "pending") {
    return <CenteredSpinner />;
  }

  if (distinctLogMessagesStatus === "error") {
    return <UnknownError errorMessage={distinctLogMessagesError.message} />;
  }

  return (
    <TrackedEventPicker
      distinctLogMessages={distinctLogMessages}
      toggleTrackedEvent={toggleTrackedEvent}
    />
  );
}

export { CreateCustomReport };
