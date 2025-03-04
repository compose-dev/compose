import { useEffect, useState } from "react";
import { Spinner } from "~/components/spinner";
import { appStore } from "~/utils/appStore";
import { classNames } from "~/utils/classNames";

function LoadingOverlay({ loading }: { loading: appStore.Type["loading"] }) {
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (loading.value) {
      setInitialLoad(false);
    }
  }, [loading]);

  return (
    <>
      <div
        className={classNames(
          "fixed bottom-0 w-full flex justify-center pointer-events-none z-40",
          {
            hidden: initialLoad,
            // These two animations also toggle the display between hidden
            // and flex. We do this inside the animation so that the
            // value only flips once the animation is complete.
            "animate-slide-fade-in-loading-indicator": loading.value,
            "animate-slide-fade-out-loading-indicator": !loading.value,
          }
        )}
      >
        <div className="shadow-lg p-2 px-4 min-w-48 flex justify-center items-center gap-4 mb-4 rounded-3xl max-w-2xl mx-4 bg-brand-page border border-brand-neutral dark:border-0 dark:bg-brand-overlay">
          <Spinner />
          <span>{loading.properties?.text || "Loading..."}</span>
        </div>
      </div>
      {loading.value && loading.properties?.disableInteraction && (
        <div className="bg-black opacity-35 dark:opacity-60 fixed top-0 left-0 w-screen h-screen transition-opacity" />
      )}
    </>
  );
}

export default LoadingOverlay;
