import { ConnectionStatus } from "~/utils/wsContext";
import Icon from "~/components/icon";
import { Spinner } from "~/components/spinner";
import { classNames } from "~/utils/classNames";

function ConnectionStatusIndicator({
  connectionStatus,
}: {
  connectionStatus: ConnectionStatus.Type;
}) {
  return (
    <div
      className={classNames("flex flex-row items-center", {
        "space-x-0.5":
          ConnectionStatus.STATUS_TO_HEALTH[connectionStatus] !==
          ConnectionStatus.HEALTH.LOADING,
        "space-x-1.5":
          ConnectionStatus.STATUS_TO_HEALTH[connectionStatus] ===
          ConnectionStatus.HEALTH.LOADING,
      })}
    >
      <div className="w-4 h-4 flex items-center justify-center">
        {ConnectionStatus.STATUS_TO_HEALTH[connectionStatus] ===
          ConnectionStatus.HEALTH.GOOD && (
          <Icon
            name="checkmark"
            size="0.75"
            color="brand-success"
            stroke="normal"
          />
        )}
        {ConnectionStatus.STATUS_TO_HEALTH[connectionStatus] ===
          ConnectionStatus.HEALTH.BAD && (
          <Icon name="x" size="0.75" color="brand-error" stroke="normal" />
        )}
        {ConnectionStatus.STATUS_TO_HEALTH[connectionStatus] ===
          ConnectionStatus.HEALTH.LOADING && (
          <Spinner size="sm" variant="neutral" />
        )}
      </div>
      <p
        className={classNames("text-sm", {
          "text-brand-success":
            ConnectionStatus.STATUS_TO_HEALTH[connectionStatus] ===
            ConnectionStatus.HEALTH.GOOD,
          "text-brand-error":
            ConnectionStatus.STATUS_TO_HEALTH[connectionStatus] ===
            ConnectionStatus.HEALTH.BAD,
          "text-brand-neutral-2":
            ConnectionStatus.STATUS_TO_HEALTH[connectionStatus] ===
            ConnectionStatus.HEALTH.LOADING,
        })}
      >
        {ConnectionStatus.STATUS_TO_LABEL[connectionStatus]}
      </p>
    </div>
  );
}

export default ConnectionStatusIndicator;
