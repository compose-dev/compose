import { UI } from "@composehq/ts-public";
import { UIRenderStaticLayout } from "../constants";
import { ComponentTree, TableState } from "../utils";

async function configureTablePagination(
  layout: UIRenderStaticLayout,
  renderId: string,
  tableState: TableState.Class
) {
  const count = ComponentTree.countByCondition(
    layout,
    (component) =>
      component.type === UI.TYPE.INPUT_TABLE &&
      component.hooks.onPageChange !== null
  );

  if (count === 0) {
    tableState.deleteForRenderId(renderId);
    return layout;
  }

  return await ComponentTree.editByCondition(layout, async (component) => {
    if (component.type !== UI.TYPE.INPUT_TABLE) {
      return false;
    }

    const currentState = tableState.get(renderId, component.model.id);

    // If the component is no longer paginated, and it was previously paginated,
    // delete the table state for the component.
    if (component.hooks.onPageChange === null) {
      if (currentState) {
        tableState.delete(renderId, component.model.id);
      }

      return false;
    }

    const offset = currentState ? currentState.offset : UI.Table.DEFAULT_OFFSET;
    const pageSize = currentState
      ? currentState.pageSize
      : component.model.properties.pageSize || UI.Table.DEFAULT_PAGE_SIZE;
    const searchQuery = currentState
      ? currentState.searchQuery
      : UI.Table.DEFAULT_SEARCH_QUERY;

    let data: UI.Table.DataRow[];
    let totalRecords: number;

    if (component.hooks.onPageChange.type === UI.Table.PAGINATION_TYPE.MANUAL) {
      if (currentState) {
        data = currentState.data;
        totalRecords = currentState.totalRecords || currentState.data.length;

        tableState.update(renderId, component.model.id, {
          stale: UI.Stale.OPTION.UPDATE_NOT_DISABLED,
          initialSortBy: component.model.properties.sortBy || [],
          initialFilterBy: component.model.properties.filterBy || null,
        });
      } else {
        data = [];
        totalRecords = data.length;

        tableState.set(renderId, component.model.id, {
          totalRecords: null,
          stale: UI.Stale.OPTION.INITIALLY_STALE,
          data,
          offset,
          pageSize,
          searchQuery,
          initialSortBy: component.model.properties.sortBy || [],
          initialFilterBy: component.model.properties.filterBy || null,
        });
      }
    } else {
      const all = component.hooks.onPageChange.fn();
      data = all.slice(offset, offset + pageSize);
      totalRecords = all.length;

      if (!currentState) {
        tableState.set(renderId, component.model.id, {
          totalRecords,
          searchQuery,
          offset,
          pageSize,
          data,
          stale: UI.Stale.OPTION.FALSE,
          initialSortBy: component.model.properties.sortBy || [],
          initialFilterBy: component.model.properties.filterBy || null,
        });
      } else {
        tableState.update(renderId, component.model.id, {
          initialSortBy: component.model.properties.sortBy || [],
          initialFilterBy: component.model.properties.filterBy || null,
        });
      }
    }

    return {
      ...component,
      model: {
        ...component.model,
        properties: {
          ...component.model.properties,
          data,
          totalRecords,
          offset,
          searchQuery,
          pageSize,
        },
      },
    };
  });
}

export { configureTablePagination };
