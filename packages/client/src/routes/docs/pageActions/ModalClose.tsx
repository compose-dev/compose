import { useState } from "react";
import { Modal } from "~/components/modal";
import Button from "~/components/button";

function ModalClose() {
  const [isOpen, setIsOpen] = useState(true);
  const [choice, setChoice] = useState<"yes" | "no" | null | undefined>(
    undefined
  );

  return (
    <>
      <div className="p-4">
        {isOpen && (
          <Modal.Root
            isOpen={true}
            onClose={() => {
              setChoice(null);
              setIsOpen(false);
            }}
          >
            <Modal.CloseableHeader
              onClose={() => {
                setChoice(null);
                setIsOpen(false);
              }}
            >
              &nbsp;
            </Modal.CloseableHeader>
            <Modal.Body>
              <p>Is three slices of bread a sandwich?</p>
              <div>
                <Button
                  variant="primary"
                  onClick={() => {
                    setChoice("yes");
                    setIsOpen(false);
                  }}
                >
                  Yes
                </Button>
              </div>
              <div>
                <Button
                  variant="primary"
                  onClick={() => {
                    setChoice("no");
                    setIsOpen(false);
                  }}
                >
                  No
                </Button>
              </div>
            </Modal.Body>
          </Modal.Root>
        )}
        {choice === "yes" && <div>You answered correctly!</div>}
        {choice === "no" && <div>You answered incorrectly :(</div>}
        {choice === null && <div>You didn't answer the question!</div>}
      </div>
    </>
  );
}

export default ModalClose;
