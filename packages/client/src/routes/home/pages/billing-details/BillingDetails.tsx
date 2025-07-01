import { m, u } from "@compose/ts";
import { useNavigate, useSearch } from "@tanstack/react-router";
import Button from "~/components/button";
import { CenteredSpinner } from "~/components/spinner";
import { classNames } from "~/utils/classNames";
import { useHomeStore } from "~/routes/home/utils/useHomeStore";
import { Favicon } from "~/components/favicon";
import { useBillingQuery } from "~/utils/queries/useBillingQuery";
import { useEffect, useState } from "react";

export default function BillingDetails() {
  const { user } = useHomeStore();
  const navigate = useNavigate();

  const [didInitialFetch, setDidInitialFetch] = useState(false);

  const billing = useBillingQuery();

  useEffect(() => {
    // Always refetch billing data on this page since it's the callback
    // for the checkout flow.
    if (!didInitialFetch) {
      billing.refetch();
      setDidInitialFetch(true);
    }
  }, [billing, didInitialFetch]);

  const { checkoutResult } = useSearch({ from: "/home/billing/details" });

  if (billing.error) {
    return (
      <div className="py-16 px-4 flex justify-center items-center h-full">
        <div className="flex flex-col max-w-sm justify-start gap-12 items-center">
          <Favicon className="w-10 h-10" />
          <p className="text-brand-error">Error: {billing.error.message}</p>
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

  if (!billing.data || billing.isPending || !user || !didInitialFetch) {
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

  const planName = billing.data.FREE_UNLIMITED_USAGE
    ? "Friends and Family"
    : m.Company.PLAN_TO_LABEL[billing.data.company.plan];

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
              "text-orange-700 dark:text-orange-400":
                billing.data.company.plan === m.Company.PLANS.PRO,
            })}
          >
            {planName}
          </p>
        </div>
        <div className="w-full border-b border-brand-neutral" />
        <div className="flex flex-col gap-8 w-full">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-row items-center justify-between">
              <p>Standard users</p>
              <p>{billing.data.standardSeats}</p>
            </div>
            <p className="text-xs text-brand-neutral-2">
              Users within your organization that can use and/or build apps.
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-row items-center justify-between">
              <p>External user credits</p>
              <p>{billing.data.externalSeats}</p>
            </div>
            <p className="text-xs text-brand-neutral-2">
              Users that are not part of your organization, such as contractors
              or clients. One credit allows you to share apps with one external
              email.
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
