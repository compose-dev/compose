import {
  Listbox as HeadlessListbox,
  ListboxButton as HeadlessListboxButton,
  ListboxOption as HeadlessListboxOption,
  ListboxOptions as HeadlessListboxOptions,
  Field,
} from "@headlessui/react";
import React from "react"; // Removed Fragment

import {
  SelectOption,
  SelectValue,
  useSelect,
  useSelectMulti,
} from "~/components/.utils/selectUtils";
import Button from "~/components/button";
import Icon from "~/components/icon";
import { IOComponent } from "~/components/io-component";
import { classNames } from "~/utils/classNames";

// --- Base Props ---
interface ListboxBaseProps<T extends SelectValue> {
  id: string;
  label: string | null;
  disabled: boolean;
  description?: string | null;
  hasError?: boolean;
  errorMessage?: string | null;
  rootClassName?: string;
  buttonBoxClassName?: string; // Equivalent to inputBoxClassName
  optionsBoxClassName?: string;
  options: SelectOption<NonNullable<T>>[];
  placeholder?: string; // Added placeholder for single select
}

// --- Base Components (Adapted from ComboboxBase) ---

function ListboxRoot({
  label,
  children,
  description,
  rootClassName = "",
  hasError = false,
  errorMessage = null,
}: {
  label: ListboxBaseProps<SelectValue>["label"];
  children: React.ReactNode;
  description?: ListboxBaseProps<SelectValue>["description"];
  rootClassName?: ListboxBaseProps<SelectValue>["rootClassName"];
  hasError?: ListboxBaseProps<SelectValue>["hasError"];
  errorMessage?: ListboxBaseProps<SelectValue>["errorMessage"];
}) {
  return (
    <Field className={classNames("flex flex-col w-full", rootClassName)}>
      {label && (
        <IOComponent.Label as="HeadlessUILabel">{label}</IOComponent.Label>
      )}
      {description && (
        <IOComponent.Description>{description}</IOComponent.Description>
      )}
      {children}
      {hasError && errorMessage !== null && (
        <IOComponent.Error>{errorMessage}</IOComponent.Error>
      )}
    </Field>
  );
}

function ListboxButtonRoot({
  children,
  buttonBoxClassName = "",
}: {
  children: React.ReactNode;
  buttonBoxClassName?: ListboxBaseProps<SelectValue>["buttonBoxClassName"];
}) {
  // This component now directly wraps the HeadlessListboxButton
  // Styling is applied directly to the button via className prop
  return (
    <div className={classNames("relative w-full", buttonBoxClassName)}>
      {children}
    </div>
  );
}

