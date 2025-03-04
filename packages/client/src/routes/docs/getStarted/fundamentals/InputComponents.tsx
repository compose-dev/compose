import { useState } from "react";
import { TextInput } from "~/components/input";
import RadioGroup from "~/components/radio-group";
import { toast } from "~/utils/toast";

function InputComponents() {
  const { addToast } = toast.useStore();

  const [value, setValue] = useState<string | null>(null);
  const [radio, setRadio] = useState<"yes" | "no" | null>(null);

  const setRadioGroup = (value: "yes" | "no" | null) => {
    setRadio(value);
    addToast({ message: `You selected ${value || "nothing"}` });
  };

  const onEnter = () => {
    addToast({ message: `Hello, ${value || "mysterious person"}!` });
  };

  return (
    <div className="p-4 text-brand-neutral max-w-md flex flex-col gap-4">
      <RadioGroup
        label="Do you like ice cream?"
        options={[
          { label: "yes", value: "yes" },
          { label: "no", value: "no" },
        ]}
        value={radio}
        setValue={setRadioGroup}
        disabled={false}
      />
      <TextInput
        label="Enter your name"
        value={value}
        setValue={setValue}
        onEnter={onEnter}
      />
    </div>
  );
}

export default InputComponents;
