import { Framework, Step } from "../../../utils";
import NotSupportedTS from "../components/NotSupportedTS";

function NextjsExisting({
  setStep,
}: {
  setStep: (step: Step, framework?: Framework) => void;
}) {
  return (
    <NotSupportedTS
      setStep={setStep}
      frameworkLabel="Next.js"
      showAddComposeToBackendOption={true}
      showSpinUpDedicatedNodejsProjectOption={true}
    />
  );
}

export default NextjsExisting;
