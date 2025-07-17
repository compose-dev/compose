import { m, u } from "@compose/ts";
import { useHomeStore } from "~/routes/home/utils/useHomeStore";
import { Page } from "~/routes/home/components/page";
import InvalidPlanError from "./components/errors/InvalidPlanError";
import { Tabs } from "~/components/tabs";
import { InlineLink } from "~/components/inline-link";
import Button from "~/components/button";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { EDIT_CUSTOM_REPORT_STEPS } from "./pages/edit-custom-report";
import { useFetchAllReportsQuery } from "~/utils/queries/useFetchAllReportsQuery";
import { useEffect } from "react";
import { CenteredSpinner } from "~/components/spinner";
import UnknownError from "./components/errors/UnknownError";
import {
  useActivePath,
  PATHS,
  Path,
  VIEW_CUSTOM_REPORT_PATH,
} from "./utils/useActivePath";

export default function ActivityLogs() {
  const navigate = useNavigate({
    from: "/home/activity-logs",
  });

  const { data: reports } = useFetchAllReportsQuery();

  const { company, user } = useHomeStore();

  const { activePath, setActivePath } = useActivePath();

  const isInvalidPlan = !company || company.plan === m.Company.PLANS.HOBBY;

  const canCreateCustomReport =
    !isInvalidPlan &&
    user &&
    u.permission.isAllowed(u.permission.FEATURE.CREATE_REPORT, user.permission);

  const canViewListOfReports =
    !isInvalidPlan &&
    user &&
    u.permission.isAllowed(
      u.permission.FEATURE.VIEW_LIST_OF_REPORTS,
      user.permission
    );

  function getTabOptions() {
    const options: { label: string; value: Path }[] = [];

    if (canViewListOfReports) {
      options.push({
        label: "App Runs Report",
        value: PATHS.APP_RUNS,
      });
    }

    if (reports) {
      for (const report of reports.reports) {
        options.push({
          label: report.title,
          value: VIEW_CUSTOM_REPORT_PATH(report.id),
        });
      }
    }

    if (canViewListOfReports) {
      options.push({
        label: "All Events",
        value: PATHS.ALL_EVENTS,
      });
    }

    return options;
  }

  useEffect(() => {
    // If the user is not an admin but does have access to custom reports,
    // auto redirect to the first custom report.
    if (
      reports &&
      reports.reports.length > 0 &&
      !canViewListOfReports &&
      activePath === PATHS.APP_RUNS
    ) {
      setActivePath(VIEW_CUSTOM_REPORT_PATH(reports.reports[0].id));
    }
  }, [reports, canViewListOfReports, activePath, setActivePath]);

  const hasCustomReports = reports && reports.reports.length > 0;

  return (
    <Page.Root width="lg" gap="8">
      <div className="flex flex-row justify-between items-center w-full">
        <Page.Title>Activity Logs</Page.Title>
        {canCreateCustomReport && (
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
        )}
      </div>
      <Tabs
        activeTab={activePath}
        setActiveTab={setActivePath}
        options={getTabOptions()}
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
      {!isInvalidPlan && (
        <>
          {/* Case 1: Not admin + custom reports not yet loaded */}
          {!canViewListOfReports && !reports && <CenteredSpinner />}
          {/* Case 2: Not admin + no custom reports */}
          {!canViewListOfReports && !hasCustomReports && (
            <div className="flex flex-col items-center justify-center h-full w-full">
              <UnknownError errorMessage="You don't have permission to view any reports. Ask an administrator to grant you access." />
            </div>
          )}
          {/* Case 3: Either admin or has custom reports */}
          {(canViewListOfReports || hasCustomReports) && <Outlet />}
        </>
      )}
    </Page.Root>
  );
}
