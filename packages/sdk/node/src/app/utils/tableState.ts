import { UI } from "@composehq/ts-public";
import { SmartDebounce } from "./smartDebounce";

interface TableStateRecord {
  data: any[];
  totalRecords: number | null;
  searchQuery: string | null;
  offset: number;
  pageSize: number;
  stale: UI.Stale.Option;
  pageUpdateDebouncer: SmartDebounce;
  renderId: string;
  tableId: string;
}

const PAGE_UPDATE_DEBOUNCE_INTERVAL_MS = 250;

const KEY_SEPARATOR = "__";

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
      "pageUpdateDebouncer" | "renderId" | "tableId" | "updateCount"
    >
  ) {
    const key = this.generateKey(renderId, tableId);

    this.state[key] = {
      ...state,
      pageUpdateDebouncer: new SmartDebounce(PAGE_UPDATE_DEBOUNCE_INTERVAL_MS),
      renderId,
      tableId,
    };
  }

  update(renderId: string, tableId: string, state: Partial<TableStateRecord>) {
    const key = this.generateKey(renderId, tableId);
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
}

export { TableState as Class, TableStateRecord as Record };
