import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";

export function useSettingsQuery() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await api.routes.getSettings();

      if (response.didError) {
        throw new Error(response.data.message);
      }

      return response.data;
    },
    retry: false, // never auto-retry
  });
}
