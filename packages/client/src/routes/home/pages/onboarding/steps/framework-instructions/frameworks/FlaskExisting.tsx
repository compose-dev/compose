import AddStarterAppsPython from "../components/AddStarterAppsPython";
import InstallPackagePython from "../components/InstallPackagePython";
import RunYourAppPython from "../components/RunYourAppNode copy";
import StartClientPython from "../components/StartClientPython";

const START_COMPOSE_CLIENT_CODE = `from flask import Flask, jsonify
from .compose import compose_client
import os

# Avoid running the client in the auto-reload process
if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
    compose_client.connect_async()

app = Flask(__name__)`;

function FlaskExisting({ apiKey }: { apiKey: string | null }) {
  return (
    <>
      <InstallPackagePython />
      <AddStarterAppsPython apiKey={apiKey} />
      <StartClientPython code={START_COMPOSE_CLIENT_CODE} />
      <RunYourAppPython
        label="Start your Flask server"
        command="flask --app main run"
      />
    </>
  );
}

export default FlaskExisting;
