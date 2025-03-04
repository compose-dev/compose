import { Combobox as HeadlessCombobox } from "@headlessui/react";
import { SelectValue, useSelect } from "~/components/.utils/selectUtils";

import * as Combobox from "./ComboboxBase";
import useComboboxQuery from "./hooks";

import { VIRTUALIZATION_THERSHOLD } from "./constants";

interface ComboboxSingleProps<T extends SelectValue> extends Combobox.Props<T> {
  value: T | null;
  setValue: (value: T | null) => void;
}

function ComboboxSingle<T extends SelectValue>({
  value,
  setValue,
  options,
  ...props
}: ComboboxSingleProps<T>) {
  const { selectedOption, onSelectOption } = useSelect(
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
        value={selectedOption}
        onChange={onSelectOption}
        onClose={() => setQuery("")}
        disabled={props.disabled}
        immediate
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
          <Combobox.Input
            label={props.label}
            setQuery={setQuery}
            displayValue={(value: typeof selectedOption) => {
              return value ? value.label : "";
            }}
            id={props.id}
          />
        </Combobox.InputRoot>
        <Combobox.Options
          selectedValues={selectedOption ? [selectedOption.value] : []}
          filteredOptions={filteredOptions}
          optionsBoxClassName={props.optionsBoxClassName}
          virtualized={options.length > VIRTUALIZATION_THERSHOLD}
        />
      </HeadlessCombobox>
    </Combobox.Root>
  );
}

export default ComboboxSingle;
