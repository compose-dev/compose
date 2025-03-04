import { classNames } from "~/utils/classNames";

function HeaderCell({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={classNames(
        "px-2 py-2 border-b border-brand-neutral flex items-center bg-brand-overlay font-medium",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export default HeaderCell;
