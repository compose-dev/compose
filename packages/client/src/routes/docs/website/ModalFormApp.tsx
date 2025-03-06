import { u } from "@compose/ts";
import { useEffect, useMemo, useState } from "react";
import Button from "~/components/button";
import { ComboboxSingle } from "~/components/combobox";
import { EmailInput, TextAreaInput } from "~/components/input";
import { IOComponent } from "~/components/io-component";
import { toast } from "~/utils/toast";

const REQUIRED = {
  email: true,
  role: true,
  notes: true,
};

function ModalFormApp() {
  const { addToast } = toast.useStore();

  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null>(null);

  const [didFillEmail, setDidFillEmail] = useState(false);
  const [didFillRole, setDidFillRole] = useState(false);
  const [didFillNotes, setDidFillNotes] = useState(false);

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
    if (!didFillNotes && notes !== null) {
      setDidFillNotes(true);
    }
  }, [didFillNotes, notes]);

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

  const notesError = useMemo(() => {
    if (notes === null && REQUIRED.notes) {
      return "Notes are required.";
    }

    return null;
  }, [notes]);

  const formError = useMemo(() => {
    if (emailError || roleError || notesError) {
      return "Form is invalid.";
    }

    return null;
  }, [emailError, roleError, notesError]);

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
              setNotes(null);
              setDidFillEmail(false);
              setDidFillRole(false);
              setDidFillNotes(false);
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
            <TextAreaInput
              label="Notes"
              value={notes}
              setValue={setNotes}
              errorMessage={notesError}
              hasError={notesError !== null && (didSubmit || didFillNotes)}
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
