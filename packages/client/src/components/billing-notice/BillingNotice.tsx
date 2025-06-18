import Icon from "~/components/icon";
import { classNames } from "~/utils/classNames";

/**
 * A simple notice that displays a billing-related message to the user inside
 * a card UI.
 */
export default function BillingNotice({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={classNames(
        "flex flex-row items-start gap-x-2 p-4 rounded bg-brand-overlay text-sm",
        className
      )}
    >
      <div>
        <Icon name="coin" color="brand-neutral-2" size="1.25" />
      </div>
      <p className="text-brand-neutral-2">{children}</p>
    </div>
  );
}
