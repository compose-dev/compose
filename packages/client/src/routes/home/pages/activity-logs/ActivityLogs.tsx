import { m } from "@compose/ts";
import { useHomeStore } from "~/routes/home/utils/useHomeStore";
import { Page } from "~/routes/home/components/page";
import InvalidPlanError from "./components/InvalidPlanError";
import { Tabs } from "~/components/tabs";
import { useActiveTab, TAB_OPTIONS, TABS } from "./utils/useActiveTab";
import AllEventsTab from "./components/AllEventsTab";
import AppLoadsTab from "./components/AppLoadsTab";
import { InlineLink } from "~/components/inline-link";

export default function ActivityLogs() {
  const { company } = useHomeStore();

  const { activeTab, setActiveTab } = useActiveTab();

  const isInvalidPlan = !company || company.plan === m.Company.PLANS.HOBBY;

  return (
    <Page.Root width="lg" gap="8">
      <Page.Title>Activity Logs</Page.Title>
      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        options={TAB_OPTIONS}
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
      {!isInvalidPlan && activeTab === TABS.ALL_EVENTS && <AllEventsTab />}
      {!isInvalidPlan && activeTab === TABS.APP_LOADS && <AppLoadsTab />}
    </Page.Root>
  );
}
