import { useNavigate, useSearch } from "@tanstack/react-router";

const TABS = {
  // DEFAULT
  APP_RUNS: "app-runs",
  ALL_EVENTS: "all-events",

  // CUSTOM
  CREATE_CUSTOM_REPORT: "create-custom-report",
  EDIT_CUSTOM_REPORT: "edit-custom-report",
  VIEW_CUSTOM_REPORT: "view-custom-report",
} as const;

type Tab = (typeof TABS)[keyof typeof TABS];

const TAB_TO_LABEL: Record<Tab, string> = {
  [TABS.APP_RUNS]: "App Runs Report",
  [TABS.CREATE_CUSTOM_REPORT]: "Create Custom Report",
  [TABS.EDIT_CUSTOM_REPORT]: "Edit Custom Report",
  [TABS.VIEW_CUSTOM_REPORT]: "View Custom Report",
  [TABS.ALL_EVENTS]: "All Events",
};

function useActiveTab() {
  const { tab: activeTab } = useSearch({ from: "/home/audit-log" });
  const navigate = useNavigate({ from: "/home/audit-log" });

  const setActiveTab = (tab: Tab) => {
    navigate({
      to: "/home/audit-log",
      search: (prev) => ({ ...prev, tab }),
    });
  };
  return { activeTab, setActiveTab };
}

const DEFAULT_TAB = TABS.APP_RUNS;

export { useActiveTab, TABS, TAB_TO_LABEL, type Tab, DEFAULT_TAB };
