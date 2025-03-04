import { ComponentProps } from "react";
import Input from "./Input";
import Icon from "~/components/icon";

function UrlInput(props: ComponentProps<typeof Input>) {
  return (
    <Input right={<Icon name="link" color="brand-neutral-2" />} {...props} />
  );
}

export default UrlInput;
