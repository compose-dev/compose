import { BrowserToServerEvent, m, u } from "@compose/ts";
import { useHomeStore } from "~/routes/home/utils/useHomeStore";
import Button from "~/components/button";
import { useNavigate } from "@tanstack/react-router";
import { classNames } from "~/utils/classNames";
import Icon from "~/components/icon";
import { useBilling } from "../useBilling";
import { toast } from "~/utils/toast";

function CheckmarkItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <Icon name="checkmark" color="brand-neutral" />
      <p>{children}</p>
    </div>
  );
}

function CurrentPlanChip() {
  return (
    <div className="text-brand-neutral-2 text-xs bg-brand-overlay p-1 rounded-brand font-medium">
      Current plan
    </div>
  );
}

function BillingSection({
  settings,
  billing,
  billingFlow,
}: {
  settings: BrowserToServerEvent.GetSettings.Response;
  billing: BrowserToServerEvent.BillingDetails.Response;
  billingFlow: ReturnType<typeof useBilling>;
}) {
  const { user } = useHomeStore();
  const navigate = useNavigate();
  const { addToast } = toast.useStore();
  if (!user) {
    return null;
  }

  if (
    !u.permission.isAllowed(u.permission.FEATURE.VIEW_BILLING, user.permission)
  ) {
    return (
      <div className="flex flex-col gap-8">
        <h3>Billing</h3>
        <p className="text-brand-neutral-2">
          You are not authorized to view billing information. Please reach out
          to an admin to make changes, or email support: atul@composehq.com.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <h3 id="billing">Billing</h3>
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/home/billing/details" })}
        >
          View current plan details
        </Button>
      </div>
      {billing.FREE_UNLIMITED_USAGE && (
        <div className="p-4 rounded-brand bg-brand-overlay border border-brand-neutral flex flex-col gap-4">
          <h5>You're on the friends and family plan!</h5>
          <p className="text-brand-neutral-2">
            Don't worry about billing - friends and family get free access to
            the full Compose platform for free. Thanks for being a user!
          </p>
        </div>
      )}
      <div className="flex flex-row">
        <div className="flex flex-col p-8 border border-brand-neutral rounded-brand rounded-r-none gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-4">
              <h5>Hobby</h5>
              {billing.company.plan === m.Company.PLANS.HOBBY && (
                <CurrentPlanChip />
              )}
            </div>
            <p className="text-brand-neutral-2">
              For indie hackers, solo developers, and founders just starting
              out.
            </p>
          </div>

          <h5>Free forever</h5>

          <Button
            variant="danger"
            onClick={() => {
              if (
                !u.permission.isAllowed(
                  u.permission.FEATURE.CHANGE_BILLING,
                  user.permission
                )
              ) {
                addToast({
                  message:
                    "You are not authorized to downgrade to Hobby. Please ask an admin to change your permissions.",
                  appearance: toast.APPEARANCE.error,
                });
                return;
              }
              billingFlow.setActiveModal(
                billingFlow.ACTIVE_MODAL.DOWNGRADE_HOBBY
              );
            }}
            className={classNames({
              "pointer-events-none invisible":
                settings.company.plan === m.Company.PLANS.HOBBY,
            })}
          >
            Downgrade to Hobby
          </Button>

          <div className="w-full border-b border-brand-neutral"></div>
          <div className="flex flex-col gap-4 text-sm">
            <CheckmarkItem>Up to 1 user</CheckmarkItem>
            <CheckmarkItem>Unlimited apps</CheckmarkItem>
            <CheckmarkItem>Unlimited app executions</CheckmarkItem>
            <CheckmarkItem>Unlimited environments</CheckmarkItem>
          </div>
        </div>
        <div className="flex flex-col p-8 border border-brand-neutral rounded-brand rounded-l-none border-l-0 gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-4">
              <h5 className="text-orange-700 dark:text-orange-400">Pro</h5>
              {billing.company.plan === m.Company.PLANS.PRO && (
                <CurrentPlanChip />
              )}
            </div>
            <p className="text-brand-neutral-2">
              For teams of all sizes. Every feature, unlimited users, dedicated
              support.
            </p>
          </div>
          <h5>
            $12{" "}
            <span className="text-brand-neutral-2 font-normal text-base">
              per user/month
            </span>
          </h5>
          <Button
            variant="warning"
            onClick={() => {
              if (
                !u.permission.isAllowed(
                  u.permission.FEATURE.CHANGE_BILLING,
                  user.permission
                )
              ) {
                addToast({
                  message:
                    "You are not authorized to upgrade to Pro. Please ask an admin to change your permissions.",
                  appearance: toast.APPEARANCE.error,
                });
                return;
              }

              billingFlow.clearForm();
              billingFlow.setActiveModal(
                billingFlow.ACTIVE_MODAL.PROVISION_PRO
              );
            }}
            className={classNames("bg-orange-600 hover:bg-orange-700", {
              "pointer-events-none invisible":
                settings.company.plan === m.Company.PLANS.PRO,
            })}
          >
            Upgrade to Pro
          </Button>
          <div className="w-full border-b border-brand-neutral"></div>
          <div className="flex flex-col gap-4 text-sm">
            <CheckmarkItem>Everything in Hobby</CheckmarkItem>
            <CheckmarkItem>Unlimited users</CheckmarkItem>
            <CheckmarkItem>Dedicated engineering support</CheckmarkItem>
            <CheckmarkItem>Access to secure external sharing</CheckmarkItem>
            <CheckmarkItem>
              1 year audit logs and analytics history
            </CheckmarkItem>
            <CheckmarkItem>Role based permissions</CheckmarkItem>
          </div>
        </div>
      </div>
    </>
  );
}

export default BillingSection;
