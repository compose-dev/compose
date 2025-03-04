import Icon from "~/components/icon";
import Button from "../button";
import { toast } from "~/utils/toast";

function CopyCodeButton({ code }: { code: string }) {
  const { addToast } = toast.useStore();

  return (
    <>
      <Button
        variant="ghost"
        className="absolute top-2.5 right-2.5 bg-brand-overlay-2 rounded-brand p-2 border border-transparent duration-150 transition-opacity invisible opacity-0 group-hover:visible group-hover:opacity-60 hover:!opacity-100"
        onClick={() => {
          navigator.clipboard.writeText(code);
          addToast({
            message: "Copied to clipboard",
            appearance: "success",
          });
        }}
      >
        <div className="opacity-0">
          <Icon name="copy" color="brand-neutral-2" size="md" />
        </div>
      </Button>
      <div className="absolute top-2.5 right-2.5 invisible duration-150 transition-opacity opacity-0 group-hover:visible group-hover:opacity-100 p-2 pointer-events-none border border-brand-neutral rounded-brand">
        <Icon name="copy" color="brand-neutral-2" size="md" />
      </div>
    </>
  );
}

export { CopyCodeButton };
