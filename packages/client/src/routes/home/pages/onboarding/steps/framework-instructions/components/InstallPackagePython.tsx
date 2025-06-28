import { Code } from "~/components/code";
import FrameworkStep from "./FrameworkStep";

const INSTALL_CODE = `pip install compose-sdk
# or
poetry add compose-sdk
# or
uv add compose-sdk`;

function InstallPackagePython() {
  return (
    <FrameworkStep>
      <h4>1. Install the SDK</h4>
      <p>Use your package manager to install the Compose SDK.</p>
      <Code code={INSTALL_CODE} lang="bash" />
    </FrameworkStep>
  );
}

export default InstallPackagePython;
