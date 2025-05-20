import { UI } from "@composehq/ts-public";
import { FormattedTableRow } from "../constants";
import { SortingState } from "@tanstack/react-table";

type DisplaySortModel = SortingState;
type ValidatedSortModel = SortingState;
type ServerSortModel = UI.Table.ColumnSortRule<FormattedTableRow[]>[];

export type { ServerSortModel, DisplaySortModel, ValidatedSortModel };
