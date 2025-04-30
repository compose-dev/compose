import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import Icon from "~/components/icon";
import { classNames } from "~/utils/classNames";

const LABEL_VARIANT = {
  primary: "neutral",
  ghost: "ghost",
} as const;

type LabelVariant = (typeof LABEL_VARIANT)[keyof typeof LABEL_VARIANT];

function DropdownMenu({
  label,
  options,
  labelVariant = "neutral",
  dropdownAnchor = "bottom end",
  className = "",
  menuClassName = "",
}: {
  label: React.ReactNode;
  options: {
    label: string;
    left?: React.ReactNode;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    variant?: "neutral" | "error" | "warning" | "success" | "primary";
  }[];
  labelVariant?: LabelVariant;
  dropdownAnchor?: "bottom end" | "bottom start";
  className?: string;
  menuClassName?: string;
}) {
  return (
    <Menu>
      {labelVariant !== "ghost" && (
        <MenuButton
          className={classNames(
            "inline-flex items-center text-base/6 rounded-brand px-2 py-1 bg-brand-overlay focus:outline-none data-[hover]:bg-brand-overlay-2 data-[open]:bg-brand-overlay-2 data-[focus]:outline-1 data-[focus]:outline-brand-neutral-2",
            className
          )}
        >
          <p className="text-brand-neutral-button mr-4">{label}</p>
          <Icon name="chevron-down" color="brand-neutral-2" />
        </MenuButton>
      )}
      {labelVariant === "ghost" && (
        <MenuButton className={classNames(className)}>{label}</MenuButton>
      )}
      <Transition
        enter="transition ease-out duration-75"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <MenuItems
          anchor={dropdownAnchor}
          className={classNames(
            "w-48 origin-top-right border-brand rounded-brand border-brand-neutral bg-brand-io p-1 text-base/6 text-brand-neutral [--anchor-gap:4px] focus:outline-none z-30",
            menuClassName
          )}
        >
          {options.map((option) => (
            <MenuItem key={option.label}>
              <button
                className={classNames(
                  "group flex w-full items-center gap-2 rounded-brand py-1.5 px-3 data-[focus]:bg-brand-overlay-2 text-sm text-left",
                  {
                    "text-brand-neutral": option.variant === "neutral",
                    "text-brand-error": option.variant === "error",
                    "text-brand-warning": option.variant === "warning",
                    "text-brand-success": option.variant === "success",
                    "text-brand-primary": option.variant === "primary",
                  }
                )}
                onClick={option.onClick}
              >
                {option.left && option.left}
                {option.label}
              </button>
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  );
}

export default DropdownMenu;
