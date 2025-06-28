import { useCallback } from "react";
import { api } from "~/api";
import { HomeStore, useHomeStore } from "./useHomeStore";

export function useRefetchEnvironment() {
  const { environments, setEnvironments } = useHomeStore();

  const refetchEnvironment = useCallback(
    async (environmentId: string) => {
      const response =
        await api.routes.fetchEnvironmentWithDetails(environmentId);

      const newEnvironments: HomeStore["environments"] = {
        ...environments,
      };

      if (!response.didError) {
        const apps: HomeStore["environments"][string]["apps"] = {};

        for (const app of response.data.environment.apps) {
          apps[app.route] = app;
        }

        newEnvironments[response.data.environment.id] = {
          ...newEnvironments[response.data.environment.id],
          ...response.data.environment,
          apps,
        };
      }

      setEnvironments(newEnvironments);
    },
    [environments, setEnvironments]
  );

  return { refetchEnvironment };
}
