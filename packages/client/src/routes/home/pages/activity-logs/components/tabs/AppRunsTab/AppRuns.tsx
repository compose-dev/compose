import { m } from "@compose/ts";
import { CustomReport } from "../../custom-report";
import { u as uPublic } from "@composehq/ts-public";
import { Alert } from "~/components/alert";

function AppRunsTab({ now }: { now: React.MutableRefObject<Date> }) {
  return (
    <>
      <CustomReport
        header={
          <Alert appearance="neutral" iconName="info-circle" className="w-full">
            An app run is counted every time a user loads an app. Navigating
            between apps counts as a new run.
          </Alert>
        }
        trackedEvents={[
          {
            message: m.Log.APP_INITIALIZED_MESSAGE,
            type: uPublic.log.TYPE.SYSTEM,
          },
        ]}
        initialGroupBy="app"
        getTotalOccurrencesStatLabel={() => "Total App Runs"}
        getTotalOccurrencesStatDescription={() =>
          "Number of times an app was run within the selected timeframe"
        }
        getTotalUsersStatLabel={() => "Total Users"}
        getTotalUsersStatDescription={() =>
          "Unique users who ran an app within the selected timeframe"
        }
        chartLabel="App Runs by User"
        now={now}
      />
    </>
  );
}

export default AppRunsTab;
