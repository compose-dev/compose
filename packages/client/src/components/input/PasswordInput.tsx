import { ComponentProps } from "react";
import Input from "./Input";
import Icon from "~/components/icon";

function PasswordInput(props: ComponentProps<typeof Input>) {
  return (
    <Input
      right={<Icon name="lock" color="brand-neutral-2" />}
      type="password"
      {...props}
    />
  );
}

export default PasswordInput;
