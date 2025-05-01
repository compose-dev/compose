import { UI } from "@composehq/ts-public";
import { PageSelector, TableLoading } from "./footer-components";
import { useEffect, useRef } from "react";
import { TanStackTable } from "../../utils";

function RowCountLabel({
  table,
  paginated,
}: {
  table: TanStackTable;
  paginated: boolean;
}) {
  const offset =
    table.getState().pagination.pageIndex *
    table.getState().pagination.pageSize;

  const currentPageRowCount = table.getRowModel().rows.length;

  const totalRecords = table.getRowCount();

  if (paginated) {
    return (
      <p className="text-brand-neutral-2 text-sm">
        {(offset + 1).toLocaleString()} -{" "}
        {(offset + currentPageRowCount).toLocaleString()} of{" "}
        {totalRecords === Infinity ? "???" : totalRecords.toLocaleString()}{" "}
        <span className="hidden sm:inline">results</span>
      </p>
    );
  }

  return (
    <p className="text-brand-neutral-2 text-sm">
      {totalRecords.toLocaleString()} results
    </p>
  );
}

function FooterRow({
  table,
  paginated,
  loading,
  scrollToTop,
  offset,
}: {
  table: TanStackTable;
  paginated: boolean;
  loading: UI.Stale.Option;
  scrollToTop: () => void;
  offset: number;
}) {
  const prevLoadingRef = useRef(loading);

  useEffect(() => {
    if (
      prevLoadingRef.current !== loading &&
      loading === UI.Stale.OPTION.FALSE
    ) {
      scrollToTop();
    }

    if (
      loading === UI.Stale.OPTION.UPDATE_DISABLED ||
      loading === UI.Stale.OPTION.FALSE
    ) {
      prevLoadingRef.current = loading;
    }
  }, [scrollToTop, loading]);

  if (!paginated) {
    return (
      <div className="flex sm:hidden flex-row justify-center items-center p-2 w-full border-t border-brand-neutral bg-brand-io">
        <RowCountLabel table={table} paginated={paginated} />
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center justify-between p-2 w-full border-t border-brand-neutral bg-brand-io">
      {!loading && (
        <div className="block sm:hidden">
          <RowCountLabel table={table} paginated={paginated} />
        </div>
      )}
      <TableLoading loading={loading} />
      <PageSelector
        table={table}
        disabled={loading === UI.Stale.OPTION.UPDATE_DISABLED}
        offset={offset}
      />
    </div>
  );
}

export default FooterRow;
