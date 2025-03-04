import { Code } from "~/components/code";
import { APP_CODE_PYTHON, APP_CODE_TS, LANG, Lang } from "../constants";
import CodeInline from "./CodeInline";
import Button from "~/components/button";

const ACTIVATE_VENV_CMD = `# mac/linux
source .venv/bin/activate

# windows command prompt
.venv\\Scripts\\activate.bat

# windows powershell
.venv\\Scripts\\Activate.ps1`;

const getRootFileName = (lang: Lang | null) => {
  if (lang === "typescript") {
    return "app.ts";
  }

  if (lang === "javascript") {
    return "app.js";
  }

  if (lang === "python") {
    return "app.py";
  }

  return "";
};

function ManualInstall({
  lang,
  apiKey,
  onSuccess,
}: {
  lang: Lang | null;
  apiKey: string | null;
  onSuccess: () => void;
}) {
  if (lang === LANG.typescript) {
    const appCode = apiKey
      ? APP_CODE_TS.replace("API_KEY_HERE", apiKey)
      : APP_CODE_TS;

    return (
      <>
        <p>
          Installing the SDK manually takes just a couple steps. First, create a
          new project directory:
        </p>
        <Code code={"mkdir compose && cd compose"} />
        <p>Initialize an npm project.</p>
        <Code code={"npm init -y; npm pkg set type=module"} />
        <p>Install the Compose SDK</p>
        <Code code={"npm install @composehq/sdk"} />
        <p>And typescript dependencies.</p>
        <Code code={"npm install --save-dev typescript tsx"} />
        <p>
          Create a file called <CodeInline>{getRootFileName(lang)}</CodeInline>.
        </p>
        <Code code={`touch ${getRootFileName(lang)}`} />
        <p>And paste the following starter code:</p>
        <Code code={appCode} />
        <Button onClick={onSuccess} variant="primary">
          Run this app
        </Button>
      </>
    );
  }

  if (lang === LANG.javascript) {
    const appCode = apiKey
      ? APP_CODE_TS.replace("API_KEY_HERE", apiKey)
      : APP_CODE_TS;

    return (
      <>
        <p>
          Installing the SDK manually takes just a couple steps. First, create a
          new project directory:
        </p>
        <Code code={"mkdir compose && cd compose"} />
        <p>Initialize an npm project.</p>
        <Code code={"npm init -y; npm pkg set type=module"} />
        <p>Install the Compose SDK</p>
        <Code code={"npm install @composehq/sdk"} />
        <p>
          Create a file called <CodeInline>{getRootFileName(lang)}</CodeInline>.
        </p>
        <Code code={`touch ${getRootFileName(lang)}`} />
        <p>And paste the following starter code:</p>
        <Code code={appCode} />
        <Button onClick={onSuccess} variant="primary">
          Run this app
        </Button>
      </>
    );
  }

  if (lang === LANG.python) {
    const appCode = apiKey
      ? APP_CODE_PYTHON.replace("API_KEY_HERE", apiKey)
      : APP_CODE_PYTHON;

    return (
      <>
        <p>
          Installing the SDK manually takes just a couple steps. First, create a
          new project directory.
        </p>
        <Code code={"mkdir compose && cd compose"} />
        <p>Then, create a virtual environment.</p>
        <Code code={"python -m venv .venv"} />
        <p>Activate the virtual environment.</p>
        <Code code={ACTIVATE_VENV_CMD} />
        <p>Install the SDK.</p>
        <Code code={"pip install compose-sdk"} />
        <p>
          Create a file called <CodeInline>{getRootFileName(lang)}</CodeInline>.
        </p>
        <Code code={`touch ${getRootFileName(lang)}`} />
        <p>And paste the following starter code:</p>
        <Code code={appCode} />
        <Button onClick={onSuccess} variant="primary">
          Run this app
        </Button>
      </>
    );
  }

  return null;
}

export default ManualInstall;
