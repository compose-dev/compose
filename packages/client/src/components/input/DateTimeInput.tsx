import { ComponentProps } from "react";
import Input from "./Input";
import { u } from "@compose/ts";

type DateTimeModel = u.date.DateTimeModel | null;

interface DateTimeInputProps
  extends Omit<ComponentProps<typeof Input>, "value" | "setValue"> {
  value: DateTimeModel;
  setValue: (val: DateTimeModel) => void;
}

function formatDateTime(dateTime: DateTimeModel) {
  if (dateTime === null) {
    return null;
  }

  const paddedHour = dateTime.hour.toString().padStart(2, "0");
  const paddedMinute = dateTime.minute.toString().padStart(2, "0");
  const paddedMonth = dateTime.month.toString().padStart(2, "0");
  const paddedDay = dateTime.day.toString().padStart(2, "0");
  const paddedYear = dateTime.year.toString().padStart(4, "0");

  return `${paddedYear}-${paddedMonth}-${paddedDay}T${paddedHour}:${paddedMinute}`;
}

function parseDateTime(dateTime: string | null): DateTimeModel {
  if (dateTime === null) {
    return null;
  }

  const [datePart, timePart] = dateTime.split("T");
  if (!datePart || !timePart) {
    return null;
  }

  const [year, month, day] = datePart.split("-");
  const [hour, minute] = timePart.split(":");

  if (year && month && day && hour !== undefined && minute !== undefined) {
    return {
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: parseInt(hour),
      minute: parseInt(minute),
    };
  }
  return null;
}

function DateTimeInput({ value, setValue, ...props }: DateTimeInputProps) {
  return (
    <Input
      value={formatDateTime(value)}
      setValue={(val) => setValue(parseDateTime(val))}
      type="datetime-local"
      {...props}
    />
  );
}

export default DateTimeInput;
