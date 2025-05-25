import { useState } from "react";
import Table from "~/components/table";
import { Modal } from "~/components/modal";
import Json from "~/components/json";
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
  const [modalContent, setModalContent] = useState(null);

  return (
    <div className="p-4">
      {modalContent !== null && (
        <Modal.Root
          isOpen={true}
          width="lg"
          onClose={() => setModalContent(null)}
        >
          <Modal.CloseableHeader onClose={() => setModalContent(null)}>
            User Details
          </Modal.CloseableHeader>
          <Modal.Body>
            <Json json={modalContent} label={null} />
          </Modal.Body>
        </Modal.Root>
      )}
      <Table.Root
        id="users"
        data={data}
        columns={[
          {
            id: "name",
            label: "Name",
            accessorKey: "name",
            overflow: "ellipsis",
            width: "160px",
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
            width: "140px",
            overflow: "ellipsis",
          },
          {
            id: "createdAt",
            label: "Created At",
            accessorKey: "createdAt",
            format: "date",
            width: "160px",
          },
        ]}
        actions={[]}
        onTableRowActionHook={() => {}}
        enableRowSelection={false}
        rowSelections={selected}
        setRowSelections={setSelected}
        tableClassName="!h-[75vh]"
        onTablePageChangeHook={() => {}}
        totalRecords={data.length}
      />
    </div>
  );
}

export default TableComponent;
