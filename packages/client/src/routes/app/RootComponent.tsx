import { memo } from "react";

import { appStore } from "~/utils/appStore";
import Component from "./Component";
import { UI } from "@composehq/ts-public";
import { Modal } from "~/components/modal";

function RootComponent({
  renderId,
  componentId,
  environmentId,
  onCloseModal,
}: {
  renderId: string;
  componentId: string | appStore.DeletedRender;
  environmentId: string | null;
  onCloseModal: (renderId: string) => void;
}) {
  const componentModel = appStore.use((state) => {
    if (componentId === appStore.DELETED_RENDER) {
      return null;
    }
    return state.flattenedModel[renderId][componentId];
  });

  const metadata = appStore.use((state) => state.renderToMetadata[renderId]);

  const spacingY = appStore.use((state) => state.config.spacingY);

  if (componentModel === null || componentModel.type === UI.TYPE.DISPLAY_NONE) {
    return null;
  }

  if (metadata.appearance === UI.RENDER_APPEARANCE.MODAL) {
    return (
      <Modal.Root
        isOpen={true}
        width={metadata.modalWidth}
        onClose={() => onCloseModal(renderId)}
      >
        <Modal.CloseableHeader onClose={() => onCloseModal(renderId)}>
          {metadata.modalHeader || ""}
        </Modal.CloseableHeader>
        <Modal.RawBody>
          <Component
            renderId={renderId}
            componentId={componentId}
            environmentId={environmentId}
          />
        </Modal.RawBody>
      </Modal.Root>
    );
  }

  return (
    <div
      className="w-full flex flex-col items-stretch c-container c-stack c-root"
      style={{
        marginBottom: spacingY,
      }}
      key={renderId}
    >
      <Component
        renderId={renderId}
        componentId={componentId}
        environmentId={environmentId}
      />
    </div>
  );
}

export default memo(RootComponent);
