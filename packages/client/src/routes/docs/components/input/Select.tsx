import { useState } from "react";
import { ComboboxSingle } from "~/components/combobox";

const options = ["A", "B", "C", "D"];

const formatted = options.map((option) => ({
  label: option,
  value: option,
}));

function Select() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <div className="px-8 py-4">
      <div className="max-w-md">
        <ComboboxSingle
          label="Select an option"
          value={value}
          setValue={setValue}
          options={formatted}
          disabled={false}
          id="select"
        />
      </div>
    </div>
  );
}

export default Select;
