import { m } from "@compose/ts";
import { useMemo } from "react";
import { Divider } from "~/components/divider";
import { InlineLink } from "~/components/inline-link";

export default function ChildAppNotice({
  externalUsers,
  environmentApps,
  shareBehaviorLabel,
}: {
  externalUsers: m.ExternalAppUser.DB[] | undefined;
  environmentApps: Record<string, m.Environment.DB["apps"][number]>;
  shareBehaviorLabel: string;
}) {
  const parentAppName = useMemo(() => {
    if (!externalUsers) {
      return null;
    }

    const parentPermission = externalUsers.find((user) =>
      user.email.startsWith(
        m.ExternalAppUser.INHERIT_PERMISSIONS_FROM_APP_PREFIX
      )
    );

    if (!parentPermission) {
      return null;
    }

    const parentAppRoute = parentPermission.email.slice(
      m.ExternalAppUser.INHERIT_PERMISSIONS_FROM_APP_PREFIX.length
    );

    if (!environmentApps[parentAppRoute]) {
      return null;
    }

    return environmentApps[parentAppRoute].name;
  }, [environmentApps, externalUsers]);

  if (!parentAppName) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col space-y-2">
        <p>
          This app is a sub-page of{" "}
          <span className="font-medium">{parentAppName}</span>. Anyone with
          access to the parent app will also have access to this app.
          <br />
          <br />
          {shareBehaviorLabel}
          <br />
          <br />
          <InlineLink
            url="https://docs.composehq.com/guides/multipage-apps#share-multipage-apps"
            appearance="secondary"
            showLinkIcon
          >
            Learn more about multipage apps
          </InlineLink>
        </p>
      </div>
      <Divider />
    </>
  );
}
