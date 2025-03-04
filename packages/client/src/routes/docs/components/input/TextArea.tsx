import { useState } from "react";
import { TextAreaInput } from "~/components/input";

function TextArea() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <div className="p-4 text-brand-neutral">
      <TextAreaInput
        label="Write your story..."
        value={value}
        setValue={setValue}
      />
    </div>
  );
}

export default TextArea;
