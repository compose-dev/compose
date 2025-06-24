import Icon from "~/components/icon";
import { TextInput } from "~/components/input";
import {
  FormattedTableRow,
  GlobalFiltering,
  Sorting,
  TanStackTable,
  Views,
} from "../../utils";
import {
  DownloadCSVPopover,
  FilterColumnsPopover,
  PinAndHideColumnsPopover,
  SortColumnsPopover,
  TableViewsPopover,
} from "./toolbar-components";
import { classNames } from "~/utils/classNames";
import { UI } from "@composehq/ts-public";
import { Spinner } from "~/components/spinner";
import Button from "~/components/button";
import { useState } from "react";

function SearchInput({
  value,
  setValue,
  disabled,
}: {
  value: string | null;
  setValue: (val: string | null) => void;
  disabled?: boolean;
}) {
  return (
    <TextInput
      value={value}
      setValue={(val) => {
        // Do this instead of using the input's disabled prop since toggling
        // the disabled prop will also cause the input to lose focus.
        if (disabled) {
          return;
        }

        setValue(val);
      }}
      placeholder="Search"
      label={null}
      left={<Icon name="search" color="brand-neutral-2" />}
      rootClassName="!w-full sm:max-w-60 md:max-w-72"
      inputClassName={classNames("border-none focus:ring-0 focus:border-none", {
        "!bg-brand-io text-brand-neutral-2": disabled === true,
      })}
      showFocusRing={false}
    />
  );
}

function VerticalDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={classNames(
        "self-stretch w-1 border-r border-brand-neutral",
        className
      )}
    />
  );
}

function SearchWidget({
  searchQuery,
  setSearchQuery,
  isSearchQueryStale,
  loading,
  paginated,
  onTablePageChangeHook,
  searchable,
}: {
  searchQuery: string | null;
  setSearchQuery: (val: string | null) => void;
  isSearchQueryStale: boolean;
  loading: UI.Stale.Option;
  paginated: boolean;
  onTablePageChangeHook: (offset?: number) => void;
  searchable: boolean;
}) {
  if (!searchable) {
    return (
      <div className="ml-2">
        {loading === UI.Stale.OPTION.UPDATE_DISABLED && (
          <Spinner size="sm" variant="neutral" />
        )}
      </div>
    );
  }

  if (!paginated) {
    return <SearchInput value={searchQuery} setValue={setSearchQuery} />;
  }

  return (
    <form
      className="flex flex-row gap-x-2 items-center sm:mr-2 flex-1"
      onSubmit={(e) => {
        e.preventDefault();
        onTablePageChangeHook();
      }}
    >
      <SearchInput
        value={searchQuery}
        setValue={setSearchQuery}
        disabled={loading === UI.Stale.OPTION.UPDATE_DISABLED}
      />
      {isSearchQueryStale && loading !== UI.Stale.OPTION.UPDATE_DISABLED && (
        <p className="text-brand-neutral-2 text-sm min-w-fit">
          <span className="hidden sm:block">Press Enter to search</span>
          <span className="block sm:hidden">Enter to search</span>
        </p>
      )}
      {loading === UI.Stale.OPTION.UPDATE_DISABLED && (
        <div className="flex flex-row items-center gap-x-2">
          <Spinner size="sm" variant="neutral" />
          <p className="text-brand-neutral-2 text-sm hidden md:block">
            Fetching results...
          </p>
        </div>
      )}
    </form>
  );
}

function ControlsButton({
  setShowSettings,
  searchable,
}: {
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
  searchable: boolean;
}) {
  function toggleSettings() {
    setShowSettings((prev) => !prev);
  }

  return (
    <Button
      variant="ghost"
      onClick={toggleSettings}
      className={classNames(
        "flex flex-row items-center gap-x-1 text-brand-neutral-2",
        {
          "text-sm": !searchable,
        }
      )}
    >
      Controls
      <Icon name="settings" color="brand-neutral-2" size="1.125" />
    </Button>
  );
}

