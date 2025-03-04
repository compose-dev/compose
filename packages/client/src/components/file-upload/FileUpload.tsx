import { IOComponent } from "../io-component";
import FileDrop from "./FileDrop";
import { FileUploadProps } from "./props";

function FileUpload(props: FileUploadProps) {
  return (
    <div className="flex flex-col">
      {props.label && <IOComponent.Label>{props.label}</IOComponent.Label>}
      {props.description && (
        <IOComponent.Description>{props.description}</IOComponent.Description>
      )}
      <FileDrop {...props} />
      {props.errorMessage !== null && props.hasError && (
        <IOComponent.Error>{props.errorMessage}</IOComponent.Error>
      )}
    </div>
  );
}

export default FileUpload;
