import { useState } from "react";
import Table from "~/components/table";
import { toast } from "~/utils/toast";

const data = [
  { name: "Sarah", age: 31, city: "Seattle" },
  { name: "Tom", age: 27, city: "Boston" },
  { name: "Lisa", age: 36, city: "Denver" },
];

function TableActions() {
  const { addToast } = toast.useStore();
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
          { id: "age", label: "Age", accessorKey: "age", overflow: "ellipsis" },
          {
            id: "city",
            label: "City",
            accessorKey: "city",
            overflow: "ellipsis",
          },
        ]}
        actions={[
          {
            label: "Edit",
          },
          {
            label: "Delete",
            appearance: "danger",
          },
          {
            label: "View",
            surface: true,
          },
        ]}
        onTableRowActionHook={(rowIdx, actionIdx) => {
          if (actionIdx === 0) {
            addToast({
              title: "Edit",
              message: `You clicked the edit action on row ${rowIdx + 1}`,
            });
          } else if (actionIdx === 1) {
            addToast({
              title: "Delete",
              message: `You clicked the delete action on row ${rowIdx + 1}`,
            });
          } else if (actionIdx === 2) {
            addToast({
              title: "View",
              message: `You clicked the view action on row ${rowIdx + 1}`,
            });
          }
        }}
        enableRowSelection={false}
        rowSelections={selected}
        setRowSelections={setSelected}
        onTablePageChangeHook={() => {}}
        totalRecords={data.length}
      />
    </div>
  );
}

export default TableActions;
