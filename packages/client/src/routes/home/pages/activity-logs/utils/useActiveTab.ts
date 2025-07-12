import { useState } from "react";

const TABS = {
  APP_RUNS: "app-runs",
  CUSTOM_EVENTS: "custom-events",
  ALL_EVENTS: "all-events",
} as const;

type Tab = (typeof TABS)[keyof typeof TABS];

const TAB_OPTIONS: { label: string; value: Tab }[] = [
  {
    label: "App Runs",
    value: TABS.APP_RUNS,
  },
  // {
  //   label: "Custom Events",
  //   value: TABS.CUSTOM_EVENTS,
  // },
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
