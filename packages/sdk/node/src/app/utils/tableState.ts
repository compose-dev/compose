import { UI } from "@composehq/ts-public";
import { SmartDebounce } from "./smartDebounce";

type PaginationView = Pick<
  UI.Table.ViewInternal<UI.Table.DataRow[]>,
  "filterBy" | "sortBy" | "searchQuery"
> & { viewBy?: string };

interface TableStateRecord {
  data: any[];
  totalRecords: number | null;
  offset: number;
  pageSize: number;
  stale: UI.Stale.Option;
  pageUpdateDebouncer: SmartDebounce;
  renderId: string;
  tableId: string;
  initialView: PaginationView;
  activeView: PaginationView;
}

const PAGE_UPDATE_DEBOUNCE_INTERVAL_MS = 250;

const KEY_SEPARATOR = "__";

function searchQueryDidChange(
  oldSearchQuery: PaginationView["searchQuery"],
  newSearchQuery: PaginationView["searchQuery"]
) {
  return oldSearchQuery !== newSearchQuery;
}

function sortByDidChange(
  oldSortBy: PaginationView["sortBy"],
  newSortBy: PaginationView["sortBy"]
) {
  if (oldSortBy === undefined && newSortBy === undefined) {
    return false;
  }

  // If one is undefined, the sort by changed. (We know
  // from the previous check that they are not both undefined.)
  if (oldSortBy === undefined || newSortBy === undefined) {
    return true;
  }

  if (oldSortBy.length !== newSortBy.length) {
    return true;
  }

  return oldSortBy.some((sort, index) => {
    return (
      sort.key !== newSortBy[index].key ||
      sort.direction !== newSortBy[index].direction
    );
  });
}

function filterByDidChange(
  oldFilterBy: PaginationView["filterBy"],
  newFilterBy: PaginationView["filterBy"]
) {
  const noOldFilterBy = oldFilterBy === undefined || oldFilterBy === null;
  const noNewFilterBy = newFilterBy === undefined || newFilterBy === null;

  if (noOldFilterBy && noNewFilterBy) {
    return false;
  }

  if (noOldFilterBy || noNewFilterBy) {
    return true;
  }

  return JSON.stringify(oldFilterBy) !== JSON.stringify(newFilterBy);
}

function viewDidChange(oldView: PaginationView, newView: PaginationView) {
  return (
    searchQueryDidChange(oldView.searchQuery, newView.searchQuery) ||
    sortByDidChange(oldView.sortBy, newView.sortBy) ||
    filterByDidChange(oldView.filterBy, newView.filterBy)
  );
}

class TableState {
  state: Record<string, TableStateRecord>;

  constructor() {
    this.state = {};

    this.generateKey = this.generateKey.bind(this);
    this.parseKey = this.parseKey.bind(this);
    this.has = this.has.bind(this);
    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
    this.update = this.update.bind(this);
  }

  generateKey(renderId: string, tableId: string) {
    return `${renderId}${KEY_SEPARATOR}${tableId}`;
  }

  parseKey(key: string) {
    const splitIndex = key.indexOf(KEY_SEPARATOR);
    const renderId = key.slice(0, splitIndex);
    const tableId = key.slice(splitIndex + KEY_SEPARATOR.length);
    return { renderId, tableId };
  }

  has(renderId: string, tableId: string) {
    const key = this.generateKey(renderId, tableId);
    return this.state[key] !== undefined;
  }

  get(renderId: string, tableId: string): TableStateRecord | undefined {
    const key = this.generateKey(renderId, tableId);
    return this.state[key];
  }

  getByRenderId(renderId: string) {
    return Object.values(this.state).filter(
      (state) => state.renderId === renderId
    );
  }

  set(
    renderId: string,
    tableId: string,
    state: Omit<
      TableStateRecord,
      | "pageUpdateDebouncer"
      | "renderId"
      | "tableId"
      | "updateCount"
      | "activeView"
    >
  ) {
    const key = this.generateKey(renderId, tableId);

    this.state[key] = {
      ...state,
      pageUpdateDebouncer: new SmartDebounce(PAGE_UPDATE_DEBOUNCE_INTERVAL_MS),
      renderId,
      tableId,
      activeView: { ...state.initialView },
    };
  }

  update(renderId: string, tableId: string, state: Partial<TableStateRecord>) {
    const key = this.generateKey(renderId, tableId);

    // Update the active view if the initial view changed. This overrides
    // any changes on the browser side that were made to the active view.
    if (
      state.initialView !== undefined &&
      viewDidChange(state.initialView, this.state[key].initialView)
    ) {
      this.state[key].activeView = { ...state.initialView };
    }

    this.state[key] = { ...this.state[key], ...state };
  }

  delete(renderId: string, tableId: string) {
    const key = this.generateKey(renderId, tableId);
    delete this.state[key];
  }

  deleteForRenderId(renderId: string) {
    Object.keys(this.state).forEach((key) => {
      if (this.parseKey(key).renderId === renderId) {
        delete this.state[key];
      }
    });
  }

  hasQueuedUpdate(renderId: string, tableId: string) {
    const key = this.generateKey(renderId, tableId);
    return this.state[key].pageUpdateDebouncer.hasQueuedUpdate();
  }

  static shouldRefreshTotalRecord(
    previousView: PaginationView,
    newView: PaginationView
  ) {
    if (searchQueryDidChange(previousView.searchQuery, newView.searchQuery)) {
      return true;
    }

    if (filterByDidChange(previousView.filterBy, newView.filterBy)) {
      return true;
    }

    return false;
  }
}

export { TableState as Class, TableStateRecord as Record };
