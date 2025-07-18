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
  left = null,
  onEnter = null,
  type = TYPE.TEXT,
  testId,
  postFix = null,
  showFocusRing = true,
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
  left?: React.ReactNode;
  onEnter?: (() => void) | null;
  type?: Type;
  testId?: string;
  postFix?: React.ReactNode;
  showFocusRing?: boolean;
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
        {left !== null && (
          <div className="absolute left-2 top-1/2 -translate-y-1/2">{left}</div>
        )}
        <div
          className={classNames(
            "flex w-full rounded-brand focus-within:ring-brand-primary-heavy",
            {
              "focus-within:ring-2": showFocusRing,
            }
          )}
        >
          <HeadlessInput
            value={value === null ? "" : value}
            placeholder={placeholder ?? undefined}
            onChange={(e) =>
              setValue(e.target.value === "" ? null : e.target.value)
            }
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={classNames(
              "rounded-l-brand border px-2 py-1 text-base/6 sm:text-sm/6 text-brand-neutral w-full bg-brand-io outline-none",
              {
                "border-brand-error": hasError,
                "border-brand-neutral": !hasError,
                "pr-8": right !== null && postFix === null,
                "pl-8": left !== null,
                "bg-brand-io-disabled": disabled,
                "rounded-r-brand": postFix === null,
                "rounded-r-none border-r-0": postFix !== null,
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
          {postFix !== null && (
            <div className="flex items-center px-3 border border-brand-neutral rounded-r-brand bg-brand-io-disabled text-brand-neutral-2 text-sm">
              {postFix}
            </div>
          )}
        </div>
        {right !== null && postFix === null && (
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
