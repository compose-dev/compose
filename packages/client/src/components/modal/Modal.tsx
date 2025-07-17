import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { classNames } from "~/utils/classNames";
import Icon from "../icon";
import Button from "../button";

function ModalRoot({
  children,
  isOpen,
  onClose,
  width = "md",
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
  width?: "sm" | "md" | "lg" | "xl" | "2xl";
}) {
  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={onClose}
      // Fix: when opening multiple modals on top of each other on mobile, the topmost modal
      // would not scroll (e.g. if the content is too long).
      // This is a workaround to fix that.
      // See: https://github.com/tailwindlabs/headlessui/issues/3378
      onTouchMove={(e) => {
        e.stopPropagation();
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <DialogBackdrop className="fixed inset-0 bg-black/30 dark:bg-black/60 animate-opacity-in" />
        <div className="flex min-h-full items-center justify-center p-6 sm:p-8">
          <DialogPanel
            className={classNames(
              "w-full rounded-brand backdrop-blur-2xl animate-slide-fade-in-modal overflow-clip border border-brand-neutral",
              {
                "max-w-md": width === "sm",
                "max-w-lg": width === "md",
                "max-w-xl": width === "lg",
                "max-w-3xl": width === "xl",
                "max-w-5xl": width === "2xl",
              }
            )}
            style={{
              scrollbarWidth: "thin",
            }}
          >
            <div
              // The "-2px" in the height is to account for the border.
              className="w-full h-full modal-height overflow-y-auto bg-brand-page px-6 sm:px-8 pb-6 sm:pb-8"
              style={{ scrollbarWidth: "thin" }}
            >
              {children}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

function ModalHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "gap-2 pt-6 sm:pt-8 bg-brand-page pb-2 sticky z-10 top-0",
        className || ""
      )}
    >
      {children}
    </div>
  );
}

function ModalTitle({ children }: { children: React.ReactNode }) {
  return (
    <DialogTitle as="h3" className="text-xl/7 font-medium text-brand-neutral">
      {children}
    </DialogTitle>
  );
}

function ModalCloseIcon({
  onClick,
}: {
  onClick: React.ComponentProps<typeof Button>["onClick"];
}) {
  return (
    <Button variant="ghost" onClick={onClick}>
      <Icon name="x" color="brand-neutral-2" size="0.75" />
    </Button>
  );
}

function ModalCloseableHeader({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: React.ComponentProps<typeof ModalCloseIcon>["onClick"];
}) {
  return (
    <ModalHeader className="flex flex-row justify-between items-center">
      <ModalTitle>{children}</ModalTitle>
      <ModalCloseIcon onClick={onClose} />
    </ModalHeader>
  );
}

function ModalSubtitle({ children }: { children: React.ReactNode }) {
  return <p className="text-brand-neutral-2">{children}</p>;
}

function ModalBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "flex flex-col gap-y-4 text-brand-neutral pt-2 modal-body",
        className || ""
      )}
    >
      {children}
    </div>
  );
}

function ModalRawBody({ children }: { children: React.ReactNode }) {
  return <div className="pt-2 modal-body">{children}</div>;
}

export {
  ModalRoot as Root,
  ModalHeader as Header,
  ModalTitle as Title,
  ModalSubtitle as Subtitle,
  ModalCloseIcon as CloseIcon,
  ModalBody as Body,
  ModalCloseableHeader as CloseableHeader,
  ModalRawBody as RawBody,
};
