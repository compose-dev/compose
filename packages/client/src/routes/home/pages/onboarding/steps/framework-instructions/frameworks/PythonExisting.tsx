import AddStarterAppsPython from "../components/AddStarterAppsPython";
import InstallPackagePython from "../components/InstallPackagePython";
import RunYourAppPython from "../components/RunYourAppNode copy";
import StartClientPython from "../components/StartClientPython";

const START_COMPOSE_CLIENT_CODE = `from .compose import compose_client

# other code ...

# Run the client in a background thread. Use .connect() to run the client
# as a blocking process in the main thread.
compose_client.connect_async()`;

function PythonExisting({ apiKey }: { apiKey: string | null }) {
  return (
    <>
      <InstallPackagePython />
      <AddStarterAppsPython apiKey={apiKey} />
      <StartClientPython code={START_COMPOSE_CLIENT_CODE} />
      <RunYourAppPython
        label="Run your project's dev command"
        command="python main.py"
      />
    </>
  );
}

export default PythonExisting;
