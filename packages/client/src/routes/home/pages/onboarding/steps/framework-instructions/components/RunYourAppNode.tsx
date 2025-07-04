import { Code } from "~/components/code";
import FrameworkStep from "./FrameworkStep";

function RunYourAppNode({
  command = "npm run dev",
  sectionNumber = 4,
}: {
  command?: string;
  sectionNumber?: number;
}) {
  return (
    <FrameworkStep>
      <h4>{sectionNumber}. Run your app</h4>
      <p>
        Run your app's normal dev command. Compose will automatically connect in
        the background.
      </p>
      <Code code={command} lang="bash" />
    </FrameworkStep>
  );
}

export default RunYourAppNode;
