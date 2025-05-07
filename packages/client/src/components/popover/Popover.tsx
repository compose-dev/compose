import {
  Popover as HeadlessPopover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { classNames } from "~/utils/classNames";

const POPOVER_ANCHOR = {
  "bottom-end": "bottom end",
  "bottom-start": "bottom start",
  "top-end": "top end",
  "top-start": "top start",
} as const;

type PopoverAnchor = (typeof POPOVER_ANCHOR)[keyof typeof POPOVER_ANCHOR];

const Root = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <HeadlessPopover className={classNames("relative", className)}>
      {children}
    </HeadlessPopover>
  );
};

const Trigger = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <PopoverButton
      className={classNames("block focus:outline-none", className)}
    >
      {children}
    </PopoverButton>
  );
};

const Panel = ({
  children,
  anchor = "bottom end",
  className = "",
}: {
  children: React.ReactNode;
  anchor?: PopoverAnchor;
  className?: string;
}) => {
  return (
    <Transition
      enter="transition ease-out duration-75"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <PopoverPanel
        anchor={anchor}
        className={classNames(
          "border-brand rounded-brand border-brand-neutral bg-brand-page p-4 text-base/6 [--anchor-gap:4px] focus:outline-none z-30 shadow [--anchor-padding:16px]",
          className
        )}
      >
        {children}
      </PopoverPanel>
    </Transition>
  );
};

const Popover = {
  Root,
  Trigger,
  Panel,
};

export default Popover;
