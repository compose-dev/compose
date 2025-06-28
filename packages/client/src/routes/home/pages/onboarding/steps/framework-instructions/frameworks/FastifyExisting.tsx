import AddStarterAppsNode from "../components/AddStarterAppsNode";
import InstallPackageNode from "../components/InstallPackageNode";
import RunYourAppNode from "../components/RunYourAppNode";
import StartClientNode from "../components/StartClientNode";

const START_COMPOSE_CLIENT_CODE = `import { composeClient } from "./compose"; // import the client

// other code...

fastify.listen({ port: 3000 }, (err, address) => {
  composeClient.connect(); // connect to Compose servers
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(\`server listening on \${address}\`);
});`;

function FastifyExisting({ apiKey }: { apiKey: string | null }) {
  return (
    <>
      <InstallPackageNode />
      <AddStarterAppsNode apiKey={apiKey} />
      <StartClientNode code={START_COMPOSE_CLIENT_CODE} />
      <RunYourAppNode />
    </>
  );
}

export default FastifyExisting;
