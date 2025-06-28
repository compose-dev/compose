import AddStarterAppsNode from "../components/AddStarterAppsNode";
import InstallPackageNode from "../components/InstallPackageNode";
import RunYourAppNode from "../components/RunYourAppNode";
import StartClientNode from "../components/StartClientNode";

const START_COMPOSE_CLIENT_CODE = `import { composeClient } from "./compose"; // import the client

// other code...

app.listen(3000, () => {
    console.log("Server is running on port 3000");
    composeClient.connect(); // connect to Compose servers
});`;

function KoaExisting({ apiKey }: { apiKey: string | null }) {
  return (
    <>
      <InstallPackageNode />
      <AddStarterAppsNode apiKey={apiKey} />
      <StartClientNode code={START_COMPOSE_CLIENT_CODE} />
      <RunYourAppNode />
    </>
  );
}

export default KoaExisting;
