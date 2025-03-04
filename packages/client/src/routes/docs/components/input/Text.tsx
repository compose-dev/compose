import { useState } from "react";
import { TextInput } from "~/components/input";

function Text() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <div className="p-4 text-brand-neutral max-w-md">
      <TextInput label="Enter some text" value={value} setValue={setValue} />
    </div>
  );
}

export default Text;
