import { m } from "@compose/ts";
import Icon from "~/components/icon";

function EnvironmentTypeBadge({ type }: { type: m.Environment.Type }) {
  if (type === m.Environment.TYPE.dev) {
    return (
      <div
        className="flex flex-row items-center gap-x-1 text-brand-warning text-sm"
        data-tooltip-id="top-tooltip"
        data-tooltip-content="This environment is meant for local development. It is only accessible to you."
      >
        <Icon name="code" color="brand-warning" />
        Development
      </div>
    );
  }

  if (type === m.Environment.TYPE.prod) {
    return (
      <div
        className="flex flex-row items-center gap-x-1 text-brand-primary text-sm"
        data-tooltip-id="top-tooltip"
        data-tooltip-content="This is a live environment that is accessible to everyone in your organization."
      >
        <Icon name="shield-check-filled" color="brand-primary" />
        Production
      </div>
    );
  }
}

export default EnvironmentTypeBadge;
