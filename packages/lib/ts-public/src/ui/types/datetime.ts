interface DateRepresentation {
  /**
   * 1-31. Not 0 indexed.
   */
  day: number;
  /**
   * 1-12. Not 0 indexed.
   */
  month: number;
  /**
   * 4 digits
   */
  year: number;
}

interface TimeRepresentation {
  /**
   * 0-23
   */
  hour: number;
  /**
   * 0-59
   */
  minute: number;
}

interface DateTimeRepresentation
  extends DateRepresentation,
    TimeRepresentation {}

interface DateRepresentationWithJsDate extends DateRepresentation {
  /**
   * UTC midnight of the selected date
   */
  jsDate: Date;
}

interface DateTimeRepresentationWithJsDate extends DateTimeRepresentation {
  /**
   * Selected date and time in UTC
   */
  jsDate: Date;
}

export type {
  DateRepresentation as DateRepresentation,
  TimeRepresentation as TimeRepresentation,
  DateTimeRepresentation as DateTimeRepresentation,
  DateRepresentationWithJsDate as DateRepresentationWithJsDate,
  DateTimeRepresentationWithJsDate as DateTimeRepresentationWithJsDate,
};
