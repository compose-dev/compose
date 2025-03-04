import { useState } from "react";
import { UrlInput } from "~/components/input";

function Text() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <div className="p-4 text-brand-neutral max-w-md">
      <UrlInput label="Enter a url" value={value} setValue={setValue} />
    </div>
  );
}

export default Text;
