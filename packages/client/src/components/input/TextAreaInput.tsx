import { Field, Textarea as HeadlessTextArea } from "@headlessui/react";
import { classNames } from "~/utils/classNames";

import { IOComponent } from "~/components/io-component";
import { useState } from "react";

function TextAreaInput({
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
      <div className="relative flex">
        <HeadlessTextArea
          value={value === null ? "" : value}
          placeholder={placeholder ?? undefined}
          onChange={(e) =>
            setValue(e.target.value === "" ? null : e.target.value)
          }
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={classNames(
            // text-base on mobile prevents zooming when focusing on the input
            "rounded-brand border px-2 py-1 text-base/6 sm:text-sm/6 text-brand-neutral w-full bg-brand-io outline-none focus:ring-brand-primary-heavy focus:ring-2 focus:ring-offset-0 h-32",
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
              ((e.metaKey && e.key === "Enter") ||
                (e.ctrlKey && e.key === "Enter")) &&
              onEnter !== null
            ) {
              setAttemptedSubmit(true);
              onEnter();
            }
          }}
          data-testid={testId}
        ></HeadlessTextArea>
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
          Press {/Mac/i.test(navigator.userAgent) ? "⌘" : "ctrl"} + enter to
          submit{didSubmit ? " again" : ""}
        </IOComponent.HelpMessage>
      )}
    </Field>
  );
}

export default TextAreaInput;
