const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

const TIMEFRAMES = {
  LAST_24_HOURS: "LAST_24_HOURS",
  LAST_7_DAYS: "LAST_7_DAYS",
  LAST_30_DAYS: "LAST_30_DAYS",
  LAST_WEEK: "LAST_WEEK",
  TWO_WEEKS_AGO: "TWO_WEEKS_AGO",
  LAST_MONTH: "LAST_MONTH",
  TWO_MONTHS_AGO: "TWO_MONTHS_AGO",
  CUSTOM: "CUSTOM",
} as const;

type Timeframe = (typeof TIMEFRAMES)[keyof typeof TIMEFRAMES];

const TIMEFRAME_TO_START_DATE: Record<Timeframe, (now: Date) => Date> = {
  [TIMEFRAMES.LAST_24_HOURS]: (now) => new Date(now.getTime() - ONE_DAY_IN_MS),
  [TIMEFRAMES.LAST_7_DAYS]: (now) =>
    new Date(now.getTime() - 7 * ONE_DAY_IN_MS),
  [TIMEFRAMES.LAST_30_DAYS]: (now) =>
    new Date(now.getTime() - 30 * ONE_DAY_IN_MS),
  [TIMEFRAMES.LAST_WEEK]: (now) => {
    // Start of last week (Sunday 12:00:00 AM)
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const lastSunday = new Date(now);
    lastSunday.setDate(now.getDate() - currentDay - 7); // Go to Sunday of last week
    lastSunday.setHours(0, 0, 0, 0);
    return lastSunday;
  },
  [TIMEFRAMES.TWO_WEEKS_AGO]: (now) => {
    // Start of two weeks ago (Sunday 12:00:00 AM)
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const twoWeeksAgoSunday = new Date(now);
    twoWeeksAgoSunday.setDate(now.getDate() - currentDay - 14); // Go to Sunday of two weeks ago
    twoWeeksAgoSunday.setHours(0, 0, 0, 0);
    return twoWeeksAgoSunday;
  },
  [TIMEFRAMES.LAST_MONTH]: (now) => {
    // Start of last month (first day of previous month 12:00:00 AM)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1); // 1st day of previous month
    startOfLastMonth.setHours(0, 0, 0, 0);
    return startOfLastMonth;
  },
  [TIMEFRAMES.TWO_MONTHS_AGO]: (now) => {
    // Start of two months ago (first day of month before last 12:00:00 AM)
    const startOfTwoMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 2,
      1
    ); // 1st day of two months ago
    startOfTwoMonthsAgo.setHours(0, 0, 0, 0);
    return startOfTwoMonthsAgo;
  },
  [TIMEFRAMES.CUSTOM]: (now) => now,
};

const TIMEFRAME_TO_END_DATE: Record<Timeframe, (now: Date) => Date> = {
  [TIMEFRAMES.LAST_24_HOURS]: (now) => now,
  [TIMEFRAMES.LAST_7_DAYS]: (now) => now,
  [TIMEFRAMES.LAST_30_DAYS]: (now) => now,
  [TIMEFRAMES.LAST_WEEK]: (now) => {
    // End of last week (Saturday 11:59:59 PM)
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const lastSaturday = new Date(now);
    lastSaturday.setDate(now.getDate() - currentDay - 1); // Go to last Saturday
    lastSaturday.setHours(23, 59, 59, 999);
    return lastSaturday;
  },
  [TIMEFRAMES.TWO_WEEKS_AGO]: (now) => {
    // End of two weeks ago (Saturday 11:59:59 PM)
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const twoWeeksAgoSaturday = new Date(now);
    twoWeeksAgoSaturday.setDate(now.getDate() - currentDay - 8); // Go to Saturday of two weeks ago
    twoWeeksAgoSaturday.setHours(23, 59, 59, 999);
    return twoWeeksAgoSaturday;
  },
  [TIMEFRAMES.LAST_MONTH]: (now) => {
    // End of last month (last day of previous month 11:59:59 PM)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0); // 0th day = last day of previous month
    endOfLastMonth.setHours(23, 59, 59, 999);
    return endOfLastMonth;
  },
  [TIMEFRAMES.TWO_MONTHS_AGO]: (now) => {
    // End of two months ago (last day of month before last 11:59:59 PM)
    const endOfTwoMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      0
    ); // 0th day = last day of two months ago
    endOfTwoMonthsAgo.setHours(23, 59, 59, 999);
    return endOfTwoMonthsAgo;
  },
  [TIMEFRAMES.CUSTOM]: (now) => now,
};

export {
  TIMEFRAMES,
  type Timeframe,
  TIMEFRAME_TO_START_DATE,
  TIMEFRAME_TO_END_DATE,
};
