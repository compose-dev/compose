import { u } from "@compose/ts";
import { useState } from "react";
import { DateInput } from "~/components/input";

function Date() {
  const [value, setValue] = useState<u.date.DateOnlyModel | null>(null);

  return (
    <div className="p-4 text-brand-neutral max-w-md">
      <DateInput
        label="Enter your birthday"
        value={value}
        setValue={setValue}
      />
    </div>
  );
}

export default Date;
