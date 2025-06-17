import { classNames } from "~/utils/classNames";

function PageRoot({
  children,
  width = "md",
}: {
  children: React.ReactNode;
  width?: "md" | "lg" | "full";
}) {
  return (
    <div className="flex justify-center">
      <div
        className={classNames(
          "flex flex-col justify-start items-start py-16 px-4 lg:px-8 gap-12 w-full",
          {
            "max-w-5xl": width === "md",
            "max-w-7xl": width === "lg",
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
}: {
  children: React.ReactNode;
  color?: "neutral" | "primary";
}) {
  return (
    <h3
      className={classNames("text-brand-neutral", {
        "text-brand-primary": color === "primary",
      })}
    >
      {children}
    </h3>
  );
}

export { PageRoot as Root, PageTitle as Title, PageSubtitle as Subtitle };
