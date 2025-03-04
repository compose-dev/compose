import Button from "~/components/button";
import Icon from "~/components/icon";
import { InlineLink } from "~/components/inline-link";
import { toast } from "~/utils/toast";

export default function NewUserGuide({
  developmentApiKey,
  onClose,
}: {
  developmentApiKey: string | null;
  onClose: () => void;
}) {
  const { addToast } = toast.useStore();

  return (
    <div className="bg-brand-overlay rounded-brand p-8 space-y-8">
      <div className="space-y-2">
        <div className="flex flex-row items-center justify-between">
          <h3>Welcome to Compose!</h3>
          <Button variant="ghost" onClick={onClose}>
            <Icon name="x" size="sm" color="brand-neutral-2" />
          </Button>
        </div>
        <p>
          Compose is the developer-centric platform for building great internal
          software <span className="text-brand-warning italic">simply</span> and{" "}
          <span className="text-brand-warning italic">fast</span>.
        </p>
      </div>
      <div className="space-y-2">
        <h5>Step 1: Integrate (2 min)</h5>
        <p>
          First, read the{" "}
          <InlineLink url="https://docs.composehq.com/get-started/quickstart">
            quickstart guide
          </InlineLink>
          , which will take you through the process of installing the Compose
          SDK and creating a hello world app. Once you do the quickstart,
          refresh this page and your app should appear below.
        </p>
        <div className="flex flex-row items-center space-x-2">
          <p>Your API key: {developmentApiKey?.substring(0, 12)}...</p>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(developmentApiKey || "");
              addToast({
                message: "Copied API key to clipboard",
                appearance: toast.APPEARANCE.success,
              });
            }}
            variant="ghost"
          >
            <Icon name="copy" />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <h5>Step 2: Learn the basics (7 min)</h5>
        <p>
          Next, go through the{" "}
          <InlineLink url="https://docs.composehq.com/get-started/concepts">
            key concepts tutorial
          </InlineLink>
          , which will teach you the basics of Compose by building a simple user
          management app.
        </p>
      </div>
      <div className="space-y-2">
        <h5>Step 3: That's it!</h5>
        <p>
          There's a lot more that Compose is capable of. Explore the docs, use
          the{" "}
          <InlineLink url="https://app.composehq.com/app/76c437ce-2db1-4146-8712-d4417cb8e570/compose-cheat-sheet">
            cheat sheet
          </InlineLink>
          , and{" "}
          <InlineLink url="https://discord.gg/82rk2N8ZE6">
            join the Discord community
          </InlineLink>{" "}
          to get help and share feedback!
        </p>
      </div>
    </div>
  );
}
