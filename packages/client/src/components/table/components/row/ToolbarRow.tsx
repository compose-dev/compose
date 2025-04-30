import { u } from "@compose/ts";
import Icon from "~/components/icon";
import { TextInput } from "~/components/input";
import { TableColumnProp, TanStackTable } from "../../utils";
import {
  DownloadCSVPopover,
  PinAndHideColumnsPopover,
  SortColumnsPopover,
} from "./toolbar-components";
import { classNames } from "~/utils/classNames";
import { UI } from "@composehq/ts-public";
import { Spinner } from "~/components/spinner";

function SearchInput({
  value,
  setValue,
}: {
  value: string | null;
  setValue: (val: string | null) => void;
}) {
  return (
    <TextInput
      value={value}
      setValue={setValue}
      placeholder="Search"
      label={null}
      left={<Icon name="search" color="brand-neutral-2" />}
      rootClassName="!w-full sm:!w-60 md:!w-72"
      inputClassName="border-none focus:ring-0 focus:border-none"
      showFocusRing={false}
    />
  );
}

function SearchWidget({
  searchQuery,
  setSearchQuery,
  setTableFilter,
  serverSearchQuery,
  loading,
  paginated,
  onTablePageChangeHook,
}: {
  searchQuery: string | null;
  setSearchQuery: (val: string | null) => void;
  setTableFilter: (val: string | null) => void;
  serverSearchQuery: string | null;
  loading: UI.Stale.Option;
  paginated: boolean;
  onTablePageChangeHook: (val: string | null) => void;
}) {
  if (!paginated) {
    return (
      <SearchInput
        value={searchQuery}
        setValue={(val) => {
          setSearchQuery(val);
          setTableFilter(val);
        }}
      />
    );
  }

  return (
    <form
      className="flex flex-row gap-x-2 items-center sm:mr-2"
      onSubmit={(e) => {
        e.preventDefault();
        onTablePageChangeHook(searchQuery);
      }}
    >
      <SearchInput value={searchQuery} setValue={setSearchQuery} />
      {searchQuery !== serverSearchQuery &&
        loading !== UI.Stale.OPTION.UPDATE_DISABLED && (
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

function ToolbarRow({
  searchQuery,
  setSearchQuery,
  setTableFilter,
  serverSearchQuery,
  loading,
  paginated,
  onTablePageChangeHook,
  offset,
  rowCount,
  totalRecords,
  table,
  columns,
  disableSearch,
  sortable,
  tableId,
  resetSortingStateToInitial,
}: {
  searchQuery: string | null;
  setSearchQuery: (val: string | null) => void;
  setTableFilter: (val: string | null) => void;
  serverSearchQuery: string | null;
  loading: UI.Stale.Option;
  paginated: boolean;
  onTablePageChangeHook: (val: string | null) => void;
  offset: number;
  rowCount: number;
  totalRecords: number;
  table: TanStackTable;
  columns: TableColumnProp[];
  disableSearch: boolean;
  sortable: UI.Table.SortOption;
  tableId: string;
  resetSortingStateToInitial: () => void;
}) {
  return (
    <div
      className={classNames(
        "flex flex-row space-x-2 items-center justify-between mr-2",
        {
          "my-2": disableSearch,
          "my-1": !disableSearch,
        }
      )}
    >
      {disableSearch ? (
        <div className="ml-2">
          {loading === UI.Stale.OPTION.UPDATE_DISABLED && (
            <Spinner size="sm" variant="neutral" />
          )}
        </div>
      ) : (
        <SearchWidget
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setTableFilter={setTableFilter}
          serverSearchQuery={serverSearchQuery}
          loading={loading}
          paginated={paginated}
          onTablePageChangeHook={onTablePageChangeHook}
        />
      )}
      <div className="flex flex-row space-x-4 items-center leading-none">
        <SortColumnsPopover
          sortingState={table.getState().sorting}
          setSortingState={table.setSorting}
          resetSortingState={resetSortingStateToInitial}
          columns={columns}
          sortable={sortable}
        />
        <PinAndHideColumnsPopover
          columns={columns}
          columnVisibility={table.getState().columnVisibility}
          setColumnVisibility={table.setColumnVisibility}
          resetColumnVisibility={table.resetColumnVisibility}
        />
        <DownloadCSVPopover
          table={table}
          columns={columns}
          paginated={paginated}
          defaultFileName={`${tableId}`}
        />
        <div className="self-stretch w-1 border-r border-brand-neutral hidden sm:block" />
        <p className="text-brand-neutral-2 text-sm hidden sm:block">
          {paginated
            ? `${u.string.formatNumber(offset + 1)} - ${u.string.formatNumber(offset + rowCount)} of ${totalRecords === Infinity ? "???" : u.string.formatNumber(totalRecords)} results`
            : `${u.string.formatNumber(rowCount)} results`}
        </p>
      </div>
    </div>
  );
}

export default ToolbarRow;
