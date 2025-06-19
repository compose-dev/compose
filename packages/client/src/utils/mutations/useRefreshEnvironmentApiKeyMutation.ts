import { useMutation } from "@tanstack/react-query";
import { api } from "~/api";

function useRefreshEnvironmentApiKeyMutation() {
  return useMutation({
    mutationFn: async (environmentId: string) => {
      const response = await api.routes.refreshEnvironmentApiKey(environmentId);

      if (response.didError) {
        throw new Error(response.data.message);
      }

      return response.data;
    },
  });
}

export { useRefreshEnvironmentApiKeyMutation };
