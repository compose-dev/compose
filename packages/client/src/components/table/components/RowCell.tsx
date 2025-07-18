import { useEffect, useRef, useState } from "react";
import { UI } from "@composehq/ts-public";
import { classNames } from "~/utils/classNames";

function RowCell({
  children,
  overflow = "ellipsis",
  density,
  isLastRow = false,
  className = "",
  style = {},
  expand = false,
  tooltipContent = null,
}: {
  children: React.ReactNode;
  overflow?: "clip" | "ellipsis" | "dynamic";
  density: "compact" | "standard" | "comfortable";
  isLastRow?: boolean;
  className?: string;
  style?: React.CSSProperties;
  expand?: boolean;
  tooltipContent?: string | null;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [tooltipAttributes, setTooltipAttributes] = useState<Record<
    string,
    string | number
  > | null>(null);

  useEffect(() => {
    if (
      !ref.current ||
      overflow === UI.Table.OVERFLOW_BEHAVIOR.DYNAMIC ||
      !tooltipContent
    ) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      if (ref.current) {
        if (ref.current.scrollWidth > ref.current.clientWidth) {
          setTooltipAttributes({
            "data-tooltip-id": "table-tooltip",
            "data-tooltip-html": tooltipContent,
          });
        } else {
          setTooltipAttributes(null);
        }
      }
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [overflow, tooltipContent]);

  return (
    <div
      ref={ref}
      className={classNames(
        // table-row-cell class is used to target the tooltip.
        "px-2 text-brand-neutral table-row-cell",
        {
          "first:rounded-bl-brand last:rounded-br-brand": isLastRow,
          "break-words": overflow === "dynamic",
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
      {...tooltipAttributes}
    >
      {children}
    </div>
  );
}

export default RowCell;
