import { classNames } from "~/utils/classNames";
import Icon from "../icon";

interface InlineLinkProps {
  children: React.ReactNode;
  url: string;
  newTab?: boolean;
  appearance?: "primary" | "secondary" | "success";
  alwaysUnderline?: boolean;
  showLinkIcon?: boolean;
}

function InlineLink({
  children,
  url,
  appearance = "primary",
  newTab = true,
  alwaysUnderline = undefined,
  showLinkIcon = false,
}: InlineLinkProps) {
  return (
    <a
      className={classNames(
        "cursor-pointer hover:underline inline-flex items-center gap-x-1",
        {
          "text-brand-primary hover:text-brand-primary-heavy":
            appearance === "primary",
          "text-brand-neutral-2 hover:text-brand-neutral-2":
            appearance === "secondary",
          "text-brand-success hover:text-brand-success-heavy":
            appearance === "success",
          underline:
            alwaysUnderline === true ||
            (alwaysUnderline === undefined && appearance === "secondary"),
        }
      )}
      href={url}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
    >
      {children}
      {showLinkIcon && (
        <Icon
          name="external-link"
          color={
            appearance === "primary"
              ? "brand-primary"
              : appearance === "secondary"
                ? "brand-neutral-2"
                : appearance === "success"
                  ? "brand-success"
                  : "brand-neutral"
          }
          size="1.125"
        />
      )}
    </a>
  );
}

export default InlineLink;
