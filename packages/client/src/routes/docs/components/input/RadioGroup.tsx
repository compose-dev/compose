import { useState } from "react";
import RadioGroup from "~/components/radio-group";

const options = ["A", "B", "C", "D"];

const formatted = options.map((option) => ({
  label: option,
  value: option,
}));

function Select() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <div className="p-4">
      <RadioGroup
        label="Select an option"
        value={value}
        setValue={setValue}
        options={formatted}
        disabled={false}
      />
    </div>
  );
}

export default Select;
