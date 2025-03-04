import {
  RadioGroup as HeadlessRadioGroup,
  Field,
  Radio,
  Label,
} from "@headlessui/react";
import { classNames } from "~/utils/classNames";
import {
  SelectOption,
  SelectValue,
  useSelect,
} from "~/components/.utils/selectUtils";
import { IOComponent } from "~/components/io-component";

function RadioGroup<T extends SelectValue>({
  label,
  value,
  setValue,
  options,
  disabled,
  description = null,
  hasError = false,
  errorMessage = null,
  rootClassName = "",
}: {
  label: string | null;
  value: T | null;
  setValue: (value: T | null) => void;
  options: SelectOption<NonNullable<T>>[];
  disabled: boolean;
  description?: string | null;
  hasError?: boolean;
  errorMessage?: string | null;
  rootClassName?: string;
}) {
  const { selectedOption, onSelectOption } = useSelect(
    value,
    setValue,
    options
  );

  return (
    <HeadlessRadioGroup
      value={selectedOption}
      onChange={onSelectOption}
      aria-label={label || undefined}
      disabled={disabled}
      className={rootClassName}
    >
      {label !== null && (
        <IOComponent.Label as="HeadlessUILabel">{label}</IOComponent.Label>
      )}
      {description !== null && (
        <IOComponent.Description>{description}</IOComponent.Description>
      )}
      <div className="flex flex-col gap-1">
        {options.map((option) => (
          <Field
            key={option.value.toString()}
            className="flex items-start gap-2"
          >
            <Radio
              value={option}
              className={classNames(
                "group flex size-5 min-w-5 items-center justify-center rounded-full border-brand bg-brand-io mt-0.5",
                {
                  "border-brand-error": hasError,
                  "border-brand-neutral": !hasError,
                }
              )}
            >
              <span className="invisible size-3 rounded-full bg-brand-btn-primary group-data-[checked]:visible" />
            </Radio>
            <div className="flex flex-col gap-1">
              <Label>{option.label}</Label>
              {option.description && (
                <IOComponent.Description>
                  {option.description}
                </IOComponent.Description>
              )}
            </div>
          </Field>
        ))}
      </div>
      {errorMessage !== null && hasError && (
        <IOComponent.Error>{errorMessage}</IOComponent.Error>
      )}
    </HeadlessRadioGroup>
  );
}

export default RadioGroup;
