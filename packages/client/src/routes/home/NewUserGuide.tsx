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
      <p>
        Get started fast by reading the{" "}
        <InlineLink url="https://docs.composehq.com/quickstart">
          quickstart guide
        </InlineLink>
        , which will take you through the process of installing the Compose SDK
        and creating a starter app. Once you do the quickstart, refresh this
        page and your starter app should appear below.
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
  );
}
