import { flexRender } from "@tanstack/react-table";
import { TanStackTable } from "../../utils";
import React from "react";

function ColumnHeaderRow({ table }: { table: TanStackTable }) {
  return (
    <div className="flex sticky top-0 z-10 bg-brand-overlay">
      {table
        .getHeaderGroups()
        .map((group) =>
          group.headers.map((header) => (
            <React.Fragment key={header.id}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </React.Fragment>
          ))
        )}
    </div>
  );
}

export default ColumnHeaderRow;
