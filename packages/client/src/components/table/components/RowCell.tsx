import { classNames } from "~/utils/classNames";

function RowCell({
  children,
  isLastRow = false,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  isLastRow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={classNames(
        "px-2 py-2 flex break-all text-brand-neutral",
        {
          "first:rounded-bl-brand last:rounded-br-brand": isLastRow,
        },
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export default RowCell;
