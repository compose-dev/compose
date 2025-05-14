import { getRouteApi, useNavigate, useRouter } from "@tanstack/react-router";
import { BrowserToServerEvent } from "@compose/ts";

import Button from "~/components/button";

import { WSProvider } from "~/utils/wsContext";

import RootComponent from "./RootComponent";
import { Modal } from "~/components/modal";
import { classNames } from "~/utils/classNames";
import { CenteredSpinner } from "~/components/spinner";
import { ConfirmDialog } from "~/components/confirm-dialog";

import { appStore } from "~/utils/appStore";
import { useAppRunner } from "./utils";
import DropdownMenu from "~/components/dropdown-menu";
import Icon from "~/components/icon";
import { ConnectionStatusIndicator } from "~/components/connection-status-indicator";
import { useCallback, useEffect, useMemo } from "react";
import LoadingOverlay from "./LoadingOverlay";
import { Tooltip } from "react-tooltip";

const routeApi = getRouteApi("/app/$environmentId/$appRoute");

function App() {
  const navigate = useNavigate({ from: "/app/$environmentId/$appRoute" });
  const router = useRouter();
  const { appRoute } = routeApi.useParams();

  const {
    loadingAuthorization,
    error,
    restartApp,
    pageConfirm,
    dispatch,
    config,
    renders,
    renderToRootComponent,
    executionId,
    environmentId,
    sendWSJsonMessage,
    connectionStatus,
    isExternalUser,
    browserSessionId,
    pageLoading,
  } = useAppRunner();

  const hasNav = appStore.useNavigation((state) => {
    if (state.environmentId !== environmentId) {
      return false;
    }

    const navId = state.appRouteToNavId[appRoute];

    if (!navId) {
      return false;
    }

    return state.navs.find((nav) => nav.id === navId) !== undefined;
  });

  const handleBeforeUnload = useCallback(() => {
    // Check that there's actually an app running before sending this message!
    if (executionId !== null) {
      sendWSJsonMessage(
        {
          type: BrowserToServerEvent.WS.TYPE.BROWSER_SESSION_ENDED,
          sessionId: browserSessionId,
          executionId,
        },
        environmentId
      );
    }
  }, [browserSessionId, environmentId, sendWSJsonMessage, executionId]);

  useEffect(() => {
    // Listen for closing the tab/window
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Listen for navigating away from apps. (navigating to another app
    // gets caught separately in the SDK itself).
    const unsubscribe = router.subscribe("onBeforeNavigate", (evt) => {
      if (!evt.toLocation.pathname.startsWith(`/app`)) {
        handleBeforeUnload();
      }
    });

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      unsubscribe();
    };
  }, [handleBeforeUnload, router]);

  function onClickPageConfirm(response: boolean) {
    if (pageConfirm !== null && executionId !== null) {
      sendWSJsonMessage(
        {
          type: BrowserToServerEvent.WS.TYPE.ON_CONFIRM_RESPONSE_HOOK,
          executionId,
          componentId: pageConfirm.model.id,
          response,
        },
        environmentId
      );

      dispatch({
        type: appStore.EVENT_TYPE.REMOVE_PAGE_CONFIRM,
      });
    }
  }

  /**
   * Closes a modal. This does not get triggered on every
   * close modal event, but only with the default close
   * icon that's automatically added in the top right corner.
   *
   * SDK triggered modal closes are sent back from the SDK
   * and handled in the app runner custom hook.
   * @param renderId The renderId of the modal to close.
   */
  const onClickCloseModal = useCallback(
    (renderId: string) => {
      if (executionId !== null) {
        sendWSJsonMessage(
          {
            type: BrowserToServerEvent.WS.TYPE.ON_CLOSE_MODAL,
            executionId,
            renderId,
          },
          environmentId
        );

        dispatch({
          type: appStore.EVENT_TYPE.CLOSE_MODAL,
          properties: {
            renderId,
          },
        });
      }
    },
    [environmentId, executionId, sendWSJsonMessage, dispatch]
  );

  const dropdownMenuOptions = useMemo(() => {
    const options = [
      {
        label: "Restart app",
        left: <Icon name="refresh" color="brand-neutral" />,
        onClick: restartApp,
      },
    ];

    if (!isExternalUser) {
      options.unshift({
        label: "Back to home",
        left: <Icon name="home" color="brand-neutral" />,
        onClick: () => navigate({ to: "/home" }),
      });
    }

    return options;
  }, [isExternalUser, navigate, restartApp]);

  if (loadingAuthorization) {
    return <CenteredSpinner />;
  }

  return (
    <>
      {error !== null && (
        <Modal.Root
          isOpen={true}
          width="lg"
          onClose={() => {
            // Allow the user to close warnings, but not errors.
            if (error.severity === "warning") {
              dispatch({
                type: appStore.EVENT_TYPE.REMOVE_APP_ERROR,
              });
            }
          }}
        >
          <Modal.Header>
            <Modal.Title>
              {error.severity === "error" ? "Error" : "Warning"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p
              className={classNames("whitespace-pre-wrap", {
                "text-brand-error": error.severity === "error",
                "text-brand-warning": error.severity === "warning",
              })}
            >
              {error.message}
            </p>
            <div>
              {error.severity === "error" && (
                <Button variant="danger" onClick={restartApp}>
                  Restart app
                </Button>
              )}
              {error.severity === "warning" && (
                <Button
                  variant="warning"
                  onClick={() => {
                    dispatch({
                      type: appStore.EVENT_TYPE.REMOVE_APP_ERROR,
                    });
                  }}
                >
                  Ignore
                </Button>
              )}
            </div>
          </Modal.Body>
        </Modal.Root>
      )}
      {pageConfirm !== null && (
        <ConfirmDialog
          onConfirm={() => onClickPageConfirm(true)}
          onCancel={() => onClickPageConfirm(false)}
          title={pageConfirm.model.properties.title}
          message={pageConfirm.model.properties.message}
          confirmButtonLabel={pageConfirm.model.properties.confirmButtonLabel}
          cancelButtonLabel={pageConfirm.model.properties.cancelButtonLabel}
          appearance={pageConfirm.model.properties.appearance}
          typeToConfirmText={pageConfirm.model.properties.typeToConfirmText}
        />
      )}
      <div
        className="w-full flex justify-center"
        style={{
          paddingTop: config.paddingTop ?? config.paddingY,
          paddingBottom: `max(4rem, ${config.paddingBottom ?? config.paddingY})`,
          paddingLeft: config.paddingLeft ?? config.paddingX,
          paddingRight: config.paddingRight ?? config.paddingX,
        }}
      >
        <div
          className="w-full flex flex-col justify-start items-start"
          style={{
            maxWidth: config.width,
          }}
        >
          {renders.map((renderId) =>
            renderId && renderId in renderToRootComponent ? (
              <RootComponent
                key={renderId}
                renderId={renderId}
                componentId={renderToRootComponent[renderId]}
                environmentId={environmentId}
                onCloseModal={onClickCloseModal}
              />
            ) : null
          )}
        </div>
      </div>
      <div
        className={classNames("fixed bottom-4 right-4", {
          "lg:bottom-2 lg:right-2": hasNav,
        })}
      >
        <div
          className={classNames(
            "rounded-brand flex items-center bg-brand-page border border-brand-neutral dark:bg-brand-overlay relative",
            {
              "lg:rounded-tr-none lg:rounded-bl-none lg:rounded-br-none lg:!bg-brand-overlay lg:dark:!bg-brand-io lg:!border-b-0 lg:!border-r-0":
                hasNav,
            }
          )}
        >
          {hasNav && (
            // Fix curves on the bottom left and right of floating menu to make it blend correctly with the page
            <div className="hidden lg:block">
              <div className="absolute left-[-4px] bottom-0 w-1 h-px bg-brand-overlay" />
              <div className="absolute left-[-1px] bottom-0 w-px h-1 bg-brand-overlay" />
              <div className="absolute left-[-4px] bottom-0 border-r border-b rounded-br-brand border-brand-neutral w-1 h-1 bg-transparent" />
              <div className="absolute right-0 top-[-1px] w-1 h-px bg-brand-overlay" />
              <div className="absolute right-0 top-[-4px] w-px h-1 bg-brand-overlay" />
              <div className="absolute right-0 top-[-4px] border-r border-b rounded-br-brand border-brand-neutral w-1 h-1 bg-transparent" />
            </div>
          )}
          <div
            className="p-2 cursor-pointer flex items-center gap-2"
            onClick={() => {
              window.open("https://composehq.com", "_blank");
            }}
          >
            {isExternalUser && <p className="font-medium text-sm">Made with</p>}
            <img
              src="/light-logo-with-text.svg"
              className="w-24 hidden dark:block"
              alt="Logo"
            />
            <img
              src="/dark-logo-with-text.svg"
              className="w-24 block dark:hidden"
              alt="Logo"
            />
          </div>
          <div className="px-2 border-x border-brand-neutral">
            <ConnectionStatusIndicator connectionStatus={connectionStatus} />
          </div>
          <DropdownMenu
            menuClassName="w-40"
            label={
              <div className="p-2">
                <Icon name="dots" color="brand-neutral-2" />
              </div>
            }
            labelVariant="ghost"
            options={dropdownMenuOptions}
          />
        </div>
      </div>
      <LoadingOverlay loading={pageLoading} />
      <Tooltip
        id="top-tooltip-offset8"
        className="tooltip z-40 hidden sm:block"
        place="top"
        offset={8}
        noArrow={true}
      />
      <Tooltip
        id="top-tooltip-offset4"
        className="tooltip z-40 hidden sm:block"
        place="top"
        offset={4}
        noArrow={true}
      />
    </>
  );
}

function AppWrapper() {
  const { environmentId, appRoute } = routeApi.useParams();

  return (
    <WSProvider environmentId={environmentId} appRoute={appRoute}>
      <App />
    </WSProvider>
  );
}

export default AppWrapper;
