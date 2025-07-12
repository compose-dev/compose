import Icon from "~/components/icon";

function UnknownError({ errorMessage }: { errorMessage: string }) {
  return (
    <div className="w-full flex justify-center mt-24">
      <div className="bg-brand-overlay p-4 rounded-brand border border-brand-neutral flex flex-col gap-4 max-w-xl">
        <div className="flex flex-row items-center gap-2">
          <Icon
            name="exclamation-circle"
            color="brand-error-heavy"
            size="1.5"
          />
          <h4 className="text-brand-error-heavy">Error fetching logs</h4>
        </div>
        <p>{errorMessage}</p>
      </div>
    </div>
  );
}

export default UnknownError;
