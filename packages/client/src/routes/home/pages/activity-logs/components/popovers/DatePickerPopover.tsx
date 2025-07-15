import Icon from "~/components/icon";
import { Popover } from "~/components/popover";
import {
  TIMEFRAMES,
  TIMEFRAME_OPTIONS,
  Timeframe,
} from "../../utils/useTimeframe";
import { u } from "@compose/ts";
import { Listbox } from "~/components/listbox";
import { DateInput } from "~/components/input";
import { Divider } from "~/components/divider";
import { useEffect, useMemo, useState } from "react";
import Button from "~/components/button";

const MAX_CUSTOM_RANGE_DURATION_IN_DAYS = 100;

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

function PopoverTrigger({
  selectedTimeframe,
  datetimeStart,
  datetimeEnd,
}: {
  selectedTimeframe: Timeframe;
  datetimeStart: Date;
  datetimeEnd: Date;
}) {
  return (
    <Popover.Trigger>
      <div className="border border-brand-neutral rounded-brand p-2 py-1 flex flex-row gap-2 items-center shadow-sm hover:bg-brand-overlay transition-colors">
        <Icon name="calendar" color="brand-neutral" />
        <p className="text-brand-neutral">
          {selectedTimeframe === TIMEFRAMES.CUSTOM ? (
            <p className="flex-shrink-0">
              {getPrettifiedDateRange(datetimeStart, datetimeEnd)}
            </p>
          ) : (
            TIMEFRAME_OPTIONS.find(
              (option) => option.value === selectedTimeframe
            )?.label
          )}
        </p>
        <Icon name="chevron-down" color="brand-neutral" size="0.75" />
      </div>
    </Popover.Trigger>
  );
}

function DatePickerPopover({
  selectedTimeframe,
  datetimeStart,
  datetimeEnd,
  handleTimeframeChange,
  setDatetimeStart,
  setDatetimeEnd,
  disabled,
}: {
  selectedTimeframe: Timeframe;
  datetimeStart: Date;
  datetimeEnd: Date;
  handleTimeframeChange: (timeframe: Timeframe | null) => void;
  setDatetimeStart: (datetime: Date) => void;
  setDatetimeEnd: (datetime: Date) => void;
  disabled: boolean;
}) {
  const [startInput, setStartInput] = useState<u.date.DateOnlyModel | null>(
    u.date.toDateOnlyModel(datetimeStart)
  );
  const [endInput, setEndInput] = useState<u.date.DateOnlyModel | null>(
    u.date.toDateOnlyModel(datetimeEnd)
  );

  const customRangeDurationInDays = useMemo(() => {
    if (startInput === null || endInput === null) {
      return 0;
    }
    return (
      (u.date.fromDateOnlyModel(endInput).getTime() -
        u.date.fromDateOnlyModel(startInput).getTime()) /
      (1000 * 60 * 60 * 24)
    );
  }, [startInput, endInput]);

  useEffect(() => {
    setStartInput(u.date.toDateOnlyModel(datetimeStart));
  }, [datetimeStart]);

  useEffect(() => {
    setEndInput(u.date.toDateOnlyModel(datetimeEnd));
  }, [datetimeEnd]);

  const datetimeStartModel = u.date.toDateOnlyModel(datetimeStart);
  const datetimeEndModel = u.date.toDateOnlyModel(datetimeEnd);

  const isCustomStartChanged =
    datetimeStartModel.year !== startInput?.year ||
    datetimeStartModel.month !== startInput?.month ||
    datetimeStartModel.day !== startInput?.day;

  const isCustomEndChanged =
    datetimeEndModel.year !== endInput?.year ||
    datetimeEndModel.month !== endInput?.month ||
    datetimeEndModel.day !== endInput?.day;

  function applyCustomDateRange() {
    if (startInput === null || endInput === null) {
      return;
    }

    setDatetimeStart(u.date.fromDateOnlyModel(startInput));
    setDatetimeEnd(u.date.fromDateOnlyModel(endInput));

    handleTimeframeChange(TIMEFRAMES.CUSTOM);
  }

  return (
    <Popover.Root>
      <PopoverTrigger
        selectedTimeframe={selectedTimeframe}
        datetimeStart={datetimeStart}
        datetimeEnd={datetimeEnd}
      />
      <Popover.Panel anchor="bottom start">
        <div className="flex flex-col gap-4 w-full min-w-80 max-w-full">
          <h5>Date Range</h5>
          <div className="flex flex-col gap-1">
            <Listbox.Single
              options={TIMEFRAME_OPTIONS}
              value={selectedTimeframe}
              setValue={handleTimeframeChange}
              id="timeframe"
              label={null}
              disabled={disabled}
            />
            {selectedTimeframe !== TIMEFRAMES.CUSTOM && (
              <p className="flex-shrink-0 text-brand-neutral-2 text-sm self-end mt">
                {getPrettifiedDateRange(datetimeStart, datetimeEnd)}
              </p>
            )}
          </div>
          <Divider />
          <>
            <DateInput
              label="Start Date (UTC)"
              value={startInput}
              setValue={setStartInput}
            />
            <DateInput
              label="End Date (UTC)"
              value={endInput}
              setValue={setEndInput}
            />
            <Button
              variant="primary"
              onClick={applyCustomDateRange}
              disabled={
                startInput === null ||
                endInput === null ||
                (!isCustomStartChanged && !isCustomEndChanged) ||
                customRangeDurationInDays > MAX_CUSTOM_RANGE_DURATION_IN_DAYS
              }
            >
              Apply Custom Date Range
            </Button>
            {customRangeDurationInDays > MAX_CUSTOM_RANGE_DURATION_IN_DAYS && (
              <p className="text-brand-error text-sm">
                Custom date range cannot exceed{" "}
                {MAX_CUSTOM_RANGE_DURATION_IN_DAYS} days.
              </p>
            )}
          </>
        </div>
      </Popover.Panel>
    </Popover.Root>
  );
}

export default DatePickerPopover;
