import { Popover } from "~/components/popover";
import {
  TIMEFRAME_OPTIONS,
  TIMEFRAME_TO_LABEL,
  getPrettifiedDateRange,
} from "../../utils/timeFrame";
import { m, u } from "@compose/ts";
import { Listbox } from "~/components/listbox";
import { DateInput } from "~/components/input";
import { Divider } from "~/components/divider";
import { useEffect, useMemo, useState } from "react";
import Button from "~/components/button";
import PopoverTrigger from "./PopoverTrigger";

const MAX_CUSTOM_RANGE_DURATION_IN_DAYS = 100;

function DatePickerPopover({
  selectedTimeframe,
  datetimeStart,
  datetimeEnd,
  handleTimeframeChange,
  disabled,
  viewOnly = false,
}: {
  selectedTimeframe: m.Report.Timeframe;
  datetimeStart: Date;
  datetimeEnd: Date;
  handleTimeframeChange: (
    timeframe: m.Report.Timeframe,
    dateRange: m.Report.DB["data"]["dateRange"]
  ) => void;
  disabled: boolean;
  viewOnly?: boolean;
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

    handleTimeframeChange(m.Report.TIMEFRAMES.CUSTOM, {
      start: u.date.fromDateOnlyModel(startInput),
      end: u.date.fromDateOnlyModel(endInput),
    });
  }

  const popoverTriggerLabel =
    selectedTimeframe === m.Report.TIMEFRAMES.CUSTOM
      ? getPrettifiedDateRange(datetimeStart, datetimeEnd)
      : TIMEFRAME_TO_LABEL[selectedTimeframe];

  return (
    <Popover.Root>
      <PopoverTrigger
        label={popoverTriggerLabel}
        icon="calendar"
        viewOnly={viewOnly}
      />
      <Popover.Panel anchor="bottom start">
        <div className="flex flex-col gap-4 w-full min-w-80 max-w-full">
          <h5>Date Range</h5>
          <div className="flex flex-col gap-1">
            <Listbox.Single
              options={TIMEFRAME_OPTIONS}
              value={selectedTimeframe}
              setValue={(value) => {
                if (!value) {
                  return;
                }

                if (value === m.Report.TIMEFRAMES.CUSTOM) {
                  applyCustomDateRange();
                } else {
                  handleTimeframeChange(value, {
                    start: null,
                    end: null,
                  });
                }
              }}
              id="timeframe"
              label={null}
              disabled={disabled || viewOnly}
            />
            {selectedTimeframe !== m.Report.TIMEFRAMES.CUSTOM && (
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
              disabled={viewOnly}
            />
            <DateInput
              label="End Date (UTC)"
              value={endInput}
              setValue={setEndInput}
              disabled={viewOnly}
            />
            {!viewOnly && (
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
            )}
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
