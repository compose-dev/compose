import { m } from "@compose/ts";
import { CustomReport } from "../../components/custom-report";
import { Alert } from "~/components/alert";
import { useReportData } from "~/routes/home/pages/activity-logs/utils/useReportData";
import { u as uPublic } from "@composehq/ts-public";

const INITIAL_REPORT_DATA: Partial<m.Report.DB["data"]> = {
  trackedEventModel: {
    logicOperator: m.Report.TRACKED_EVENT_LOGIC_OPERATORS.AND,
    events: [
      {
        operator: m.Report.TRACKED_EVENT_OPERATORS.EQUALS,
        event: m.Log.APP_INITIALIZED_MESSAGE,
        type: uPublic.log.TYPE.SYSTEM,
      },
    ],
  },
};

function AppRuns() {
  const report = useReportData(INITIAL_REPORT_DATA);

  return (
    <>
      <CustomReport
        // header
        header={
          <Alert appearance="neutral" iconName="info-circle" className="w-full">
            An app run is counted every time a user loads an app. Navigating
            between apps counts as a new run.
          </Alert>
        }
        // state
        report={report}
        // labels
        initialGroupBy="app"
        totalOccurrencesStatLabel="Total App Runs"
        totalOccurrencesStatDescription="Number of times an app was run within the selected timeframe"
        totalUsersStatLabel="Total Users"
        totalUsersStatDescription="Unique users who ran an app within the selected timeframe"
        chartLabel="App Runs by User"
      />
    </>
  );
}

export default AppRuns;
