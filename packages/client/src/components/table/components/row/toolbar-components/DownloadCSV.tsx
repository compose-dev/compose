import Button from "~/components/button";
import Icon from "~/components/icon";
import {
  generateAndDownloadCSV,
  TableColumnProp,
  TanStackTable,
} from "~/components/table/utils";
import { classNames } from "~/utils/classNames";
import { Popover } from "~/components/popover";
import { useState } from "react";
import { TextInput } from "~/components/input";
import { Alert } from "~/components/alert";

function DownloadCSVPanel({
  table,
  columns,
  className = "",
  paginated,
  defaultFileName,
}: {
  table: TanStackTable;
  columns: TableColumnProp[];
  className?: string;
  paginated: boolean;
  defaultFileName: string;
}) {
  const [filename, setFilename] = useState<string | null>(defaultFileName);

  function downloadCSV(filename?: string | null) {
    generateAndDownloadCSV(table, columns, filename ?? defaultFileName);
  }

  return (
    <div
      className={classNames("flex flex-col space-y-4 max-w-full", className)}
    >
      <h5>Download table as CSV</h5>
      {paginated && (
        <Alert appearance="warning" iconName="exclamation-circle">
          The CSV export will only include the current page of results.
        </Alert>
      )}
      <TextInput
        value={filename}
        setValue={(val) => setFilename(val)}
        placeholder="Filename"
        label={null}
        postFix=".csv"
      />
      <Button variant="primary" onClick={() => downloadCSV(filename)}>
        Download CSV
      </Button>
    </div>
  );
}

function DownloadCSVPopover({
  table,
  columns,
  paginated,
  defaultFileName,
}: {
  table: TanStackTable;
  columns: TableColumnProp[];
  paginated: boolean;
  defaultFileName: string;
}) {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <div data-tooltip-id="top-tooltip" data-tooltip-content="Download CSV">
          <Icon name="download" color="brand-neutral-2" />
        </div>
      </Popover.Trigger>
      <Popover.Panel>
        <DownloadCSVPanel
          table={table}
          columns={columns}
          className="w-96"
          paginated={paginated}
          defaultFileName={defaultFileName}
        />
      </Popover.Panel>
    </Popover.Root>
  );
}

export { DownloadCSVPopover, DownloadCSVPanel };
