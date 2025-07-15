import { useEnvironmentsQuery } from "~/utils/queries/useEnvironmentsQuery";
import { useTimeframe } from "../../utils/useTimeframe";
import useSelectedApps from "../../utils/useSelectedApps";
import { useLogEnvironments } from "../../utils/useLogEnvironments";
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

type GroupBy = "app" | "message";

function CustomReport({
  trackedEvents,
  initialGroupBy = "message",
  now,

  // Labels for various report elements
  getTotalOccurrencesStatLabel = () => `Total Event Occurrences`,
  getTotalOccurrencesStatDescription = () =>
    `Number of times the ${
      trackedEvents.length > 1 ? "events" : "event"
    } occurred within the selected timeframe`,
  getTotalUsersStatLabel = () => `Total Users`,
  getTotalUsersStatDescription = () =>
    `Unique users who triggered the ${trackedEvents.length > 1 ? "events" : "event"} within the selected timeframe`,
  chartLabel = "Event Occurrences by User",

  // header
  header = null,
}: {
  trackedEvents: { message: string; type: m.Log.DB["type"] }[];
  initialGroupBy?: GroupBy;
  now: React.MutableRefObject<Date>;

  // Labels for various report elements
  getTotalOccurrencesStatLabel?: (count: number) => string;
  getTotalOccurrencesStatDescription?: (count: number) => string;
  getTotalUsersStatLabel?: (count: number) => string;
  getTotalUsersStatDescription?: (count: number) => string;
  chartLabel?: string;

  // header
  header?: React.ReactNode;
}) {
  const [groupBy, setGroupBy] = useState<GroupBy>(initialGroupBy);

  const {
    data: environments,
    status: environmentsStatus,
    error: environmentsError,
  } = useEnvironmentsQuery();

  const {
    selectedTimeframe,
    datetimeStart,
    datetimeEnd,
    handleTimeframeChange,
    setDatetimeStart,
    setDatetimeEnd,
  } = useTimeframe(now);

  const {
    includeDevLogs,
    setIncludeDevLogs,
    includeProdLogs,
    setIncludeProdLogs,
  } = useLogEnvironments();

  const { selectedApps, setSelectedApps } = useSelectedApps();

  const {
    data: logEvents,
    status: logEventsStatus,
    fetchStatus: logEventsFetchStatus,
    error: logEventsError,
  } = useCustomLogEventsQuery(
    datetimeStart,
    datetimeEnd,
    includeDevLogs,
    includeProdLogs,
    selectedApps,
    trackedEvents
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
            selectedTimeframe={selectedTimeframe}
            datetimeStart={datetimeStart}
            datetimeEnd={datetimeEnd}
            handleTimeframeChange={handleTimeframeChange}
            setDatetimeStart={setDatetimeStart}
            setDatetimeEnd={setDatetimeEnd}
            disabled={logEventsFetchStatus === "fetching"}
          />
          <LogEnvironmentsPopover
            includeDevLogs={includeDevLogs}
            includeProdLogs={includeProdLogs}
            setIncludeDevLogs={setIncludeDevLogs}
            setIncludeProdLogs={setIncludeProdLogs}
            disabled={logEventsFetchStatus === "fetching"}
          />
          <AppsPickerPopover
            environments={environments}
            includeDevLogs={includeDevLogs}
            includeProdLogs={includeProdLogs}
            selectedApps={selectedApps}
            setSelectedApps={setSelectedApps}
            disabled={logEventsFetchStatus === "fetching"}
          />
        </div>
        {logEventsFetchStatus === "fetching" && (
          <Spinner text="Loading..." size="5" />
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="flex-1">
          <Statistic
            label={getTotalOccurrencesStatLabel(totalOccurrences)}
            value={totalOccurrences}
            description={getTotalOccurrencesStatDescription(totalOccurrences)}
          />
        </div>
        <div className="flex-1">
          <Statistic
            label={getTotalUsersStatLabel(totalUsers)}
            value={totalUsers}
            description={getTotalUsersStatDescription(totalUsers)}
          />
        </div>
      </div>
      <div className="flex flex-col w-full mb-16">
        {chartDataByApp.length > 0 && chartDataByMessage.length > 0 && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-1 mb-2">
              <p>{chartLabel}</p>
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
