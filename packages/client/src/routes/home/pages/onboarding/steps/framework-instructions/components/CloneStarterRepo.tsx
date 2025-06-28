import { Code } from "~/components/code";
import FrameworkStep from "./FrameworkStep";

function CloneStarterRepo({
  code,
  text,
}: {
  code: string;
  text: React.ReactNode;
}) {
  return (
    <FrameworkStep>
      <h4>1. Clone the starter repo</h4>
      {text}
      <Code code={code} lang="bash" />
    </FrameworkStep>
  );
}

export default CloneStarterRepo;
