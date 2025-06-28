import Icon from "~/components/icon";
import { classNames } from "~/utils/classNames";

function Alert({
  appearance,
  iconName,
  children,
  className = "",
}: {
  appearance: "warning" | "primary" | "neutral" | "success" | "danger";
  iconName: Parameters<typeof Icon>[0]["name"];
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "rounded-brand p-4 flex flex-row gap-x-2 items-start relative",
        {
          "text-brand-warning": appearance === "warning",
          "text-brand-primary": appearance === "primary",
          "text-brand-success": appearance === "success",
          "text-brand-error": appearance === "danger",
          "text-brand-neutral-2 bg-brand-overlay": appearance === "neutral",
        },
        className
      )}
    >
      <div>
        <Icon
          name={iconName}
          color={
            appearance === "warning"
              ? "brand-warning"
              : appearance === "primary"
                ? "brand-primary"
                : appearance === "success"
                  ? "brand-success"
                  : appearance === "danger"
                    ? "brand-error"
                    : "brand-neutral-2"
          }
          size="1.25"
        />
      </div>
      <p className="text-sm">{children}</p>
      <div
        className={classNames(
          "absolute inset-0 rounded-brand pointer-events-none",
          {
            "bg-brand-warning opacity-10": appearance === "warning",
            "bg-brand-primary opacity-10": appearance === "primary",
            "bg-brand-success opacity-10": appearance === "success",
            "bg-brand-error opacity-10": appearance === "danger",
            "bg-brand-transparent": appearance === "neutral",
          }
        )}
      ></div>
    </div>
  );
}

export default Alert;
