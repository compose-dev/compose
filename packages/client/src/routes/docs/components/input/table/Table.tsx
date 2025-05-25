import { useState } from "react";
import Table from "~/components/table";
import { Modal } from "~/components/modal";
import Json from "~/components/json";
import { UI } from "@composehq/ts-public";
import { faker } from "@composehq/faker";

function TableComponent({ coreConcepts }: { coreConcepts?: boolean }) {
  const [data] = useState(
    faker.records(
      {
        companyName: "companyName",
        tier: {
          type: "arrayElement",
          options: ["Enterprise", "Premium", "Basic"],
        },
        arr: {
          type: "int",
          min: 10000,
          max: 1000000,
        },
        onboarded: "boolean",
      },
      1456
    )
  );
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
            Customer Details
          </Modal.CloseableHeader>
          <Modal.Body>
            <Json json={modalContent} label={null} />
          </Modal.Body>
        </Modal.Root>
      )}
      <Table.Root
        id="companies"
        data={data}
        columns={[
          {
            id: "companyName",
            label: "Name",
            accessorKey: "companyName",
            format: "string",
            original: "companyName",
          },
          {
            id: "tier",
            label: "Tier",
            accessorKey: "tier",
            format: "tag",
            original: "tier",
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
          },
          {
            id: "arr",
            label: "ARR",
            accessorKey: "arr",
            format: "currency",
            original: "arr",
          },
          {
            id: "onboarded",
            label: "Onboarded",
            accessorKey: "onboarded",
            format: "boolean",
            original: "onboarded",
          },
        ]}
        actions={[{ label: "Details" }]}
        views={
          coreConcepts
            ? []
            : [
                {
                  label: "Highest ARR",
                  description: "Sort by ARR (decreasing)",
                  key: "highest-arr",
                  sortBy: [{ key: "arr", direction: "desc" }],
                  isDefault: true,
                },
                {
                  label: "Enterprise Customers",
                  description: "Filter to show only enterprise customers",
                  key: "enterprise-customers",
                  filterBy: {
                    key: "tier",
                    operator: "hasAny",
                    value: ["Enterprise"],
                  },
                },
              ]
        }
        onTableRowActionHook={(rowIdx) => {
          setModalContent(data[rowIdx] as unknown as null);
        }}
        enableRowSelection={false}
        rowSelections={{}}
        setRowSelections={() => {}}
        onTablePageChangeHook={() => {}}
        totalRecords={data.length}
      />
    </div>
  );
}

export default TableComponent;
