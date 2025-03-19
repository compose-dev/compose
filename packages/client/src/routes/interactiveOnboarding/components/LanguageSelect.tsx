import Button from "~/components/button";
import { LANG, Lang } from "../constants";
import Icon from "~/components/icon";
import { toast } from "~/utils/toast";
import { useState } from "react";
import { InlineLink } from "~/components/inline-link";
import DescriptiveButton from "./DescriptiveButton";

function MobileDeviceCallout() {
  const { addToast } = toast.useStore();

  const [ignoreWarning, setIgnoreWarning] = useState(false);

  if (ignoreWarning) {
    return null;
  }

  return (
    <div className="border border-brand-error shadow-sm p-4 rounded-brand flex flex-col gap-4 sm:hidden">
      <div className="flex flex-row items-center justify-between">
        <Icon name="exclamation-circle" color="brand-error" size="lg" />
        <Button variant="ghost" onClick={() => setIgnoreWarning(true)}>
          <Icon name="x" color="brand-neutral-2" size="sm" />
        </Button>
      </div>
      <p>
        It looks like you're on mobile! We recommend setting up Compose on the
        same machine where you do your development. You can copy a link to this
        page and open it on your desktop.
      </p>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          addToast({
            message: "Link copied to clipboard",
            appearance: "success",
          });
        }}
      >
        Copy link to URL
      </Button>
    </div>
  );
}

function LanguageSelect({ setLang }: { setLang: (lang: Lang) => void }) {
  return (
    <>
      <MobileDeviceCallout />
      <p className="text-center max-w-md">
        Install the SDK into your{" "}
        <span className="font-medium">backend application</span> and run a basic
        starter app in just a few steps.
      </p>
      <p className="text-center">Choose your platform to get started.</p>
      <div className="flex flex-col gap-4 w-full">
        <DescriptiveButton
          onClick={() => setLang(LANG.typescript)}
          iconName="typescript"
          iconColor="brand-primary"
          name="TypeScript"
          description="Supports all major runtimes (Node.js, Bun, Deno) and frameworks (Express, Fastify, Koa, etc.)"
        />
        <DescriptiveButton
          onClick={() => setLang(LANG.javascript)}
          iconName="javascript"
          iconColor="yellow-500"
          name="JavaScript"
          description="Identical to TypeScript, but with types removed from the starter app."
        />
        <DescriptiveButton
          onClick={() => setLang(LANG.python)}
          iconName="python"
          iconColor="brand-success"
          name="Python"
          description="Supports pure Python applications and all major frameworks (Django, Flask, FastAPI, etc.)"
        />
      </div>

      <p className="text-sm text-center text-brand-neutral-2 max-w-md">
        The Compose SDK installs into your{" "}
        <span className="italic font-medium">backend</span> (not your frontend)!
        Learn more in the{" "}
        <InlineLink
          url="https://docs.composehq.com"
          appearance="secondary"
          newTab
        >
          quickstart docs
        </InlineLink>
        .
      </p>
    </>
  );
}

export default LanguageSelect;
