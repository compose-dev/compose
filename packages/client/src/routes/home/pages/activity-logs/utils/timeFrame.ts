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

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

const TIMEFRAME_TO_START_DATE: Record<m.Report.Timeframe, (now: Date) => Date> =
  {
    [m.Report.TIMEFRAMES.LAST_24_HOURS]: (now) =>
      new Date(now.getTime() - ONE_DAY_IN_MS),
    [m.Report.TIMEFRAMES.LAST_7_DAYS]: (now) =>
      new Date(now.getTime() - 7 * ONE_DAY_IN_MS),
    [m.Report.TIMEFRAMES.LAST_30_DAYS]: (now) =>
      new Date(now.getTime() - 30 * ONE_DAY_IN_MS),
    [m.Report.TIMEFRAMES.LAST_WEEK]: (now) => {
      // Start of last week (Sunday 12:00:00 AM)
      const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const lastSunday = new Date(now);
      lastSunday.setDate(now.getDate() - currentDay - 7); // Go to Sunday of last week
      lastSunday.setHours(0, 0, 0, 0);
      return lastSunday;
    },
    [m.Report.TIMEFRAMES.TWO_WEEKS_AGO]: (now) => {
      // Start of two weeks ago (Sunday 12:00:00 AM)
      const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const twoWeeksAgoSunday = new Date(now);
      twoWeeksAgoSunday.setDate(now.getDate() - currentDay - 14); // Go to Sunday of two weeks ago
      twoWeeksAgoSunday.setHours(0, 0, 0, 0);
      return twoWeeksAgoSunday;
    },
    [m.Report.TIMEFRAMES.LAST_MONTH]: (now) => {
      // Start of last month (first day of previous month 12:00:00 AM)
      const startOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      ); // 1st day of previous month
      startOfLastMonth.setHours(0, 0, 0, 0);
      return startOfLastMonth;
    },
    [m.Report.TIMEFRAMES.TWO_MONTHS_AGO]: (now) => {
      // Start of two months ago (first day of month before last 12:00:00 AM)
      const startOfTwoMonthsAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 2,
        1
      ); // 1st day of two months ago
      startOfTwoMonthsAgo.setHours(0, 0, 0, 0);
      return startOfTwoMonthsAgo;
    },
    [m.Report.TIMEFRAMES.CUSTOM]: (now) => now,
  };

const TIMEFRAME_TO_END_DATE: Record<m.Report.Timeframe, (now: Date) => Date> = {
  [m.Report.TIMEFRAMES.LAST_24_HOURS]: (now) => now,
  [m.Report.TIMEFRAMES.LAST_7_DAYS]: (now) => now,
  [m.Report.TIMEFRAMES.LAST_30_DAYS]: (now) => now,
  [m.Report.TIMEFRAMES.LAST_WEEK]: (now) => {
    // End of last week (Saturday 11:59:59 PM)
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const lastSaturday = new Date(now);
    lastSaturday.setDate(now.getDate() - currentDay - 1); // Go to last Saturday
    lastSaturday.setHours(23, 59, 59, 999);
    return lastSaturday;
  },
  [m.Report.TIMEFRAMES.TWO_WEEKS_AGO]: (now) => {
    // End of two weeks ago (Saturday 11:59:59 PM)
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const twoWeeksAgoSaturday = new Date(now);
    twoWeeksAgoSaturday.setDate(now.getDate() - currentDay - 8); // Go to Saturday of two weeks ago
    twoWeeksAgoSaturday.setHours(23, 59, 59, 999);
    return twoWeeksAgoSaturday;
  },
  [m.Report.TIMEFRAMES.LAST_MONTH]: (now) => {
    // End of last month (last day of previous month 11:59:59 PM)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0); // 0th day = last day of previous month
    endOfLastMonth.setHours(23, 59, 59, 999);
    return endOfLastMonth;
  },
  [m.Report.TIMEFRAMES.TWO_MONTHS_AGO]: (now) => {
    // End of two months ago (last day of month before last 11:59:59 PM)
    const endOfTwoMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      0
    ); // 0th day = last day of two months ago
    endOfTwoMonthsAgo.setHours(23, 59, 59, 999);
    return endOfTwoMonthsAgo;
  },
  [m.Report.TIMEFRAMES.CUSTOM]: (now) => now,
};

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

export {
  TIMEFRAME_OPTIONS,
  TIMEFRAME_TO_START_DATE,
  TIMEFRAME_TO_END_DATE,
  TIMEFRAME_TO_LABEL,
  getPrettifiedDateRange,
};
