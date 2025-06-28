import { Code } from "~/components/code";
import FrameworkStep from "./FrameworkStep";
import { InlineCode } from "~/components/inline-code";
import { ToggleDetails } from "~/components/toggle-details";

function ConnectTypesToggle() {
  return (
    <ToggleDetails
      title={
        <span>
          <InlineCode>connect_async()</InlineCode> vs{" "}
          <InlineCode>connect()</InlineCode>
        </span>
      }
    >
      <div className="flex flex-col gap-y-4">
        <p>
          The Python SDK provides two methods to connect to the Compose web
          dashboard: <InlineCode>connect_async()</InlineCode> and{" "}
          <InlineCode>connect()</InlineCode>.
        </p>
        <ul className="list-disc list-outside flex flex-col gap-y-4 ml-4">
          <li>
            <InlineCode>connect_async()</InlineCode> starts the WebSocket
            connection in a separate background thread. Use this in environments
            like Django, Flask, etc. where blocking the main thread would
            interfere with request handling.
          </li>
          <li>
            <InlineCode>connect()</InlineCode> runs the connection in the main
            thread. Use this when running a standalone Python process dedicated
            to Compose apps.
          </li>
        </ul>
      </div>
    </ToggleDetails>
  );
}

function StartClientPython({
  code,
  django,
  sectionNumber = 3,
}: {
  code: string;
  django?: boolean;
  sectionNumber?: number;
}) {
  if (django) {
    return (
      <FrameworkStep>
        <FrameworkStep>
          <h4>{sectionNumber}. Start the Compose Client</h4>
          <p>
            In the <InlineCode>apps.py</InlineCode> file of the{" "}
            <InlineCode>compose</InlineCode> folder, add the following:
          </p>
          <Code code={code} lang="python" />
          <ConnectTypesToggle />
        </FrameworkStep>
      </FrameworkStep>
    );
  }

  return (
    <FrameworkStep>
      <h4>{sectionNumber}. Start the Compose Client</h4>
      <p>
        In the main entry point of your project, e.g.{" "}
        <InlineCode>main.py</InlineCode>, import the Compose Client from the
        previous step and initialize it:
      </p>
      <Code code={code} lang="python" />
      <ConnectTypesToggle />
    </FrameworkStep>
  );
}

export default StartClientPython;
