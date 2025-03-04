import { useState } from "react";
import { PasswordInput } from "~/components/input";

function Text() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <div className="p-4 text-brand-neutral max-w-md">
      <PasswordInput
        label="Enter your password"
        value={value}
        setValue={setValue}
      />
    </div>
  );
}

export default Text;
