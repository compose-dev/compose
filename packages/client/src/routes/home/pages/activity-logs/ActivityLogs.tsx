import { m } from "@compose/ts";
import { useHomeStore } from "~/routes/home/utils/useHomeStore";
import { Page } from "~/routes/home/components/page";
import InvalidPlanError from "./components/errors/InvalidPlanError";
import { Tabs } from "~/components/tabs";
import { useActiveTab, TABS, TAB_TO_LABEL } from "./utils/useActiveTab";
import AllEventsTab from "./components/tabs/AllEventsTab";
import AppRunsTab from "./components/tabs/AppRunsTab";
import { InlineLink } from "~/components/inline-link";
import CreateCustomReportTab from "./components/tabs/CreateCustomReportTab";
import Button from "~/components/button";
import { useRef } from "react";
import useTrackedEvents from "./utils/useTrackedEvents";
import EditCustomReportTab from "./components/tabs/EditCustomReportTab";

export default function ActivityLogs() {
  const { company } = useHomeStore();

  const now = useRef(new Date());

  const { activeTab, setActiveTab } = useActiveTab();
  const { trackedEvents, toggleTrackedEvent, clearTrackedEvents } =
    useTrackedEvents();

  const isInvalidPlan = !company || company.plan === m.Company.PLANS.HOBBY;

  return (
    <Page.Root width="lg" gap="8">
      <div className="flex flex-row justify-between items-center w-full">
        <Page.Title>Activity Logs</Page.Title>
        <Button
          variant="primary"
          onClick={() => setActiveTab(TABS.CREATE_CUSTOM_REPORT)}
        >
          Create Custom Report
        </Button>
      </div>
      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        options={[
          {
            label: TAB_TO_LABEL[TABS.APP_RUNS],
            value: TABS.APP_RUNS,
          },
          {
            label: TAB_TO_LABEL[TABS.ALL_EVENTS],
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
      {!isInvalidPlan && (
        <>
          {activeTab === TABS.ALL_EVENTS && <AllEventsTab />}
          {activeTab === TABS.APP_RUNS && <AppRunsTab now={now} />}
          {activeTab === TABS.CREATE_CUSTOM_REPORT && (
            <CreateCustomReportTab
              clearTrackedEvents={clearTrackedEvents}
              toggleTrackedEvent={(message, type) => {
                toggleTrackedEvent(message, type);
                setActiveTab(TABS.EDIT_CUSTOM_REPORT);
              }}
            />
          )}
          {activeTab === TABS.EDIT_CUSTOM_REPORT && (
            <EditCustomReportTab now={now} trackedEvents={trackedEvents} />
          )}
        </>
      )}
    </Page.Root>
  );
}
