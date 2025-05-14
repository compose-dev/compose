import Button from "~/components/button";
import Icon from "~/components/icon";
import { TanStackTable } from "~/components/table/utils";

function PageSelector({
  table,
  disabled,
  offset,
}: {
  table: TanStackTable;
  disabled?: boolean;
  offset: number;
}) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalRecords = table.getRowCount();

  const pageCountFloat = table.getRowCount() / pageSize;
  const totalPages = Math.ceil(pageCountFloat);

  // Calculate ourselves instead of using tanstack methods to avoid
  // react lifecycle issues. the `disabled` prop updates one lifecycle
  // prior to tanstack's `canNextPage` and `canPreviousPage` props
  // since disabled is directly passed to the `Table` component, but
  // tanstack's methods are derived. Hence, we use `offset` here which
  // is also directly passed to the `Table` component to ensure that
  // lifecycles are in sync.
  const canNextPage = offset + pageSize < totalRecords;
  const canPreviousPage = offset > 0;

  return (
    <div className="flex flex-1 items-center space-x-0.5 sm:space-x-2 justify-end">
      <Button
        variant="ghost"
        onClick={table.firstPage}
        className="pr-1"
        disabled={!canPreviousPage || disabled}
      >
        <Icon name="chevron-pipe-left" color="brand-neutral-2" size="1.25" />
      </Button>
      <Button
        variant="ghost"
        onClick={table.previousPage}
        className="px-1"
        disabled={!canPreviousPage || disabled}
      >
        <Icon name="chevron-left-package" color="brand-neutral-2" size="1.25" />
      </Button>
      <p className="text-brand-neutral-2 text-sm">
        <span className="hidden sm:inline">Page</span>{" "}
        {(pageIndex + 1).toLocaleString()} of{" "}
        {totalRecords === Infinity ? "???" : totalPages.toLocaleString()}
      </p>
      <Button
        variant="ghost"
        onClick={table.nextPage}
        className="px-1"
        disabled={!canNextPage || disabled}
      >
        <Icon
          name="chevron-right-package"
          color="brand-neutral-2"
          size="1.25"
        />
      </Button>
      {totalRecords !== Infinity && (
        <Button
          variant="ghost"
          onClick={table.lastPage}
          className="pl-1"
          disabled={!canNextPage || disabled}
        >
          <Icon name="chevron-pipe-right" color="brand-neutral-2" size="1.25" />
        </Button>
      )}
    </div>
  );
}

export default PageSelector;
