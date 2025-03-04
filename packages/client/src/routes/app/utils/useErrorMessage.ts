import { useMemo } from "react";
import { appStore } from "~/utils/appStore";
import { UI } from "@composehq/ts-public";

const useErrorMessage = (component: appStore.FrontendComponentOutput.All) => {
  const errorMessage = useMemo(() => {
    const canHaveError =
      component.interactionType === UI.INTERACTION_TYPE.INPUT ||
      component.type === UI.TYPE.LAYOUT_FORM;

    if (!canHaveError) {
      return null;
    }

    const hasLocalValidation =
      component.interactionType === UI.INTERACTION_TYPE.INPUT;

    const localErrorMessage =
      hasLocalValidation && component.validation.showLocalErrorIfExists
        ? component.validation.localErrorMessage
        : null;

    if (component.validation.remoteErrorMessage !== null) {
      const formattedRemoteErrorMsg =
        component.validation.remoteErrorMessage.endsWith(".")
          ? component.validation.remoteErrorMessage
          : `${component.validation.remoteErrorMessage}.`;

      if (localErrorMessage !== null) {
        return `${formattedRemoteErrorMsg} ${localErrorMessage}`;
      }

      return formattedRemoteErrorMsg;
    }

    return localErrorMessage;
  }, [component]);

  return errorMessage;
};

export { useErrorMessage };
