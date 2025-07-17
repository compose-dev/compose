import { m, u } from "@compose/ts";

const TIMEFRAME_TO_LABEL: Record<m.Report.Timeframe, string> = {
  [m.Report.TIMEFRAMES.LAST_24_HOURS]: "Last 24 Hours",
  [m.Report.TIMEFRAMES.LAST_7_DAYS]: "Last 7 Days",
  [m.Report.TIMEFRAMES.LAST_30_DAYS]: "Last 30 Days",
  [m.Report.TIMEFRAMES.LAST_WEEK]: "Last Week",
  [m.Report.TIMEFRAMES.TWO_WEEKS_AGO]: "Two Weeks Ago",
  [m.Report.TIMEFRAMES.LAST_MONTH]: "Last Month",
  [m.Report.TIMEFRAMES.TWO_MONTHS_AGO]: "Two Months Ago",
  [m.Report.TIMEFRAMES.CUSTOM]: "Custom",
};

const TIMEFRAME_OPTIONS: { label: string; value: m.Report.Timeframe }[] = [
  {
    label: TIMEFRAME_TO_LABEL[m.Report.TIMEFRAMES.LAST_24_HOURS],
    value: m.Report.TIMEFRAMES.LAST_24_HOURS,
  },
  {
    label: TIMEFRAME_TO_LABEL[m.Report.TIMEFRAMES.LAST_7_DAYS],
    value: m.Report.TIMEFRAMES.LAST_7_DAYS,
  },
  {
    label: TIMEFRAME_TO_LABEL[m.Report.TIMEFRAMES.LAST_30_DAYS],
    value: m.Report.TIMEFRAMES.LAST_30_DAYS,
  },
  {
    label: TIMEFRAME_TO_LABEL[m.Report.TIMEFRAMES.LAST_WEEK],
    value: m.Report.TIMEFRAMES.LAST_WEEK,
  },
  {
    label: TIMEFRAME_TO_LABEL[m.Report.TIMEFRAMES.TWO_WEEKS_AGO],
    value: m.Report.TIMEFRAMES.TWO_WEEKS_AGO,
  },
  {
    label: TIMEFRAME_TO_LABEL[m.Report.TIMEFRAMES.LAST_MONTH],
    value: m.Report.TIMEFRAMES.LAST_MONTH,
  },
  {
    label: TIMEFRAME_TO_LABEL[m.Report.TIMEFRAMES.TWO_MONTHS_AGO],
    value: m.Report.TIMEFRAMES.TWO_MONTHS_AGO,
  },
  {
    label: TIMEFRAME_TO_LABEL[m.Report.TIMEFRAMES.CUSTOM],
    value: m.Report.TIMEFRAMES.CUSTOM,
  },
];

function getPrettifiedDateRange(start: Date, end: Date) {
  const startString = u.date.toString(
    start,
    u.date.SerializedFormat["LLL d, yyyy"]
  );
  const endString = u.date.toString(
    end,
    u.date.SerializedFormat["LLL d, yyyy"]
  );

  return `${startString} - ${endString}`;
}

export { TIMEFRAME_OPTIONS, TIMEFRAME_TO_LABEL, getPrettifiedDateRange };
