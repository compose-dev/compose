import { useState } from "react";
import AddStarterAppsNode from "../components/AddStarterAppsNode";
import {
  INSTALL_STRATEGY,
  type InstallStrategy,
  NewProjectInstallStrategyPicker,
} from "../components/new-project-install-strategy-picker";
import CloneStarterRepo from "../components/CloneStarterRepo";
import { InlineLink } from "~/components/inline-link";
import Button from "~/components/button";
import FrameworkStep from "../components/FrameworkStep";
import { Code } from "~/components/code";
import { InlineCode } from "~/components/inline-code";
import AddApiKey from "../components/AddApiKey";

const CLONE_REPO_CODE = `git clone https://github.com/compose-dev/compose-node-starter.git
cd compose-node-starter`;

function InstallDependencies() {
  return (
    <FrameworkStep>
      <h4>2. Install dependencies</h4>
      <Code code={`npm install`} lang="bash" />
    </FrameworkStep>
  );
}

function RunTheApp() {
  return (
    <FrameworkStep>
      <h4>4. Run the app</h4>
      <Code code={`npm run dev`} lang="bash" />
    </FrameworkStep>
  );
}

const RUN_THE_APP_MANUAL_INSTALL_CODE = `# TypeScript
npx tsx --watch src/index.ts

# JavaScript
node --watch src/index.js`;

function RunTheAppManualInstall() {
  return (
    <FrameworkStep>
      <h4>3. Run the app</h4>
      <p>Run your project's dev command, e.g:</p>
      <Code code={RUN_THE_APP_MANUAL_INSTALL_CODE} lang="bash" />
    </FrameworkStep>
  );
}

function NodeNew({ apiKey }: { apiKey: string | null }) {
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
                  url="https://github.com/compose-dev/compose-node-starter"
                  newTab
                  showLinkIcon
                >
                  starter repo
                </InlineLink>{" "}
                is a barebones Node.js project that comes with TypeScript and
                the Compose SDK installed. If you prefer JavaScript, you can
                always{" "}
                <Button
                  variant="ghost"
                  onClick={() => setInstallStrategy(INSTALL_STRATEGY.MANUAL)}
                >
                  <span className="text-brand-neutral underline hover:text-brand-primary transition-colors duration-200">
                    setup your project manually
                  </span>
                  .
                </Button>
              </p>
            }
          />
          <InstallDependencies />
          <AddApiKey
            apiKey={apiKey}
            filePath="src/index.ts"
            sectionNumber={3}
          />
          <RunTheApp />
        </>
      )}
      {installStrategy === INSTALL_STRATEGY.MANUAL && (
        <>
          <FrameworkStep>
            <h4>1. Setup your project</h4>
            <p>Create a project directory</p>
            <Code code="mkdir compose && cd compose" lang="bash" />
            <p>
              Initialize the project, and set the project type to{" "}
              <InlineCode>module</InlineCode> to enable modern JavaScript
              import/export syntax.
            </p>
            <Code code="npm init -y && npm pkg set type=module" lang="bash" />
            <p>
              If you're using TypeScript, install the TypeScript compiler and{" "}
              <InlineCode>tsx</InlineCode>, which we'll use to run our app
              during development.
            </p>
            <Code code="npm install --save-dev typescript tsx" lang="bash" />
          </FrameworkStep>
          <AddStarterAppsNode apiKey={apiKey} newProject />
          <RunTheAppManualInstall />
        </>
      )}
    </>
  );
}

export default NodeNew;
