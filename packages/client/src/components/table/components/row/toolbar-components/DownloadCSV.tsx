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
  const [includeUnselectedRows, setIncludeUnselectedRows] = useState(false);

  const rowSelections = Object.keys(table.getState().rowSelection).map((row) =>
    parseInt(row)
  );

  const offset = paginated
    ? table.getState().pagination.pageIndex *
      table.getState().pagination.pageSize
    : 0;

  function downloadCSV(filename?: string | null) {
    generateAndDownloadCSV(
      table,
      columns,
      filename ?? defaultFileName,
      rowSelections,
      offset,
      includeHiddenColumns,
      rowSelections.length > 0 ? includeUnselectedRows : true
    );
  }

  const hiddenColumnCount = Object.values(
    table.getState().columnVisibility
  ).filter((column) => column === false).length;

  const currentPageSize = paginated
    ? table.getState().pagination.pageSize
    : table.getRowCount();

  const currentPageRowSelections = paginated
    ? rowSelections.filter(
        (row) => row >= offset && row < offset + currentPageSize
      )
    : rowSelections;

  const numUnselectedRows = currentPageSize - currentPageRowSelections.length;

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
      {rowSelections.length > 0 && (
        <Checkbox
          checked={includeUnselectedRows}
          setChecked={(val) => setIncludeUnselectedRows(val)}
          label="Include unselected rows"
          description={`${numUnselectedRows} unselected ${
            numUnselectedRows === 1 ? "row" : "rows"
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
