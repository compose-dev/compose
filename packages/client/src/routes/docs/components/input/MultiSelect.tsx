import { useState } from "react";
import { ComboboxMulti } from "~/components/combobox";

const options = ["A", "B", "C", "D"];

const formatted = options.map((option) => ({
  label: option,
  value: option,
}));

function MultiSelect() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <div className="px-8 py-4">
      <div className="max-w-md">
        <ComboboxMulti
          label="Select options"
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

export default MultiSelect;
