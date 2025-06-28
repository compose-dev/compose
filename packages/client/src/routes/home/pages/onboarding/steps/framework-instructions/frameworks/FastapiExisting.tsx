import AddStarterAppsPython from "../components/AddStarterAppsPython";
import InstallPackagePython from "../components/InstallPackagePython";
import RunYourAppPython from "../components/RunYourAppNode copy";
import StartClientPython from "../components/StartClientPython";

const START_COMPOSE_CLIENT_CODE = `from fastapi import FastAPI
from contextlib import asynccontextmanager

from .compose import compose_client

# Use the lifespan context manager to connect to the Compose servers once
# when the app starts up, and disconnect when the app shuts down.
@asynccontextmanager
async def lifespan(app: FastAPI):
    compose_client.connect_async()
    yield
    compose_client.shutdown()

app = FastAPI(lifespan=lifespan)`;

function FastapiExisting({ apiKey }: { apiKey: string | null }) {
  return (
    <>
      <InstallPackagePython />
      <AddStarterAppsPython apiKey={apiKey} />
      <StartClientPython code={START_COMPOSE_CLIENT_CODE} />
      <RunYourAppPython
        label="Start your FastAPI server"
        command="fastapi dev main.py"
      />
    </>
  );
}

export default FastapiExisting;
