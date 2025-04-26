import {
  ComboboxButton,
  Field,
  ComboboxInput as HeadlessComboboxInput,
  ComboboxOption as HeadlessComboboxOption,
  ComboboxOptions as HeadlessComboboxOptions,
} from "@headlessui/react";

import { SelectOption, SelectValue } from "~/components/.utils/selectUtils";
import { classNames } from "~/utils/classNames";
import Icon from "~/components/icon";
import { IOComponent } from "~/components/io-component";

interface ComboboxBaseProps<T extends SelectValue> {
  id: string;
  label: string | null;
  disabled: boolean;
  description?: string | null;
  hasError?: boolean;
  errorMessage?: string | null;
  rootClassName?: string;
  inputBoxClassName?: string;
  optionsBoxClassName?: string;
  options: SelectOption<NonNullable<T>>[];
}

function ComboboxRoot({
  label,
  children,
  description,
  rootClassName = "",
  hasError = false,
  errorMessage = null,
}: {
  label: ComboboxBaseProps<SelectValue>["label"];
  children: React.ReactNode;
  description?: ComboboxBaseProps<SelectValue>["description"];
  rootClassName?: ComboboxBaseProps<SelectValue>["rootClassName"];
  hasError?: ComboboxBaseProps<SelectValue>["hasError"];
  errorMessage?: ComboboxBaseProps<SelectValue>["errorMessage"];
}) {
  return (
    <Field className={classNames("flex flex-col", rootClassName)}>
      {label !== null && (
        <IOComponent.Label as="HeadlessUILabel">{label}</IOComponent.Label>
      )}
      {description !== null && (
        <IOComponent.Description>{description}</IOComponent.Description>
      )}
      {children}
      {hasError && errorMessage !== null && (
        <IOComponent.Error>{errorMessage}</IOComponent.Error>
      )}
    </Field>
  );
}

function ComboboxInputRoot({
  children,
  disabled,
  hasError = false,
  inputBoxClassName = "",
  id,
}: {
  children: React.ReactNode;
  disabled: ComboboxBaseProps<SelectValue>["disabled"];
  hasError?: ComboboxBaseProps<SelectValue>["hasError"];
  inputBoxClassName?: ComboboxBaseProps<SelectValue>["inputBoxClassName"];
  id: ComboboxBaseProps<SelectValue>["id"];
}) {
  return (
    <div className={classNames("relative", inputBoxClassName)}>
      <div
        className={classNames(
          // text-base on mobile prevents zooming when focusing on the input
          "border-brand rounded-brand py-1 text-base/6 sm:text-sm/6 text-brand-neutral w-full focus:outline-none data-[focus]:outline-none data-[focus]:ring-brand-primary-heavy data-[focus]:ring-2 data-[focus]:ring-offset-0 bg-brand-io",
          {
            "border-brand-error": hasError,
            "border-brand-neutral": !hasError,
            "bg-brand-io-disabled": disabled,
          }
        )}
        id={`${id}-inputRoot`}
      >
        {children}
      </div>
      <ComboboxButton className="group absolute bottom-3 right-0 px-2.5">
        <Icon name="chevron-down" color="brand-neutral-2" />
      </ComboboxButton>
    </div>
  );
}

function ComboboxInput({
  label,
  setQuery,
  ...props
}: {
  label: ComboboxBaseProps<SelectValue>["label"];
  setQuery: (value: string) => void;
} & React.ComponentProps<typeof HeadlessComboboxInput>) {
  return (
    <HeadlessComboboxInput
      aria-label={label}
      onChange={(event) => setQuery(event.target.value)}
      className="px-2 pr-8 border-none p-0 focus:outline-none w-full bg-transparent"
      {...props}
      onFocus={() => {
        const inputRoot = document.getElementById(`${props.id}-inputRoot`);
        if (inputRoot) {
          inputRoot.setAttribute("data-focus", "true");
        }
      }}
      onBlur={() => {
        const inputRoot = document.getElementById(`${props.id}-inputRoot`);
        if (inputRoot) {
          inputRoot.removeAttribute("data-focus");
        }
      }}
    />
  );
}

const OPTIONS_ANCHOR = "bottom start" as const;

function ComboboxOptions<T extends SelectValue>({
  selectedValues,
  filteredOptions,
  optionsBoxClassName = "",
  virtualized = false,
}: {
  selectedValues: NonNullable<T>[];
  filteredOptions: SelectOption<NonNullable<T>>[];
  optionsBoxClassName?: ComboboxBaseProps<SelectValue>["optionsBoxClassName"];
  virtualized?: boolean;
}) {
  if (virtualized) {
    return (
      // This component is implemented in a very non DRY way. But, we can't put
      // the <HeadlessComboboxOption /> into its own component or the
      // virtualization will start mysteriously glitching.
      <HeadlessComboboxOptions
        anchor={OPTIONS_ANCHOR}
        className={classNames(
          "w-[var(--input-width)] bg-brand-io border-brand border-brand-neutral rounded-brand shadow-sm [--anchor-gap:4px] text-sm/6 text-brand-neutral py-2 mt-2 z-20",
          optionsBoxClassName
        )}
        key={filteredOptions.length}
      >
        {({ option }: { option: SelectOption<NonNullable<T>> }) => (
          <HeadlessComboboxOption
            key={option.value.toString()}
            value={option}
            className="data-[focus]:bg-brand-overlay px-2 py-2 w-full"
          >
            <div className="flex items-center justify-between">
              <p className="text-brand-neutral text-base/6">{option.label}</p>
              {selectedValues.includes(option.value) && (
                <Icon name="checkmark" size="0.75" color="brand-neutral-2" />
              )}
            </div>
            {option.description && (
              <p className="text-brand-neutral-2 text-sm/6 mt-0.5">
                {option.description}
              </p>
            )}
          </HeadlessComboboxOption>
        )}
      </HeadlessComboboxOptions>
    );
  }

  return (
    <HeadlessComboboxOptions
      anchor={OPTIONS_ANCHOR}
      className={classNames(
        "w-[var(--input-width)] bg-brand-io border-brand border-brand-neutral rounded-brand shadow-sm [--anchor-gap:4px] text-sm/6 text-brand-neutral py-2 mt-2 z-20",
        optionsBoxClassName
      )}
      key={filteredOptions.length}
    >
      {filteredOptions.map((option) => (
        <HeadlessComboboxOption
          key={option.value.toString()}
          value={option}
          className="data-[focus]:bg-brand-overlay px-2 py-2 w-full"
        >
          <div className="flex items-center justify-between">
            <p className="text-brand-neutral text-base/6">{option.label}</p>
            {selectedValues.includes(option.value) && (
              <Icon name="checkmark" size="0.75" color="brand-neutral-2" />
            )}
          </div>
          {option.description && (
            <p className="text-brand-neutral-2 text-sm/6 mt-0.5">
              {option.description}
            </p>
          )}
        </HeadlessComboboxOption>
      ))}
      {filteredOptions.length === 0 && (
        <p className="text-brand-neutral-2 text-base/6 px-2 py-2">
          No options available.
        </p>
      )}
    </HeadlessComboboxOptions>
  );
}

export {
  ComboboxRoot as Root,
  ComboboxInputRoot as InputRoot,
  ComboboxInput as Input,
  ComboboxOptions as Options,
  type ComboboxBaseProps as Props,
};
