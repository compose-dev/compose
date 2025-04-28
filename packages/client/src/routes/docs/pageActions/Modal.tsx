import { useState } from "react";
import Table from "~/components/table";
import { Modal } from "~/components/modal";
import Json from "~/components/json";

const users = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    name: "John Doe",
    email: "john.doe@example.com",
    createdAt: "2023-05-15T09:23:41Z",
    isApproved: true,
    age: 32,
  },
  {
    id: "7f8d5a3e-6c3b-4f5a-b9d2-1e8c7a9f6b4d",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    createdAt: "2023-07-22T14:30:12Z",
    isApproved: false,
    age: 28,
  },
  {
    id: "3a2b1c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    createdAt: "2023-09-03T18:45:33Z",
    isApproved: true,
    age: 45,
  },
  {
    id: "9b8a7c6d-5e4f-3g2h-1i0j-9k8l7m6n5o4p",
    name: "Emily Brown",
    email: "emily.brown@example.com",
    createdAt: "2023-06-10T11:12:55Z",
    isApproved: true,
    age: 39,
  },
  {
    id: "2c3d4e5f-6g7h-8i9j-0k1l-2m3n4o5p6q7r",
    name: "David Wilson",
    email: "david.wilson@example.com",
    createdAt: "2023-08-28T16:20:07Z",
    isApproved: false,
    age: 52,
  },
];

function ModalComponent() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [modalContent, setModalContent] = useState<object | null>(null);

  return (
    <>
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
          data={users}
          columns={[
            {
              id: "name",
              label: "Name",
              accessorKey: "name",
              overflow: "ellipsis",
            },
          ]}
          actions={[{ label: "View Details" }]}
          onTableRowActionHook={(rowIdx) => {
            setModalContent(users[rowIdx]);
          }}
          enableRowSelection={true}
          rowSelections={selected}
          setRowSelections={setSelected}
          allowMultiSelection={true}
          onTablePageChangeHook={() => {}}
          totalRecords={users.length}
        />
      </div>
    </>
  );
}

export default ModalComponent;
