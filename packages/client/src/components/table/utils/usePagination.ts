import { PaginationState, Updater } from "@tanstack/react-table";
import { useEffect, useState } from "react";

function usePagination(
  offset: number,
  pageSize: number,
  onPageChange: (offset: number, pageSize: number) => void
) {
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: Math.floor(offset / pageSize),
    pageSize: pageSize,
  });

  useEffect(() => {
    setPaginationState({
      pageIndex: Math.floor(offset / pageSize),
      pageSize: pageSize,
    });
  }, [offset, pageSize]);

  function handlePageChange(newState: Updater<PaginationState>) {
    const newPageState =
      typeof newState === "function" ? newState(paginationState) : newState;

    onPageChange(
      newPageState.pageIndex * newPageState.pageSize,
      newPageState.pageSize
    );
  }

  return {
    paginationState,
    setPaginationState: handlePageChange,
  };
}

export { usePagination };
