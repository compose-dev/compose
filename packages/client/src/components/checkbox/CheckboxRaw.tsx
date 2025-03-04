import { Checkbox } from "@headlessui/react";
import { classNames } from "~/utils/classNames";

function CheckboxRaw({
  enabled,
  setEnabled,
  disabled = false,
  hasError = false,
}: {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  disabled?: boolean;
  hasError?: boolean;
}) {
  return (
    <Checkbox
      checked={enabled}
      onChange={setEnabled}
      className={classNames(
        "group block size-4 min-w-4 min-h-4 rounded-brand border-brand data-[checked]:bg-brand-btn-primary data-[focus]:outline-none data-[focus]:ring-brand-primary-heavy data-[focus]:ring-offset-0 data-[focus]:ring-2",
        {
          "border-brand-error": hasError,
          "border-brand-neutral": !hasError,
          "bg-brand-io": !disabled,
          "bg-brand-io-disabled": disabled,
        }
      )}
      disabled={disabled}
    >
      {/* Checkmark icon */}
      <svg
        className="stroke-white opacity-0 group-data-[checked]:opacity-100"
        viewBox="0 0 14 14"
        fill="none"
      >
        <path
          d="M3 8L6 11L11 3.5"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Checkbox>
  );
}

export default CheckboxRaw;
