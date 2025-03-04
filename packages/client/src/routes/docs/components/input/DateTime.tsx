import { u } from "@compose/ts";
import { useState } from "react";
import { DateTimeInput } from "~/components/input";

function DateTime() {
  const [value, setValue] = useState<u.date.DateTimeModel | null>(null);

  return (
    <div className="p-4 text-brand-neutral max-w-md">
      <DateTimeInput
        label="When will the world end?"
        value={value}
        setValue={setValue}
      />
    </div>
  );
}

export default DateTime;
