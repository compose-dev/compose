import { useEnvironmentsQuery } from "~/utils/queries/useEnvironmentsQuery";
import { useCustomLogEventsQuery } from "~/utils/queries/useCustomLogEventsQuery";
import { m } from "@compose/ts";
import DatePickerPopover from "../popovers/DatePickerPopover";
import LogEnvironmentsPopover from "../popovers/LogEnvironmentsPopover";
import AppsPickerPopover from "../popovers/AppsPickerPopover";
import { CenteredSpinner, Spinner } from "~/components/spinner";
import { Statistic } from "~/components/statistic";
import UnknownError from "../errors/UnknownError";
import { useGroupEventsByApp, useGroupEventsByMessage } from "./useGroupEvents";
import { useMemo, useState } from "react";
import { BarChart } from "~/components/chart/bar-chart";
import { UI } from "@composehq/ts-public";
import { Listbox } from "~/components/listbox";
import { useReportData } from "../../utils/useReportData";
import UserPickerPopover from "../popovers/UserPickerPopover";

type GroupBy = "app" | "message";

function CustomReport({
  // state
  report,
  reportId,
  initialGroupBy = "message",
  viewOnly = false,

  // Labels for various report elements
  totalOccurrencesStatLabel,
  totalOccurrencesStatDescription,
  totalUsersStatLabel,
  totalUsersStatDescription,
  chartLabel,

  // header
  header = null,
}: {
  // state
  report: ReturnType<typeof useReportData>;
  reportId: string | undefined;
  initialGroupBy?: GroupBy;
  viewOnly?: boolean;

  // Labels for various report elements
  totalOccurrencesStatLabel?: string;
  totalOccurrencesStatDescription?: string;
  totalUsersStatLabel?: string;
  totalUsersStatDescription?: string;
  chartLabel?: string;

  // header
  header?: React.ReactNode;
}) {
  const [groupBy, setGroupBy] = useState<GroupBy>(initialGroupBy);

  const trackedEventRules = m.Report.getTrackedEventRules(
    report.reportData.trackedEventModel
  );

  const {
    data: environments,
    status: environmentsStatus,
    error: environmentsError,
  } = useEnvironmentsQuery();

  const {
    data: logEvents,
    status: logEventsStatus,
    fetchStatus: logEventsFetchStatus,
    error: logEventsError,
  } = useCustomLogEventsQuery(
    report.reportData.timeFrame,
    report.reportData.dateRange,
    report.reportData.includeDevelopmentLogs,
    report.reportData.includeProductionLogs,
    report.reportData.selectedApps,
    report.reportData.trackedEventModel,
    report.reportData.selectedUserEmails,
    report.reportData.includeAnonymousUsers,
    reportId
  );

  const environmentsById = useMemo(() => {
    if (!environments) {
      return {};
    }

    const environmentsById: Record<
      string,
      m.Environment.ApiAndDecryptableKeyOmittedDB & {
        appsByRoute: Record<
          string,
          m.Environment.ApiAndDecryptableKeyOmittedDB["apps"][number]
        >;
      }
    > = {};

    for (const environment of environments.environments) {
      environmentsById[environment.id] = {
        ...environment,
        appsByRoute: {},
      };
      for (const app of environment.apps) {
        environmentsById[environment.id].appsByRoute[app.route] = app;
      }
    }

    return environmentsById;
  }, [environments]);

  const { data: chartDataByApp, series: chartSeriesByApp } =
    useGroupEventsByApp(logEvents, environmentsById);

  const { data: chartDataByMessage, series: chartSeriesByMessage } =
    useGroupEventsByMessage(logEvents);

  if (logEventsStatus === "pending" || environmentsStatus === "pending") {
    return <CenteredSpinner />;
  }

  if (logEventsStatus === "error") {
    return <UnknownError errorMessage={logEventsError.message} />;
  }

  if (environmentsStatus === "error") {
    return <UnknownError errorMessage={environmentsError.message} />;
  }

  const totalOccurrences = logEvents.groupedLogs.reduce(
    (acc, curr) => acc + curr.count,
    0
  );

  const totalUsers = new Set(logEvents.groupedLogs.map((log) => log.userEmail))
    .size;

  return (
    <>
      {header}
      <div className="flex flex-row w-full justify-between">
        <div className="flex flex-row flex-wrap gap-2">
          <DatePickerPopover
            selectedTimeframe={report.reportData.timeFrame}
            datetimeStart={report.datetimeStart}
            datetimeEnd={report.datetimeEnd}
            handleTimeframeChange={report.updateTimeFrame}
            disabled={logEventsFetchStatus === "fetching"}
            viewOnly={viewOnly && !report.reportData.timeFrameIsEditable}
          />
          <UserPickerPopover
            selectedUserEmails={report.reportData.selectedUserEmails}
            setSelectedUserEmails={(userEmails) =>
              report.setReportData((prev) => ({
                ...prev,
                selectedUserEmails: userEmails,
              }))
            }
            includeAnonymousUsers={report.reportData.includeAnonymousUsers}
            setIncludeAnonymousUsers={(value) =>
              report.setReportData((prev) => ({
                ...prev,
                includeAnonymousUsers: value,
              }))
            }
            disabled={logEventsFetchStatus === "fetching"}
            viewOnly={
              viewOnly && !report.reportData.selectedUserEmailsIsEditable
            }
          />
          <AppsPickerPopover
            environments={environments}
            includeDevLogs={report.reportData.includeDevelopmentLogs}
            includeProdLogs={report.reportData.includeProductionLogs}
            selectedApps={report.reportData.selectedApps}
            setSelectedApps={(apps) =>
              report.setReportData((prev) => ({
                ...prev,
                selectedApps: apps,
              }))
            }
            disabled={logEventsFetchStatus === "fetching"}
            viewOnly={viewOnly && !report.reportData.selectedAppsIsEditable}
          />
          <LogEnvironmentsPopover
            includeDevLogs={report.reportData.includeDevelopmentLogs}
            includeProdLogs={report.reportData.includeProductionLogs}
            setIncludeDevLogs={(value) =>
              report.setReportData((prev) => ({
                ...prev,
                includeDevelopmentLogs: value,
              }))
            }
            setIncludeProdLogs={(value) =>
              report.setReportData((prev) => ({
                ...prev,
                includeProductionLogs: value,
              }))
            }
            disabled={logEventsFetchStatus === "fetching"}
            devLogsViewOnly={
              viewOnly && !report.reportData.includeDevelopmentLogsIsEditable
            }
            prodLogsViewOnly={
              viewOnly && !report.reportData.includeProductionLogsIsEditable
            }
          />
        </div>
        {logEventsFetchStatus === "fetching" && (
          <Spinner text="Loading..." size="5" />
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="flex-1">
          <Statistic
            label={totalOccurrencesStatLabel || "Total Event Occurrences"}
            value={totalOccurrences}
            description={
              totalOccurrencesStatDescription ||
              `Number of times the ${
                trackedEventRules.length > 1 ? "events" : "event"
              } occurred within the selected timeframe`
            }
          />
        </div>
        <div className="flex-1">
          <Statistic
            label={totalUsersStatLabel || "Total Users"}
            value={totalUsers}
            description={
              totalUsersStatDescription ||
              `Unique users who triggered the ${
                trackedEventRules.length > 1 ? "events" : "event"
              } within the selected timeframe`
            }
          />
        </div>
      </div>
      <div className="flex flex-col w-full mb-16">
        {chartDataByApp.length > 0 && chartDataByMessage.length > 0 && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-1 mb-2">
              <p>{chartLabel || "Event Occurrences by User"}</p>
              <Listbox.Single
                rootClassName="max-w-72"
                id="group-by"
                label={null}
                value={groupBy}
                disabled={logEventsFetchStatus === "fetching"}
                setValue={(value) => {
                  if (!value) {
                    return;
                  }
                  setGroupBy(value);
                }}
                options={[
                  {
                    label: "Group by App",
                    value: "app",
                    description:
                      "Breakdown results by the app in which the event occurred",
                  },
                  {
                    label: "Group by Event",
                    value: "message",
                    description: "Breakdown results by event type",
                  },
                ]}
              />
            </div>
            <div className="w-full h-[48rem] min-h-[48rem]">
              <BarChart
                data={groupBy === "app" ? chartDataByApp : chartDataByMessage}
                indexBy={UI.Chart.LABEL_SERIES_KEY}
                keys={
                  groupBy === "app" ? chartSeriesByApp : chartSeriesByMessage
                }
                groupMode={UI.Chart.BAR_GROUP_MODE.STACKED}
                enableTotals={true}
              />
            </div>
          </>
        )}
        {chartDataByApp.length === 0 && chartDataByMessage.length === 0 && (
          <div className="w-full h-[32rem]">
            <p className="text-brand-neutral-2 text-sm/6 mt-0.5">
              No data available for the selected timeframe.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default CustomReport;
