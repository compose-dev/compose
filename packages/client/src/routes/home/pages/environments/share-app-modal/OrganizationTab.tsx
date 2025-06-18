import { BrowserToServerEvent, m } from "@compose/ts";
import Button from "~/components/button";
import Icon from "~/components/icon";
import { InlineLink } from "~/components/inline-link";
import ProPlanNotice from "./components/ProPlanNotice";
import CopyAppLinkButton from "./components/CopyAppLinkButton";

function MiddleDot() {
  return <div className="size-0.5 rounded-full bg-brand-neutral-2" />;
}

export default function OrganizationTab({
  billing,
  environmentType,
  appLink,
  settings,
}: {
  billing: BrowserToServerEvent.BillingDetails.Response;
  environmentType: m.Environment.DB["type"];
  appLink: string;
  settings: BrowserToServerEvent.GetSettings.Response | undefined;
}) {
  if (environmentType === m.Environment.TYPE.dev) {
    return (
      <>
        <p>
          This app is part of a development environment, which is designed for
          engineers to rapidly build apps in a local environment.
        </p>
        <p>
          Deploy the environment to production to share this app with your
          organization.
        </p>
        <Button
          variant="primary"
          onClick={() =>
            window.open(
              "https://docs.composehq.com/guides/deployment",
              "_blank"
            )
          }
        >
          Learn more about environments
        </Button>
      </>
    );
  }

  if (
    billing.company.plan === m.Company.PLANS.HOBBY &&
    !billing.FREE_UNLIMITED_USAGE
  ) {
    return (
      <ProPlanNotice label="Share and build apps together across your organization with the pro plan." />
    );
  }

  return (
    <>
      <div className="flex flex-row gap-x-4">
        <Icon name="checkmark" color="brand-neutral" />
        <div className="flex flex-col">
          <p>This app is available to all users in your organization.</p>
          {settings && (
            <div className="flex flex-row gap-x-2 text-sm items-center">
              <p className="text-brand-neutral-2 text-sm">
                {settings.users.length}{" "}
                {settings.users.length === 1 ? "user" : "users"}
              </p>
              <MiddleDot />
              <InlineLink
                url="/home/settings#organization"
                appearance="secondary"
                alwaysUnderline={false}
              >
                View users
              </InlineLink>
            </div>
          )}
        </div>
      </div>
      <CopyAppLinkButton link={appLink} />
    </>
  );
}
