import Icon from "~/components/icon";
import { Popover } from "~/components/popover";
import { Checkbox } from "~/components/checkbox";
import { classNames } from "~/utils/classNames";

function PopoverTrigger({
  includeDevLogs,
  includeProdLogs,
  viewOnly = false,
}: {
  includeDevLogs: boolean;
  includeProdLogs: boolean;
  viewOnly: boolean;
}) {
  const label =
    includeDevLogs && includeProdLogs
      ? "Development and Production Logs"
      : includeDevLogs
        ? "Development Logs"
        : includeProdLogs
          ? "Production Logs"
          : "No Logs";

  return (
    <Popover.Trigger>
      <div
        className={classNames(
          "border border-brand-neutral rounded-brand p-2 py-1 flex flex-row gap-2 items-center shadow-sm hover:bg-brand-overlay transition-colors",
          {
            "bg-brand-overlay": !!viewOnly,
          }
        )}
      >
        <Icon name="server" color="brand-neutral" />
        <p className="text-brand-neutral">{label}</p>
        {!viewOnly && (
          <Icon name="chevron-down" color="brand-neutral" size="0.75" />
        )}
      </div>
    </Popover.Trigger>
  );
}

function LogEnvironmentsPopover({
  includeDevLogs,
  includeProdLogs,
  setIncludeDevLogs,
  setIncludeProdLogs,
  disabled,
  devLogsViewOnly = false,
  prodLogsViewOnly = false,
}: {
  includeDevLogs: boolean;
  includeProdLogs: boolean;
  setIncludeDevLogs: (includeDevLogs: boolean) => void;
  setIncludeProdLogs: (includeProdLogs: boolean) => void;
  disabled: boolean;
  devLogsViewOnly: boolean;
  prodLogsViewOnly: boolean;
}) {
  return (
    <Popover.Root>
      <PopoverTrigger
        includeDevLogs={includeDevLogs}
        includeProdLogs={includeProdLogs}
        viewOnly={devLogsViewOnly && prodLogsViewOnly}
      />
      <Popover.Panel anchor="bottom start">
        <div className="flex flex-col gap-4 w-full min-w-32 max-w-96">
          <h5>Log Environments</h5>
          <Checkbox
            label="Include Production Logs"
            checked={includeProdLogs}
            setChecked={setIncludeProdLogs}
            description="Logs created in production environments."
            disabled={disabled || prodLogsViewOnly}
          />
          <Checkbox
            label="Include Development Logs"
            checked={includeDevLogs}
            setChecked={setIncludeDevLogs}
            description="Logs created in development environments. In the majority of cases, you will want to exclude these logs."
            disabled={disabled || devLogsViewOnly}
          />
        </div>
      </Popover.Panel>
    </Popover.Root>
  );
}

export default LogEnvironmentsPopover;
