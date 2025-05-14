import { flexRender } from "@tanstack/react-table";
import { TanStackTable } from "../../utils";
import React from "react";

function ColumnHeaderRow({ table }: { table: TanStackTable }) {
  const leftHeaderGroups = table.getLeftHeaderGroups();
  const centerHeaderGroups = table.getCenterHeaderGroups();
  const rightHeaderGroups = table.getRightHeaderGroups();

  const hasLeftHeaders =
    leftHeaderGroups.length > 0 && leftHeaderGroups[0].headers.length > 0;
  const hasRightHeaders =
    rightHeaderGroups.length > 0 && rightHeaderGroups[0].headers.length > 0;

  return (
    <div className="flex sticky top-0 z-10 bg-brand-overlay">
      {hasLeftHeaders && (
        <div className="sticky flex left-0 border-r border-brand-neutral z-10 contain-paint">
          {leftHeaderGroups.map((group) =>
            group.headers.map((header) => (
              <React.Fragment key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </React.Fragment>
            ))
          )}
        </div>
      )}
      {centerHeaderGroups.map((group) =>
        group.headers.map((header) => (
          <React.Fragment key={header.id}>
            {flexRender(header.column.columnDef.header, header.getContext())}
          </React.Fragment>
        ))
      )}
      {hasRightHeaders && (
        <div
          className="sticky flex right-0 border-l border-brand-neutral contain-paint"
          style={{ boxShadow: "1px 0 0 var(--brand-bg-overlay)" }}
        >
          {rightHeaderGroups.map((group) =>
            group.headers.map((header) => (
              <React.Fragment key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </React.Fragment>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ColumnHeaderRow;
