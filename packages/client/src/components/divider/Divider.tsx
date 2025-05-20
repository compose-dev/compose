import { classNames } from "~/utils/classNames";

function Divider({
  orientation = "horizontal",
  thickness = "thin",
  style,
}: {
  orientation?: "horizontal" | "vertical";
  thickness?: "thin" | "medium" | "thick";
  style?: React.CSSProperties | null;
}) {
  if (orientation === "horizontal") {
    return (
      <hr
        className={classNames("border-brand-neutral w-full", {
          "border-t": thickness === "thin",
          "border-t-2": thickness === "medium",
          "border-t-4": thickness === "thick",
        })}
        style={{
          margin: "0.5rem 0",
          ...(style || undefined),
        }}
      />
    );
  }

  return (
    <div
      className={classNames("border-brand-neutral h-full", {
        "border-l": thickness === "thin",
        "border-l-2": thickness === "medium",
        "border-l-4": thickness === "thick",
      })}
      style={{
        margin: "0 0.5rem",
        ...(style || undefined),
      }}
    />
  );
}

export default Divider;
