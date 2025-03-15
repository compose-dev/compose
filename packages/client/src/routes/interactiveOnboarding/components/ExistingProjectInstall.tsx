import { Code } from "~/components/code";
import {
  APP_CODE_PYTHON,
  APP_CODE_TS,
  EXPRESS_INTEGRATION_TS,
  FLASK_INTEGRATION_PY,
  LANG,
  Lang,
} from "../constants";
import CodeInline from "./CodeInline";
import Button from "~/components/button";

function ExistingProjectInstall({
  lang,
  apiKey,
  onSuccess,
}: {
  lang: Lang | null;
  apiKey: string | null;
  onSuccess: () => void;
}) {
  function appCodeTS() {
    const appCode = APP_CODE_TS.replace(
      "const client =",
      "const composeClient ="
    ).replace("client.connect();", "export { composeClient }");

    if (apiKey) {
      return appCode.replace("API_KEY_HERE", apiKey);
    }

    return appCode;
  }

  function appCodePY() {
    const appCode = APP_CODE_PYTHON.replace(
      "client =",
      "compose_client ="
    ).replace("\nclient.connect()", "");

    if (apiKey) {
      return appCode.replace("API_KEY_HERE", apiKey);
    }

    return appCode;
  }

  if (lang === LANG.typescript || lang === LANG.javascript) {
    return (
      <>
        <p>
          Install the SDK into your project in just a few steps. First, install
          the package:
        </p>
        <Code code={"npm install @composehq/sdk"} lang="bash" />
        <p>
          Next, define some starter apps to display a table of users and a form
          to create new users. Copy this code directly into a new file (e.g.{" "}
          <CodeInline>
            {lang === LANG.typescript ? "./src/compose.ts" : "./src/compose.js"}
          </CodeInline>
          ) in your project:
        </p>
        <Code code={appCodeTS()} lang="typescript" />
        <p>
          Finally, start the Compose client after starting your server. Here's
          an example using Express, but the integration is identical for all
          runtimes & frameworks.
        </p>
        <Code code={EXPRESS_INTEGRATION_TS} lang="typescript" />
        <Button onClick={onSuccess} variant="primary">
          Run this app
        </Button>
      </>
    );
  }

  if (lang === LANG.python) {
    return (
      <>
        <p>
          Install the SDK into your project in just a few steps. First, install
          the package
        </p>
        <Code code={"pip install compose-sdk"} />
        <p>
          Next, define some starter apps to display a table of users and a form
          to create new users. Copy this code directly into a new file (e.g.{" "}
          <CodeInline>./src/compose.py</CodeInline>) in your project:
        </p>
        <Code code={appCodePY()} />
        <p>
          Finally, start the Compose client. Here's an example using Flask, but
          the integration is identical for all frameworks.
        </p>
        <Code code={FLASK_INTEGRATION_PY} lang="python" />
        <p className="text-sm text-brand-neutral-2">
          Note: <CodeInline>connect_async()</CodeInline> is a non-blocking call
          that is the correct way to start the client for most frameworks (e.g.
          Flask, Django, FastAPI, etc.). Compose also provides a blocking
          <CodeInline>connect()</CodeInline> function for implementations where
          there isn't already another process using the main thread.
        </p>
        <Button onClick={onSuccess} variant="primary">
          Run this app
        </Button>
      </>
    );
  }

  return null;
}

export default ExistingProjectInstall;
