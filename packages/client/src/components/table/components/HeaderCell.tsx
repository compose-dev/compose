import Icon from "~/components/icon";
import { classNames } from "~/utils/classNames";

function HeaderCell({
  children,
  className = "",
  style = {},
  onClick = () => {},
  sortDirection = false,
  nextSortDirection = false,
  isSortable = false,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  sortDirection?: "asc" | "desc" | false;
  nextSortDirection?: "asc" | "desc" | false;
  isSortable?: boolean;
}) {
  return (
    <div
      className={classNames(
        "px-2 py-2 border-b border-brand-neutral flex items-center bg-brand-overlay font-medium group",
        {
          "cursor-pointer": isSortable,
        },
        className
      )}
      style={style}
      onClick={onClick}
    >
      {children}
      {isSortable && !sortDirection && (
        <div className={classNames("ml-1 hidden group-hover:block")}>
          <Icon
            name={nextSortDirection === "asc" ? "arrow-up" : "arrow-down"}
            size="1.125"
            color="brand-neutral-3"
            stroke="semi-bold"
          />
        </div>
      )}
      {isSortable && sortDirection && (
        <div className="ml-1">
          <Icon
            name={sortDirection === "asc" ? "arrow-up" : "arrow-down"}
            size="1.125"
            stroke="semi-bold"
          />
        </div>
      )}
    </div>
  );
}

export default HeaderCell;
