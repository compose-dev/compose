import Icon from "~/components/icon";
import { classNames } from "~/utils/classNames";
import { UI } from "@composehq/ts-public";

function HeaderCell({
  children,
  density,
  className = "",
  style = {},
  onClick = () => {},
  sortDirection = false,
  nextSortDirection = false,
  isSortable = false,
}: {
  children: React.ReactNode;
  density: UI.Table.Density;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  sortDirection?: "asc" | "desc" | false;
  nextSortDirection?: "asc" | "desc" | false;
  isSortable?: boolean;
}) {
  const iconSize =
    density === UI.Table.DENSITY.COMPACT
      ? "0.875"
      : density === UI.Table.DENSITY.STANDARD
        ? "1"
        : "1.125";

  return (
    <div
      className={classNames(
        "px-2 border-b border-brand-neutral flex items-center bg-brand-overlay font-medium group",
        {
          "cursor-pointer": isSortable,
          "py-2":
            density === UI.Table.DENSITY.STANDARD ||
            density === UI.Table.DENSITY.COMPACT,
          "py-3": density === UI.Table.DENSITY.COMFORTABLE,
        },
        className
      )}
      style={style}
      onClick={onClick}
    >
      <p>{children}</p>
      {isSortable && !sortDirection && (
        <div
          className={classNames("hidden group-hover:block", {
            "ml-1": density !== UI.Table.DENSITY.COMPACT,
            "ml-0.5": density === UI.Table.DENSITY.COMPACT,
          })}
        >
          <Icon
            name={nextSortDirection === "asc" ? "arrow-up" : "arrow-down"}
            size={iconSize}
            color="brand-neutral-3"
            stroke="semi-bold"
          />
        </div>
      )}
      {isSortable && sortDirection && (
        <div
          className={classNames({
            "ml-1": density !== UI.Table.DENSITY.COMPACT,
            "ml-0.5": density === UI.Table.DENSITY.COMPACT,
          })}
        >
          <Icon
            name={sortDirection === "asc" ? "arrow-up" : "arrow-down"}
            size={iconSize}
            stroke="semi-bold"
          />
        </div>
      )}
    </div>
  );
}

export default HeaderCell;
