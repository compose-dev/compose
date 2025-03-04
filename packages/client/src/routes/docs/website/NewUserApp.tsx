import { v4 as uuid } from "uuid";
import { u } from "@compose/ts";
import { useEffect, useMemo, useState } from "react";
import Button from "~/components/button";
import { ComboboxSingle } from "~/components/combobox";
import { EmailInput, TextInput } from "~/components/input";
import { IOComponent } from "~/components/io-component";
import Json from "~/components/json";

const REQUIRED = {
  name: true,
  email: true,
  companyId: true,
};

const companies = [
  "Apple",
  "Microsoft",
  "Amazon",
  "Google",
  "Facebook",
  "Tesla",
  "Netflix",
  "IBM",
  "Intel",
  "Oracle",
  "Salesforce",
  "Adobe",
  "Nvidia",
  "Cisco",
  "PayPal",
  "Twitter",
  "Uber",
  "Airbnb",
  "SpaceX",
  "LinkedIn",
];

const getUserJSON = (name: string, email: string, companyId: string) => {
  return {
    id: uuid(),
    companyId,
    name,
    email,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const formattedCompanies = companies.map((company) => ({
  label: company,
  value: uuid(),
}));

function NewUserApp() {
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);

  const [didFillName, setDidFillName] = useState(false);
  const [didFillEmail, setDidFillEmail] = useState(false);
  const [didFillCompanyId, setDidFillCompanyId] = useState(false);

  const [didSubmit, setDidSubmit] = useState(false);
  const [successfulSubmit, setSuccessfulSubmit] = useState(false);

  useEffect(() => {
    if (!didFillName && name !== null) {
      setDidFillName(true);
    }

    if (!didFillEmail && email !== null) {
      setDidFillEmail(true);
    }

    if (!didFillCompanyId && companyId !== null) {
      setDidFillCompanyId(true);
    }
  }, [didFillName, name, didFillEmail, email, didFillCompanyId, companyId]);

  const nameError = useMemo(() => {
    if (!name && REQUIRED.name) {
      return "Name is required.";
    }
    return null;
  }, [name]);

  const emailError = useMemo(() => {
    if (!email && REQUIRED.email) {
      return "Email is required.";
    }

    if (email && !u.string.isValidEmail(email)) {
      return "Invalid email address.";
    }

    return null;
  }, [email]);

  const companyIdError = useMemo(() => {
    if (!companyId && REQUIRED.companyId) {
      return "Company is required.";
    }
    return null;
  }, [companyId]);

  const formError = useMemo(() => {
    if (nameError || emailError || companyIdError) {
      return "Form is invalid.";
    }

    return null;
  }, [nameError, emailError, companyIdError]);

  return (
    <div className="p-8 w-full">
      <form
        className="flex flex-col space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setDidSubmit(true);
          if (!formError) {
            setSuccessfulSubmit(true);
          }
        }}
      >
        <p className="text-xl font-medium">Create a new user</p>
        <div className="w-full">
          <ComboboxSingle
            label="Company"
            id="company"
            disabled={false}
            options={formattedCompanies}
            value={companyId}
            setValue={setCompanyId}
            errorMessage={companyIdError}
            hasError={
              companyIdError !== null && (didSubmit || didFillCompanyId)
            }
          />
        </div>
        <div className="w-full">
          <TextInput
            label="Name"
            value={name}
            setValue={setName}
            errorMessage={nameError}
            hasError={nameError !== null && (didSubmit || didFillName)}
          />
        </div>
        <div className="w-full">
          <EmailInput
            label="Email"
            value={email}
            setValue={setEmail}
            errorMessage={emailError}
            hasError={emailError !== null && (didSubmit || didFillEmail)}
          />
        </div>
        <div className="!mt-5">
          <Button type="submit" variant="primary" onClick={() => {}}>
            Submit form
          </Button>
        </div>
        {didSubmit && formError && (
          <IOComponent.Error>{formError}</IOComponent.Error>
        )}
        {didSubmit && !formError && successfulSubmit && <p>User created!</p>}
        {didSubmit &&
          !formError &&
          successfulSubmit &&
          name &&
          email &&
          companyId && (
            <Json json={getUserJSON(name, email, companyId)} label={null} />
          )}
      </form>
    </div>
  );
}

export default NewUserApp;
