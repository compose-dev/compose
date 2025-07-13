import { useState } from "react";

const TABS = {
  APP_RUNS: "app-runs",
  CUSTOM_REPORT: "custom-report",
  ALL_EVENTS: "all-events",
} as const;

type Tab = (typeof TABS)[keyof typeof TABS];

const TAB_OPTIONS: { label: string; value: Tab }[] = [
  {
    label: "App Runs Report",
    value: TABS.APP_RUNS,
  },
  {
    label: "Custom Report",
    value: TABS.CUSTOM_REPORT,
  },
  {
    label: "All Events",
    value: TABS.ALL_EVENTS,
  },
];

function useActiveTab() {
  const [activeTab, setActiveTab] = useState<Tab>(TAB_OPTIONS[0].value);

  return { activeTab, setActiveTab };
}

export { useActiveTab, TAB_OPTIONS, TABS };