// Combined ListboxButton and content display logic
function ListboxButtonContent<T extends SelectValue>({
  selectedOption, // For single select
  selectedOptions, // For multi select
  placeholder,
  disabled,
  hasError,
  label,
  onRemoveOption, // For multi select tag removal
}: {
  selectedOption?: SelectOption<NonNullable<T>> | null;
  selectedOptions?: SelectOption<NonNullable<T>>[];
  placeholder?: string;
  disabled: boolean;
  hasError?: boolean;
  label: string | null;
  onRemoveOption?: (option: SelectOption<NonNullable<T>>) => void; // Optional callback
}) {
  return (
    <HeadlessListboxButton
      aria-label={label ?? undefined} // Use label for aria-label if provided
      className={classNames(
        // Base styles mimic ComboboxInputRoot container
        "border-brand rounded-brand py-1 text-base/6 sm:text-sm/6 text-brand-neutral focus:outline-none data-[focus]:outline-none data-[focus]:ring-brand-primary-heavy data-[focus]:ring-2 data-[focus]:ring-offset-0 bg-brand-io relative cursor-default w-full",
        // Add specific styles for button content layout
        "pl-2 pr-8 text-left", // Padding for text and icon space
        {
          "border-brand-error": !!hasError,
          "border-brand-neutral": !hasError,
          "bg-brand-io-disabled": disabled,
          "text-brand-neutral-2": !!(
            !selectedOption &&
            !selectedOptions?.length &&
            placeholder
          ),
        }
      )}
    >
      <span className="block truncate">
        {/* Multi-select tags */}
        {selectedOptions && selectedOptions.length > 0 && onRemoveOption && (
          <div className="flex flex-wrap gap-1 pt-1 pb-1">
            {" "}
            {/* Adjusted padding */}
            {selectedOptions.map((option) => (
              <span
                key={option.value.toString()}
                // Prevent click propagation to button to allow tag removal
                onClick={(e) => e.stopPropagation()}
                className={classNames(
                  "border-brand border-brand-neutral rounded-brand px-2 py-0.5 bg-brand-overlay flex items-center justify-between text-sm", // Adjusted padding/text size
                  {
                    "bg-brand-overlay-2": disabled,
                  }
                )}
              >
                {option.label}
                <Button
                  variant="ghost"
                  size="sm" // Adjust size if needed
                  className="ml-1 -mr-1 p-0.5" // Adjust spacing
                  onClick={() => {
                    onRemoveOption?.(option);
                  }}
                  disabled={disabled}
                >
                  <Icon name="x" size="0.5" />
                </Button>
              </span>
            ))}
          </div>
        )}

        {/* Single-select display */}
        {selectedOption &&
          (!selectedOptions || selectedOptions.length === 0) && (
            <span className="text-brand-neutral text-base/6 sm:text-sm/6">
              {selectedOption.label}
            </span>
          )}

        {/* Placeholder for single select when empty */}
        {!selectedOption &&
          (!selectedOptions || selectedOptions.length === 0) && (
            <span
              className={classNames(
                "text-brand-neutral-2 text-base/6 sm:text-sm/6",
                {
                  "text-transparent": !placeholder,
                }
              )}
            >
              {placeholder || "Select"}
            </span>
          )}

        {/* Placeholder for multi-select when empty (optional, can be handled by root placeholder) */}
        {/* {!selectedOptions?.length && placeholder && (
           <span className="text-brand-neutral-2 text-base/6 sm:text-sm/6">{placeholder}</span>
         )} */}
      </span>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
        <Icon
          name="chevron-down"
          color="brand-neutral-2"
          size="0.75"
          aria-hidden="true"
        />
      </span>
    </HeadlessListboxButton>
  );
}

const OPTIONS_ANCHOR = "bottom start" as const;

function ListboxOptions<T extends SelectValue>({
  filteredOptions,
  selectedValues,
  optionsBoxClassName = "",
}: {
  filteredOptions: SelectOption<NonNullable<T>>[];
  selectedValues: NonNullable<T>[];
  optionsBoxClassName?: ListboxBaseProps<SelectValue>["optionsBoxClassName"];
}) {
  // NOTE: Headless UI Listbox doesn't support virtual prop directly like Combobox.
  // If virtualization is needed, it would require a library like react-window or react-virtualized
  // integrated manually with HeadlessListboxOptions. For simplicity, we omit virtualization for now.
  // If performance becomes an issue with very long lists, this could be added later.
  // Virtualization logic/comments removed for Listbox

  return (
    <HeadlessListboxOptions
      anchor={OPTIONS_ANCHOR}
      className={classNames(
        "w-[var(--button-width)] bg-brand-io border-brand border-brand-neutral rounded-brand shadow-sm [--anchor-gap:4px] text-sm/6 text-brand-neutral py-2 mt-2 z-30 max-h-60 overflow-auto focus:outline-none", // Added max-h and overflow
        optionsBoxClassName
      )}
      key={filteredOptions.length}
      // No key needed based on filteredOptions length like combobox
    >
      {filteredOptions.length === 0 && (
        <p className="text-brand-neutral-2 text-base/6 px-2 py-2 cursor-default">
          No options available.
        </p>
      )}
      {filteredOptions.map((option) => (
        <HeadlessListboxOption
          key={option.value.toString()}
          value={option} // Pass the whole option object
          className="data-[focus]:bg-brand-overlay px-2 py-2 w-full" // Adjusted classes for listbox
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
        </HeadlessListboxOption>
      ))}
    </HeadlessListboxOptions>
  );
}

