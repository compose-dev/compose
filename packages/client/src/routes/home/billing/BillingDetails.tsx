import { m, u } from "@compose/ts";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { api } from "~/api";
import Button from "~/components/button";
import { CenteredSpinner } from "~/components/spinner";
import { classNames } from "~/utils/classNames";
import { fetcher } from "~/utils/fetcher";
import { useHomeStore } from "../useHomeStore";
import { Favicon } from "~/components/favicon";

export default function BillingDetails() {
  const { user } = useHomeStore();
  const navigate = useNavigate();
  const { data, loading, error } = fetcher.use(api.routes.getBillingData);

  const { checkoutResult } = useSearch({ from: "/home/billing/details" });

  if (error) {
    return (
      <div className="py-16 px-4 flex justify-center items-center h-full">
        <div className="flex flex-col max-w-sm justify-start gap-12 items-center">
          <Favicon className="w-10 h-10" />
          <p className="text-brand-error">Error: {error.data.message}</p>
          <Button
            onClick={() => navigate({ to: "/home/settings" })}
            variant="primary"
            className="w-full"
          >
            Back to settings
          </Button>
        </div>
      </div>
    );
  }

  if (!data || loading || !user) {
    return <CenteredSpinner />;
  }

  if (
    !u.permission.isAllowed(u.permission.FEATURE.VIEW_BILLING, user.permission)
  ) {
    return (
      <div className="py-16 px-4 flex justify-center items-center h-full">
        <div className="flex flex-col max-w-sm justify-start gap-12 items-center">
          <Favicon className="w-10 h-10" />
          <p className="text-brand-error">
            You are not authorized to view billing information. Please reach out
            to an admin to make changes, or email support: atul@composehq.com.
          </p>
          <Button
            onClick={() => navigate({ to: "/home/settings" })}
            variant="primary"
            className="w-full"
          >
            Back to settings
          </Button>
        </div>
      </div>
    );
  }

  const planName = data.FREE_UNLIMITED_USAGE
    ? "Friends and Family"
    : m.Company.PLAN_TO_LABEL[data.company.plan];

  return (
    <div className="py-16 px-4 flex justify-center items-center h-full">
      <div className="flex flex-col max-w-sm justify-start gap-12 items-center">
        <Favicon className="w-10 h-10" />
        <h4 className="text-center w-full">
          {checkoutResult === "SUCCESS" &&
            `Success! You're now on the ${planName} plan.`}
          {checkoutResult === "ERROR" &&
            `Payment was unsuccessful. You were not charged.`}
          {!checkoutResult && `You're on the ${planName} plan.`}
        </h4>
        <div className="flex flex-row items-center justify-between w-full">
          <p>Current plan</p>
          <p
            className={classNames({
              "text-orange-700": data.company.plan === m.Company.PLANS.PRO,
            })}
          >
            {planName}
          </p>
        </div>
        <div className="w-full border-b border-brand-neutral" />
        <div className="flex flex-col gap-8 w-full">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-row items-center justify-between">
              <p>Standard seats</p>
              <p>{data.standardSeats}</p>
            </div>
            <p className="text-xs text-brand-neutral-2">
              Team members within your organization with full access to the
              Compose platform, depending on the permissions they are assigned.
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-row items-center justify-between">
              <p>External seats</p>
              <p>{data.externalSeats}</p>
            </div>
            <p className="text-xs text-brand-neutral-2">
              Users outside of your organization who can be given access by
              email to use individual apps.
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate({ to: "/home/settings" })}
          variant="primary"
          className="w-full"
        >
          Back to settings
        </Button>
      </div>
    </div>
  );
}
