import { UI as UIModule } from "@composehq/ts-public";
import { AppHandlerOptions } from "./app";

type State = AppHandlerOptions["state"];
type UI = AppHandlerOptions["ui"];
type Page = AppHandlerOptions["page"];

// Table Column Types
type TableColumn<
  TData extends UIModule.Table.DataRow[] = UIModule.Table.DataRow[],
> = UIModule.Table.ColumnGenerator<TData>;
type TableColumns<
  TData extends UIModule.Table.DataRow[] = UIModule.Table.DataRow[],
> = UIModule.Table.ColumnGenerator<TData>[];

// Table Page Change Types
type TablePageChangeParams<
  TData extends UIModule.Table.DataRow[] = UIModule.Table.DataRow[],
> = UIModule.Table.PageChangeParams<TData>;
type TablePageChangeResponse<
  TData extends UIModule.Table.DataRow[] = UIModule.Table.DataRow[],
> = UIModule.Table.PageChangeResponse<TData>;

// Table Action Types
type TableAction<
  TData extends UIModule.Table.DataRow[] = UIModule.Table.DataRow[],
> = UIModule.Table.Action<TData>;
type TableActions<
  TData extends UIModule.Table.DataRow[] = UIModule.Table.DataRow[],
> = UIModule.Table.Action<TData>[];

// Table View Types
type TableView<
  TData extends UIModule.Table.DataRow[] = UIModule.Table.DataRow[],
> = UIModule.Table.View<TData>;
type TableViews<
  TData extends UIModule.Table.DataRow[] = UIModule.Table.DataRow[],
> = UIModule.Table.View<TData>[];

// Table Column Filter Types
type TableColumnFilterModel<
  TData extends UIModule.Table.DataRow[] = UIModule.Table.DataRow[],
> = UIModule.Table.ColumnFilterModel<TData>;
type TableColumnFilterGroup<
  TData extends UIModule.Table.DataRow[] = UIModule.Table.DataRow[],
> = UIModule.Table.ColumnFilterGroup<TData>;
type TableColumnFilterRule<
  TData extends UIModule.Table.DataRow[] = UIModule.Table.DataRow[],
> = UIModule.Table.ColumnFilterRule<TData>;

// Table Column Sort Types
type TableColumnSortRule<
  TData extends UIModule.Table.DataRow[] = UIModule.Table.DataRow[],
> = UIModule.Table.ColumnSortRule<TData>;
type TableColumnSortModel<
  TData extends UIModule.Table.DataRow[] = UIModule.Table.DataRow[],
> = UIModule.Table.ColumnSortModel<TData>;

type ComposeFile = UIModule.ComposeFile.Type;

type SelectOption = UIModule.SelectOption.Type;
type SelectOptions = UIModule.SelectOption.List;

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
