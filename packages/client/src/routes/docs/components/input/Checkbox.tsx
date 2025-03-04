import { useState } from "react";
import { Checkbox } from "~/components/checkbox";

function CheckboxComponent() {
  const [value, setValue] = useState<boolean>(false);

  return (
    <div className="p-4 text-brand-neutral">
      <Checkbox
        label="I agree that Compose is the best thing since sliced bread"
        checked={value}
        setChecked={setValue}
      />
    </div>
  );
}

export default CheckboxComponent;
