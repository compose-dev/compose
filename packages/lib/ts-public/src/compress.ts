import * as UI from "./ui";

/**
 * Optimizes the table packet size by removing the columns that are not
 * needed by the client.
 *
 * @param table - The table to optimize.
 * @returns The optimized table.
 */
function compressTableLayout<T extends UI.ComponentGenerators.InputTable>(
  table: T
): T {
  const columnsProperty = table.model.properties.columns;

  const columns =
    columnsProperty === null
      ? table.model.properties.data.length > 0
        ? Object.keys(table.model.properties.data[0])
        : null
      : columnsProperty;

  if (columns === null) {
    return table;
  }

  const optimizedColumns = columns.map((column, idx) => {
    const optimized =
      typeof column === "string"
        ? {
            key: idx.toString(),
            original: column,
          }
        : { ...column, key: idx.toString(), original: column.key };

    return optimized;
  });

  const newData = table.model.properties.data.map((row) => {
    const newRow: Record<string, any> = {};

    optimizedColumns.forEach((column) => {
      newRow[column.key] = row[column.original];
    });

    return newRow;
  });

  return {
    ...table,
    model: {
      ...table.model,
      properties: {
        ...table.model.properties,
        data: newData,
        columns: optimizedColumns,
      },
    },
  };
}

function compressStaticLayout<T extends UI.ComponentGenerators.All>(
  layout: T
): T {
  if (layout.type === UI.TYPE.INPUT_TABLE) {
    return compressTableLayout(layout) as T;
  }

  if (layout.interactionType === UI.INTERACTION_TYPE.LAYOUT) {
    return {
      ...layout,
      model: {
        ...layout.model,
        children: Array.isArray(layout.model.children)
          ? layout.model.children.map((child) => compressStaticLayout(child))
          : compressStaticLayout(layout.model.children as T),
      },
    };
  }

  return layout;
}

function compressStaticLayoutWithoutRecursion<
  T extends UI.ComponentGenerators.All,
>(layout: T): T {
  if (layout.type === UI.TYPE.INPUT_TABLE) {
    return compressTableLayout(layout) as T;
  }

  if (layout.interactionType === UI.INTERACTION_TYPE.LAYOUT) {
    return layout;
  }

  return layout;
}

export {
  compressStaticLayout as uiTree,
  compressStaticLayoutWithoutRecursion as uiTreeWithoutRecursion,
  compressTableLayout as table,
};
