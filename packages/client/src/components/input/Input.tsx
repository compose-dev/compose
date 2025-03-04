import { Field, Input as HeadlessInput } from "@headlessui/react";
import { classNames } from "~/utils/classNames";

import { IOComponent } from "~/components/io-component";
import { useState } from "react";

const TYPE = {
  TEXT: "text",
  PASSWORD: "password",
  DATE: "date",
  TIME: "time",
  DATETIME: "datetime-local",
} as const;

type Type = (typeof TYPE)[keyof typeof TYPE];

function Input({
  label,
  value,
  setValue,
  placeholder = null,
  disabled = false,
  description = null,
  hasError = false,
  errorMessage = null,
  rootClassName = "",
  inputClassName = "",
  right = null,
  onEnter = null,
  type = TYPE.TEXT,
  testId,
}: {
  label: string | null;
  value: string | null;
  setValue: (val: string | null) => void;
  placeholder?: string | null;
  disabled?: boolean;
  description?: string | null;
  hasError?: boolean;
  errorMessage?: string | null;
  rootClassName?: string;
  inputClassName?: string;
  right?: React.ReactNode;
  onEnter?: (() => void) | null;
  type?: Type;
  testId?: string;
}) {
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const didSubmit = !hasError && attemptedSubmit;

  const showErrorMessage = errorMessage !== null && hasError;
  const showOnEnterMessage = onEnter !== null && !showErrorMessage && isFocused;

  return (
    <Field
      disabled={disabled}
      className={classNames("flex flex-col w-full", rootClassName)}
    >
      {label !== null && (
        <IOComponent.Label as="HeadlessUILabel">{label}</IOComponent.Label>
      )}
      {description !== null && (
        <IOComponent.Description>{description}</IOComponent.Description>
      )}
      <div className="relative">
        <HeadlessInput
          value={value === null ? "" : value}
          placeholder={placeholder ?? undefined}
          onChange={(e) =>
            setValue(e.target.value === "" ? null : e.target.value)
          }
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={classNames(
            // text-base on mobile prevents zooming when focusing on the input
            "rounded-brand border px-2 py-1 text-base/6 sm:text-sm/6 text-brand-neutral w-full bg-brand-io outline-none focus:ring-brand-primary-heavy focus:ring-2 focus:ring-offset-0",
            {
              "border-brand-error": hasError,
              "border-brand-neutral": !hasError,
              "pr-8": right !== null,
              "bg-brand-io-disabled": disabled,
            },
            inputClassName
          )}
          onKeyDown={(e) => {
            if (
              (e.key === "Enter" || e.key === "NumpadEnter") &&
              onEnter !== null
            ) {
              setAttemptedSubmit(true);
              onEnter();
            }
          }}
          type={type}
          data-testid={testId}
        ></HeadlessInput>
        {right !== null && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {right}
          </div>
        )}
      </div>
      {showErrorMessage && (
        <IOComponent.Error>{errorMessage}</IOComponent.Error>
      )}
      {showOnEnterMessage && (
        <IOComponent.HelpMessage>
          Press enter to submit{didSubmit ? " again" : ""}
        </IOComponent.HelpMessage>
      )}
    </Field>
  );
}

export default Input;
