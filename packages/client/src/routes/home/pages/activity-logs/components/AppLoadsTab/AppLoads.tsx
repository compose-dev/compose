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

  const { data, status, fetchStatus, error } = useAppLoadsByUserQuery(
    datetimeStart,
    datetimeEnd,
    includeDevLogs,
    includeProdLogs
  );

  const {
    data: environments,
    status: environmentsStatus,
    error: environmentsError,
  } = useEnvironmentsQuery();

  const chartData = useMemo(() => {
    if (!data || !environments) {
      return {
        data: [],
        uniqueRoutes: [],
      };
    }

    const formattedEnvironments: Record<
      string,
      {
        name: string;
        envs: {
          id: string;
          name: string;
        }[];
      }
    > = {};

    for (const environment of environments.environments) {
      for (const app of environment.apps) {
        if (!formattedEnvironments[app.route]) {
          formattedEnvironments[app.route] = {
            name: app.name,
            envs: [
              {
                id: environment.id,
                name: environment.name,
              },
            ],
          };
        } else {
          formattedEnvironments[app.route].envs.push({
            id: environment.id,
            name: environment.name,
          });
        }
      }
    }

    const loadsByUserEmail: Record<string, Record<string, number>> = {};

    for (const log of data.groupedAppLoads) {
      const correctedEmail = log.userEmail || "Anonymous User";

      if (!loadsByUserEmail[correctedEmail]) {
        loadsByUserEmail[correctedEmail] = {};
      }

      if (!log.environmentId || !formattedEnvironments[log.appRoute]) {
        // If there's no associated environment, assume the app is part
        // of a deleted environment.
        const appName = `${log.appRoute} (deleted)`;
        if (!loadsByUserEmail[correctedEmail][appName]) {
          loadsByUserEmail[correctedEmail][appName] = log.count;
        } else {
          loadsByUserEmail[correctedEmail][appName] += log.count;
        }
      } else {
        const app = formattedEnvironments[log.appRoute];

        if (!app) {
          continue;
        }

        const envName = app.envs.find(
          (env) => env.id === log.environmentId
        )?.name;

        if (!envName) {
          continue;
        }

        // If there are multiple envs with the same app name, append the env
        // name to differentiate them.
        const appName =
          app.envs.length > 1 ? `${app.name} (${envName})` : app.name;

        loadsByUserEmail[correctedEmail][appName] = log.count;
      }
    }

    const formatted = Object.entries(loadsByUserEmail)
      .map(([userEmail, loads]) => {
        return {
          [UI.Chart.LABEL_SERIES_KEY]: userEmail,
          ...loads,
        };
      })
      // Sort so by loads ascending.
      .sort((a, b) => {
        const aCount = Object.values(a).reduce((acc, curr) => {
          if (typeof curr === "number") {
            return acc + curr;
          }
          return acc;
        }, 0);
        const bCount = Object.values(b).reduce((acc, curr) => {
          if (typeof curr === "number") {
            return acc + curr;
          }
          return acc;
        }, 0);
        return aCount - bCount;
      });

    const uniqueRoutes: string[] = [];

    // Get the unique routes while preserving the order in which they
    // appear in the data.
    for (const user of formatted) {
      for (const key of Object.keys(user)) {
        if (!uniqueRoutes.includes(key) && key !== UI.Chart.LABEL_SERIES_KEY) {
          uniqueRoutes.push(key);
        }
      }
    }

    return {
      data: formatted,
      uniqueRoutes,
    };
  }, [data, environments]);

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
          </div>
          <div className="flex flex-col w-full mb-16">
            {chartData.data.length > 0 && (
              <div className="w-full h-[48rem]">
                <BarChart
                  label="App Loads by User"
                  description="Shows the number of times an app was loaded by a user. Each user's loads are subdivided by app."
                  data={chartData.data}
                  indexBy={UI.Chart.LABEL_SERIES_KEY}
                  keys={chartData.uniqueRoutes}
                  groupMode={UI.Chart.BAR_GROUP_MODE.STACKED}
                  enableTotals={true}
                />
              </div>
            )}
            {chartData.data.length === 0 && (
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
