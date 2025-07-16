import { m } from "@compose/ts";
import { useHomeStore } from "~/routes/home/utils/useHomeStore";
import { Page } from "~/routes/home/components/page";
import InvalidPlanError from "./components/errors/InvalidPlanError";
import { Tabs } from "~/components/tabs";
import { InlineLink } from "~/components/inline-link";
import Button from "~/components/button";
import {
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { EDIT_CUSTOM_REPORT_STEPS } from "./pages/edit-custom-report";
import { useFetchAllReportsQuery } from "~/utils/queries/useFetchAllReportsQuery";

const TABS = {
  APP_RUNS: "app-runs",
  ALL_EVENTS: "all-events",
  EDIT_CUSTOM_REPORT: "edit-custom-report",
} as const;

type Tab = (typeof TABS)[keyof typeof TABS];

function useActiveTab() {
  const navigate = useNavigate({
    from: "/home/activity-logs",
  });

  const { reportId } = useParams({ strict: false });

  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  const activeTab: Tab =
    pathname.includes("/view-custom-report") && reportId
      ? (`view-custom-report_${reportId}` as Tab)
      : pathname.includes("/edit-custom-report")
        ? "edit-custom-report"
        : pathname.includes("/all-events")
          ? "all-events"
          : "app-runs";

  const setActiveTab = (tab: Tab) => {
    if (tab === "edit-custom-report") {
      navigate({
        to: "/home/activity-logs/edit-custom-report",
      });
    } else if (tab === "all-events") {
      navigate({
        to: "/home/activity-logs/all-events",
      });
    } else if (tab === "app-runs") {
      navigate({
        to: "/home/activity-logs",
      });
    } else if ((tab as string).startsWith("view-custom-report_")) {
      navigate({
        to: "/home/activity-logs/view-custom-report/$reportId",
        params: {
          reportId: (tab as string).split("_")[1],
        },
      });
    }
  };

  return { activeTab, setActiveTab };
}

export default function ActivityLogs() {
  const navigate = useNavigate({
    from: "/home/activity-logs",
  });

  const { data: reports } = useFetchAllReportsQuery();

  const { company } = useHomeStore();

  const { activeTab, setActiveTab } = useActiveTab();

  const isInvalidPlan = !company || company.plan === m.Company.PLANS.HOBBY;

  return (
    <Page.Root width="lg" gap="8">
      <div className="flex flex-row justify-between items-center w-full">
        <Page.Title>Activity Logs</Page.Title>
        <Button
          variant="primary"
          onClick={() =>
            navigate({
              to: "/home/activity-logs/edit-custom-report",
              search: {
                step: EDIT_CUSTOM_REPORT_STEPS.PICK_TRACKED_EVENTS,
              },
            })
          }
        >
          Create Custom Report
        </Button>
      </div>
      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        options={[
          {
            label: "App Runs Report",
            value: TABS.APP_RUNS,
          },
          ...reports.reports.map((report) => ({
            label: report.title,
            value: `view-custom-report_${report.id}` as Tab,
          })),
          {
            label: "All Events",
            value: TABS.ALL_EVENTS,
          },
        ]}
        rightContent={
          <InlineLink
            url="https://docs.composehq.com/page-actions/log"
            newTab
            appearance="secondary"
            alwaysUnderline={false}
            showLinkIcon
          >
            <p className="text-sm">Start logging custom events</p>
          </InlineLink>
        }
      />
      {isInvalidPlan && <InvalidPlanError />}
      {!isInvalidPlan && <Outlet />}
    </Page.Root>
  );
}
