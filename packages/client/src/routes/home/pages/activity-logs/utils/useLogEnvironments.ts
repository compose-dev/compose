import { useState } from "react";

export function useLogEnvironments() {
  const [includeDevLogs, setIncludeDevLogs] = useState(false);
  const [includeProdLogs, setIncludeProdLogs] = useState(true);

  return {
    includeDevLogs,
    setIncludeDevLogs,
    includeProdLogs,
    setIncludeProdLogs,
  };
}
