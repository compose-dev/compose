import { useState } from "react";
import AddStarterAppsPython from "../components/AddStarterAppsPython";
import {
  INSTALL_STRATEGY,
  InstallStrategy,
  NewProjectInstallStrategyPicker,
} from "../components/new-project-install-strategy-picker";
import CloneStarterRepo from "../components/CloneStarterRepo";
import { InlineLink } from "~/components/inline-link";
import FrameworkStep from "../components/FrameworkStep";
import { Code } from "~/components/code";
import AddApiKey from "../components/AddApiKey";

const CLONE_REPO_CODE = `git clone https://github.com/compose-dev/compose-python-starter.git
cd compose-python-starter`;

const ACTIVATE_VIRTUAL_ENVIRONMENT_CODE = `# Mac/Linux
source .venv/bin/activate

# Windows (Command Prompt)
.venv\\Scripts\\Activate.bat

# Windows (PowerShell)
.venv\\Scripts\\Activate.ps1`;

function CreateVirtualEnvironment() {
  return (
    <FrameworkStep>
      <h4>2. Create a virtual environment</h4>
      <Code code={`python -m venv .venv`} lang="bash" />
      <p>Activate the environment.</p>
      <Code code={ACTIVATE_VIRTUAL_ENVIRONMENT_CODE} lang="bash" />
    </FrameworkStep>
  );
}

function InstallDependencies() {
  return (
    <FrameworkStep>
      <h4>3. Install dependencies</h4>
      <Code code={`pip install -r requirements.txt`} lang="bash" />
    </FrameworkStep>
  );
}

const RUN_THE_APP_CODE = `# Use py-mon to enable auto-reload on code changes
pymon app.py

# Or, use python directly
python app.py`;

function RunTheApp() {
  return (
    <FrameworkStep>
      <h4>5. Run the app</h4>
      <Code code={RUN_THE_APP_CODE} lang="bash" />
    </FrameworkStep>
  );
}

function PythonNew({ apiKey }: { apiKey: string | null }) {
  const [installStrategy, setInstallStrategy] = useState<InstallStrategy>(
    INSTALL_STRATEGY.GITHUB_REPO
  );

  return (
    <>
      <NewProjectInstallStrategyPicker
        activeTab={installStrategy}
        setActiveTab={setInstallStrategy}
      />
      {installStrategy === INSTALL_STRATEGY.GITHUB_REPO && (
        <>
          <CloneStarterRepo
            code={CLONE_REPO_CODE}
            text={
              <p>
                The{" "}
                <InlineLink
                  url="https://github.com/compose-dev/compose-python-starter"
                  newTab
                  showLinkIcon
                >
                  starter repo
                </InlineLink>{" "}
                is a barebones Python project that comes with the Compose SDK
                installed.
              </p>
            }
          />
          <CreateVirtualEnvironment />
          <InstallDependencies />
          <AddApiKey apiKey={apiKey} filePath="app.py" sectionNumber={4} />
          <RunTheApp />
        </>
      )}
      {installStrategy === INSTALL_STRATEGY.MANUAL && (
        <>
          <FrameworkStep>
            <h4>1. Create a project directory</h4>
            <Code code={`mkdir compose && cd compose`} lang="bash" />
          </FrameworkStep>
          <CreateVirtualEnvironment />
          <FrameworkStep>
            <h4>3. Install dependencies</h4>
            <p>Install the Compose SDK</p>
            <Code code={`pip install compose-sdk`} lang="bash" />
            <p>
              Optionally, install py-mon, a lightweight file watcher that will
              automatically restart your app when you make code changes.
            </p>
            <Code code={`pip install py-mon`} lang="bash" />
          </FrameworkStep>
          <AddStarterAppsPython
            apiKey={apiKey}
            framework="manual-install"
            sectionNumber={4}
          />
          <RunTheApp />
        </>
      )}
    </>
  );
}

export default PythonNew;
