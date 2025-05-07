import { classNames } from "~/utils/classNames";

function RowCell({
  children,
  overflow,
  density,
  isLastRow = false,
  className = "",
  style = {},
  expand = false,
}: {
  children: React.ReactNode;
  overflow: "clip" | "ellipsis" | "dynamic";
  density: "compact" | "standard" | "comfortable";
  isLastRow?: boolean;
  className?: string;
  style?: React.CSSProperties;
  expand?: boolean;
}) {
  return (
    <div
      className={classNames(
        "px-2 flex break-all text-brand-neutral",
        {
          "first:rounded-bl-brand last:rounded-br-brand": isLastRow,
          "truncate !block": overflow === "ellipsis",
          "overflow-hidden whitespace-nowrap text-clip !block":
            overflow === "clip",
          "flex-1": expand === true,
          "py-2": density === "compact",
          "py-2.5": density === "standard",
          "py-3": density === "comfortable",
        },
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export default RowCell;
