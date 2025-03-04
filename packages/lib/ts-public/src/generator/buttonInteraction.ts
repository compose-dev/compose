import { NonSymbolKeys } from "../types";
import * as UI from "../ui";
import { BaseWithButtonInteraction } from "./base";

interface ButtonDefaultProperties extends BaseWithButtonInteraction {
  label: UI.Components.ButtonDefault["model"]["properties"]["label"];
  appearance?: UI.Components.ButtonDefault["model"]["properties"]["appearance"];
  onClick: UI.Components.ButtonDefault["hooks"]["onClick"];
}

type RequiredButtonDefaultFields = "id";
type OptionalButtonDefaultProperties = Omit<
  ButtonDefaultProperties,
  RequiredButtonDefaultFields
>;

const defaultButtonDefaultProperties: OptionalButtonDefaultProperties = {
  onClick: null,
  style: null,
  label: null,
};

function _createButton(
  type: typeof UI.TYPE.BUTTON_DEFAULT | typeof UI.TYPE.BUTTON_FORM_SUBMIT,
  id: ButtonDefaultProperties["id"],
  properties: Partial<OptionalButtonDefaultProperties> = {}
):
  | UI.OutputOmittedComponents.ButtonDefault
  | UI.OutputOmittedComponents.ButtonFormSubmit {
  const mergedProperties = { ...defaultButtonDefaultProperties, ...properties };

  return {
    model: {
      id,
      style: mergedProperties.style,
      properties: {
        label: mergedProperties.label,
        hasOnClickHook: mergedProperties.onClick !== null,
        ...(mergedProperties.appearance && {
          appearance: mergedProperties.appearance,
        }),
      },
    },
    hooks: {
      onClick: mergedProperties.onClick,
    },
    type,
    interactionType: UI.INTERACTION_TYPE.BUTTON,
  };
}

function buttonDefault(
  id: ButtonDefaultProperties["id"],
  properties: Partial<OptionalButtonDefaultProperties> = {}
): UI.OutputOmittedComponents.ButtonDefault {
  return {
    ..._createButton(UI.TYPE.BUTTON_DEFAULT, id, properties),
    type: UI.TYPE.BUTTON_DEFAULT,
  };
}

function buttonFormSubmit(
  id: ButtonDefaultProperties["id"],
  properties: Partial<OptionalButtonDefaultProperties> = {}
): UI.OutputOmittedComponents.ButtonFormSubmit {
  return {
    ..._createButton(UI.TYPE.BUTTON_FORM_SUBMIT, id, properties),
    type: UI.TYPE.BUTTON_FORM_SUBMIT,
  };
}

interface ButtonBarChartProperties<TData extends UI.Chart.SeriesInputData>
  extends BaseWithButtonInteraction {
  data: TData;
  label: UI.Components.ButtonBarChart["model"]["properties"]["label"];
  description: UI.Components.ButtonBarChart["model"]["properties"]["description"];
  group?:
    | NonSymbolKeys<TData[number]>
    | ((
        row: TData[number],
        idx: number
      ) =>
        | string
        | number
        | null
        | undefined
        | Promise<string | number | null | undefined>);
  aggregate?: UI.Chart.Aggregator;
  series?: UI.Chart.ChartSeries<TData>[];
  orientation?: UI.Components.ButtonBarChart["model"]["properties"]["orientation"];
  groupMode?: UI.Components.ButtonBarChart["model"]["properties"]["groupMode"];
  scale?: UI.Components.ButtonBarChart["model"]["properties"]["scale"];
}

type RequiredBarChartFields = "id" | "data";
type OptionalBarChartProperties<TData extends UI.Chart.SeriesInputData> = Omit<
  ButtonBarChartProperties<TData>,
  RequiredBarChartFields
>;

