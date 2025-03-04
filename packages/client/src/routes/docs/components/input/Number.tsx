import { useState } from "react";
import { NumberInput } from "~/components/input";

function Number() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <div className="p-4 text-brand-neutral max-w-md">
      <NumberInput label="Enter your age" value={value} setValue={setValue} />
    </div>
  );
}

export default Number;
