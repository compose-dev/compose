import { Code } from "~/components/code";
import FrameworkStep from "./FrameworkStep";

const INSTALL_CODE = `npm install @composehq/sdk
# or
yarn add @composehq/sdk
# or
pnpm add @composehq/sdk`;

function InstallPackageNode() {
  return (
    <FrameworkStep>
      <h4>1. Install the SDK</h4>
      <p>Use your package manager to install the Compose SDK.</p>
      <Code code={INSTALL_CODE} lang="bash" />
    </FrameworkStep>
  );
}

export default InstallPackageNode;
