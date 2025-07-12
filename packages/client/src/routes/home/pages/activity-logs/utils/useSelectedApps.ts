import { useState } from "react";

function useSelectedApps() {
  const [selectedApps, setSelectedApps] = useState<
    {
      route: string;
      environmentId: string;
    }[]
  >([]);

  return {
    selectedApps,
    setSelectedApps,
  };
}

export default useSelectedApps;
