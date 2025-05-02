import Button from "~/components/button";
import Icon from "~/components/icon";
import { INTERNAL_COLUMN_ID, TableColumnProp } from "~/components/table/utils";
import { classNames } from "~/utils/classNames";
import { Popover } from "~/components/popover";
import { useState } from "react";
import { TextInput } from "~/components/input";
import { TanStackTable } from "~/components/table/utils";
import { ColumnPinningPosition } from "@tanstack/react-table";

function Tooltip({
  children,
  content,
  className,
}: {
  children: React.ReactNode;
  content: string;
  className?: string;
}) {
  return (
    <div
      data-tooltip-id="top-tooltip-offset8"
      data-tooltip-content={content}
      data-tooltip-offset={4}
      data-tooltip-delay-show={300}
      className={className}
    >
      {children}
    </div>
  );
}

function ColumnRow({
  column,
  isVisible,
  onToggleVisibility,
  pinned,
  onPinColumn,
}: {
  column: TableColumnProp;
  isVisible: boolean;
  onToggleVisibility: () => void;
  pinned: ColumnPinningPosition;
  onPinColumn: (columnId: string, pinned: ColumnPinningPosition) => void;
}) {
  return (
    <div className="flex flex-row items-center justify-between py-2.5 border-b border-brand-neutral last:border-b-0">
      <div className="flex items-center gap-x-2">
        <Tooltip
          content={isVisible ? "Hide column" : "Show column"}
          className="flex items-center"
        >
          <Button
            variant="ghost"
            className="p-1"
            onClick={onToggleVisibility}
            data-tooltip-id="top-tooltip-offset4"
            data-tooltip-content={isVisible ? "Hide column" : "Show column"}
          >
            <Icon
              name={isVisible ? "eye" : "eye-slash"}
              size="1.125"
              color={isVisible ? "brand-neutral" : "brand-error"}
            />
          </Button>
        </Tooltip>
        <span>{column.label}</span>
      </div>
      <div className="flex items-center gap-x-4">
        {pinned === "left" ? (
          <Tooltip
            content="Unpin column from left"
            className="flex items-center justify-center w-6"
          >
            <Button
              variant="ghost"
              className="-rotate-90"
              onClick={() => onPinColumn(column.id, false)}
            >
              <Icon name="pin-vertical" size="1.375" color="brand-primary" />
            </Button>
          </Tooltip>
        ) : (
          <Tooltip
            content="Pin column to left"
            className="flex items-center justify-center w-6"
          >
            <Button
              variant="ghost"
              onClick={() => onPinColumn(column.id, "left")}
            >
              <Icon name="chevron-left" size="0.875" />
            </Button>
          </Tooltip>
        )}
        {pinned === "right" ? (
          <Tooltip
            content="Unpin column from right"
            className="flex items-center justify-center w-6"
          >
            <Button
              variant="ghost"
              className="rotate-90"
              onClick={() => onPinColumn(column.id, false)}
            >
              <Icon name="pin-vertical" size="1.375" color="brand-primary" />
            </Button>
          </Tooltip>
        ) : (
          <Tooltip
            content="Pin column to right"
            className="flex items-center justify-center w-6"
          >
            <Button
              variant="ghost"
              onClick={() => onPinColumn(column.id, "right")}
            >
              <Icon name="chevron-right" size="0.875" />
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

function PinAndHideColumnsPanel({
  columns,
  columnVisibility,
  setColumnVisibility,
  resetColumnVisibility,
  table,
  className = "",
}: {
  columns: TableColumnProp[];
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: (visibility: Record<string, boolean>) => void;
  resetColumnVisibility: () => void;
  className?: string;
  table: TanStackTable;
}) {
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const filteredColumns = searchTerm
    ? columns.filter((col) =>
        col.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : columns;

  function toggleColumnVisibility(columnId: string) {
    const isCurrentlyHidden = columnVisibility[columnId] === false;
    setColumnVisibility({
      ...columnVisibility,
      [columnId]: isCurrentlyHidden ? true : false,
    });
  }

  const resetAllSettings = () => {
    resetColumnVisibility();
  };

  const onPinColumn = (columnId: string, pinned: ColumnPinningPosition) => {
    table.getColumn(columnId)?.pin(pinned);
  };

  return (
    <div
      className={classNames("flex flex-col space-y-4 max-w-full", className)}
    >
      <h5>Column settings</h5>

      <TextInput
        value={searchTerm}
        setValue={setSearchTerm}
        placeholder="Search columns..."
        left={<Icon name="search" color="brand-neutral-2" />}
        label={null}
      />

      <div className="flex flex-col overflow-y-auto">
        {filteredColumns.map((column) => {
          return (
            <ColumnRow
              key={column.id}
              column={column}
              isVisible={columnVisibility[column.id] !== false}
              onToggleVisibility={() => toggleColumnVisibility(column.id)}
              pinned={table.getColumn(column.id)?.getIsPinned() ?? false}
              onPinColumn={onPinColumn}
            />
          );
        })}
      </div>

      <div className="flex w-full border-b border-brand-neutral" />

      <div>
        <Button
          variant="ghost"
          className="text-sm text-brand-neutral-2 hover:text-brand-neutral"
          onClick={resetAllSettings}
        >
          Reset to default
        </Button>
      </div>
    </div>
  );
}

function PinAndHideColumnsPopover({
  columns,
  table,
  resetColumnPinningToInitial,
}: {
  columns: TableColumnProp[];
  table: TanStackTable;
  resetColumnPinningToInitial: () => void;
}) {
  const columnVisibility = table.getState().columnVisibility;
  const columnPinning = table.getState().columnPinning;

  function getPinnedCount() {
    const leftCount = columnPinning.left
      ? columnPinning.left.filter(
          (column) => column !== INTERNAL_COLUMN_ID.SELECT
        ).length
      : 0;

    const rightCount = columnPinning.right
      ? columnPinning.right.filter(
          (column) => column !== INTERNAL_COLUMN_ID.ACTION
        ).length
      : 0;

    return leftCount + rightCount;
  }

  const pinnedCount = getPinnedCount();

  function getTooltipContent() {
    const hiddenCount = Object.values(columnVisibility).filter(
      (v) => v === false
    ).length;

    const pinnedString =
      pinnedCount > 0
        ? `${pinnedCount} pinned ${pinnedCount > 1 ? "columns" : "column"}`
        : "";

    const hiddenString =
      hiddenCount > 0
        ? `${hiddenCount} hidden ${hiddenCount > 1 ? "columns" : "column"}`
        : "";

    if (pinnedString && hiddenString) {
      return `${pinnedString}, ${hiddenString}`;
    }

    if (pinnedString) {
      return `${pinnedString}, 0 hidden columns`;
    }

    if (hiddenString) {
      return `${hiddenString}, 0 pinned columns`;
    }

    return "Pin and hide columns";
  }

  const hasActiveSettings = Object.values(columnVisibility).some(
    (v) => v === false
  );

  return (
    <Popover.Root>
      <Popover.Trigger>
        <div
          data-tooltip-id="top-tooltip-offset4"
          data-tooltip-content={getTooltipContent()}
        >
          <Icon
            name="adjustments"
            color={hasActiveSettings ? "brand-primary" : "brand-neutral-2"}
          />
        </div>
      </Popover.Trigger>
      <Popover.Panel>
        <PinAndHideColumnsPanel
          columns={columns}
          columnVisibility={columnVisibility}
          setColumnVisibility={table.setColumnVisibility}
          resetColumnVisibility={() => {
            table.resetColumnVisibility();
            resetColumnPinningToInitial();
          }}
          className="w-96"
          table={table}
        />
      </Popover.Panel>
    </Popover.Root>
  );
}

export { PinAndHideColumnsPopover, PinAndHideColumnsPanel };
