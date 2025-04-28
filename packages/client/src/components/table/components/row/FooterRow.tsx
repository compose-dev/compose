import { UI } from "@composehq/ts-public";
import { PageSelector, TableLoading } from "./footer-components";
import { useEffect, useRef } from "react";
import { u } from "@compose/ts";

function RowCountLabel({
  paginated,
  offset,
  rowCount,
  totalRecords,
}: {
  paginated: boolean;
  offset: number;
  rowCount: number;
  totalRecords: number;
}) {
  if (paginated) {
    return (
      <p className="text-brand-neutral-2 text-sm">
        {u.string.formatNumber(offset + 1)} -{" "}
        {u.string.formatNumber(offset + rowCount)} of{" "}
        {totalRecords === Infinity
          ? "???"
          : u.string.formatNumber(totalRecords)}{" "}
        <span className="hidden sm:inline">results</span>
      </p>
    );
  }

  return (
    <p className="text-brand-neutral-2 text-sm">
      {u.string.formatNumber(rowCount)} results
    </p>
  );
}

function FooterRow({
  paginated,
  loading,
  offset,
  pageSize,
  totalRecords,
  onTablePageChangeHook,
  scrollToTop,
  rowCount,
}: {
  paginated: boolean;
  loading: UI.Stale.Option;
  offset: number;
  pageSize: number;
  totalRecords: number;
  onTablePageChangeHook: (offset: number, pageSize: number) => void;
  scrollToTop: () => void;
  rowCount: number;
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
        <RowCountLabel
          paginated={paginated}
          offset={offset}
          rowCount={rowCount}
          totalRecords={totalRecords}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center justify-between p-2 w-full border-t border-brand-neutral bg-brand-io">
      {!loading && (
        <div className="block sm:hidden">
          <RowCountLabel
            paginated={paginated}
            offset={offset}
            rowCount={rowCount}
            totalRecords={totalRecords}
          />
        </div>
      )}
      <TableLoading loading={loading} />
      <PageSelector
        offset={offset}
        pageSize={pageSize}
        totalRecords={totalRecords}
        onPageChange={(offset) => {
          onTablePageChangeHook(offset, pageSize);
        }}
        disabled={loading === UI.Stale.OPTION.UPDATE_DISABLED}
      />
    </div>
  );
}

export default FooterRow;
