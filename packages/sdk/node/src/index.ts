import { UI } from "@composehq/ts-public";
import { AppHandlerOptions } from "./app";

type State = AppHandlerOptions["state"];
type UI = AppHandlerOptions["ui"];
type Page = AppHandlerOptions["page"];

// Table Column Types
type TableColumn<TData extends UI.Table.DataRow[] = UI.Table.DataRow[]> =
  UI.Table.ColumnGenerator<TData>;
type TableColumns<TData extends UI.Table.DataRow[] = UI.Table.DataRow[]> =
  UI.Table.ColumnGenerator<TData>[];

// Table Page Change Types
type TablePageChangeParams<
  TData extends UI.Table.DataRow[] = UI.Table.DataRow[],
> = UI.Table.PageChangeParams<TData>;
type TablePageChangeResponse<
  TData extends UI.Table.DataRow[] = UI.Table.DataRow[],
> = UI.Table.PageChangeResponse<TData>;

// Table Action Types
type TableAction<TData extends UI.Table.DataRow[] = UI.Table.DataRow[]> =
  UI.Table.Action<TData>;
type TableActions<TData extends UI.Table.DataRow[] = UI.Table.DataRow[]> =
  UI.Table.Action<TData>[];

// Table View Types
type TableView<TData extends UI.Table.DataRow[] = UI.Table.DataRow[]> =
  UI.Table.View<TData>;
type TableViews<TData extends UI.Table.DataRow[] = UI.Table.DataRow[]> =
  UI.Table.View<TData>[];

// Table Column Filter Types
type TableColumnFilterModel<
  TData extends UI.Table.DataRow[] = UI.Table.DataRow[],
> = UI.Table.ColumnFilterModel<TData>;
type TableColumnFilterGroup<
  TData extends UI.Table.DataRow[] = UI.Table.DataRow[],
> = UI.Table.ColumnFilterGroup<TData>;
type TableColumnFilterRule<
  TData extends UI.Table.DataRow[] = UI.Table.DataRow[],
> = UI.Table.ColumnFilterRule<TData>;

// Table Column Sort Types
type TableColumnSortRule<
  TData extends UI.Table.DataRow[] = UI.Table.DataRow[],
> = UI.Table.ColumnSortRule<TData>;
type TableColumnSortModel<
  TData extends UI.Table.DataRow[] = UI.Table.DataRow[],
> = UI.Table.ColumnSortModel<TData>;

type ComposeFile = UI.ComposeFile.Type;

type SelectOption = UI.SelectOption.Type;
type SelectOptions = UI.SelectOption.List;

export * as Compose from "./module";
export {
  // Core Types
  UI,
  Page,

  // Additional types
  ComposeFile,
  SelectOption,
  SelectOptions,

  // Table Types
  TableColumn,
  TableColumns,
  TablePageChangeParams,
  TablePageChangeResponse,
  TableAction,
  TableActions,
  TableView,
  TableViews,

  // Table Data Control Types
  TableColumnFilterModel,
  TableColumnFilterGroup,
  TableColumnFilterRule,
  TableColumnSortRule,
  TableColumnSortModel,

  // Deprecated
  State,
};
