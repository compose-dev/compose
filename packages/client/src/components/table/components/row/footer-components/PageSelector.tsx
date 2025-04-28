import { u } from "@compose/ts";
import Button from "~/components/button";
import Icon from "~/components/icon";

function PageSelector({
  offset,
  pageSize,
  totalRecords,
  onPageChange,
  disabled,
}: {
  offset: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (offset: number) => void;
  disabled?: boolean;
}) {
  const pageIndex = Math.floor(offset / pageSize);
  const completePages = Math.floor(totalRecords / pageSize);
  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="flex flex-1 items-center space-x-0.5 sm:space-x-2 justify-end">
      <Button
        variant="ghost"
        onClick={() => onPageChange(0)}
        className="pr-1"
        disabled={pageIndex <= 0 || disabled}
      >
        <Icon name="chevron-pipe-left" color="brand-neutral-2" size="1.25" />
      </Button>
      <Button
        variant="ghost"
        onClick={() => onPageChange((pageIndex - 1) * pageSize)}
        className="px-1"
        disabled={pageIndex <= 0 || disabled}
      >
        <Icon name="chevron-left-package" color="brand-neutral-2" size="1.25" />
      </Button>
      <p className="text-brand-neutral-2 text-sm">
        <span className="hidden sm:inline">Page</span>{" "}
        {u.string.formatNumber(pageIndex + 1)} of{" "}
        {totalRecords === Infinity ? "???" : u.string.formatNumber(totalPages)}
      </p>
      <Button
        variant="ghost"
        onClick={() => onPageChange((pageIndex + 1) * pageSize)}
        className="px-1"
        disabled={pageIndex >= totalPages - 1 || disabled}
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
          onClick={() =>
            onPageChange(
              (completePages === totalPages
                ? completePages - 1
                : completePages) * pageSize
            )
          }
          className="pl-1"
          disabled={pageIndex >= totalPages - 1 || disabled}
        >
          <Icon name="chevron-pipe-right" color="brand-neutral-2" size="1.25" />
        </Button>
      )}
    </div>
  );
}

export default PageSelector;
