import Button from "~/components/button";
import Icon from "~/components/icon";
import { TableColumnProp } from "~/components/table/utils";
import { classNames } from "~/utils/classNames";
import { Popover } from "~/components/popover";
import { useState } from "react";
import { TextInput } from "~/components/input";

function ColumnRow({
  column,
  isVisible,
  onToggleVisibility,
}: {
  column: TableColumnProp;
  isVisible: boolean;
  onToggleVisibility: () => void;
}) {
  return (
    <div className="flex flex-row items-center justify-between py-2.5 border-b border-brand-neutral last:border-b-0">
      <span>{column.label}</span>
      <div
        className="flex items-center justify-center"
        data-tooltip-id="top-tooltip-offset8"
        data-tooltip-content={isVisible ? "Hide column" : "Show column"}
        data-tooltip-offset={4}
        data-tooltip-delay-show={500}
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
      </div>
    </div>
  );
}

function PinAndHideColumnsPanel({
  columns,
  columnVisibility,
  setColumnVisibility,
  resetColumnVisibility,
  className = "",
}: {
  columns: TableColumnProp[];
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: (visibility: Record<string, boolean>) => void;
  resetColumnVisibility: () => void;
  className?: string;
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
            />
          );
        })}
      </div>

      <div className="flex w-full border-b border-brand-neutral" />

      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          className="text-sm text-brand-neutral-2 hover:text-brand-neutral"
          onClick={resetAllSettings}
        >
          Reset to default
        </Button>

        <div className="flex items-center space-x-1 text-sm text-brand-neutral-2">
          <span>
            Showing{" "}
            {
              filteredColumns.filter(
                (col) => columnVisibility[col.id] !== false
              ).length
            }{" "}
            of {columns.length} columns
          </span>
        </div>
      </div>
    </div>
  );
}

function PinAndHideColumnsPopover({
  columns,
  columnVisibility,
  setColumnVisibility,
  resetColumnVisibility,
}: {
  columns: TableColumnProp[];
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: (visibility: Record<string, boolean>) => void;
  resetColumnVisibility: () => void;
}) {
  function getTooltipContent() {
    const hiddenCount = Object.values(columnVisibility).filter(
      (v) => v === false
    ).length;

    if (hiddenCount > 1) {
      return `${hiddenCount} hidden columns`;
    }

    if (hiddenCount > 0) {
      return `${hiddenCount} hidden column`;
    }

    return "Hide columns";
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
          setColumnVisibility={setColumnVisibility}
          resetColumnVisibility={resetColumnVisibility}
          className="w-96"
        />
      </Popover.Panel>
    </Popover.Root>
  );
}

export { PinAndHideColumnsPopover, PinAndHideColumnsPanel };
