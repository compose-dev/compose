import { UI } from "@composehq/ts-public";
import { Spinner } from "~/components/spinner";

function Header({
  children,
  loading,
}: {
  children: React.ReactNode;
  loading: UI.Stale.Option;
}) {
  return (
    <div className="flex flex-row items-center gap-x-2">
      <h5>{children}</h5>
      {loading === UI.Stale.OPTION.UPDATE_DISABLED && (
        <Spinner size="sm" variant="primary" text="Fetching data" />
      )}
    </div>
  );
}

export { Header };
