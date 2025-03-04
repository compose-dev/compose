import { useState } from "react";
import { EmailInput } from "~/components/input";

function Text() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <div className="p-4 text-brand-neutral max-w-md">
      <EmailInput label="Enter your email" value={value} setValue={setValue} />
    </div>
  );
}

export default Text;
