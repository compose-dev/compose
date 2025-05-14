import { UI } from "@composehq/ts-public";
import { FormattedTableRow } from "../constants";

type ViewServerFormat = string | undefined;
type ViewDisplayFormat = string;
type ViewValidatedFormat = Omit<
  Required<UI.Table.ViewInternal<FormattedTableRow[]>>,
  "description" | "isDefault" | "overflow" | "density"
> & {
  description?: string;
  isDefault?: boolean;
  overflow?: UI.Table.OverflowBehavior;
  density?: UI.Table.Density;
};

const NO_VIEW_APPLIED_KEY = "__internal__no_view_applied";

export type { ViewServerFormat, ViewDisplayFormat, ViewValidatedFormat };
export { NO_VIEW_APPLIED_KEY };
