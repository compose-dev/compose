/**
 * "L/d": 10/14
 *
 * "L/d/yyyy": 10/14/1983
 *
 * "L/d/yy": 10/14/83
 *
 * "LLL d": Oct 14
 *
 * "LLL d, yyyy": Oct 14, 1983
 *
 * "h:mm a": 10:14 AM
 */
enum SerializedDateFormat {
  "L/d",
  "L/d/yyyy",
  "L/d/yy",
  "LLL d",
  "LLL d, yyyy",
  "h:mm a",
  "LLL d, yyyy h:mm a",
}

const NUM_TO_MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const HOUR_TO_12_FORMAT = [
  "12",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
];

/**
 * @field day The day of the month. 1-31. Not 0 indexed.
 * @field month The month of the year. 1-12. Not 0 indexed.
 * @field year The year.
 */
type DateOnlyModel = {
  day: number;
  month: number;
  year: number;
};

/**
 * @field hour The hour of the day. 0-23.
 * @field minute The minute of the hour. 0-59.
 */
type TimeOnlyModel = {
  hour: number;
  minute: number;
};

type DateTimeModel = DateOnlyModel & TimeOnlyModel;

function toString(
  date: Date,
  format: SerializedDateFormat,
  utc: boolean = false
): string {
  switch (format) {
    case SerializedDateFormat["L/d"]: {
      const monthNumeric = utc ? date.getUTCMonth() : date.getMonth();
      const day = utc ? date.getUTCDate() : date.getDate();
      return `${monthNumeric + 1}/${day}`;
    }

    case SerializedDateFormat["L/d/yyyy"]: {
      const monthNumeric = utc ? date.getUTCMonth() : date.getMonth();
      const day = utc ? date.getUTCDate() : date.getDate();
      const year = utc ? date.getUTCFullYear() : date.getFullYear();

      return `${monthNumeric + 1}/${day}/${year}`;
    }

    case SerializedDateFormat["L/d/yy"]: {
      const monthNumeric = utc ? date.getUTCMonth() : date.getMonth();
      const day = utc ? date.getUTCDate() : date.getDate();
      const year = utc ? date.getUTCFullYear() : date.getFullYear();

      return `${monthNumeric + 1}/${day}/${year.toString().slice(-2)}`;
    }

    case SerializedDateFormat["LLL d"]: {
      const monthShort =
        NUM_TO_MONTH_SHORT[utc ? date.getUTCMonth() : date.getMonth()];
      const day = utc ? date.getUTCDate() : date.getDate();

      return `${monthShort} ${day}`;
    }

    case SerializedDateFormat["LLL d, yyyy"]: {
      const monthShort =
        NUM_TO_MONTH_SHORT[utc ? date.getUTCMonth() : date.getMonth()];
      const day = utc ? date.getUTCDate() : date.getDate();
      const year = utc ? date.getUTCFullYear() : date.getFullYear();

      return `${monthShort} ${day}, ${year}`;
    }

    case SerializedDateFormat["h:mm a"]: {
      const hour = utc ? date.getUTCHours() : date.getHours();
      const minute = utc ? date.getUTCMinutes() : date.getMinutes();
      const dayPeriod = hour >= 12 ? "PM" : "AM";

      return `${HOUR_TO_12_FORMAT[hour]}:${minute.toString().padStart(2, "0")} ${dayPeriod}`;
    }

    case SerializedDateFormat["LLL d, yyyy h:mm a"]: {
      const monthShort =
        NUM_TO_MONTH_SHORT[utc ? date.getUTCMonth() : date.getMonth()];

      const day = utc ? date.getUTCDate() : date.getDate();
      const year = utc ? date.getUTCFullYear() : date.getFullYear();
      const hour = utc ? date.getUTCHours() : date.getHours();
      const minute = utc ? date.getUTCMinutes() : date.getMinutes();
      const dayPeriod = hour >= 12 ? "PM" : "AM";

      return `${monthShort} ${day}, ${year} ${HOUR_TO_12_FORMAT[hour]}:${minute.toString().padStart(2, "0")} ${dayPeriod}`;
    }
  }
}

function fromISOString(date: string): Date {
  return new Date(date);
}

function fromDateOnlyModel(model: DateOnlyModel): Date {
  return new Date(Date.UTC(model.year, model.month - 1, model.day));
}

function fromTimeOnlyModel(model: TimeOnlyModel): Date {
  return new Date(Date.UTC(0, 0, 0, model.hour, model.minute));
}

function fromDateTimeModel(model: DateTimeModel): Date {
  return new Date(
    Date.UTC(model.year, model.month - 1, model.day, model.hour, model.minute)
  );
}

function toDateOnlyModel(date: Date): DateOnlyModel {
  return {
    day: date.getUTCDate(),
    month: date.getUTCMonth() + 1,
    year: date.getUTCFullYear(),
  };
}

function toTimeOnlyModel(date: Date): TimeOnlyModel {
  return {
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
  };
}

function toDateTimeModel(date: Date): DateTimeModel {
  return {
    ...toDateOnlyModel(date),
    ...toTimeOnlyModel(date),
  };
}

/**
 * @param date The date to compare.
 * @param minDate The minimum date to compare against.
 * @returns Whether the date is earlier than the min date.
 */
function isEarlierThan(
  date: DateOnlyModel | TimeOnlyModel | DateTimeModel | Date,
  minDate: DateOnlyModel | TimeOnlyModel | DateTimeModel | Date
) {
  const convertToDate = (
    d: DateOnlyModel | TimeOnlyModel | DateTimeModel | Date
  ): Date => {
    if (d instanceof Date) {
      return d;
    }

    if ("day" in d && "hour" in d) {
      return fromDateTimeModel(d);
    }

    if ("day" in d) {
      return fromDateOnlyModel(d);
    }

    if ("hour" in d) {
      return fromTimeOnlyModel(d);
    }

    throw new Error("Invalid date model");
  };

  const dateA = convertToDate(date);
  const dateB = convertToDate(minDate);

  return dateA < dateB;
}

/**
 * @param date The date to compare.
 * @param maxDate The maximum date to compare against.
 * @returns Whether the date is later than the max date.
 */
function isLaterThan(
  date: DateOnlyModel | TimeOnlyModel | DateTimeModel | Date,
  maxDate: DateOnlyModel | TimeOnlyModel | DateTimeModel | Date
) {
  const convertToDate = (
    d: DateOnlyModel | TimeOnlyModel | DateTimeModel | Date
  ): Date => {
    if (d instanceof Date) {
      return d;
    }

    if ("day" in d && "hour" in d) {
      return fromDateTimeModel(d);
    }

    if ("day" in d) {
      return fromDateOnlyModel(d);
    }

    if ("hour" in d) {
      return fromTimeOnlyModel(d);
    }

    throw new Error("Invalid date model");
  };

  const dateA = convertToDate(date);
  const dateB = convertToDate(maxDate);

  return dateA > dateB;
}

function isValidISODateString(
  str: string | undefined | null | object
): boolean {
  if (str === undefined || str === null || typeof str !== "string") {
    return false;
  }

  const date = new Date(str);
  return !isNaN(date.getTime()) && str === date.toISOString();
}

export {
  isValidISODateString,
  toString,
  fromISOString,
  SerializedDateFormat as SerializedFormat,
  DateOnlyModel,
  TimeOnlyModel,
  DateTimeModel,
  fromDateOnlyModel,
  fromTimeOnlyModel,
  fromDateTimeModel,
  toDateOnlyModel,
  toTimeOnlyModel,
  toDateTimeModel,
  isEarlierThan,
  isLaterThan,
};
