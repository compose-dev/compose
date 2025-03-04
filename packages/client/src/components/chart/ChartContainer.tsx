import { classNames } from "~/utils/classNames";
import { IOComponent } from "../io-component";
import { COLORS } from "./constants";

export default function ChartContainer({
  children,
  label,
  description,
  legend,
}: {
  children: React.ReactNode;
  label?: string;
  description?: string;
  legend: string[];
}) {
  function getColor(idx: number) {
    return COLORS[idx % COLORS.length];
  }

  return (
    <div className={classNames("flex flex-col self-stretch flex-1 h-full")}>
      {label && <IOComponent.Label>{label}</IOComponent.Label>}
      {description && (
        <IOComponent.Description>{description}</IOComponent.Description>
      )}
      <div className="w-full border border-brand-neutral rounded-brand bg-brand-io flex-1 flex flex-col">
        <div className="w-full flex flex-row p-4 pb-1 justify-center items-center flex-wrap gap-4 md:gap-8 md:gap-y-4 text-sm">
          {legend.map((item, idx) => (
            <div
              className="flex flex-row gap-2 items-center"
              key={`legend-${idx}`}
            >
              <div
                style={{
                  backgroundColor: getColor(idx),
                }}
                className="w-4 h-4"
              />
              <div className="text-brand-text-neutral">{item}</div>
            </div>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}
