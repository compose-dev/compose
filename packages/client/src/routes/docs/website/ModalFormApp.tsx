import { Modal } from "~/components/modal";
import { TextInput, EmailInput } from "~/components/input";
import Button from "~/components/button";
import { useEffect, useMemo, useState } from "react";
import { toast } from "~/utils/toast";
import { u } from "@compose/ts";

export default function ModalFormApp() {
  const { addToast } = toast.useStore();
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const [didFillName, setDidFillName] = useState(false);
  const [didFillEmail, setDidFillEmail] = useState(false);

  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useEffect(() => {
    if (!didFillName && name !== null) {
      setDidFillName(true);
    }
  }, [didFillName, name]);

  useEffect(() => {
    if (!didFillEmail && email !== null) {
      setDidFillEmail(true);
    }
  }, [didFillEmail, email]);

  const nameError = useMemo(() => {
    if (!name) {
      return "Name is required.";
    }
    return null;
  }, [name]);

  const emailError = useMemo(() => {
    if (!email) {
      return "Email is required.";
    }

    if (!u.string.isValidEmail(email)) {
      return "Email is invalid.";
    }

    return null;
  }, [email]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (nameError || emailError) {
      setSubmissionError("Form is invalid.");
      return;
    }

    addToast({
      message: "User created!",
      appearance: "success",
    });

    setName(null);
    setEmail(null);
    setDidFillName(false);
    setDidFillEmail(false);
    setSubmissionError(null);
  }

  return (
    <Modal.Root isOpen={true} width="lg" onClose={() => {}}>
      <Modal.Header className="flex items-center justify-between">
        <Modal.Title>User Creation Tool</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <TextInput
            label="Name"
            value={name}
            setValue={setName}
            errorMessage={nameError}
            hasError={(didFillName || !!submissionError) && !!nameError}
          />
          <EmailInput
            label="Email"
            value={email}
            setValue={setEmail}
            errorMessage={emailError}
            hasError={(didFillEmail || !!submissionError) && !!emailError}
          />
          <div>
            <Button type="submit" variant="primary" onClick={() => {}}>
              Submit
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal.Root>
  );
}
