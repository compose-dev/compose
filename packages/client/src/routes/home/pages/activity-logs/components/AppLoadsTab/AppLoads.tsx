import { useAppLoadsByUserQuery } from "~/utils/queries/useAppLoadsByUserQuery";
import { useEnvironmentsQuery } from "~/utils/queries/useEnvironmentsQuery";
import UnknownError from "../UnknownError";
import { CenteredSpinner, Spinner } from "~/components/spinner";
import { BarChart } from "~/components/chart/bar-chart";
import { UI } from "@composehq/ts-public";
import { useTimeframe } from "../../utils/useTimeframe";
import DatePickerPopover from "../DatePickerPopover";
import { useMemo } from "react";
import { useLogEnvironments } from "../../utils/useLogEnvironments";
import LogEnvironmentsPopover from "../LogEnvironmentsPopover";
import { Statistic } from "~/components/statistic";
import { useAppLoadsByUser } from "./useAppLoadsByUser";
import AppsPickerPopover from "../AppsPickerPopover";
import useSelectedApps from "../../utils/useSelectedApps";
import { m } from "@compose/ts";

function AppLoadsTab() {
  const {
    selectedTimeframe,
    datetimeStart,
    datetimeEnd,
    handleTimeframeChange,
    setDatetimeStart,
    setDatetimeEnd,
  } = useTimeframe();

  const {
    includeDevLogs,
    setIncludeDevLogs,
    includeProdLogs,
    setIncludeProdLogs,
  } = useLogEnvironments();

  const { selectedApps, setSelectedApps } = useSelectedApps();

  const { data, status, fetchStatus, error } = useAppLoadsByUserQuery(
    datetimeStart,
    datetimeEnd,
    includeDevLogs,
    includeProdLogs,
    selectedApps
  );

  const {
    data: environments,
    status: environmentsStatus,
    error: environmentsError,
  } = useEnvironmentsQuery();

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

  const { data: chartData, series: chartSeries } = useAppLoadsByUser(
    data,
    environmentsById
  );

  return (
    <>
      {(status === "pending" || environmentsStatus === "pending") && (
        <CenteredSpinner />
      )}
      {status === "error" && <UnknownError errorMessage={error.message} />}
      {environmentsStatus === "error" && (
        <UnknownError errorMessage={environmentsError.message} />
      )}
      {status === "success" && environmentsStatus === "success" && (
        <>
          <div className="flex flex-row w-full justify-between">
            <div className="flex flex-row gap-2">
              <DatePickerPopover
                selectedTimeframe={selectedTimeframe}
                datetimeStart={datetimeStart}
                datetimeEnd={datetimeEnd}
                handleTimeframeChange={handleTimeframeChange}
                setDatetimeStart={setDatetimeStart}
                setDatetimeEnd={setDatetimeEnd}
                disabled={fetchStatus === "fetching"}
              />
              <LogEnvironmentsPopover
                includeDevLogs={includeDevLogs}
                includeProdLogs={includeProdLogs}
                setIncludeDevLogs={setIncludeDevLogs}
                setIncludeProdLogs={setIncludeProdLogs}
                disabled={fetchStatus === "fetching"}
              />
              <AppsPickerPopover
                environments={environments}
                includeDevLogs={includeDevLogs}
                includeProdLogs={includeProdLogs}
                selectedApps={selectedApps}
                setSelectedApps={setSelectedApps}
                disabled={fetchStatus === "fetching"}
              />
            </div>
            {fetchStatus === "fetching" && (
              <Spinner text="Loading..." size="5" />
            )}
          </div>
          <div className="flex flex-row gap-4 w-full">
            <div className="flex-1">
              <Statistic
                label="Total App Loads"
                value={data.groupedAppLoads.reduce(
                  (acc, curr) => acc + curr.count,
                  0
                )}
              />
            </div>
            <div className="flex-1">
              <Statistic
                label="Total Users"
                value={
                  new Set(data.groupedAppLoads.map((log) => log.userEmail)).size
                }
              />
            </div>
          </div>
          <div className="flex flex-col w-full mb-16">
            {chartData.length > 0 && (
              <div className="w-full h-[48rem]">
                <BarChart
                  label="App Loads by User"
                  description="Shows the number of times an app was loaded by a user. Each user's loads are subdivided by app."
                  data={chartData}
                  indexBy={UI.Chart.LABEL_SERIES_KEY}
                  keys={chartSeries}
                  groupMode={UI.Chart.BAR_GROUP_MODE.STACKED}
                  enableTotals={true}
                />
              </div>
            )}
            {chartData.length === 0 && (
              <div className="w-full h-[32rem]">
                <p className="text-brand-neutral-2 text-sm/6 mt-0.5">
                  No data available for the selected timeframe.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default AppLoadsTab;
