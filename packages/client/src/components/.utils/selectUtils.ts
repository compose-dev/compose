import { useCallback, useMemo } from "react";

type SelectValue = string | number | boolean | null;

type SelectOptionValue = NonNullable<SelectValue>;

type SelectOption<T extends SelectOptionValue> = {
  value: NonNullable<T>;
  label: string;
  description?: string;
};

function getOptionFromValue<T extends SelectValue>(
  value: T,
  options: SelectOption<NonNullable<T>>[]
): SelectOption<NonNullable<T>> | null {
  if (value === null) {
    return null;
  }

  return options.find((option) => option.value === value) || null;
}

function useSelect<T extends SelectValue>(
  value: T | null,
  setValue: (value: T | null) => void,
  options: SelectOption<NonNullable<T>>[]
) {
  const selectedOption = useMemo(
    () => getOptionFromValue(value, options),
    [value, options]
  );

  const onSelectOption = useCallback(
    (option: SelectOption<NonNullable<T>>) => {
      if (option === null) {
        setValue(null);
      } else {
        setValue(option.value);
      }
    },
    [setValue]
  );

  return { selectedOption, onSelectOption };
}

function useSelectMulti<T extends SelectValue>(
  value: NonNullable<T>[],
  setValue: (value: NonNullable<T>[]) => void,
  options: SelectOption<NonNullable<T>>[]
) {
  const selectedOptions = useMemo(() => {
    const selectOptions = value.map((value) =>
      getOptionFromValue(value, options)
    );

    return selectOptions.filter((option) => option !== null) as SelectOption<
      NonNullable<T>
    >[];
  }, [value, options]);

  const onSelectOptions = useCallback(
    (options: SelectOption<NonNullable<T>>[]) => {
      setValue(options.map((option) => option.value));
    },
    []
  );

  function onRemoveOption(option: SelectOption<NonNullable<T>>) {
    setValue(value.filter((value) => value !== option.value));
  }

  return { selectedOptions, onSelectOptions, onRemoveOption };
}

export { type SelectOption, type SelectValue, useSelect, useSelectMulti };
