import { useState } from "react";
import Table from "~/components/table";

const generateRandomData = (count: number) => {
  const firstNames = [
    "John",
    "Jane",
    "Bob",
    "Alice",
    "Michael",
    "Emily",
    "David",
    "Sarah",
    "Tom",
    "Lisa",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
  ];

  const emailDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];

  return Array.from({ length: count }, () => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const emailDomain =
      emailDomains[Math.floor(Math.random() * emailDomains.length)];

    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}@${emailDomain}`;

    return {
      name,
      email,
      approved: Math.random() < 0.5,
    };
  });
};

const data = generateRandomData(6321);

function TableComponent() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  return (
    <div className="p-4">
      <Table.Root
        id="users"
        data={data}
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
            id: "approved",
            label: "Approved",
            accessorKey: "approved",
            format: "boolean",
            width: "170px",
            overflow: "ellipsis",
          },
        ]}
        actions={[]}
        onTableRowActionHook={() => {}}
        enableRowSelection={true}
        rowSelections={selected}
        setRowSelections={setSelected}
        tableClassName="!h-[80vh]"
        allowMultiSelection={true}
        onTablePageChangeHook={() => {}}
        totalRecords={data.length}
      />
    </div>
  );
}

export default TableComponent;
