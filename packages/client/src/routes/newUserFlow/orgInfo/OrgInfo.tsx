import { useState } from "react";
import Button from "~/components/button";
import { DashedWrapper } from "~/components/dashed-wrapper";
import { Favicon } from "~/components/favicon";
import { TextInput } from "~/components/input";
import { Modal } from "~/components/modal";

function OrgInfo({
  onSubmit,
  submitting,
}: {
  onSubmit: (orgName: string) => void;
  submitting: boolean;
}) {
  const [orgName, setOrgName] = useState<string | null>(null);
  const [showJoinOrgModal, setShowJoinOrgModal] = useState(false);

  function handleSubmit() {
    if (orgName) {
      onSubmit(orgName);
    }
  }

  return (
    <DashedWrapper>
      <div className="flex flex-col space-y-8 min-w-80">
        <div className="flex items-center justify-center flex-col space-y-8">
          <Favicon className="w-10 h-10" />
          <div className="flex flex-col space-y-4">
            <h2 className="font-medium text-2xl text-center">
              Create an organization
            </h2>
            <p className="text-brand-neutral-2 max-w-80 text-center">
              Organizations allow teams to build and use apps together in a
              shared workspace.
            </p>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <TextInput
            label="Organization Name"
            placeholder="Acme Inc."
            value={orgName}
            setValue={setOrgName}
          />
          <Button
            variant="primary"
            disabled={!orgName}
            onClick={handleSubmit}
            loading={submitting}
          >
            Create Organization
          </Button>
        </div>
        <p className="text-brand-neutral-2 text-center">
          or,{" "}
          <Button
            variant="ghost"
            onClick={() => setShowJoinOrgModal(true)}
            className="text-brand-neutral hover:underline"
          >
            join an existing organization
          </Button>
        </p>
      </div>
      <Modal.Root
        isOpen={showJoinOrgModal}
        width="md"
        onClose={() => setShowJoinOrgModal(false)}
      >
        <Modal.Header className="flex items-center justify-between">
          <Modal.Title>Join Organization</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          In order to join an organization, have an organization admin invite
          you to the organization from within Compose.
          <br />
          <br />
          <span className="text-brand-error">
            Don't create a separate account right now. Wait until you've been
            invited to the organization, and use the special invite link to sign
            up.
          </span>
          <br />
          <Button variant="primary" onClick={() => setShowJoinOrgModal(false)}>
            Got it
          </Button>
        </Modal.Body>
      </Modal.Root>
    </DashedWrapper>
  );
}

export default OrgInfo;
