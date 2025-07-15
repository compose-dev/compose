import { useNavigate } from "@tanstack/react-router";
import Button from "~/components/button";
import Icon from "~/components/icon";

function InvalidPlanError() {
  const navigate = useNavigate({ from: "/home/audit-log" });

  return (
    <div className="w-full flex justify-center mt-24">
      <div className="border-brand-neutral border p-4 rounded-md flex flex-col gap-4 max-w-lg shadow bg-brand-overlay">
        <div className="flex flex-row items-center gap-2">
          <Icon
            name="exclamation-circle"
            color="brand-warning-heavy"
            size="1.5"
            stroke="semi-bold"
          />
          <h4 className="text-brand-warning-heavy">
            Unlock Activity Logs and more with a Pro plan
          </h4>
        </div>
        <p className="text-brand-neutral">
          The pro plan enables teams to build and use apps together, collect
          activity logs, implement granular permissions, and more.
        </p>
        <Button
          variant="warning"
          onClick={() => navigate({ to: "/home/settings" })}
        >
          Upgrade to Pro
        </Button>
      </div>
    </div>
  );
}

export default InvalidPlanError;
