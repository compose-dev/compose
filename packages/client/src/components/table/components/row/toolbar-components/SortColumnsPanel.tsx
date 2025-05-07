import { ComboboxSingle } from "~/components/combobox";
import Button from "~/components/button";
import Icon from "~/components/icon";
import { TanStackTable } from "~/components/table/utils";
import { SortingState } from "@tanstack/react-table";
import DropdownMenu from "~/components/dropdown-menu";
import { UI } from "@composehq/ts-public";
import { classNames } from "~/utils/classNames";
import { Popover } from "~/components/popover";

function SortRow({
  columnOptions,
  column,
  setColumn,
  desc,
  toggleDesc,
  removeSort,
}: {
  columnOptions: Parameters<typeof ComboboxSingle>[0]["options"];
  column: Parameters<typeof ComboboxSingle>[0]["value"];
  setColumn: Parameters<typeof ComboboxSingle>[0]["setValue"];
  desc: boolean;
  toggleDesc: () => void;
  removeSort: (() => void) | null;
}) {
  return (
    <div className="flex flex-row space-x-2">
      <ComboboxSingle
        options={columnOptions}
        value={column}
        setValue={setColumn}
        id="sort-column"
        label={null}
        disabled={false}
        rootClassName="w-full"
      />
      <Button
        variant="ghost"
        className="border border-brand-neutral bg-brand-io rounded-brand p-1 px-2 flex flex-row items-center space-x-1 text-sm w-24 justify-center"
        onClick={toggleDesc}
      >
        <span>{desc ? "Desc" : "Asc"}</span>
        <Icon name={desc ? "arrow-down" : "arrow-up"} size="1" />
      </Button>
      <Button
        variant="ghost"
        onClick={removeSort ?? (() => {})}
        className={removeSort ? "" : "invisible"}
      >
        <Icon name="x" size="0.625" color="brand-neutral-2" />
      </Button>
    </div>
  );
}

function SortColumnsPanel({
  sortingState,
  setSortingState,
  table,
  sortable,
  resetSortingState,
  className = "",
}: {
  sortingState: SortingState;
  setSortingState: (sortingState: SortingState) => void;
  table: TanStackTable;
  sortable: UI.Table.SortOption;
  className?: string;
  resetSortingState: () => void;
}) {
  const sortColumnOptions = table
    .getAllColumns()
    .filter((column) => column.columnDef.meta?.isDataColumn)
    .map((column) => ({
      label: column.columnDef.meta?.label ?? "Unknown",
      value: column.id,
      format: column.columnDef.meta?.format,
    }));

  return (
    <div
      className={classNames("flex flex-col space-y-4 max-w-full", className)}
    >
      <div className="flex flex-row items-center justify-between">
        <h5>Sort by</h5>
        <Button variant="ghost" onClick={resetSortingState}>
          <p className="text-sm text-brand-neutral-2">Reset to default</p>
        </Button>
      </div>
      {sortingState.length > 0 && (
        <div className="flex flex-col space-y-2">
          {sortingState.map((sort) => (
            <SortRow
              key={sort.id}
              columnOptions={sortColumnOptions}
              column={sort.id}
              setColumn={(val) => {
                const newSort = sortingState.map((s) => {
                  if (s.id === sort.id) {
                    return { id: val as string, desc: s.desc };
                  }
                  return s;
                });
                setSortingState(newSort);
              }}
              desc={sort.desc}
              toggleDesc={() => {
                const newSort = sortingState.map((s) => {
                  if (s.id === sort.id) {
                    return { id: s.id, desc: !s.desc };
                  }
                  return s;
                });
                setSortingState(newSort);
              }}
              removeSort={() => {
                const newSort = sortingState.filter((s) => s.id !== sort.id);
                setSortingState(newSort);
              }}
            />
          ))}
        </div>
      )}
      {(sortable !== UI.Table.SORT_OPTION.SINGLE ||
        sortingState.length < 1) && (
        <div>
          <DropdownMenu
            labelVariant="ghost"
            label={
              <div className="flex flex-row items-center space-x-1 border border-brand-neutral rounded-brand p-1.5 px-2 bg-brand-io">
                <Icon name="plus" />
                <p className="text-sm">Add sort</p>
              </div>
            }
            dropdownAnchor="bottom start"
            options={sortColumnOptions.map((option) => ({
              label: option.label,
              onClick: () => {
                setSortingState([
                  ...sortingState,
                  {
                    id: option.value,
                    desc: UI.Table.shouldSortDescendingFirst(option.format),
                  },
                ]);
              },
            }))}
          />
        </div>
      )}
      {sortable === UI.Table.SORT_OPTION.MULTI && (
        <>
          <div className="flex w-full border-b border-brand-neutral" />
          <p className="text-xs text-brand-neutral-2">
            Hold <span className="font-mono">shift</span> when clicking on a
            column header to add it as an additional sort level.
          </p>
        </>
      )}
    </div>
  );
}

function SortColumnsPopover({
  sortingState,
  setSortingState,
  resetSortingState,
  table,
  sortable,
}: {
  sortingState: SortingState;
  setSortingState: (val: SortingState) => void;
  resetSortingState: () => void;
  table: TanStackTable;
  sortable: UI.Table.SortOption;
}) {
  if (sortable === UI.Table.SORT_OPTION.DISABLED) {
    return null;
  }

  function getSortingTooltipContent() {
    if (sortingState.length > 1) {
      return `Sorting by ${sortingState.length} columns`;
    }

    if (sortingState.length === 1) {
      return `Sorting by ${table
        .getAllColumns()
        .find((column) => column.id === sortingState[0].id)
        ?.columnDef.meta?.label?.toLowerCase()}`;
    }

    return "Sort";
  }

  return (
    <Popover.Root>
      <Popover.Trigger>
        <div
          data-tooltip-id="top-tooltip-offset4"
          data-tooltip-content={getSortingTooltipContent()}
        >
          <Icon
            name="arrows-sort"
            color={
              sortingState.length > 0 ? "brand-primary" : "brand-neutral-2"
            }
          />
        </div>
      </Popover.Trigger>
      <Popover.Panel>
        <SortColumnsPanel
          sortingState={sortingState}
          setSortingState={setSortingState}
          table={table}
          className="w-96"
          sortable={sortable}
          resetSortingState={resetSortingState}
        />
      </Popover.Panel>
    </Popover.Root>
  );
}

export { SortColumnsPopover, SortColumnsPanel };
