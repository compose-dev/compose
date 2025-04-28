import { u } from "@compose/ts";
import { useEffect, useMemo, useState } from "react";
import Button from "~/components/button";
import { ComboboxSingle } from "~/components/combobox";
import { TextInput, EmailInput } from "~/components/input";
import { IOComponent } from "~/components/io-component";
import { Modal } from "~/components/modal";
import Table from "~/components/table";
import { toast } from "~/utils/toast";

const REQUIRED = {
  name: true,
  email: true,
  role: true,
};

const USERS = [
  {
    name: "Ada Lovelace",
    email: "first.coder@algorithm.dev",
    role: "Admin",
  },
  {
    name: "Linus Torvalds",
    email: "penguin.lover@linux.org",
    role: "User",
  },
  {
    name: "Grace Hopper",
    email: "bug.squasher@navy.mil",
    role: "Guest",
  },
  {
    name: "Alan Turing",
    email: "enigma.solver@computing.uk",
    role: "Admin",
  },
  {
    name: "Margaret Hamilton",
    email: "moon.lander@nasa.gov",
    role: "User",
  },
  {
    name: "Tim Berners-Lee",
    email: "web.inventor@cern.ch",
    role: "Admin",
  },
  {
    name: "Katherine Johnson",
    email: "human.computer@nasa.gov",
    role: "User",
  },
  {
    name: "Dennis Ritchie",
    email: "c.creator@bell-labs.com",
    role: "Guest",
  },
  {
    name: "John von Neumann",
    email: "game.theorist@princeton.edu",
    role: "Admin",
  },
  {
    name: "Barbara Liskov",
    email: "substitution.principle@mit.edu",
    role: "User",
  },
  {
    name: "Donald Knuth",
    email: "art.of.programming@stanford.edu",
    role: "Admin",
  },
  {
    name: "Guido van Rossum",
    email: "python.creator@dropbox.com",
    role: "User",
  },
  {
    name: "Frances Allen",
    email: "compiler.optimizer@ibm.com",
    role: "Guest",
  },
  {
    name: "Brendan Eich",
    email: "javascript.creator@mozilla.org",
    role: "User",
  },
  {
    name: "Shafi Goldwasser",
    email: "cryptography.pioneer@mit.edu",
    role: "Admin",
  },
];

function Form() {
  const { addToast } = toast.useStore();
  const [users, setUsers] = useState<typeof USERS>([...USERS]);

  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const [didFillName, setDidFillName] = useState(false);
  const [didFillEmail, setDidFillEmail] = useState(false);
  const [didFillRole, setDidFillRole] = useState(false);

  const [didSubmit, setDidSubmit] = useState(false);

  const [isOpen, setIsOpen] = useState(true);

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

  useEffect(() => {
    if (!didFillRole && role !== null) {
      setDidFillRole(true);
    }
  }, [didFillRole, role]);

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

  const formError = useMemo(() => {
    if (nameError || emailError || roleError) {
      return "Form is invalid.";
    }

    return null;
  }, [nameError, emailError, roleError]);

  return (
    <div className="p-4 flex flex-col gap-4">
      <Modal.Root isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.CloseableHeader onClose={() => setIsOpen(false)}>
          <Modal.Title>Create User</Modal.Title>
        </Modal.CloseableHeader>
        <Modal.RawBody>
          <form
            className="flex flex-col space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setDidSubmit(true);
              if (!formError) {
                if (name && email && role) {
                  setUsers([{ name, email, role }, ...users]);
                }
                setName(null);
                setEmail(null);
                setRole(null);
                setDidFillName(false);
                setDidFillEmail(false);
                setDidFillRole(false);
                setDidSubmit(false);
                setIsOpen(false);
                addToast({
                  message: "User created successfully",
                  appearance: "success",
                });
              }
            }}
          >
            <div className="max-w-md">
              <TextInput
                label="Name"
                value={name}
                setValue={setName}
                errorMessage={nameError}
                hasError={nameError !== null && (didSubmit || didFillName)}
              />
            </div>
            <div className="max-w-md">
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
            <div>
              <Button type="submit" variant="primary" onClick={() => {}}>
                Submit
              </Button>
            </div>
            {didSubmit && formError && (
              <IOComponent.Error>{formError}</IOComponent.Error>
            )}
          </form>
        </Modal.RawBody>
      </Modal.Root>
      <Table.Root
        id="users"
        data={users}
        columns={[
          {
            id: "name",
            label: "Name",
            accessorKey: "name",
            overflow: "ellipsis",
          },
          {
            id: "email",
            label: "Email",
            accessorKey: "email",
            overflow: "ellipsis",
          },
          {
            id: "role",
            label: "Role",
            accessorKey: "role",
            overflow: "ellipsis",
          },
        ]}
        actions={null}
        onTableRowActionHook={() => {}}
        enableRowSelection={true}
        rowSelections={{}}
        setRowSelections={() => {}}
        allowMultiSelection={true}
        onTablePageChangeHook={() => {}}
        totalRecords={users.length}
      />
      <div className="flex">
        <Button variant="primary" onClick={() => setIsOpen(true)}>
          Create User
        </Button>
      </div>
    </div>
  );
}

export default Form;
