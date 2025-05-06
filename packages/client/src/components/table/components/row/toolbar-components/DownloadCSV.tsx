import Button from "~/components/button";
import Icon from "~/components/icon";
import {
  FormattedTableRow,
  generateAndDownloadCSV,
  RowSelections,
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
  preFilteredRows,
}: {
  table: TanStackTable;
  columns: TableColumnProp[];
  className?: string;
  paginated: boolean;
  defaultFileName: string;
  preFilteredRows: FormattedTableRow[];
}) {
  const [filename, setFilename] = useState<string | null>(defaultFileName);
  const [includeHiddenColumns, setIncludeHiddenColumns] = useState(false);
  const [includeUnselectedRows, setIncludeUnselectedRows] = useState(false);

  const rowSelections = table.getState().rowSelection;

  function downloadCSV(filename?: string | null) {
    generateAndDownloadCSV(
      table,
      columns,
      filename ?? defaultFileName,
      includeHiddenColumns,
      table.getIsSomeRowsSelected() ? includeUnselectedRows : true
    );
  }

  const hiddenColumnCount = Object.values(
    table.getState().columnVisibility
  ).filter((column) => column === false).length;

  const rowSelectionsCount = RowSelections.getSelectedRows(
    rowSelections,
    preFilteredRows
  ).length;

  const numUnselectedRows = preFilteredRows.length - rowSelectionsCount;

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
      {rowSelectionsCount > 0 && (
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
  preFilteredRows,
}: {
  table: TanStackTable;
  columns: TableColumnProp[];
  paginated: boolean;
  defaultFileName: string;
  preFilteredRows: FormattedTableRow[];
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
          preFilteredRows={preFilteredRows}
        />
      </Popover.Panel>
    </Popover.Root>
  );
}

export { DownloadCSVPopover, DownloadCSVPanel };
