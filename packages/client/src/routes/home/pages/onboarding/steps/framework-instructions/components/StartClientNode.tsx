import { Code } from "~/components/code";
import FrameworkStep from "./FrameworkStep";
import { InlineCode } from "~/components/inline-code";

function StartClientNode({
  code,
  entryPoint = "index.ts",
}: {
  code: string;
  entryPoint?: string;
}) {
  return (
    <FrameworkStep>
      <h4>3. Start the Compose Client</h4>
      <p>
        In the main entry point of your project, e.g.{" "}
        <InlineCode>{entryPoint}</InlineCode>, import the Compose Client that
        you exported in the previous step and initialize it:
      </p>
      <Code code={code} lang="typescript" />
    </FrameworkStep>
  );
}

export default StartClientNode;
