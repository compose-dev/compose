import { ReactNode, useMemo } from "react";
import { classNames } from "~/utils/classNames";

function TextBubble({
  caratDirection,
  children,
  animate = "bounce",
}: {
  caratDirection: "up" | "down";
  children: ReactNode;
  animate?: "bounce" | "none";
}) {
  const caratBorderStyle = useMemo(() => {
    const style =
      "absolute left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent";
    if (caratDirection === "up") {
      return `${style} bottom-full border-b-8 border-b-brand-primary`;
    }
    // down
    return `${style} top-full border-t-8 border-t-brand-primary`;
  }, [caratDirection]);

  const caratFillStyle = useMemo(() => {
    const style =
      "absolute left-1/2 -translate-x-1/2 w-0 h-0 border-x-[7px] border-x-transparent";
    if (caratDirection === "up") {
      return `${style} bottom-[calc(100%-1px)] border-b-[7px] border-b-blue-200 dark:border-b-blue-900`;
    }
    // down
    return `${style} top-[calc(100%-1px)] border-t-[7px] border-t-blue-200 dark:border-t-blue-900`;
  }, [caratDirection]);

  return (
    <div
      className={classNames("flex", {
        "animate-bounce": animate === "bounce",
      })}
    >
      <div className="relative bg-blue-200 dark:bg-blue-900 rounded-lg border border-brand-primary p-3">
        {/* Carat border */}
        <div className={caratBorderStyle} />
        {/* Carat fill */}
        <div className={caratFillStyle} />
        <p className="text-sm text-blue-950 dark:text-white/80">{children}</p>
      </div>
    </div>
  );
}

export default TextBubble;
