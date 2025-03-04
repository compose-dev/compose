import { Label } from "@headlessui/react";
import { classNames } from "~/utils/classNames";

function IOLabel({
  children,
  as = "p",
}: {
  children: React.ReactNode;
  as?: "p" | "HeadlessUILabel";
}) {
  if (as === "p") {
    return <p className="text-brand-neutral mb-1 text-base/6">{children}</p>;
  }

  return (
    <div className="mb-1">
      <Label className="text-brand-neutral text-base/6">{children}</Label>
    </div>
  );
}

function IODescription({
  children,
  as = "p",
  className = "",
}: {
  children: React.ReactNode;
  as?: "p";
  className?: string;
}) {
  if (as === "p") {
    return (
      <p
        className={classNames(
          "text-brand-neutral-2 mb-1 text-sm/6 -mt-1",
          className
        )}
      >
        {children}
      </p>
    );
  }
}

function IOError({ children }: { children: React.ReactNode }) {
  return <p className="text-brand-error text-sm/6 mt-1">{children}</p>;
}

function IOHelpMessage({ children }: { children: React.ReactNode }) {
  return <p className="text-brand-neutral-2 text-sm/6 mt-1">{children}</p>;
}

export {
  IOLabel as Label,
  IODescription as Description,
  IOError as Error,
  IOHelpMessage as HelpMessage,
};
