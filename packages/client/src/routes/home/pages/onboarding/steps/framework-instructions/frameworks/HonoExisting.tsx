import { Framework, Step } from "../../../utils";
import NotSupportedTS from "../components/NotSupportedTS";

function HonoExisting({
  setStep,
}: {
  setStep: (step: Step, framework?: Framework) => void;
}) {
  return (
    <NotSupportedTS
      setStep={setStep}
      frameworkLabel="Hono"
      showAddComposeToBackendOption={false}
      showSpinUpDedicatedNodejsProjectOption={true}
    />
  );
}

export default HonoExisting;
