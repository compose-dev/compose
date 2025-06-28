import Button from "~/components/button";
import { FRAMEWORK, Framework, Step, STEP } from "../../../utils";
import FrameworkStep from "./FrameworkStep";

function NotSupportedTS({
  setStep,
  frameworkLabel,
  showAddComposeToBackendOption,
  showSpinUpDedicatedNodejsProjectOption,
}: {
  setStep: (step: Step, framework?: Framework) => void;
  frameworkLabel: string;
  showAddComposeToBackendOption: boolean;
  showSpinUpDedicatedNodejsProjectOption: boolean;
}) {
  return (
    <>
      <p>
        Compose requires a persistent connection to the Compose servers to run
        your apps, which is incompatible with {frameworkLabel}'s serverless
        model.
      </p>
      {showAddComposeToBackendOption && (
        <FrameworkStep>
          <h4>Option 1: Add Compose to your backend</h4>
          <p>
            If your app has a dedicated backend (e.g. Django, Express, etc.)
            that serves your {frameworkLabel} app, we recommend installing
            Compose there. Compose is meant to be installed into your backend to
            enable simple code sharing with your models, utilities, and other
            business logic. See{" "}
            <Button
              variant="ghost"
              onClick={() => setStep(STEP["installation-method"])}
            >
              <p className="text-brand-primary hover:text-brand-primary-heavy hover:underline">
                supported languages and frameworks
              </p>
            </Button>
            .
          </p>
        </FrameworkStep>
      )}
      {showSpinUpDedicatedNodejsProjectOption && (
        <FrameworkStep>
          <h4>
            {showAddComposeToBackendOption
              ? "Option 2: Spin up a dedicated Node.js project"
              : "Spin up a dedicated Node.js project in less than 2 minutes"}
          </h4>
          <p>
            You can spin up a dedicated Node.js project to run Compose. Many
            users already do this in order to isolate their internal apps from
            their main server runtime. It takes less than 2 minutes to get
            started. See the
            <Button
              variant="ghost"
              onClick={() =>
                setStep(STEP["framework-instructions"], FRAMEWORK["nodejs-new"])
              }
            >
              <p className="text-brand-primary hover:text-brand-primary-heavy hover:underline">
                Node.js guide
              </p>
            </Button>{" "}
            for more information.
          </p>
        </FrameworkStep>
      )}
    </>
  );
}

export default NotSupportedTS;
