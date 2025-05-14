import { UI } from "@composehq/ts-public";
import { UIRenderStaticLayout } from "../constants";
import { ComponentTree, TableState } from "../utils";

type PaginationView = Pick<
  UI.Table.ViewInternal<UI.Table.DataRow[]>,
  "searchQuery" | "sortBy" | "filterBy"
> & { viewBy?: string };

const FALLBACK_VIEW: PaginationView = {
  searchQuery: null,
  sortBy: [],
  filterBy: null,
  viewBy: undefined,
};

function getSortBy(
  sortable: UI.Table.SortOption,
  defaultView: UI.Table.ViewInternal<UI.Table.DataRow[]>
) {
  if (sortable === UI.Table.SORT_OPTION.DISABLED) {
    return [];
  }

  if (sortable === UI.Table.SORT_OPTION.SINGLE) {
    if (defaultView.sortBy) {
      return defaultView.sortBy.length > 1
        ? defaultView.sortBy.slice(0, 1)
        : defaultView.sortBy;
    }

    return FALLBACK_VIEW.sortBy;
  }

  if (defaultView.sortBy) {
    return defaultView.sortBy;
  }

  return FALLBACK_VIEW.sortBy;
}

function getDefaultView(
  views: UI.Components.InputTable["model"]["properties"]["views"],
  filterable: boolean,
  searchable: boolean,
  sortable: UI.Table.SortOption
): PaginationView {
  try {
    if (!views) {
      return { ...FALLBACK_VIEW };
    }

    const defaultView = views.find((view) => view.isDefault);

    if (!defaultView) {
      return { ...FALLBACK_VIEW };
    }

    return {
      viewBy: defaultView.key,
      filterBy:
        filterable && defaultView.filterBy
          ? defaultView.filterBy
          : FALLBACK_VIEW.filterBy,
      searchQuery:
        searchable && defaultView.searchQuery
          ? defaultView.searchQuery
          : FALLBACK_VIEW.searchQuery,
      sortBy: getSortBy(sortable, defaultView),
    };
  } catch (error) {
    return { ...FALLBACK_VIEW };
  }
}

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

    const searchable =
      component.model.properties.notSearchable === true ? false : true;

    const defaultView = getDefaultView(
      component.model.properties.views,
      component.model.properties.filterable ?? true,
      searchable,
      component.model.properties.sortable ?? UI.Table.SORT_OPTION.MULTI
    );

    const offset = currentState ? currentState.offset : UI.Table.DEFAULT_OFFSET;
    const pageSize = currentState
      ? currentState.pageSize
      : component.model.properties.pageSize || UI.Table.DEFAULT_PAGE_SIZE;

    let data: UI.Table.DataRow[];
    let totalRecords: number;

    if (component.hooks.onPageChange.type === UI.Table.PAGINATION_TYPE.MANUAL) {
      if (currentState) {
        data = currentState.data;
        totalRecords = currentState.totalRecords || currentState.data.length;

        tableState.update(renderId, component.model.id, {
          stale: UI.Stale.OPTION.UPDATE_NOT_DISABLED,
          initialView: defaultView,
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
          initialView: defaultView,
        });
      }
    } else {
      const all = component.hooks.onPageChange.fn();
      data = all.slice(offset, offset + pageSize);
      totalRecords = all.length;

      if (!currentState) {
        tableState.set(renderId, component.model.id, {
          totalRecords,
          offset,
          pageSize,
          data,
          stale: UI.Stale.OPTION.FALSE,
          initialView: defaultView,
        });
      } else {
        tableState.update(renderId, component.model.id, {
          initialView: defaultView,
        });
      }
    }

    // Set these at the end to ensure they are working with the most recent
    // active view. In some cases, the active view will be overriden when
    // the initial view is updated above!
    const searchQuery = currentState
      ? currentState.activeView.searchQuery
      : defaultView.searchQuery;
    const sortBy = currentState
      ? currentState.activeView.sortBy
      : defaultView.sortBy;
    const filterBy = currentState
      ? currentState.activeView.filterBy
      : defaultView.filterBy;
    const viewBy = currentState
      ? currentState.activeView.viewBy
      : defaultView.viewBy;

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
          sortBy,
          filterBy,
          viewBy,
          pageSize,
        },
      },
    };
  });
}

export { configureTablePagination };
