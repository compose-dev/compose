import { u } from "@compose/ts";
import { useEffect, useMemo, useState } from "react";
import Button from "~/components/button";
import { JsonEditor } from "~/components/code-editor";
import { ComboboxSingle } from "~/components/combobox";
import { EmailInput } from "~/components/input";
import { IOComponent } from "~/components/io-component";
import { toast } from "~/utils/toast";

const REQUIRED = {
  email: true,
  role: true,
  featureFlags: true,
};

const DEFAULT_FEATURE_FLAGS = {
  betaAccess: false,
  lang: "en-US",
};

function ModalFormApp() {
  const { addToast } = toast.useStore();

  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [featureFlags, setFeatureFlags] = useState<string | null>(
    JSON.stringify(DEFAULT_FEATURE_FLAGS, null, 2)
  );

  const [didFillEmail, setDidFillEmail] = useState(false);
  const [didFillRole, setDidFillRole] = useState(false);
  const [didFillFeatureFlags, setDidFillFeatureFlags] = useState(false);

  const [didSubmit, setDidSubmit] = useState(false);

  useEffect(() => {
    if (!didFillEmail && email !== null) {
      setDidFillEmail(true);
    }
  }, [didFillEmail, email]);

  useEffect(() => {
    if (!didFillRole && role !== null) {
      setDidFillRole(true);
    }
  }, [didFillRole, role]);

  useEffect(() => {
    if (!didFillFeatureFlags && featureFlags !== null) {
      setDidFillFeatureFlags(true);
    }
  }, [didFillFeatureFlags, featureFlags]);

  const emailError = useMemo(() => {
    if (!email && REQUIRED.email) {
      return "Email is required.";
    }

    if (email && !u.string.isValidEmail(email)) {
      return "Invalid email.";
    }

    return null;
  }, [email]);

  const roleError = useMemo(() => {
    if (role === null && REQUIRED.role) {
      return "Role is required.";
    }

    return null;
  }, [role]);

  const featureFlagsError = useMemo(() => {
    if (featureFlags === null && REQUIRED.featureFlags) {
      return "Feature flags are required.";
    }

    try {
      JSON.parse(featureFlags as string);
    } catch (error) {
      return `Invalid JSON: ${error instanceof Error ? error.message : "Unknown error"}`;
    }

    return null;
  }, [featureFlags]);

  const formError = useMemo(() => {
    if (emailError || roleError || featureFlagsError) {
      return "Form is invalid.";
    }

    return null;
  }, [emailError, roleError, featureFlagsError]);

  return (
    <div className="p-4 flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-col space-y-4 w-full items-center justify-center">
        <form
          className="flex flex-col space-y-4 max-w-md w-full"
          onSubmit={(e) => {
            e.preventDefault();
            setDidSubmit(true);
            if (!formError) {
              setEmail(null);
              setRole(null);
              setFeatureFlags(null);
              setDidFillEmail(false);
              setDidFillRole(false);
              setDidFillFeatureFlags(false);
              setDidSubmit(false);
              addToast({
                message: "Form submitted successfully",
                appearance: "success",
              });
            }
          }}
        >
          <h3>Create User</h3>
          <div className="max-w-md w-full">
            <EmailInput
              label="Email"
              value={email}
              setValue={setEmail}
              errorMessage={emailError}
              hasError={emailError !== null && (didSubmit || didFillEmail)}
            />
          </div>
          <div className="w-full max-w-md">
            <ComboboxSingle
              label="Role"
              value={role}
              setValue={(internalValue) => setRole(internalValue)}
              options={[
                { label: "Admin", value: "Admin" },
                { label: "User", value: "User" },
                { label: "Guest", value: "Guest" },
              ]}
              hasError={roleError !== null && (didSubmit || didFillRole)}
              errorMessage={roleError}
              disabled={false}
              id="role"
            />
          </div>
          <div className="max-w-md w-full">
            <JsonEditor
              label="Feature flags"
              value={featureFlags}
              onChange={(value) => setFeatureFlags(value)}
              errorMessage={featureFlagsError}
              hasError={
                featureFlagsError !== null && (didSubmit || didFillFeatureFlags)
              }
              id="feature-flags"
              description={null}
              height="120px"
            />
          </div>
          <div>
            <Button type="submit" variant="primary" onClick={() => {}}>
              Submit
            </Button>
          </div>
          {didSubmit && formError && (
            <IOComponent.Error>{formError}</IOComponent.Error>
          )}
        </form>
      </div>
    </div>
  );
}

export default ModalFormApp;
