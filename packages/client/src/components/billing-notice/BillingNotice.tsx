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
        "flex flex-col space-y-4 p-4 rounded bg-brand-overlay text-sm",
        className
      )}
    >
      <div className="flex flex-row space-x-1 items-center">
        <Icon name="coin" color="brand-neutral" size="lg" />
        <p className="font-medium">Billing</p>
      </div>
      <p className="text-brand-neutral-2">{children}</p>
    </div>
  );
}
