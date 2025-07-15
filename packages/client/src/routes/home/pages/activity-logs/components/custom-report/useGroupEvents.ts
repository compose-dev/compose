import { UI } from "@composehq/ts-public";
import { useMemo } from "react";
import { useCustomLogEventsQuery } from "~/utils/queries/useCustomLogEventsQuery";
import { type FormattedEnvironmentsById } from "./constants";

interface GroupedEventsDataAndSeries {
  // The formatted data for the chart. Each row includes a field for the user
  // email. All other fields are app names -> counts.
  data: Array<{
    [key: string]: number | string;
  }>;
  // The unique set of apps that are rendered in the chart. Used for the chart legend.
  series: string[];
}

function flattenAndSortGroupedEvents(
  groupedEventOccurrences: Record<string, Record<string, number>>
) {
  return (
    Object.entries(groupedEventOccurrences)
      // Flatten the grouped event occurrences into a single object
      // that includes the user email as the label series key.
      .map(([userEmail, occurrences]) => {
        return {
          [UI.Chart.LABEL_SERIES_KEY]: userEmail,
          ...occurrences,
        };
      })
      // Sort so by event occurrences ascending.
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
      })
  );
}

function getUniqueSeries(
  formatted: Array<{
    [key: string]: number | string;
  }>
) {
  const series: string[] = [];

  // Get the unique series while preserving the order in which they
  // appear in the data.
  for (const user of formatted) {
    for (const key of Object.keys(user)) {
      if (!series.includes(key) && key !== UI.Chart.LABEL_SERIES_KEY) {
        series.push(key);
      }
    }
  }

  return series;
}

function getCorrectedEmail(userEmail: string | null) {
  return userEmail || "Unknown User";
}

function getAppName(
  log: Exclude<
    ReturnType<typeof useCustomLogEventsQuery>["data"],
    undefined
  >["groupedLogs"][number],
  environmentsById: FormattedEnvironmentsById,
  multipleEnvironmentsInData: boolean
) {
  const environment = log.environmentId
    ? environmentsById[log.environmentId]
    : null;

  const appData = environment ? environment.appsByRoute[log.appRoute] : null;

  // Case 1: There's no associated environment. Assume the app is
  // either part of a deleted environment or was deleted from an
  // existing environment. In this case, return the app route with
  // "(deleted)" appended to it.
  if (!log.environmentId || !environment || !appData) {
    return `${log.appRoute} (deleted)`;
  }

  // Case 2: The dataset contains multiple environments. Append
  // the environment name to the app name to differentiate them.
  if (multipleEnvironmentsInData) {
    return `${appData.name} (${environment.name})`;
  }

  // Case 3: Default case. Return the app name.
  return appData.name;
}

export function useGroupEventsByApp(
  data: ReturnType<typeof useCustomLogEventsQuery>["data"],
  environmentsById: FormattedEnvironmentsById
): GroupedEventsDataAndSeries {
  return useMemo(() => {
    if (!data) {
      return {
        data: [],
        series: [],
      };
    }

    const multipleEnvironmentsInData =
      new Set(
        data.groupedLogs
          .map((log) => log.environmentId)
          .filter((id) => id !== null)
      ).size > 1;

    const eventOccurrencesByUserEmail: Record<
      string,
      Record<string, number>
    > = {};

    for (const log of data.groupedLogs) {
      const correctedEmail = getCorrectedEmail(log.userEmail);

      if (!eventOccurrencesByUserEmail[correctedEmail]) {
        eventOccurrencesByUserEmail[correctedEmail] = {};
      }

      const appName = getAppName(
        log,
        environmentsById,
        multipleEnvironmentsInData
      );

      if (!eventOccurrencesByUserEmail[correctedEmail][appName]) {
        eventOccurrencesByUserEmail[correctedEmail][appName] = log.count;
      } else {
        eventOccurrencesByUserEmail[correctedEmail][appName] += log.count;
      }
    }

    const formatted = flattenAndSortGroupedEvents(eventOccurrencesByUserEmail);

    return {
      data: formatted,
      series: getUniqueSeries(formatted),
    };
  }, [data, environmentsById]);
}

export function useGroupEventsByMessage(
  data: ReturnType<typeof useCustomLogEventsQuery>["data"]
): GroupedEventsDataAndSeries {
  return useMemo(() => {
    if (!data) {
      return {
        data: [],
        series: [],
      };
    }

    const eventOccurrencesByMessage: Record<
      string,
      Record<string, number>
    > = {};

    for (const log of data.groupedLogs) {
      const correctedEmail = getCorrectedEmail(log.userEmail);

      if (!eventOccurrencesByMessage[correctedEmail]) {
        eventOccurrencesByMessage[correctedEmail] = {};
      }

      if (!eventOccurrencesByMessage[correctedEmail][log.message]) {
        eventOccurrencesByMessage[correctedEmail][log.message] = log.count;
      } else {
        eventOccurrencesByMessage[correctedEmail][log.message] += log.count;
      }
    }

    const formatted = flattenAndSortGroupedEvents(eventOccurrencesByMessage);

    return {
      data: formatted,
      series: getUniqueSeries(formatted),
    };
  }, [data]);
}
