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
  str: string | number | boolean | undefined | null | object
) {
  if (typeof str !== "string") {
    return false;
  }

  // minimum "YYYY-MM-DDTHH:mm:ss" → 19 chars
  if (str.length < 19) return false;

  // quick checks on the fixed separators
  if (
    str.charCodeAt(4) !== 45 /*-*/ ||
    str.charCodeAt(7) !== 45 /*-*/ ||
    str.charCodeAt(10) !== 84 /*T*/ ||
    str.charCodeAt(13) !== 58 /*:*/ ||
    str.charCodeAt(16) !== 58 /*:*/
  ) {
    return false;
  }

  // helper: ensure str[pos] is '0'–'9'
  function isDigitAt(pos: number) {
    const c = (str as string).charCodeAt(pos);
    return c >= 48 && c <= 57;
  }

  // check all digit positions first
  const digits = [
    0,
    1,
    2,
    3, // year
    5,
    6, // month
    8,
    9, // day
    11,
    12, // hour
    14,
    15, // minute
    17,
    18, // second
  ];
  for (let i = 0; i < digits.length; i++) {
    if (!isDigitAt(digits[i])) return false;
  }

  // parse the core fields
  const toInt2 = (i: number) =>
    (str.charCodeAt(i) - 48) * 10 + (str.charCodeAt(i + 1) - 48);
  const year =
    (str.charCodeAt(0) - 48) * 1000 +
    (str.charCodeAt(1) - 48) * 100 +
    (str.charCodeAt(2) - 48) * 10 +
    (str.charCodeAt(3) - 48);
  const month = toInt2(5);
  const day = toInt2(8);
  const hour = toInt2(11);
  const min = toInt2(14);
  const sec = toInt2(17);

  // range checks
  if (month < 1 || month > 12) return false;
  // days in month
  const mdays = [
    31,
    /*Feb*/ year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  if (day < 1 || day > mdays[month - 1]) return false;
  if (hour > 23 || min > 59 || sec > 59) return false;

  // now handle the fractional‐seconds + timezone starting at pos = 19
  let pos = 19;

  // optional “.123”, up to 6 digits
  if (pos < str.length && str.charCodeAt(pos) === 46 /*.*/) {
    pos++;
    const start = pos;
    while (pos < str.length && isDigitAt(pos) && pos - start < 6) pos++;
    // must have 1–6 digits
    if (pos === start) return false;
    // no more than 6
    if (pos - start > 6) return false;
  }

  // if we’re at end, that’s a **naïve** ISO (Python’s default) — still OK
  if (pos === str.length) {
    return true;
  }

  // a plain “Z”?
  if (str.charAt(pos) === "Z") {
    return pos + 1 === str.length;
  }

  // or an offset “+HH:MM” / “-HH:MM”
  const sign = str.charAt(pos);
  if (sign === "+" || sign === "-") {
    // must be exactly “+hh:mm” → 6 more chars
    if (pos + 6 !== str.length) return false;
    // check digits and colon
    if (
      !isDigitAt(pos + 1) ||
      !isDigitAt(pos + 2) ||
      str.charCodeAt(pos + 3) !== 58 /*:*/ ||
      !isDigitAt(pos + 4) ||
      !isDigitAt(pos + 5)
    ) {
      return false;
    }
    const offH = toInt2(pos + 1);
    const offM = toInt2(pos + 4);
    if (offH > 23 || offM > 59) return false;
    return true;
  }

  return false;
}

/**
 * Naively deserializes a date from a string.
 * If not possible, it returns the original input.
 *
 * @param input The input to deserialize.
 * @returns The deserialized input.
 */
function deserialize<T>(input: T): T | Date {
  if (input instanceof Date || typeof input !== "string" || input === "") {
    return input;
  }

  try {
    const date = new Date(input as string);

    if (isNaN(date.getTime())) {
      return input;
    }

    return date;
  } catch (error) {
    return input;
  }
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
  deserialize,
};
