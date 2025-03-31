import { UI } from "@composehq/ts-public";
import RowCell from "./RowCell";
import { classNames } from "~/utils/classNames";
import { TableColumn } from "../constants";
import Icon from "~/components/icon";
import { u } from "@compose/ts";

function CircleCheck() {
  return (
    <div className="h-[24px] flex items-center">
      <Icon name="checkmark" color="brand-success" stroke="semi-bold" />
    </div>
  );
}

function CircleX() {
  return (
    <div className="h-[24px] flex items-center">
      <Icon name="x" color="brand-error" stroke="bold" size="sm" />
    </div>
  );
}

function formatStringCell(value: unknown) {
  switch (typeof value) {
    case "object": {
      try {
        return JSON.stringify(value);
      } catch (e) {
        return "<??Unknown Object??>";
      }
    }

    case "string": {
      return value;
    }

    case "number": {
      return value.toString();
    }

    case "bigint": {
      return value.toString();
    }

    case "boolean": {
      return value.toString();
    }

    case "undefined": {
      return "";
    }

    default: {
      try {
        return (value as unknown as string).toString();
      } catch (e) {
        return "<??Unknown Value??>";
      }
    }
  }
}

function DataCell({
  value,
  column,
  meta,
  isLastRow,
}: {
  value: unknown;
  column: TableColumn;
  meta: Record<string, string>;
  isLastRow: boolean;
}) {
  if (value === null || value === undefined || value === "") {
    if (column.format === UI.Table.COLUMN_FORMAT.boolean) {
      return (
        <RowCell
          className={classNames({ "flex-1 min-w-48": !column.width })}
          style={
            column.width ? { width: column.width, minWidth: column.width } : {}
          }
          isLastRow={isLastRow}
        >
          <CircleX />
        </RowCell>
      );
    }

    if (value === null) {
      return (
        <RowCell
          className={classNames({
            "flex-1 min-w-48": !column.width,
            // If the format is string, we don't apply any special styling
            "!text-brand-error-heavy": column.format !== "string",
          })}
          style={
            column.width ? { width: column.width, minWidth: column.width } : {}
          }
          isLastRow={isLastRow}
        >
          NULL
        </RowCell>
      );
    }

    return (
      <RowCell
        className={classNames({ "flex-1 min-w-48": !column.width })}
        style={
          column.width ? { width: column.width, minWidth: column.width } : {}
        }
        isLastRow={isLastRow}
      >
        <></>
      </RowCell>
    );
  }

  switch (column.format) {
    case UI.Table.COLUMN_FORMAT.date: {
      return (
        <RowCell
          className={classNames({
            "flex-1 min-w-48": !column.width,
          })}
          style={
            column.width ? { width: column.width, minWidth: column.width } : {}
          }
          isLastRow={isLastRow}
        >
          {meta[column.accessorKey]}
        </RowCell>
      );
    }
    case UI.Table.COLUMN_FORMAT.datetime: {
      return (
        <RowCell
          className={classNames({
            "flex-1 min-w-48": !column.width,
          })}
          style={
            column.width ? { width: column.width, minWidth: column.width } : {}
          }
          isLastRow={isLastRow}
        >
          {meta[column.accessorKey]}
        </RowCell>
      );
    }
    case UI.Table.COLUMN_FORMAT.currency: {
      const currency = u.string.formatCurrency(value as string);

      return (
        <RowCell
          className={classNames({
            "flex-1 min-w-48": !column.width,
          })}
          style={
            column.width ? { width: column.width, minWidth: column.width } : {}
          }
          isLastRow={isLastRow}
        >
          {currency}
        </RowCell>
      );
    }
    case UI.Table.COLUMN_FORMAT.number: {
      const number = u.string.formatNumber(value as string, 3);

      return (
        <RowCell
          className={classNames({
            "flex-1 min-w-48": !column.width,
          })}
          style={
            column.width ? { width: column.width, minWidth: column.width } : {}
          }
          isLastRow={isLastRow}
        >
          {number}
        </RowCell>
      );
    }
    case UI.Table.COLUMN_FORMAT.boolean: {
      const isTrue = !!value;

      return (
        <RowCell
          className={classNames({
            "flex-1 min-w-48": !column.width,
          })}
          style={
            column.width ? { width: column.width, minWidth: column.width } : {}
          }
          isLastRow={isLastRow}
        >
          {isTrue ? <CircleCheck /> : <CircleX />}
        </RowCell>
      );
    }
    case UI.Table.COLUMN_FORMAT.tag: {
      const arrayTags = Array.isArray(value) ? value : [value];

      return (
        <RowCell
          className={classNames(
            "break-normal flex flex-wrap gap-[.375rem] py-2.5",
            {
              "flex-1 min-w-48": !column.width,
            }
          )}
          style={
            column.width ? { width: column.width, minWidth: column.width } : {}
          }
          isLastRow={isLastRow}
        >
          {arrayTags.map((value, idx) => {
            if (value === null) {
              return (
                <span key={idx} className="!text-brand-error-heavy">
                  NULL
                </span>
              );
            }

            if (
              typeof value !== "string" &&
              typeof value !== "number" &&
              typeof value !== "boolean"
            ) {
              return <span key={idx}>{formatStringCell(value)}</span>;
            }

            const tagColor = column.tagColors?.[value.toString()];

            return (
              <div
                key={idx}
                className={classNames(
                  "inline-flex items-center px-1.5 py-0.5 rounded-brand text-xs font-medium max-h-fit h-fit",
                  {
                    "red-tag": tagColor === UI.Table.TAG_COLOR.red,
                    "orange-tag": tagColor === UI.Table.TAG_COLOR.orange,
                    "yellow-tag": tagColor === UI.Table.TAG_COLOR.yellow,
                    "green-tag": tagColor === UI.Table.TAG_COLOR.green,
                    "blue-tag": tagColor === UI.Table.TAG_COLOR.blue,
                    "purple-tag": tagColor === UI.Table.TAG_COLOR.purple,
                    "pink-tag": tagColor === UI.Table.TAG_COLOR.pink,
                    "brown-tag": tagColor === UI.Table.TAG_COLOR.brown,
                    "slate-tag": tagColor === UI.Table.TAG_COLOR.gray,
                  }
                )}
              >
                {value.toString()}
              </div>
            );
          })}
        </RowCell>
      );
    }
    default: {
      const formatted = formatStringCell(value);

      return (
        <RowCell
          className={classNames({
            "flex-1 min-w-48": !column.width,
            "truncate !block": column.truncate === true,
          })}
          style={
            column.width ? { width: column.width, minWidth: column.width } : {}
          }
          isLastRow={isLastRow}
        >
          {formatted}
        </RowCell>
      );
    }
  }
}

export default DataCell;
