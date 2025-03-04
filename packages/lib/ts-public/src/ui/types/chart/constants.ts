import { NonSymbolKeys } from "../../../types";

type SeriesChartInputData = Record<string | number, any>[];

type SeriesChartData = Record<string, string | number>[];

const LABEL_SERIES_KEY = "_c*id_";

const AGGREGATOR = {
  SUM: "sum",
  COUNT: "count",
  AVERAGE: "average",
  MIN: "min",
  MAX: "max",
} as const;
type Aggregator = (typeof AGGREGATOR)[keyof typeof AGGREGATOR];

const DEFAULT_AGGREGATOR: Aggregator = AGGREGATOR.SUM;

type AdvancedChartSeries<TData extends SeriesChartInputData> = {
  /**
   * Return a custom value for the series. Return `null`/`undefined` to exclude the value from the series.
   */
  value:
    | NonSymbolKeys<TData[number]>
    | ((
        row: TData[number],
        idx: number
      ) => number | null | undefined | Promise<number | null | undefined>);
  label?: string;
  aggregate?: Aggregator;
};

type ChartSeries<TData extends SeriesChartInputData> =
  | NonSymbolKeys<TData[number]>
  | AdvancedChartSeries<TData>;

const BAR_CHART_ORIENTATION = {
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
} as const;
type BarChartOrientation =
  (typeof BAR_CHART_ORIENTATION)[keyof typeof BAR_CHART_ORIENTATION];

const DEFAULT_BAR_CHART_ORIENTATION: BarChartOrientation =
  BAR_CHART_ORIENTATION.VERTICAL;

const BAR_CHART_GROUP_MODE = {
  GROUPED: "grouped",
  STACKED: "stacked",
} as const;
type BarChartGroupMode =
  (typeof BAR_CHART_GROUP_MODE)[keyof typeof BAR_CHART_GROUP_MODE];

const DEFAULT_BAR_CHART_GROUP_MODE: BarChartGroupMode =
  BAR_CHART_GROUP_MODE.STACKED;

const CHART_SCALE = {
  LINEAR: "linear",
  SYMLOG: "symlog",
} as const;
type ChartScale = (typeof CHART_SCALE)[keyof typeof CHART_SCALE];

const DEFAULT_CHART_SCALE: ChartScale = CHART_SCALE.LINEAR;

export {
  SeriesChartData as SeriesData,
  SeriesChartInputData as SeriesInputData,
  AGGREGATOR,
  Aggregator,
  DEFAULT_AGGREGATOR,
  ChartSeries,
  LABEL_SERIES_KEY,
  BAR_CHART_ORIENTATION as BAR_ORIENTATION,
  BarChartOrientation as BarOrientation,
  BAR_CHART_GROUP_MODE as BAR_GROUP_MODE,
  BarChartGroupMode as BarGroupMode,
  DEFAULT_BAR_CHART_ORIENTATION as DEFAULT_BAR_ORIENTATION,
  DEFAULT_BAR_CHART_GROUP_MODE as DEFAULT_BAR_GROUP_MODE,
  CHART_SCALE as SCALE,
  ChartScale as Scale,
  DEFAULT_CHART_SCALE as DEFAULT_SCALE,
};
