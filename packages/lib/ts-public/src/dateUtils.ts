import * as UI from "./ui";

/**
 * One of the following:
 * - A JS Date object in UTC
 * - Human readable object with year, month (1-12), and day (1-31)
 */
type DateInput =
  | NonNullable<UI.Components.InputDate["model"]["properties"]["initialValue"]>
  | Date;

function getDateModel(date: DateInput) {
  if (date instanceof Date) {
    return {
      day: date.getUTCDate(),
      month: date.getUTCMonth() + 1,
      year: date.getUTCFullYear(),
    };
  }

  return date;
}

/**
 * One of the following:
 * - A JS Date object in UTC
 * - Human readable object with hour (0-23) and minute (0-59)
 */
type TimeInput =
  | NonNullable<UI.Components.InputTime["model"]["properties"]["initialValue"]>
  | Date;

function getTimeModel(time: TimeInput) {
  if (time instanceof Date) {
    return {
      hour: time.getUTCHours(),
      minute: time.getUTCMinutes(),
    };
  }

  return time;
}

/**
 * One of the following:
 * - A JS Date object in UTC
 * - Human readable object with year, month (1-12), day (1-31), hour (0-23), and minute (0-59)
 */
type DateTimeInput =
  | NonNullable<
      UI.Components.InputDateTime["model"]["properties"]["initialValue"]
    >
  | Date;

function getDateTimeModel(dateTime: DateTimeInput) {
  if (dateTime instanceof Date) {
    return {
      day: dateTime.getUTCDate(),
      month: dateTime.getUTCMonth() + 1,
      year: dateTime.getUTCFullYear(),
      hour: dateTime.getUTCHours(),
      minute: dateTime.getUTCMinutes(),
    };
  }

  return dateTime;
}

export {
  type DateInput,
  getDateModel,
  type TimeInput,
  getTimeModel,
  type DateTimeInput,
  getDateTimeModel,
};