function ToolbarRow({
  searchQueryHook,
  advancedFilteringHook,
  sortingHook,
  viewsHook,
  loading,
  paginated,
  onTablePageChangeHook,
  table,
  searchable,
  sortable,
  tableId,
  resetColumnPinningToInitial,
  filterable,
  resetColumnVisibility,
  views,
  setView,
  resetView,
  isViewDirty,
}: {
  searchQueryHook: ReturnType<typeof GlobalFiltering.useSearch>;
  advancedFilteringHook: ReturnType<
    typeof GlobalFiltering.useAdvancedFiltering
  >;
  sortingHook: ReturnType<typeof Sorting.use>;
  viewsHook: ReturnType<typeof Views.use>;
  loading: UI.Stale.Option;
  paginated: boolean;
  onTablePageChangeHook: (offset?: number) => void;
  table: TanStackTable;
  searchable: boolean;
  sortable: UI.Table.SortOption;
  tableId: string;
  resetColumnPinningToInitial: () => void;
  filterable: boolean;
  resetColumnVisibility: () => void;
  views: UI.Table.ViewInternal<FormattedTableRow[]>[];
  setView: (view: Views.ViewDisplayFormat) => void;
  resetView: () => void;
  isViewDirty: boolean;
}) {
  const offset =
    table.getState().pagination.pageIndex *
    table.getState().pagination.pageSize;

  const currentPageRowCount = table.getPaginationRowModel().rows.length;

  const [showSettings, setShowSettings] = useState(false);

  return (
    <div
      className={classNames(
        "flex flex-col sm:flex-row gap-2 items-center justify-between mr-2",
        {
          "my-2": !searchable,
          "my-1 gap-y-1": searchable,
        }
      )}
    >
      <div className="flex flex-row gap-x-2 items-center justify-between self-stretch flex-1">
        <SearchWidget
          searchQuery={searchQueryHook.draft}
          setSearchQuery={searchQueryHook.set}
          isSearchQueryStale={searchQueryHook.isServerValueStale}
          loading={loading}
          paginated={paginated}
          onTablePageChangeHook={onTablePageChangeHook}
          searchable={searchable}
        />
        <div className="flex sm:hidden">
          <ControlsButton
            setShowSettings={setShowSettings}
            searchable={searchable}
          />
        </div>
      </div>
      <div
        className={classNames(
          "gap-x-4 items-center self-stretch sm:self-auto justify-end",
          // these styles are only for the mobile view
          "bg-brand-overlay sm:bg-transparent ml-2 sm:ml-0 p-2 sm:p-0 rounded-brand sm:rounded-none",
          {
            "hidden sm:flex": !showSettings,
            "flex my-1 sm:my-0": showSettings,
          }
        )}
      >
        <SortColumnsPopover
          sortingState={sortingHook.draft}
          setSortingState={(sortingState) => {
            sortingHook.set(sortingState);
            if (paginated) {
              onTablePageChangeHook();
            }
          }}
          resetSortingState={() => {
            sortingHook.reset();
            if (paginated) {
              onTablePageChangeHook();
            }
          }}
          table={table}
          sortable={sortable}
          loading={loading}
        />
        <FilterColumnsPopover
          table={table}
          filterModel={advancedFilteringHook.draft}
          setFilterModel={advancedFilteringHook.set}
          resetFilterModel={advancedFilteringHook.reset}
          filterable={filterable}
          paginated={paginated}
          isServerValueStale={advancedFilteringHook.isServerValueStale}
          onTablePageChangeHook={onTablePageChangeHook}
          loading={loading}
          appliedFilterModel={advancedFilteringHook.applied}
        />
        <PinAndHideColumnsPopover
          table={table}
          resetColumnPinningToInitial={resetColumnPinningToInitial}
          resetColumnVisibility={resetColumnVisibility}
        />
        <DownloadCSVPopover
          table={table}
          paginated={paginated}
          defaultFileName={`${tableId}`}
        />
        {views && views.length > 0 && (
          <>
            <VerticalDivider />
            <TableViewsPopover
              views={views}
              activeDisplayView={viewsHook.draft}
              setActiveView={setView}
              resetActiveView={resetView}
              loading={loading}
              isViewDirty={isViewDirty}
            />
          </>
        )}
        <VerticalDivider className="hidden sm:block" />
        <p className="text-brand-neutral-2 text-sm hidden sm:block">
          {paginated
            ? `${(offset + 1).toLocaleString()} - ${(
                offset + currentPageRowCount
              ).toLocaleString()} of ${
                table.getRowCount() === Infinity
                  ? "???"
                  : table.getRowCount().toLocaleString()
              } results`
            : `${table.getFilteredRowModel().flatRows.length.toLocaleString()} results`}
        </p>
      </div>
    </div>
  );
}

export default ToolbarRow;
