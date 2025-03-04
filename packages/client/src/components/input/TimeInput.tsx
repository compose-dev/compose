import { ComponentProps } from "react";
import Input from "./Input";
import { u } from "@compose/ts";

type TimeModel = u.date.TimeOnlyModel | null;

interface TimeInputProps
  extends Omit<ComponentProps<typeof Input>, "value" | "setValue"> {
  value: TimeModel;
  setValue: (val: TimeModel) => void;
}

function formatTime(time: TimeModel) {
  if (time === null) {
    return null;
  }

  const paddedHour = time.hour.toString().padStart(2, "0");
  const paddedMinute = time.minute.toString().padStart(2, "0");

  return `${paddedHour}:${paddedMinute}`;
}

function parseTime(time: string | null): TimeModel {
  if (time === null) {
    return null;
  }

  const [hour, minute] = time.split(":");

  if (hour !== undefined && minute !== undefined) {
    return { hour: parseInt(hour), minute: parseInt(minute) };
  }

  return null;
}

function TimeInput({ value, setValue, ...props }: TimeInputProps) {
  return (
    <Input
      value={formatTime(value)}
      setValue={(val) => setValue(parseTime(val))}
      type="time"
      {...props}
    />
  );
}

export default TimeInput;
