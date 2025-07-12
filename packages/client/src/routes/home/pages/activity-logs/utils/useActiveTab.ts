import { useState } from "react";

const TABS = {
  APP_LOADS: "app-loads",
  ALL_EVENTS: "all-events",
} as const;

type Tab = (typeof TABS)[keyof typeof TABS];

const TAB_OPTIONS: { label: string; value: Tab }[] = [
  {
    label: "App Loads",
    value: TABS.APP_LOADS,
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
