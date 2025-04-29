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
import { Checkbox } from "~/components/checkbox";

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
  const [includeHiddenColumns, setIncludeHiddenColumns] = useState(false);

  function downloadCSV(filename?: string | null) {
    generateAndDownloadCSV(
      table,
      columns,
      filename ?? defaultFileName,
      includeHiddenColumns
    );
  }

  const hiddenColumnCount = Object.values(
    table.getState().columnVisibility
  ).filter((column) => column === false).length;

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
        label="File name"
        postFix=".csv"
      />
      {hiddenColumnCount > 0 && (
        <Checkbox
          checked={includeHiddenColumns}
          setChecked={(val) => setIncludeHiddenColumns(val)}
          label="Include hidden columns"
          description={`${hiddenColumnCount} hidden ${
            hiddenColumnCount === 1 ? "column" : "columns"
          } will be included in the CSV download.`}
        />
      )}
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
        <div
          data-tooltip-id="top-tooltip-offset4"
          data-tooltip-content="Download CSV"
        >
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
