import { Combobox as HeadlessCombobox } from "@headlessui/react";
import { SelectValue, useSelectMulti } from "~/components/.utils/selectUtils";
import Icon from "~/components/icon";

import * as Combobox from "./ComboboxBase";
import useComboboxQuery from "./hooks";
import Button from "~/components/button";
import { classNames } from "~/utils/classNames";
import { VIRTUALIZATION_THERSHOLD } from "./constants";

interface ComboboxMultiProps<T extends SelectValue> extends Combobox.Props<T> {
  value: NonNullable<T>[];
  setValue: (value: NonNullable<T>[]) => void;
}

function ComboboxMulti<T extends SelectValue>({
  value,
  setValue,
  options,
  ...props
}: ComboboxMultiProps<T>) {
  const { selectedOptions, onSelectOptions, onRemoveOption } = useSelectMulti(
    value,
    setValue,
    options
  );
  const { setQuery, filteredOptions } = useComboboxQuery(options);

  return (
    <Combobox.Root
      label={props.label}
      description={props.description}
      rootClassName={props.rootClassName}
      hasError={props.hasError}
      errorMessage={props.errorMessage}
    >
      <HeadlessCombobox
        value={selectedOptions}
        onChange={onSelectOptions}
        onClose={() => setQuery("")}
        disabled={props.disabled}
        immediate
        multiple
        virtual={
          options.length > VIRTUALIZATION_THERSHOLD
            ? { options: filteredOptions }
            : undefined
        }
      >
        <Combobox.InputRoot
          hasError={props.hasError}
          inputBoxClassName={props.inputBoxClassName}
          disabled={props.disabled}
          id={props.id}
        >
          {selectedOptions.map((option) => (
            <div
              key={option.value.toString()}
              className={classNames(
                "mx-2 border-brand border-brand-neutral rounded-brand px-2 py-1 mb-2 mt-1 bg-brand-overlay flex items-center justify-between",
                {
                  "bg-brand-overlay-2": props.disabled,
                }
              )}
            >
              {option.label}
              <Button
                variant="ghost"
                onClick={() => onRemoveOption(option)}
                disabled={props.disabled}
              >
                <Icon name="x" size="0.5" />
              </Button>
            </div>
          ))}
          <Combobox.Input
            label={props.label}
            setQuery={setQuery}
            id={props.id}
          />
        </Combobox.InputRoot>
        <Combobox.Options
          selectedValues={selectedOptions.map((option) => option.value)}
          filteredOptions={filteredOptions}
          optionsBoxClassName={props.optionsBoxClassName}
          virtualized={options.length > VIRTUALIZATION_THERSHOLD}
        />
      </HeadlessCombobox>
    </Combobox.Root>
  );
}

export default ComboboxMulti;
