import { useState } from "react";
import Button from "~/components/button";
import Icon from "~/components/icon";

export default function CopyAppLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant="outline"
      onClick={() => {
        navigator.clipboard.writeText(link);
        setCopied(true);
      }}
      className="flex-1"
    >
      <Icon name="copy" color="brand-neutral" />
      {copied ? "Copied!" : "Copy link to app"}
    </Button>
  );
}
