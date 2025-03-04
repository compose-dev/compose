import { classNames } from "~/utils/classNames";

interface InlineLinkProps {
  children: React.ReactNode;
  url: string;
  newTab?: boolean;
  appearance?: "primary" | "secondary" | "success";
}

function InlineLink({
  children,
  url,
  appearance = "primary",
  newTab = true,
}: InlineLinkProps) {
  return (
    <a
      className={classNames("cursor-pointer hover:underline", {
        "text-brand-primary hover:text-brand-primary-heavy":
          appearance === "primary",
        "text-brand-neutral-2 hover:text-brand-neutral":
          appearance === "secondary",
        "text-brand-success hover:text-brand-success-heavy":
          appearance === "success",
      })}
      href={url}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

export default InlineLink;
