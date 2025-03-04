import Button from "~/components/button";
import { LANG, Lang } from "../constants";
import Icon from "~/components/icon";
import { toast } from "~/utils/toast";
import { useState } from "react";

function LanguageSelect({
  lang,
  setLang,
}: {
  lang: Lang | null;
  setLang: (lang: Lang) => void;
}) {
  const { addToast } = toast.useStore();

  const [ignoreWarning, setIgnoreWarning] = useState(false);

  return (
    <>
      {!ignoreWarning && (
        <div className="border border-brand-error shadow-sm p-4 rounded-brand flex flex-col gap-4 sm:hidden">
          <div className="flex flex-row items-center justify-between">
            <Icon name="exclamation-circle" color="brand-error" size="lg" />
            <Button variant="ghost" onClick={() => setIgnoreWarning(true)}>
              <Icon name="x" color="brand-neutral-2" size="sm" />
            </Button>
          </div>
          <p>
            It looks like you're on mobile! We recommend setting up Compose on
            the same machine where you do your development. You can copy a link
            to this page and open it on your desktop.
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
      )}
      <p className="text-center">
        Lets install the SDK and run our first app in less than 100 seconds.
      </p>
      <p className="text-center">
        Compose offers SDKs for multiple languages. Which would you like to use?
      </p>
      <div className="flex flex-row space-x-4 w-full">
        <Button
          variant={lang === LANG.typescript ? "primary" : "outline"}
          onClick={() => setLang(LANG.typescript)}
          className="w-full"
        >
          <Icon name="typescript" size="mlg" /> TypeScript
        </Button>
        <Button
          variant={lang === LANG.javascript ? "primary" : "outline"}
          onClick={() => setLang(LANG.javascript)}
          className="w-full"
        >
          <Icon name="javascript" size="mlg" /> JavaScript
        </Button>
        <Button
          variant={lang === LANG.python ? "primary" : "outline"}
          onClick={() => setLang(LANG.python)}
          className="w-full"
        >
          <Icon name="python" size="mlg" /> Python
        </Button>
      </div>
    </>
  );
}

export default LanguageSelect;
