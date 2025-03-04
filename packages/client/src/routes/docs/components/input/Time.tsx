import { u } from "@compose/ts";
import { useState } from "react";
import { TimeInput } from "~/components/input";

function Time() {
  const [value, setValue] = useState<u.date.TimeOnlyModel | null>(null);

  return (
    <div className="p-4 text-brand-neutral max-w-md">
      <TimeInput
        label="What time is it right now?"
        value={value}
        setValue={setValue}
      />
    </div>
  );
}

export default Time;
