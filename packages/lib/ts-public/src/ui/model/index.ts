import { BaseGeneric, SelectOption } from "../types";

import * as InputInteraction from "./inputInteraction";
import * as DisplayInteraction from "./displayInteraction";
import * as ButtonInteraction from "./buttonInteraction";
import * as LayoutInteraction from "./layoutInteraction";
import * as PageInteraction from "./pageInteraction";

export type All<
  TId extends BaseGeneric.Id,
  TRequired extends BaseGeneric.Required,
  TChildren extends BaseGeneric.Children,
  TOptions extends SelectOption.List,
> =
  | InputInteraction.Text<TId, TRequired>
  | InputInteraction.Email<TId, TRequired>
  | InputInteraction.Url<TId, TRequired>
  | InputInteraction.Number<TId, TRequired>
  | InputInteraction.Password<TId, TRequired>
  | InputInteraction.RadioGroup<TId, TRequired, TOptions>
  | InputInteraction.SelectDropdown<TId, TRequired, TOptions>
  | InputInteraction.MultiSelectDropdown<TId, TRequired, TOptions>
  | InputInteraction.Table<TId, TRequired>
  | InputInteraction.FileDrop<TId, TRequired>
  | InputInteraction.Date<TId, TRequired>
  | InputInteraction.Time<TId, TRequired>
  | InputInteraction.DateTime<TId, TRequired>
  | InputInteraction.TextArea<TId, TRequired>
  | InputInteraction.Json<TId, TRequired>
  | InputInteraction.Checkbox<TId, TRequired>
  | ButtonInteraction.Default<TId>
  | ButtonInteraction.FormSubmit<TId>
  | ButtonInteraction.BarChart<TId>
  | ButtonInteraction.LineChart<TId>
  | DisplayInteraction.None<TId>
  | DisplayInteraction.Text<TId>
  | DisplayInteraction.Header<TId>
  | DisplayInteraction.Json<TId>
  | DisplayInteraction.Spinner<TId>
  | DisplayInteraction.Code<TId>
  | DisplayInteraction.Image<TId>
  | DisplayInteraction.Markdown<TId>
  | DisplayInteraction.Pdf<TId>
  | DisplayInteraction.Divider<TId>
  | DisplayInteraction.Statistic<TId>
  | LayoutInteraction.Stack<TId, TChildren>
  | LayoutInteraction.Form<TId, TChildren>;

export type PageAll<TId extends BaseGeneric.Id> = PageInteraction.Confirm<TId>;

export {
  InputInteraction,
  ButtonInteraction,
  DisplayInteraction,
  LayoutInteraction,
  PageInteraction,
};
