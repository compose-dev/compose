import Icon from "~/components/icon";
import { classNames } from "~/utils/classNames";

function Alert({
  appearance,
  iconName,
  children,
}: {
  appearance: "warning" | "primary" | "outline" | "success" | "danger";
  iconName: Parameters<typeof Icon>[0]["name"];
  children: string;
}) {
  return (
    <div
      className={classNames(
        "border rounded-brand p-2 flex flex-row gap-x-2 items-center relative",
        {
          "border-brand-warning text-brand-warning": appearance === "warning",
          "border-brand-primary text-brand-primary": appearance === "primary",
          "border-brand-success text-brand-success": appearance === "success",
          "border-brand-error text-brand-error": appearance === "danger",
          "border-brand-neutral text-brand-neutral": appearance === "outline",
        }
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
                    : "brand-neutral"
          }
          size="1.25"
        />
      </div>
      <p className="text-sm">{children}</p>
      <div
        className={classNames("absolute inset-0", {
          "bg-brand-warning opacity-10": appearance === "warning",
          "bg-brand-primary opacity-10": appearance === "primary",
          "bg-brand-success opacity-10": appearance === "success",
          "bg-brand-error opacity-10": appearance === "danger",
          "bg-brand-overlay": appearance === "outline",
        })}
      ></div>
    </div>
  );
}

export default Alert;
