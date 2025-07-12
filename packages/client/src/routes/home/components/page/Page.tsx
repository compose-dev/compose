import { classNames } from "~/utils/classNames";

function PageRoot({
  children,
  width = "md",
  gap = "12",
}: {
  children: React.ReactNode;
  width?: "sm" | "md" | "lg" | "full";
  gap?: "8" | "10" | "12" | "16" | "24";
}) {
  return (
    <div className="flex justify-center">
      <div
        className={classNames(
          "flex flex-col justify-start items-start py-16 px-4 lg:px-8 w-full",
          {
            "max-w-4xl": width === "sm",
            "max-w-5xl": width === "md",
            "max-w-7xl": width === "lg",
            "gap-8": gap === "8",
            "gap-10": gap === "10",
            "gap-12": gap === "12",
            "gap-16": gap === "16",
            "gap-24": gap === "24",
          }
        )}
      >
        {children}
      </div>
    </div>
  );
}

function PageTitle({ children }: { children: React.ReactNode }) {
  return <h2>{children}</h2>;
}

function PageSubtitle({
  children,
  color = "neutral",
  id,
}: {
  children: React.ReactNode;
  color?: "neutral" | "primary" | "secondary";
  id?: string;
}) {
  return (
    <h3
      className={classNames("text-brand-neutral", {
        "text-brand-primary": color === "primary",
        "text-brand-neutral-2": color === "secondary",
      })}
      id={id}
    >
      {children}
    </h3>
  );
}

export { PageRoot as Root, PageTitle as Title, PageSubtitle as Subtitle };
