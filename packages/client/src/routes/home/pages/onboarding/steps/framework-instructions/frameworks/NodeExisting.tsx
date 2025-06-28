import AddStarterAppsNode from "../components/AddStarterAppsNode";
import InstallPackageNode from "../components/InstallPackageNode";
import RunYourAppNode from "../components/RunYourAppNode";
import StartClientNode from "../components/StartClientNode";

const START_COMPOSE_CLIENT_CODE = `import { composeClient } from "./compose";

// other code...

composeClient.connect();`;

function NodeExisting({ apiKey }: { apiKey: string | null }) {
  return (
    <>
      <InstallPackageNode />
      <AddStarterAppsNode apiKey={apiKey} />
      <StartClientNode code={START_COMPOSE_CLIENT_CODE} />
      <RunYourAppNode />
    </>
  );
}

export default NodeExisting;
