import Button from "~/components/button";
import { LANG, Lang } from "../constants";
import Icon from "~/components/icon";
import { toast } from "~/utils/toast";
import { useState } from "react";
import { InlineLink } from "~/components/inline-link";

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
      <p className="text-center">
        Install the SDK and run a basic starter app in just a few steps.
      </p>
      <p className="text-center">Choose your platform to get started.</p>
      <div className="flex flex-col gap-4 w-full">
        <Button
          variant="outline"
          onClick={() => setLang(LANG.typescript)}
          className="w-full max-w-md"
        >
          <div className="flex flex-row items-center gap-4 w-full">
            <Icon name="typescript" size="lg" color="brand-primary" />{" "}
            <div className="flex flex-col items-start text-left flex-1">
              <span className="text-lg font-medium">TypeScript</span>
              <span className="text-brand-neutral-2 text-sm">
                Supports all major runtimes (Node.js, Bun, Deno) and frameworks
                (Express, Fastify, Koa, etc.)
              </span>
            </div>
          </div>
        </Button>
        <Button
          variant="outline"
          onClick={() => setLang(LANG.javascript)}
          className="w-full max-w-md"
        >
          <div className="flex flex-row items-center gap-4 w-full">
            <Icon name="javascript" size="lg" color="yellow-500" />{" "}
            <div className="flex flex-col items-start text-left flex-1">
              <span className="text-lg font-medium">JavaScript</span>
              <span className="text-brand-neutral-2 text-sm">
                Identical to TypeScript, but with types removed from the starter
                app.
              </span>
            </div>
          </div>
        </Button>
        <Button
          variant="outline"
          onClick={() => setLang(LANG.python)}
          className="w-full max-w-md"
        >
          <Icon name="python" size="lg" color="brand-success" />{" "}
          <div className="flex flex-col items-start text-left flex-1">
            <span className="text-lg font-medium">Python</span>
            <span className="text-brand-neutral-2 text-sm">
              Supports pure Python applications and all major frameworks
              (Django, Flask, FastAPI, etc.)
            </span>
          </div>
        </Button>
      </div>

      <p className="text-sm text-center text-brand-neutral-2">
        Not sure? Learn more about Compose in the{" "}
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
