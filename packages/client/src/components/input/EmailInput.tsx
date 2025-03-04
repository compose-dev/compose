import { ComponentProps } from "react";
import Input from "./Input";
import Icon from "~/components/icon";

function EmailInput(props: ComponentProps<typeof Input>) {
  return (
    <Input right={<Icon name="at" color="brand-neutral-2" />} {...props} />
  );
}

export default EmailInput;
