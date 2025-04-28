import { useState } from "react";
import Table from "~/components/table";
import { Modal } from "~/components/modal";
import Json from "~/components/json";

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

  return Array.from({ length: count }, () => ({
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    age: Math.floor(Math.random() * (65 - 18 + 1)) + 18,
    approved: Math.random() < 0.5,
  }));
};

const data = generateRandomData(6321);

function TableComponent() {
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
            id: "age",
            label: "Age",
            accessorKey: "age",
            width: "170px",
            overflow: "ellipsis",
          },
        ]}
        actions={[]}
        onTableRowActionHook={() => {}}
        enableRowSelection={true}
        rowSelections={selected}
        setRowSelections={setSelected}
        tableClassName="!h-[75vh]"
        allowMultiSelection={true}
        onTablePageChangeHook={() => {}}
        totalRecords={data.length}
      />
    </div>
  );
}

export default TableComponent;
