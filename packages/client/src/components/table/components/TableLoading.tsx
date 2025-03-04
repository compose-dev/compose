import { UI } from "@composehq/ts-public";
import { Spinner } from "~/components/spinner";

export default function TableLoading({
  loading,
}: {
  loading: UI.Stale.Option;
}) {
  if (loading) {
    return (
      <div className="flex flex-row items-center space-x-2 text-brand-primary text-sm">
        <Spinner size="sm" variant="primary" />
        <span className="hidden sm:block">
          {loading === UI.Stale.OPTION.UPDATE_DISABLED
            ? "Fetching data"
            : "Checking for updates"}
        </span>
      </div>
    );
  } else {
    return <div />;
  }
}
