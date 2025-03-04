import { useEffect, useMemo, useState } from "react";
import Button from "~/components/button";
import { EmailInput, PasswordInput } from "~/components/input";
import { IOComponent } from "~/components/io-component";
import { u } from "@compose/ts";

const REQUIRED = {
  email: true,
  password: true,
};

function AwaitedUI() {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const [didFillEmail, setDidFillEmail] = useState(false);
  const [didFillPassword, setDidFillPassword] = useState(false);

  const [didSubmit, setDidSubmit] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!didFillEmail && email !== null) {
      setDidFillEmail(true);
    }
  }, [didFillEmail, email]);

  useEffect(() => {
    if (!didFillPassword && password !== null) {
      setDidFillPassword(true);
    }
  }, [didFillPassword, password]);

  const emailError = useMemo(() => {
    if (!email) {
      return "Email is required.";
    }

    if (!u.string.isValidEmail(email)) {
      return "Invalid email.";
    }

    return null;
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password && REQUIRED.password) {
      return "Password is required.";
    }

    return null;
  }, [password]);

  const formError = useMemo(() => {
    if (emailError || passwordError) {
      return true;
    }

    if (password !== "compose") {
      return "Incorrect password.";
    }

    return null;
  }, [emailError, password, passwordError]);

  return (
    <div className="p-4">
      <form
        className="flex flex-col space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setDidSubmit(true);
          if (!formError && !success) {
            setSuccess(email);
          }
        }}
      >
        <h3>Login to proceed</h3>

        <div className="max-w-md flex flex-col space-y-4">
          <EmailInput
            label="Enter your email"
            value={email}
            setValue={setEmail}
            errorMessage={emailError}
            hasError={emailError !== null && (didSubmit || didFillEmail)}
          />
          <PasswordInput
            label="Enter your password"
            value={password}
            setValue={setPassword}
            errorMessage={passwordError}
            hasError={passwordError !== null && (didSubmit || didFillPassword)}
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
        {success && <p>Welcome, {success}!</p>}
      </form>
    </div>
  );
}

export default AwaitedUI;
