import FrameworkStep from "./FrameworkStep";
import { InlineCode } from "~/components/inline-code";
import { TextInput } from "~/components/input";
import Button from "~/components/button";
import Icon from "~/components/icon";
import { toast } from "~/utils/toast";

function AddApiKey({
  apiKey,
  filePath,
  sectionNumber,
}: {
  apiKey: string | null;
  filePath: string;
  sectionNumber: number;
}) {
  const { addToast } = toast.useStore();

  return (
    <FrameworkStep>
      <h4>{sectionNumber}. Add your API key</h4>
      <p>
        Replace <InlineCode>API_KEY_HERE</InlineCode> in{" "}
        <InlineCode>{filePath}</InlineCode> with your Compose API key:
      </p>
      <div className="flex flex-row gap-x-2">
        <TextInput value={apiKey} disabled setValue={() => {}} label={null} />
        <Button
          variant="outline"
          onClick={() => {
            if (apiKey) {
              navigator.clipboard.writeText(apiKey);
              addToast({
                title: "Copied API key",
                message: "The API key has been copied to your clipboard.",
                appearance: "success",
              });
            } else {
              addToast({
                title: "No API key found",
                message: "The API key has not been copied because it is empty.",
                appearance: "error",
              });
            }
          }}
        >
          <Icon name="copy" />
          Copy
        </Button>
      </div>
    </FrameworkStep>
  );
}

export default AddApiKey;
