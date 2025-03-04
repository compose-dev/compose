import { u } from "@compose/ts";
import { useEffect, useMemo, useState } from "react";
import Button from "~/components/button";
import { ComboboxSingle } from "~/components/combobox";
import { EmailInput, NumberInput } from "~/components/input";
import { IOComponent } from "~/components/io-component";

import { toast } from "~/utils/toast";

const REQUIRED = {
  email: true,
  role: true,
  age: true,
};

function Form() {
  const { addToast } = toast.useStore();

  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<"Admin" | "User" | "Guest" | null>(null);
  const [age, setAge] = useState<string | null>(null);

  const [didFillEmail, setDidFillEmail] = useState(false);
  const [didFillRole, setDidFillRole] = useState(false);
  const [didFillAge, setDidFillAge] = useState(false);

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
    if (!didFillAge && age !== null) {
      setDidFillAge(true);
    }
  }, [didFillAge, age]);

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
    if (!role && REQUIRED.role) {
      return "Role is required.";
    }
    return null;
  }, [role]);

  const ageError = useMemo(() => {
    if (!age && REQUIRED.age) {
      return "Age is required.";
    }

    return null;
  }, [age]);

  const formError = useMemo(() => {
    if (emailError || roleError || ageError) {
      return "Form is invalid.";
    }

    if (age && parseInt(age) < 18 && role === "Admin") {
      return "You must be at least 18 years old to be an admin.";
    }

    return null;
  }, [emailError, roleError, ageError, age, role]);

  return (
    <div className="p-4">
      <form
        className="flex flex-col space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setDidSubmit(true);
          if (!formError) {
            addToast({ message: "User created successfully!" });

            setDidSubmit(false);
            setEmail(null);
            setRole(null);
            setAge(null);
            setDidFillEmail(false);
            setDidFillRole(false);
            setDidFillAge(false);
          }
        }}
      >
        <div className="max-w-md flex flex-col space-y-4">
          <EmailInput
            label="Email"
            value={email}
            setValue={setEmail}
            errorMessage={emailError}
            hasError={emailError !== null && (didSubmit || didFillEmail)}
          />
        </div>
        <div className="max-w-md">
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
        <div className="max-w-md flex flex-col space-y-4">
          <NumberInput
            label="Age"
            value={age}
            setValue={setAge}
            errorMessage={ageError}
            hasError={ageError !== null && (didSubmit || didFillAge)}
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
  );
}

export default Form;
