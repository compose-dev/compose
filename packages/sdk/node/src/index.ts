import { UI } from "@composehq/ts-public";
import { AppHandlerOptions } from "./app";

type State = AppHandlerOptions["state"];
type UI = AppHandlerOptions["ui"];
type Page = AppHandlerOptions["page"];

type TableColumn<TData extends UI.Table.DataRow[] = UI.Table.DataRow[]> =
  UI.Table.ColumnGenerator<TData>;
type TableColumns<TData extends UI.Table.DataRow[] = UI.Table.DataRow[]> =
  UI.Table.ColumnGenerator<TData>[];
type TablePageChangeParams<
  TData extends UI.Table.DataRow[] = UI.Table.DataRow[],
> = UI.Table.PageChangeParams<TData>;
type TablePageChangeResponse<
  TData extends UI.Table.DataRow[] = UI.Table.DataRow[],
> = UI.Table.PageChangeResponse<TData>;

type ComposeFile = UI.ComposeFile.Type;

type SelectOption = UI.SelectOption.Type;
type SelectOptions = UI.SelectOption.List;

export * as Compose from "./module";
export {
  // Core types
  UI,
  Page,
  // Additional types
  ComposeFile,
  SelectOption,
  SelectOptions,
  TableColumn,
  TableColumns,
  TablePageChangeParams,
  TablePageChangeResponse,
  // Deprecated
  State,
};
