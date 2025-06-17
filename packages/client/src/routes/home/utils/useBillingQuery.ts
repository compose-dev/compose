import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";

export function useBillingQuery() {
  return useQuery({
    queryKey: ["billing"],
    queryFn: async () => {
      const response = await api.routes.getBillingData();

      if (response.didError) {
        throw new Error(response.data.message);
      }

      return response.data;
    },
    enabled: false, // never auto-run,
    retry: false, // never auto-retry
  });
}
