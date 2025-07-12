import { m } from "@compose/ts";
import { UI } from "@composehq/ts-public";
import { useMemo } from "react";
import { useAppLoadsByUserQuery } from "~/utils/queries/useAppLoadsByUserQuery";

const getDeletedAppName = (appRoute: string) => {
  return `${appRoute} (deleted)`;
};

export function useAppLoadsByUser(
  data: ReturnType<typeof useAppLoadsByUserQuery>["data"],
  environmentsById: Record<
    string,
    m.Environment.ApiAndDecryptableKeyOmittedDB & {
      appsByRoute: Record<
        string,
        m.Environment.ApiAndDecryptableKeyOmittedDB["apps"][number]
      >;
    }
  >
): {
  // The formatted data for the chart. Each row includes a field for the user
  // email. All other fields are app names -> counts.
  data: Array<{
    [key: string]: number | string;
  }>;
  // The unique set of apps that are rendered in the chart. Used for the chart legend.
  series: string[];
} {
  return useMemo(() => {
    if (!data) {
      return {
        data: [],
        series: [],
      };
    }

    const multipleEnvironmentsInData =
      new Set(
        data.groupedAppLoads
          .map((log) => log.environmentId)
          .filter((id) => id !== null)
      ).size > 1;

    const appLoadsByUserEmail: Record<string, Record<string, number>> = {};

    for (const log of data.groupedAppLoads) {
      const correctedEmail = log.userEmail || "Unknown User";

      if (!appLoadsByUserEmail[correctedEmail]) {
        appLoadsByUserEmail[correctedEmail] = {};
      }

      const environment = log.environmentId
        ? environmentsById[log.environmentId]
        : null;

      const appData = environment
        ? environment.appsByRoute[log.appRoute]
        : null;

      // If there's no associated environment, assume the app is part
      // of a deleted environment.
      if (!log.environmentId || !environment || !appData) {
        const appName = getDeletedAppName(log.appRoute);
        appLoadsByUserEmail[correctedEmail][appName] = log.count;
      } else {
        // If there are multiple environments in the data set, append the
        // environment name to the app name to differentiate them.
        const appName = multipleEnvironmentsInData
          ? `${appData.name} (${environment.name})`
          : appData.name;

        appLoadsByUserEmail[correctedEmail][appName] = log.count;
      }
    }

    const formatted = Object.entries(appLoadsByUserEmail)
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

    const series: string[] = [];

    // Get the unique routes while preserving the order in which they
    // appear in the data.
    for (const user of formatted) {
      for (const key of Object.keys(user)) {
        if (!series.includes(key) && key !== UI.Chart.LABEL_SERIES_KEY) {
          series.push(key);
        }
      }
    }

    return {
      data: formatted,
      series,
    };
  }, [data, environmentsById]);
}