/**
 * Create a bar chart.
 *
 * @see {@link https://docs.composehq.com/components/chart/bar-chart Documentation}
 *
 * @param {string} id - Unique id to identify the bar chart.
 * @param {UI.Chart.SeriesInputData} data - Data to be displayed in the bar chart.
 * @param {Partial<OptionalBarChartProperties<TData>>} properties - Optional properties to configure the bar chart.
 * @param {UI.Components.ButtonBarChart["model"]["properties"]["label"]} properties.label - Label to be displayed above the bar chart.
 * @param {UI.Components.ButtonBarChart["model"]["properties"]["description"]} properties.description - Description to be displayed between the label and the bar chart.
 * @param {UI.Components.ButtonBarChart["model"]["properties"]["group"]} properties.group - How to group the data. Should be either:
 * - A key from the data to group by. (e.g. `"month"`)
 * - A function that returns the group for that row (e.g. `(row) => row.date.getMonth()`) or `null`/`undefined` to exclude the row from the chart.
 *
 * Defaults to using the key `"group"`.
 * @param {UI.Components.ButtonBarChart["model"]["properties"]["aggregate"]} properties.aggregate - How to aggregate grouped data. Should be one of:
 * - `"sum"`: Sum the values.
 * - `"count"`: Count the number of values.
 * - `"average"`: Average the values.
 * - `"min"`: Minimum value.
 * - `"max"`: Maximum value.
 *
 * Defaults to `"sum"`.
 * @param {UI.Components.ButtonBarChart["model"]["properties"]["series"]} properties.series - Custom series to be displayed in the bar chart. Should be a list of the following:
 * - A key from the data (e.g. `"west_coast_sales"`)
 * - Or, an object with the following:
 * * - `value` (required): A key from the data (e.g. `"west_coast_sales"`) or a function that returns a number (e.g. `(row) => row.west_coast_sales + row.east_coast_sales`). `Null`/`undefined` values will be excluded from the series.
 * * - `label` (optional): A string to be displayed in the legend.
 * * - `aggregate` (optional): How to aggregate the data for this series. Overrides the `properties.aggregate` setting.
 *
 * Defaults to using all keys found in the first row of the data excluding the `group` key.
 * @param {UI.Components.ButtonBarChart["model"]["properties"]["orientation"]} properties.orientation - Orientation of the bar chart. Either `"horizontal"` or `"vertical"`. Defaults to `"vertical"`.
 * @param {UI.Components.ButtonBarChart["model"]["properties"]["groupMode"]} properties.groupMode - Group mode of the bar chart. Either `"grouped"` or `"stacked"`. Defaults to `"stacked"`.
 * @param {UI.Components.ButtonBarChart["model"]["properties"]["scale"]} properties.scale - Scale of the bar chart. Either `"linear"` or `"symlog"`. Defaults to `"linear"`.
 * @param {UI.Components.ButtonBarChart["model"]["style"]} properties.style - CSS styles object to directly style the bar chart HTML element. For example `{ height: "800px" }`.
 * @returns The configured bar chart component.
 *
 * @example
 * ```ts
 * const sales = [
 *   { group: "January", west_coast_sales: 100, east_coast_sales: 200 },
 *   { group: "February", west_coast_sales: 150, east_coast_sales: 250 },
 *   { group: "March", west_coast_sales: 120, east_coast_sales: 220 },
 * ]
 * page.add(() => ui.barChart("bar-chart-id", sales));
 * ```
 */
function buttonBarChart<TData extends UI.Chart.SeriesInputData>(
  id: ButtonBarChartProperties<TData>["id"],
  data: TData,
  properties: Partial<OptionalBarChartProperties<TData>> = {}
): UI.OutputOmittedComponents.ButtonBarChart {
  if (!Array.isArray(data)) {
    throw new Error("data must be an array");
  }

  const shallowCopy: TData = [...data] as TData;

  const finalData = UI.Chart.formatSeriesData<TData>(shallowCopy, {
    group: properties.group,
    series: properties.series,
    aggregate: properties.aggregate,
  });

  const modelProperties: UI.OutputOmittedComponents.ButtonBarChart["model"]["properties"] =
    {
      data: finalData as any, // We'll await the data in the static layout generator
    };

  if (properties.label !== undefined) {
    modelProperties.label = properties.label;
  }

  if (properties.description !== undefined) {
    modelProperties.description = properties.description;
  }

  if (properties.orientation !== undefined) {
    modelProperties.orientation = properties.orientation;
  }

  if (properties.groupMode !== undefined) {
    modelProperties.groupMode = properties.groupMode;
  }

  if (properties.scale !== undefined) {
    modelProperties.scale = properties.scale;
  }

  return {
    model: {
      id,
      style: properties.style ?? null,
      properties: modelProperties,
    },
    hooks: {},
    type: UI.TYPE.BUTTON_BAR_CHART,
    interactionType: UI.INTERACTION_TYPE.BUTTON,
  };
}

const buttonGenerator = {
  default: buttonDefault,
  formSubmit: buttonFormSubmit,
  barChart: buttonBarChart,
};

export { buttonGenerator };
