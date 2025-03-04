import { IOComponent } from "~/components/io-component";
import CheckboxRaw from "./CheckboxRaw";

function Checkbox({
  checked,
  setChecked,
  label,
  description,
  disabled = false,
  hasError = false,
  errorMessage,
}: {
  checked: boolean;
  setChecked: (checked: boolean) => void;
  label: string | null;
  description?: string | null;
  disabled?: boolean;
  hasError?: boolean;
  errorMessage?: string | null;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-start gap-2">
        <div className="mt-1">
          <CheckboxRaw
            enabled={checked}
            setEnabled={setChecked}
            disabled={disabled}
            hasError={hasError}
          />
        </div>
        {label && <p>{label}</p>}
      </div>
      {description && (
        <div className="mt-1">
          <IOComponent.Description className="mb-0">
            {description}
          </IOComponent.Description>
        </div>
      )}
      {hasError && errorMessage !== null && (
        <div className="-mt-1">
          <IOComponent.Error>{errorMessage}</IOComponent.Error>
        </div>
      )}
    </div>
  );
}

export default Checkbox;
