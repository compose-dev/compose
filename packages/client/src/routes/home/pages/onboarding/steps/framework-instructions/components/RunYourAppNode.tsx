import { Code } from "~/components/code";
import FrameworkStep from "./FrameworkStep";

function RunYourAppNode() {
  return (
    <FrameworkStep>
      <h4>4. Run your app</h4>
      <p>
        Run your app's normal dev command. Compose will automatically connect in
        the background.
      </p>
      <Code code={`npm run dev`} lang="bash" />
    </FrameworkStep>
  );
}

export default RunYourAppNode;
