import { useState } from "react";
import Table from "~/components/table";
import { faker } from "@composehq/faker";

function TableComponent() {
  const [data] = useState(
    faker.records(
      {
        name: "personName",
        email: "email",
        approved: "boolean",
        createdAt: {
          type: "date",
          min: new Date("2020-01-01"),
          max: new Date("2025-01-01"),
        },
      },
      6321
    )
  );
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
          {
            id: "createdAt",
            label: "Created At",
            accessorKey: "createdAt",
            format: "date",
          },
        ]}
        actions={[]}
        onTableRowActionHook={() => {}}
        enableRowSelection={false}
        rowSelections={selected}
        setRowSelections={setSelected}
        tableClassName="!h-[80vh]"
        onTablePageChangeHook={() => {}}
        totalRecords={data.length}
      />
    </div>
  );
}

export default TableComponent;
