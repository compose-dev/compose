import React, { useState } from "react";
import Icon from "~/components/icon";
import { classNames } from "~/utils/classNames";

interface ToggleDetailsProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const ToggleDetails: React.FC<ToggleDetailsProps> = ({
  title,
  children,
  defaultOpen = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={classNames(
        "border rounded-brand border-brand-neutral overflow-hidden",
        className ?? ""
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center gap-x-2 text-left hover:bg-brand-overlay transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <div
          className={classNames("transition-transform duration-200", {
            "rotate-90": isOpen,
          })}
        >
          <Icon name="chevron-right" size="0.75" color="brand-neutral-2" />
        </div>
        <div className="text-brand-neutral">{title}</div>
      </button>

      <div
        className={classNames(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 pb-4 pt-0">
          <div className="border-t border-brand-neutral pt-4">{children}</div>
        </div>
      </div>
    </div>
  );
};
