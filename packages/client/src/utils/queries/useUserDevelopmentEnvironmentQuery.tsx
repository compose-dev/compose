import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";

export function useUserDevelopmentEnvironmentQuery() {
  return useQuery({
    queryKey: ["user-development-environment"],
    queryFn: async () => {
      const response = await api.routes.getUserDevEnvironment();

      if (response.didError) {
        throw new Error(response.data.message);
      }

      return response.data;
    },
    retry: false, // never auto-retry
  });
}
