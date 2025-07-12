import {
  BrowserToServerEvent,
  log as logFunction,
  m,
  request,
  u,
} from "@compose/ts";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { getNodeEnvironment } from "~/utils/nodeEnvironment";

const isDev = getNodeEnvironment() === "development";
const log = isDev ? logFunction : null;

type Filters = {
  limit: number;
  offset: number;
  appRoute: string | null;
  userEmail: string | null;
  severity: m.Log.DB["severity"][];
  datetimeStart: u.date.DateTimeModel | null;
  datetimeEnd: u.date.DateTimeModel | null;
  message: string | null;
  type: m.Log.DB["type"] | null;
};

const INITIAL_FILTERS: Filters = {
  limit: 50,
  offset: 0,
  appRoute: null,
  userEmail: null,
  severity: [],
  datetimeStart: null,
  datetimeEnd: null,
  message: null,
  type: null,
};

export function usePageOfActivityLogsQuery() {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const filtersRef = useRef<Filters>(INITIAL_FILTERS);
  const [prevFilters, setPrevFilters] = useState<Filters>(INITIAL_FILTERS);

  // Not optimized to take advantage of react query features.
  const query = useQuery({
    queryKey: ["page-of-activity-logs"],
    queryFn: async () => {
      const response = await request<
        BrowserToServerEvent.GetPageOfLogs.SuccessResponseBody,
        BrowserToServerEvent.GetPageOfLogs.ErrorResponseBody
      >({
        route: `/${BrowserToServerEvent.GetPageOfLogs.route}`,
        method: BrowserToServerEvent.GetPageOfLogs.method,
        forwardLog: log,
        body: {
          ...filtersRef.current,
          datetimeStart: filtersRef.current.datetimeStart
            ? u.date.fromDateTimeModel(filtersRef.current.datetimeStart)
            : null,
          datetimeEnd: filtersRef.current.datetimeEnd
            ? u.date.fromDateTimeModel(filtersRef.current.datetimeEnd)
            : null,
        },
      });

      if (response.didError) {
        throw new Error(response.data.message);
      }

      return response.data;
    },
    retry: false, // never auto-retry
  });

  function updateFilters(newFilters: Partial<typeof filters>) {
    setFilters({
      ...filters,
      ...newFilters,
    });
    filtersRef.current = {
      ...filtersRef.current,
      ...newFilters,
    };
  }

  function applyFilters() {
    updateFilters({
      offset: 0,
    });
    setPrevFilters({ ...filters, offset: 0 });
    query.refetch();
  }

  return {
    ...query,
    prevFilters,
    filters,
    updateFilters,
    applyFilters,
  };
}