// --- Single Select Listbox ---
interface ListboxSingleProps<T extends SelectValue>
  extends ListboxBaseProps<T> {
  value: T | null;
  setValue: (value: T | null) => void;
}

function ListboxSingle<T extends SelectValue>({
  value,
  setValue,
  options,
  placeholder = "", // Default placeholder
  ...props
}: ListboxSingleProps<T>) {
  const { selectedOption, onSelectOption } = useSelect(
    value,
    setValue,
    options
  );

  return (
    <ListboxRoot
      label={props.label}
      description={props.description}
      rootClassName={props.rootClassName}
      hasError={props.hasError}
      errorMessage={props.errorMessage}
    >
      <HeadlessListbox
        value={selectedOption}
        onChange={onSelectOption}
        disabled={props.disabled}
        // 'by' prop might be needed if option objects are not stable references
        // by={(a, b) => a?.value === b?.value}
      >
        <ListboxButtonContent
          selectedOption={selectedOption}
          placeholder={placeholder}
          disabled={props.disabled}
          hasError={props.hasError}
          label={props.label}
        />
        <ListboxOptions
          filteredOptions={options} // Listbox doesn't filter internally
          selectedValues={selectedOption ? [selectedOption.value] : []}
          optionsBoxClassName={props.optionsBoxClassName}
        />
      </HeadlessListbox>
    </ListboxRoot>
  );
}

// --- Multi Select Listbox ---
interface ListboxMultiProps<T extends SelectValue> extends ListboxBaseProps<T> {
  value: NonNullable<T>[];
  setValue: (value: NonNullable<T>[]) => void;
}

function ListboxMulti<T extends SelectValue>({
  value,
  setValue,
  options,
  placeholder = "", // Default placeholder for multi
  ...props
}: ListboxMultiProps<T>) {
  const { selectedOptions, onSelectOptions, onRemoveOption } = useSelectMulti(
    value,
    setValue,
    options
  );

  return (
    <ListboxRoot
      label={props.label}
      description={props.description}
      rootClassName={props.rootClassName}
      hasError={props.hasError}
      errorMessage={props.errorMessage}
    >
      <HeadlessListbox
        value={selectedOptions} // Use selectedOptions array
        onChange={onSelectOptions}
        disabled={props.disabled}
        multiple // Enable multi-select
        // 'by' prop might be needed if option objects are not stable references
        // by={(a, b) => a?.value === b?.value}
      >
        <ListboxButtonRoot buttonBoxClassName={props.buttonBoxClassName}>
          <ListboxButtonContent
            selectedOptions={selectedOptions}
            placeholder={placeholder}
            disabled={props.disabled}
            hasError={props.hasError}
            label={props.label}
            onRemoveOption={onRemoveOption} // Pass remove handler for tags
          />
          <ListboxOptions
            filteredOptions={options} // Listbox doesn't filter internally
            selectedValues={selectedOptions.map((option) => option.value)}
            optionsBoxClassName={props.optionsBoxClassName}
          />
        </ListboxButtonRoot>
      </HeadlessListbox>
    </ListboxRoot>
  );
}

// --- Exports ---
// Decide on export strategy - export individual components or a namespace?
// Exporting Single and Multi directly is common.
export { ListboxSingle as Single, ListboxMulti as Multi };

// Optionally export base components if they need to be used/customized externally
// export { ListboxRoot, ListboxButtonRoot, ListboxButtonContent, ListboxOptions };

// Optionally export BaseProps type
// export type { ListboxBaseProps };
