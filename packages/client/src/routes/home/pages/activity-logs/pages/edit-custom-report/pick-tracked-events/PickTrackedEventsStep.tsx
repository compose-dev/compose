import { TrackedEventPicker } from "./TrackedEventPicker";
import { useEffect } from "react";
import { m } from "@compose/ts";

function PickTrackedEventsStep({
  distinctLogMessages,
  toggleTrackedEventRule,
  clearTrackedEventModel,
}: {
  distinctLogMessages: {
    distinctLogMessages: { message: string; type: m.Log.DB["type"] }[];
  };
  toggleTrackedEventRule: (rule: m.Report.TrackedEventRule) => void;
  clearTrackedEventModel: () => void;
}) {
  useEffect(() => {
    clearTrackedEventModel();
  }, [clearTrackedEventModel]);

  return (
    <TrackedEventPicker
      distinctLogMessages={distinctLogMessages}
      toggleTrackedEventRule={toggleTrackedEventRule}
    />
  );
}

export default PickTrackedEventsStep;
