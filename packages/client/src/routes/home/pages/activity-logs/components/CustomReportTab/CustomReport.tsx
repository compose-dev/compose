import { InlineLink } from "~/components/inline-link";

function CustomReport() {
  return (
    <>
      <div className="w-full flex flex-col gap-4 items-center justify-center mt-16">
        <h5>Create Custom Reports</h5>
        <p>
          Easily create beautiful reports to track custom events that you've
          logged{" "}
          <InlineLink
            url="https://docs.composehq.com/page-actions/log"
            newTab
            showLinkIcon
          >
            via the SDK
          </InlineLink>
          . Coming soon.
        </p>
      </div>
    </>
  );
}

export { CustomReport };
