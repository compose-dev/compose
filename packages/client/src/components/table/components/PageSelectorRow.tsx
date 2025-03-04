import { u } from "@compose/ts";
import Button from "~/components/button";
import Icon from "~/components/icon";

export default function PageSelectorRow({
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
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        onClick={() => onPageChange(0)}
        className="px-1"
        disabled={pageIndex <= 0 || disabled}
      >
        <Icon name="chevron-pipe-left" color="brand-neutral-2" size="mlg" />
      </Button>
      <Button
        variant="ghost"
        onClick={() => onPageChange((pageIndex - 1) * pageSize)}
        className="px-1"
        disabled={pageIndex <= 0 || disabled}
      >
        <Icon name="chevron-left-package" color="brand-neutral-2" size="mlg" />
      </Button>
      <p className="text-brand-neutral-2 text-sm">
        Page {u.string.formatNumber(pageIndex + 1)} of{" "}
        {u.string.formatNumber(totalPages)}
      </p>
      <Button
        variant="ghost"
        onClick={() => onPageChange((pageIndex + 1) * pageSize)}
        className="px-1"
        disabled={pageIndex >= totalPages - 1 || disabled}
      >
        <Icon name="chevron-right-package" color="brand-neutral-2" size="mlg" />
      </Button>
      <Button
        variant="ghost"
        onClick={() =>
          onPageChange(
            (completePages === totalPages ? completePages - 1 : completePages) *
              pageSize
          )
        }
        className="pl-1"
        disabled={pageIndex >= totalPages - 1 || disabled}
      >
        <Icon name="chevron-pipe-right" color="brand-neutral-2" size="mlg" />
      </Button>
    </div>
  );
}
