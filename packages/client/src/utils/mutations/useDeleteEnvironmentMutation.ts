import { useMutation } from "@tanstack/react-query";
import { api } from "~/api";

function useDeleteEnvironmentMutation() {
  return useMutation({
    mutationFn: async (environmentId: string) => {
      const response = await api.routes.deleteEnvironment(environmentId);

      if (response.didError) {
        throw new Error(response.data.message);
      }

      return response.data;
    },
  });
}

export { useDeleteEnvironmentMutation };
