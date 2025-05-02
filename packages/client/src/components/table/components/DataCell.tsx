import { UI } from "@composehq/ts-public";
import RowCell from "./RowCell";
import { classNames } from "~/utils/classNames";
import { TableColumnProp, COLUMN_WIDTH } from "../utils";
import Icon from "~/components/icon";
import { u } from "@compose/ts";
import Json from "~/components/json";

function CircleCheck({ density }: { density: UI.Table.Density }) {
  return (
    <div
      className={classNames("flex items-center", {
        "h-6": density === "comfortable",
        "h-5": density === "standard",
        "h-4": density === "compact",
      })}
    >
      <Icon
        name="checkmark"
        color="brand-success"
        stroke="semi-bold"
        size={density === "compact" ? "0.875" : "1"}
      />
    </div>
  );
}

function CircleX({ density }: { density: UI.Table.Density }) {
  return (
    <div
      className={classNames("flex items-center", {
        "h-6": density === "comfortable",
        "h-5": density === "standard",
        "h-4": density === "compact",
      })}
    >
      <Icon
        name="x"
        color="brand-error"
        stroke="bold"
        size={density === "compact" ? "0.625" : "0.75"}
      />
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
  density,
  isLastRow,
  pinned,
}: {
  value: unknown;
  column: TableColumnProp;
  meta: Record<string, string>;
  density: UI.Table.Density;
  isLastRow: boolean;
  pinned: UI.Table.PinnedSide | false;
}) {
  function getStyle() {
    if (pinned) {
      if (column.pinnedWidth) {
        return {
          width: column.pinnedWidth,
          maxWidth: column.pinnedWidth,
        };
      } else {
        if (column.format === UI.Table.COLUMN_FORMAT.json) {
          return {
            width: COLUMN_WIDTH.JSON,
            maxWidth: COLUMN_WIDTH.JSON,
          };
        } else {
          return {
            width: COLUMN_WIDTH.DEFAULT,
            maxWidth: COLUMN_WIDTH.DEFAULT,
          };
        }
      }
    }

    if (column.width) {
      return {
        width: column.width,
        minWidth: column.width,
      };
    }

    if (column.format === UI.Table.COLUMN_FORMAT.json) {
      return {
        flex: "1 1 0%",
        minWidth: COLUMN_WIDTH.JSON,
      };
    }

    return {
      flex: "1 1 0%",
      minWidth: COLUMN_WIDTH.DEFAULT,
    };
  }

  const style = getStyle();

  if (value === null || value === undefined || value === "") {
    if (column.format === UI.Table.COLUMN_FORMAT.boolean) {
      return (
        <RowCell
          style={style}
          isLastRow={isLastRow}
          expand={column.expand}
          overflow={column.overflow}
          density={density}
        >
          <CircleX density={density} />
        </RowCell>
      );
    }

    if (value === null) {
      return (
        <RowCell
          className={classNames({
            // If the format is string, we don't apply any special styling
            "!text-brand-error-heavy": column.format !== "string",
          })}
          style={style}
          isLastRow={isLastRow}
          expand={column.expand}
          overflow={column.overflow}
          density={density}
        >
          NULL
        </RowCell>
      );
    }

    return (
      <RowCell
        style={style}
        isLastRow={isLastRow}
        expand={column.expand}
        overflow={column.overflow}
        density={density}
      >
        <></>
      </RowCell>
    );
  }

  switch (column.format) {
    case UI.Table.COLUMN_FORMAT.date: {
      return (
        <RowCell
          style={style}
          isLastRow={isLastRow}
          expand={column.expand}
          overflow={column.overflow}
          density={density}
        >
          {meta[column.accessorKey]}
        </RowCell>
      );
    }
    case UI.Table.COLUMN_FORMAT.datetime: {
      return (
        <RowCell
          style={style}
          isLastRow={isLastRow}
          expand={column.expand}
          overflow={column.overflow}
          density={density}
        >
          {meta[column.accessorKey]}
        </RowCell>
      );
    }
    case UI.Table.COLUMN_FORMAT.currency: {
      const currency = u.string.formatCurrency(value as string);

      return (
        <RowCell
          style={style}
          isLastRow={isLastRow}
          expand={column.expand}
          overflow={column.overflow}
          density={density}
        >
          {currency}
        </RowCell>
      );
    }
    case UI.Table.COLUMN_FORMAT.number: {
      const number = u.string.formatNumber(value as string, 3);

      return (
        <RowCell
          style={style}
          isLastRow={isLastRow}
          expand={column.expand}
          overflow={column.overflow}
          density={density}
        >
          {number}
        </RowCell>
      );
    }
    case UI.Table.COLUMN_FORMAT.boolean: {
      const isTrue = !!value;

      return (
        <RowCell
          style={style}
          isLastRow={isLastRow}
          expand={column.expand}
          overflow={column.overflow}
          density={density}
        >
          {isTrue ? (
            <CircleCheck density={density} />
          ) : (
            <CircleX density={density} />
          )}
        </RowCell>
      );
    }
    case UI.Table.COLUMN_FORMAT.tag: {
      const arrayTags = Array.isArray(value) ? value : [value];

      return (
        <RowCell
          className={classNames(
            "flex flex-wrap gap-[.375rem] content-start leading-none",
            {
              "!py-3.5": density === "comfortable",
            }
          )}
          style={style}
          isLastRow={isLastRow}
          expand={column.expand}
          overflow={column.overflow}
          density={density}
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
                  "inline-flex items-center px-1.5 py-0.5 rounded-brand font-medium max-h-fit h-fit",
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
                    "text-[11px]": density === "compact",
                    "text-xs": density !== "compact",
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
    case UI.Table.COLUMN_FORMAT.json: {
      return (
        <RowCell
          style={style}
          className="font-mono"
          isLastRow={isLastRow}
          expand={column.expand}
          overflow={column.overflow}
          density={density}
        >
          {column.overflow === "dynamic" ? (
            <Json
              json={value}
              label={null}
              bare={true}
              copyable={false}
              size={density === "compact" ? "xs" : "sm"}
            />
          ) : (
            JSON.stringify(value, null)
          )}
        </RowCell>
      );
    }
    default: {
      const formatted = formatStringCell(value);

      return (
        <RowCell
          style={style}
          isLastRow={isLastRow}
          expand={column.expand}
          overflow={column.overflow}
          density={density}
        >
          {formatted}
        </RowCell>
      );
    }
  }
}

export default DataCell;
