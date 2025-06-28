import { Code } from "~/components/code";
import FrameworkStep from "./FrameworkStep";

function RunYourAppPython({
  label,
  command,
  sectionNumber = 4,
}: {
  label: string;
  command: string;
  sectionNumber?: number;
}) {
  return (
    <FrameworkStep>
      <h4>{sectionNumber}. Run your app</h4>
      <p>{label}. Compose will automatically connect in the background.</p>
      <Code code={command} lang="bash" />
    </FrameworkStep>
  );
}

export default RunYourAppPython;
