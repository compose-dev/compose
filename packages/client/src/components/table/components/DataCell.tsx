import { UI } from "@composehq/ts-public";
import RowCell from "./RowCell";
import { classNames } from "~/utils/classNames";
import { TableColumnProp } from "../utils";
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
  column: TableColumnProp;
  meta: Record<string, string>;
  isLastRow: boolean;
}) {
  if (value === null || value === undefined || value === "") {
    if (column.format === UI.Table.COLUMN_FORMAT.boolean) {
      return (
        <RowCell
          className={classNames({
            "flex-1 min-w-48": !column.width,
          })}
          style={
            column.width ? { width: column.width, minWidth: column.width } : {}
          }
          isLastRow={isLastRow}
          expand={column.expand}
          overflow={column.overflow}
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
          expand={column.expand}
          overflow={column.overflow}
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
        expand={column.expand}
        overflow={column.overflow}
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
          expand={column.expand}
          overflow={column.overflow}
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
          expand={column.expand}
          overflow={column.overflow}
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
          expand={column.expand}
          overflow={column.overflow}
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
          expand={column.expand}
          overflow={column.overflow}
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
          expand={column.expand}
          overflow={column.overflow}
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
            " flex flex-wrap gap-[.375rem] py-2.5 content-start",
            {
              "flex-1 min-w-48": !column.width,
            }
          )}
          style={
            column.width ? { width: column.width, minWidth: column.width } : {}
          }
          isLastRow={isLastRow}
          expand={column.expand}
          overflow={column.overflow}
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
                    // Setting overflow ellipsis/clip overrides the container to use
                    // block instead of flex, which makes the "gap" property not work.
                    // Hence, we manually add the same spacing here. We don't use
                    // this for dynamic overflow since "gap" also applies vertical spacing
                    // while this only applies horizontal spacing (which is fine since
                    // ellipsis/clip already truncate the cell to one line).
                    "ml-[0.375rem]":
                      idx > 0 &&
                      (column.overflow === "ellipsis" ||
                        column.overflow === "clip"),
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
          })}
          style={
            column.width ? { width: column.width, minWidth: column.width } : {}
          }
          isLastRow={isLastRow}
          expand={column.expand}
          overflow={column.overflow}
        >
          {formatted}
        </RowCell>
      );
    }
  }
}

export default DataCell;
