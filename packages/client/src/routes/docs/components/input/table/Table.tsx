import { useState } from "react";
import { IOComponent } from "~/components/io-component";
import Table from "~/components/table";
import { Modal } from "~/components/modal";
import Json from "~/components/json";
import { UI } from "@composehq/ts-public";

const data = [
  {
    name: "Apple",
    headquarters: "Cupertino, CA",
    tier: "Enterprise",
    arr: 150000,
  },
  {
    name: "Asana",
    headquarters: "San Francisco, CA",
    tier: "Basic",
    arr: 12000,
  },
  {
    name: "HubSpot",
    headquarters: "Cambridge, MA",
    tier: "Premium",
    arr: 35000,
  },
  {
    name: "Microsoft",
    headquarters: "Redmond, WA",
    tier: "Enterprise",
    arr: 120000,
  },
  {
    name: "Canva",
    headquarters: "Sydney, Australia",
    tier: "Basic",
    arr: 5000,
  },
  {
    name: "Shopify",
    headquarters: "Ottawa, Canada",
    tier: "Premium",
    arr: 45000,
  },
  {
    name: "Zendesk",
    headquarters: "San Francisco, CA",
    tier: "Premium",
    arr: 25000,
  },
  {
    name: "Salesforce",
    headquarters: "San Francisco, CA",
    tier: "Enterprise",
    arr: 80000,
  },
  {
    name: "MailChimp",
    headquarters: "Atlanta, GA",
    tier: "Basic",
    arr: 15000,
  },
  {
    name: "Notion",
    headquarters: "San Francisco, CA",
    tier: "Basic",
    arr: 8000,
  },
];

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
            Company Details
          </Modal.CloseableHeader>
          <Modal.Body>
            <Json json={modalContent} label={null} />
          </Modal.Body>
        </Modal.Root>
      )}
      <IOComponent.Label>Companies</IOComponent.Label>
      <Table.Root
        id="companies"
        data={data}
        columns={[
          {
            id: "name",
            label: "Name",
            accessorKey: "name",
            width: "150px",
            overflow: "ellipsis",
          },
          {
            id: "tier",
            label: "Tier",
            accessorKey: "tier",
            format: "tag",
            tagColors: {
              Enterprise: {
                color: UI.Table.SEMANTIC_COLOR["enterprise"],
                originalValue: "Enterprise",
              },
              Premium: {
                color: UI.Table.SEMANTIC_COLOR["premium"],
                originalValue: "Premium",
              },
              Basic: {
                color: UI.Table.SEMANTIC_COLOR["basic"],
                originalValue: "Basic",
              },
            },
            width: "150px",
            overflow: "ellipsis",
          },
          {
            id: "headquarters",
            label: "Headquarters",
            accessorKey: "headquarters",
            overflow: "ellipsis",
          },
          {
            id: "arr",
            label: "ARR",
            accessorKey: "arr",
            format: "currency",
            width: "150px",
            overflow: "ellipsis",
          },
        ]}
        actions={[{ label: "View Details" }]}
        onTableRowActionHook={(rowIdx) => {
          setModalContent(data[rowIdx] as unknown as null);
        }}
        enableRowSelection={true}
        rowSelections={selected}
        setRowSelections={setSelected}
        allowMultiSelection={true}
        onTablePageChangeHook={() => {}}
        totalRecords={data.length}
      />
    </div>
  );
}

export default TableComponent;
