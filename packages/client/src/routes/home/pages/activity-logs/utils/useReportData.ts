import { m } from "@compose/ts";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TIMEFRAME_TO_END_DATE, TIMEFRAME_TO_START_DATE } from "./timeFrame";

export function useReportData(
  initialReportData?: Partial<m.Report.DB["data"]>
) {
  const now = useRef(new Date());

  const [reportData, setReportData] = useState<m.Report.DB["data"]>({
    ...{
      // timeframe
      timeFrame: m.Report.TIMEFRAMES.LAST_30_DAYS,
      dateRange: {
        start: null,
        end: null,
      },
      timeFrameIsEditable: false,

      // included environments
      includeDevelopmentLogs: false,
      includeProductionLogs: true,
      includeDevelopmentLogsIsEditable: false,
      includeProductionLogsIsEditable: false,

      // selected user emails
      selectedUserEmails: [],
      includeAnonymousUsers: true,
      selectedUserEmailsIsEditable: false,

      // selected apps
      selectedApps: [],
      selectedAppsIsEditable: false,

      // tracked event model.
      trackedEventModel: {
        logicOperator: m.Report.TRACKED_EVENT_LOGIC_OPERATORS.AND,
        events: [],
      },
    },
    ...initialReportData,
  });

  useEffect(() => {
    setReportData((prev) => ({
      ...prev,
      ...initialReportData,
    }));
  }, [initialReportData]);

  const datetimeStart = useMemo(() => {
    if (reportData.timeFrame === m.Report.TIMEFRAMES.CUSTOM) {
      if (!reportData.dateRange.start) {
        throw new Error(
          "Date range start is not set even though time frame is CUSTOM."
        );
      }

      return reportData.dateRange.start;
    }

    return TIMEFRAME_TO_START_DATE[reportData.timeFrame](now.current);
  }, [reportData.timeFrame, now, reportData.dateRange.start]);

  const datetimeEnd = useMemo(() => {
    if (reportData.timeFrame === m.Report.TIMEFRAMES.CUSTOM) {
      if (!reportData.dateRange.end) {
        throw new Error(
          "Date range end is not set even though time frame is CUSTOM."
        );
      }

      return reportData.dateRange.end;
    }

    return TIMEFRAME_TO_END_DATE[reportData.timeFrame](now.current);
  }, [reportData.timeFrame, now, reportData.dateRange.end]);

  function updateTimeFrame(
    timeFrame: m.Report.Timeframe,
    dateRange: { start: Date | null; end: Date | null }
  ) {
    setReportData((prev) => ({
      ...prev,
      timeFrame,
      dateRange,
    }));
  }

  function toggleTrackedEventRule(rule: m.Report.TrackedEventRule) {
    setReportData((prev) => {
      const rules = m.Report.getTrackedEventRules(prev.trackedEventModel);

      const index = rules.findIndex(
        (trackedEvent) =>
          trackedEvent.event === rule.event &&
          trackedEvent.type === rule.type &&
          trackedEvent.operator === rule.operator
      );

      if (index === -1) {
        return {
          ...prev,
          trackedEventModel: {
            ...prev.trackedEventModel,
            events: [...rules, rule],
          },
        };
      } else {
        return {
          ...prev,
          trackedEventModel: {
            ...prev.trackedEventModel,
            events: rules.filter((_, i) => i !== index),
          },
        };
      }
    });
  }

  function isEventRuleTracked(rule: m.Report.TrackedEventRule) {
    const rules = m.Report.getTrackedEventRules(reportData.trackedEventModel);

    return rules.some(
      (trackedEvent) =>
        "operator" in trackedEvent &&
        trackedEvent.event === rule.event &&
        trackedEvent.type === rule.type &&
        trackedEvent.operator === rule.operator
    );
  }

  const clearTrackedEventModel = useCallback(() => {
    setReportData((prev) => ({
      ...prev,
      trackedEventModel: {
        logicOperator: m.Report.TRACKED_EVENT_LOGIC_OPERATORS.AND,
        events: [],
      },
    }));
  }, []);

  return {
    reportData,
    setReportData,
    datetimeStart,
    datetimeEnd,
    updateTimeFrame,
    toggleTrackedEventRule,
    isEventRuleTracked,
    clearTrackedEventModel,
  };
}
