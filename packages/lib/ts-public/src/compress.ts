import * as UI from "./ui";

const UNIQUE_PRIMARY_KEY_ID = "i";

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
      ? // If the table is paged, do not optimize the columns unless
        // the property is explicitly set by the user. Manually paged
        // tables transmit the table model prior to loading any data,
        // so it's too late to optimize the columns on future pages.
        table.model.properties.data.length > 0 &&
        table.model.properties.paged !== true
        ? Object.keys(table.model.properties.data[0])
        : null
      : columnsProperty;

  if (columns === null) {
    return table;
  }

  const optimizedColumns = columns.map((column, idx) => {
    const optimized =
      typeof column === "string" || typeof column === "number"
        ? {
            key: idx.toString(),
            original: column,
          }
        : { ...column, key: idx.toString(), original: column.key };

    return optimized;
  });

  const originalPrimaryKey = table.model.properties.primaryKey;
  let shouldSeparatelyAssignPrimaryKey = false;

  if (originalPrimaryKey !== undefined) {
    const primaryKeyColumn = optimizedColumns.find(
      (column) => column.original === originalPrimaryKey
    );

    if (primaryKeyColumn) {
      primaryKeyColumn.key = UNIQUE_PRIMARY_KEY_ID;
    } else {
      shouldSeparatelyAssignPrimaryKey = true;
    }
  }

  const newData = table.model.properties.data.map((row) => {
    const newRow: Record<string, any> = {};

    optimizedColumns.forEach((column) => {
      newRow[column.key] = row[column.original];
    });

    if (shouldSeparatelyAssignPrimaryKey) {
      newRow[UNIQUE_PRIMARY_KEY_ID] = row[originalPrimaryKey as string];
    }

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
        primaryKey:
          originalPrimaryKey !== undefined ? UNIQUE_PRIMARY_KEY_ID : undefined,
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
