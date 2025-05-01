import React from "react";
import { classNames } from "~/utils/classNames";

function CheckboxRaw({
  enabled,
  setEnabled,
  disabled = false,
  hasError = false,
}: {
  enabled: boolean;
  setEnabled: (
    enabled: boolean,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  disabled?: boolean;
  hasError?: boolean;
}) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnabled(event.target.checked, event);
  };

  return (
    <label
      className={classNames(
        "group relative",
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
    >
      <input
        type="checkbox"
        checked={enabled}
        onChange={handleChange}
        disabled={disabled}
        className="peer absolute size-0 opacity-0" // Hide the default checkbox
      />
      {/* Custom checkbox appearance */}
      <span
        className={classNames(
          "block size-4 min-w-4 min-h-4 rounded-brand border transition-colors duration-100 ease-in-out",
          // Base state & Error state
          {
            "border-brand-error": hasError,
            "border-brand-neutral": !hasError,
            "bg-brand-io": !disabled,
            "bg-brand-io-disabled": disabled,
          },
          // Checked state
          "peer-checked:bg-brand-btn-primary",
          // Focus state (applied via peer)
          "peer-focus-visible:outline-none peer-focus-visible:ring-brand-primary-heavy peer-focus-visible:ring-offset-0 peer-focus-visible:ring-2"
        )}
        aria-hidden="true" // Hide from screen readers as the input is the semantic element
      >
        {/* Checkmark icon */}
        <svg
          className={classNames(
            "stroke-white w-full h-full transition-opacity duration-100 ease-in-out",
            enabled ? "opacity-100" : "opacity-0" // Control visibility based on 'enabled' state directly
          )}
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
      </span>
    </label>
  );
}

export default CheckboxRaw;
