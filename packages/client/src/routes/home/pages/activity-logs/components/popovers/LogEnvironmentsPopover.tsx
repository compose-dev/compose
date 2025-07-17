import { Popover } from "~/components/popover";
import { Checkbox } from "~/components/checkbox";
import PopoverTrigger from "./PopoverTrigger";

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
  const popoverTriggerLabel =
    includeDevLogs && includeProdLogs
      ? "Development and Production Logs"
      : includeDevLogs
        ? "Development Logs"
        : includeProdLogs
          ? "Production Logs"
          : "No Logs";

  return (
    <Popover.Root>
      <PopoverTrigger
        label={popoverTriggerLabel}
        icon="server"
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
