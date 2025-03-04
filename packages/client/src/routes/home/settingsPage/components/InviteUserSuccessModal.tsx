import { Modal } from "~/components/modal";
import { useInviteUser } from "../useInviteUser";
import { TextInput } from "~/components/input";
import Button from "~/components/button";
import Icon from "~/components/icon";

export default function InviteUserSuccessModal({
  inviteFlow,
  copyText,
}: {
  inviteFlow: ReturnType<typeof useInviteUser>;
  copyText: (text: string) => void;
}) {
  return (
    <Modal.Root
      isOpen={inviteFlow.activeModal === inviteFlow.ACTIVE_MODAL.SUCCESS}
      width="md"
      onClose={() => {
        inviteFlow.closeModal();
        inviteFlow.clearSuccessData();
      }}
    >
      <Modal.CloseableHeader
        onClose={() => {
          inviteFlow.closeModal();
          inviteFlow.clearSuccessData();
        }}
      >
        Invite User
      </Modal.CloseableHeader>
      <Modal.Body>
        <div className="flex flex-col gap-8">
          <p>
            Great! Share this link with{" "}
            {inviteFlow.successData?.email ?? "the user"} to allow them to join
            your organization:
          </p>

          <div className="flex flex-row gap-2 items-center">
            <TextInput
              value={inviteFlow.successData?.link ?? ""}
              disabled={true}
              setValue={() => {}}
              label={null}
            />
            <Button
              variant="ghost"
              onClick={() => {
                copyText(inviteFlow.successData?.link ?? "");
              }}
            >
              <Icon name="copy" color="brand-neutral-2" />
            </Button>
          </div>

          <p>
            The link will expire in{" "}
            {inviteFlow.successData?.expiresAt
              ? Math.ceil(
                  (inviteFlow.successData.expiresAt.getTime() - Date.now()) /
                    (1000 * 60 * 60)
                )
              : 0}{" "}
            hours.
          </p>
          <div className="flex flex-row gap-2 justify-end">
            <Button
              variant="primary"
              onClick={() => {
                copyText(inviteFlow.successData?.link ?? "");
                inviteFlow.closeModal();
                inviteFlow.clearSuccessData();
              }}
            >
              Copy link and close
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                inviteFlow.closeModal();
                inviteFlow.clearSuccessData();
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal.Root>
  );
}
