import { useState } from "react";
import Button from "~/components/button";
import { ConfirmDialog } from "~/components/confirm-dialog";

function ConfirmModal() {
  const [userEvent, setUserEvent] = useState<"confirm" | "cancel" | null>(null);

  function handleConfirm() {
    setUserEvent("confirm");
  }

  function handleCancel() {
    setUserEvent("cancel");
  }

  return (
    <>
      {!userEvent && (
        <ConfirmDialog
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          message="Are you sure you want to delete Retool?"
          typeToConfirmText="Retool"
          appearance="danger"
        />
      )}
      <div className="flex flex-col gap-2 p-4 items-center justify-center w-full h-full">
        {userEvent === "confirm" && <div>Retool was successfully deleted</div>}
        {userEvent === "cancel" && <div>Deletion cancelled</div>}
        {userEvent && (
          <div>
            <Button variant="outline" onClick={() => setUserEvent(null)}>
              Reset
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

export default ConfirmModal;
