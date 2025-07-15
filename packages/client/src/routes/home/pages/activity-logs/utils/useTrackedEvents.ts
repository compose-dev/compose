import { m } from "@compose/ts";
import { useCallback, useState } from "react";

interface TrackedEvent {
  message: string;
  type: m.Log.DB["type"];
}

const useTrackedEvents = () => {
  const [trackedEvents, setTrackedEvents] = useState<TrackedEvent[]>([]);

  const toggleTrackedEvent = (message: string, type: m.Log.DB["type"]) => {
    const index = trackedEvents.findIndex(
      (event) => event.message === message && event.type === type
    );

    if (index === -1) {
      setTrackedEvents((prev) => [...prev, { message, type }]);
    } else {
      setTrackedEvents((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const isEventTracked = (message: string, type: m.Log.DB["type"]) => {
    return trackedEvents.some(
      (event) => event.message === message && event.type === type
    );
  };

  const clearTrackedEvents = useCallback(() => {
    setTrackedEvents([]);
  }, []);

  return {
    trackedEvents,
    toggleTrackedEvent,
    isEventTracked,
    clearTrackedEvents,
  };
};

export type { TrackedEvent };
export default useTrackedEvents;
