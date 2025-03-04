import { ComponentProps } from "react";
import Input from "./Input";

import Icon from "~/components/icon";

interface NumberInputProps
  extends Omit<ComponentProps<typeof Input>, "value" | "setValue"> {
  value: string | null;
  setValue: (val: string | null) => void;
  allowDecimals?: boolean;
  allowNegatives?: boolean;
}

function NumberInput({
  value,
  setValue,
  allowDecimals = true,
  allowNegatives = true,
  ...props
}: NumberInputProps) {
  const sanitizedValue = value === null ? "" : value.toString();

  const sanitizedSetValue = (val: string | null) => {
    if (val === null) {
      setValue(null);
      return;
    }

    // If they enter a non-numeric value, simply return without passing
    // any kind of set event to the parent.
    const negativePart = allowNegatives ? "-?" : "";
    const regex = allowDecimals
      ? new RegExp(`^${negativePart}\\d*\\.?\\d*$`)
      : new RegExp(`^${negativePart}\\d*$`);

    if (!regex.test(val)) {
      return;
    }

    setValue(val);
  };

  return (
    <Input
      value={sanitizedValue}
      setValue={sanitizedSetValue}
      right={<Icon name="number" color="brand-neutral-2" />}
      {...props}
    />
  );
}

export default NumberInput;
