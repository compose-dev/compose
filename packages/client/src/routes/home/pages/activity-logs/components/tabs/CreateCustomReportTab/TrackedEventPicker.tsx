import { m } from "@compose/ts";
import { useMemo } from "react";
import Button from "~/components/button";
import { Divider } from "~/components/divider";
import { InlineLink } from "~/components/inline-link";

function EventsList({
  label,
  description,
  events,
  toggleTrackedEvent,
  noEventsMessage,
  labelClassName,
}: {
  label: string;
  labelClassName: string;
  description: string;
  events: { message: string; type: m.Log.DB["type"] }[];
  toggleTrackedEvent: (message: string, type: m.Log.DB["type"]) => void;
  noEventsMessage: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-y-1">
        <h5 className={labelClassName}>{label}</h5>
        <p className="text-brand-neutral-2 text-sm">{description}</p>
      </div>
      {events.map((message) => (
        <div
          className="flex flex-row justify-between items-center gap-4"
          key={message.message}
        >
          <p>{message.message}</p>
          <Button
            variant="outline"
            size="sm"
            className="flex-shrink-0"
            onClick={() => {
              toggleTrackedEvent(message.message, message.type);
            }}
          >
            Track this event
          </Button>
        </div>
      ))}
      {events.length === 0 && (
        <div>
          <p className="text-brand-neutral-2">{noEventsMessage}</p>
        </div>
      )}
    </div>
  );
}

function TrackedEventPicker({
  distinctLogMessages,
  toggleTrackedEvent,
}: {
  distinctLogMessages: {
    distinctLogMessages: { message: string; type: m.Log.DB["type"] }[];
  };
  toggleTrackedEvent: (message: string, type: m.Log.DB["type"]) => void;
}) {
  const groupedLogMessages = useMemo(() => {
    if (!distinctLogMessages) {
      return {
        system: [],
        user: [],
      };
    }

    const grouped = {
      system: [] as typeof distinctLogMessages.distinctLogMessages,
      user: [] as typeof distinctLogMessages.distinctLogMessages,
    };

    for (const message of distinctLogMessages.distinctLogMessages) {
      grouped[message.type].push(message);
    }

    return grouped;
  }, [distinctLogMessages]);

  return (
    <>
      <div className="w-full flex flex-col gap-4 items-center justify-center mt-16">
        <h5>Create Custom Reports</h5>
        <p className="text-center max-w-xl">
          Easily create and share beautiful reports to track system events or
          custom events that you've logged{" "}
          <InlineLink
            url="https://docs.composehq.com/page-actions/log"
            newTab
            showLinkIcon
          >
            via the SDK
          </InlineLink>
          . Coming soon.
        </p>
      </div>
      <div
        // className="w-full flex flex-col gap-4 items-center justify-center mt-4"
        className="hidden"
      >
        <div className="bg-brand-overlay rounded-brand p-8 flex flex-col gap-4 w-full max-w-2xl dark:border dark:border-brand-neutral">
          <EventsList
            label="System events"
            labelClassName="text-brand-success-heavy"
            description="Events that are automatically logged by Compose"
            events={groupedLogMessages.system}
            toggleTrackedEvent={toggleTrackedEvent}
            noEventsMessage="No system events found."
          />
          <Divider />
          <EventsList
            label="User events"
            labelClassName="text-brand-warning-heavy"
            description="Custom events that you've logged via the SDK"
            events={groupedLogMessages.user}
            toggleTrackedEvent={toggleTrackedEvent}
            noEventsMessage={
              <>
                No user events found. Start logging custom events{" "}
                <InlineLink
                  url="https://docs.composehq.com/page-actions/log"
                  newTab
                  showLinkIcon
                >
                  via the SDK
                </InlineLink>
                .
              </>
            }
          />
        </div>
      </div>
    </>
  );
}

export { TrackedEventPicker };
