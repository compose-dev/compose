import { ComponentProps } from "react";
import Input from "./Input";
import { u } from "@compose/ts";

type DateModel = u.date.DateOnlyModel | null;

interface DateInputProps
  extends Omit<ComponentProps<typeof Input>, "value" | "setValue"> {
  value: DateModel;
  setValue: (val: DateModel) => void;
}

function formatDate(date: DateModel) {
  if (date === null) {
    return null;
  }

  const paddedMonth = date.month.toString().padStart(2, "0");
  const paddedDay = date.day.toString().padStart(2, "0");
  const paddedYear = date.year.toString().padStart(4, "0");

  return `${paddedYear}-${paddedMonth}-${paddedDay}`;
}

function parseDate(date: string | null): DateModel {
  if (date === null) {
    return null;
  }

  const [year, month, day] = date.split("-");

  if (year && month && day) {
    return { year: parseInt(year), month: parseInt(month), day: parseInt(day) };
  }
  return null;
}

function DateInput({ value, setValue, ...props }: DateInputProps) {
  return (
    <Input
      value={formatDate(value)}
      setValue={(val) => setValue(parseDate(val))}
      type="date"
      {...props}
    />
  );
}

export default DateInput;
