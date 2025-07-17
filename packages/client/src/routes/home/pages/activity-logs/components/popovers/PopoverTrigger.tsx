import { ComponentProps } from "react";
import Icon from "~/components/icon";
import { Popover } from "~/components/popover";
import { classNames } from "~/utils/classNames";

function PopoverTrigger({
  label,
  icon,
  viewOnly = false,
}: {
  label: string;
  icon: ComponentProps<typeof Icon>["name"];
  viewOnly: boolean;
}) {
  return (
    <Popover.Trigger>
      <div
        className={classNames(
          "border border-brand-neutral rounded-brand p-2 py-1 flex flex-row gap-2 items-center shadow-sm hover:bg-brand-overlay transition-colors",
          {
            "bg-brand-overlay": !!viewOnly,
          }
        )}
      >
        <Icon name={icon} color="brand-neutral" />
        <p className="text-brand-neutral">{label}</p>
        {!viewOnly && (
          <Icon name="chevron-down" color="brand-neutral" size="0.75" />
        )}
      </div>
    </Popover.Trigger>
  );
}

export default PopoverTrigger;
