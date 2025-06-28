import Button from "~/components/button";
import StepContainer from "../StepContainer";
import { useNavigate } from "@tanstack/react-router";
import { api } from "~/api";

function InviteDevelopersStep() {
  const navigate = useNavigate({ from: "/home/onboarding" });

  return (
    <StepContainer>
      <div className="flex flex-col gap-y-6">
        <h3>Invite developers to your organization</h3>
        <p>
          Compose Apps are built by developers, then shared with the rest of the
          team.
        </p>
        <p>
          It looks like you're not a developer. That's okay! You can get started
          by inviting developers to join your organization via the settings
          page.
        </p>
        <p>Need help? You can always reach out to atul@composehq.com.</p>
        <div>
          <Button
            variant="primary"
            onClick={() => {
              api.routes.updateUserMetadata({
                metadata: {
                  "show-onboarding": false,
                },
              });
              navigate({
                to: "/home/settings",
              });
            }}
          >
            Go to settings
          </Button>
        </div>
      </div>
    </StepContainer>
  );
}
export default InviteDevelopersStep;
