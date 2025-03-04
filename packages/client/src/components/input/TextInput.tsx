import { ComponentProps } from "react";
import Input from "./Input";

function TextInput(props: ComponentProps<typeof Input>) {
  return <Input {...props} />;
}

export default TextInput;
