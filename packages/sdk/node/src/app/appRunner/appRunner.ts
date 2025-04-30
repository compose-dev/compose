import {
  Page,
  SdkToServerEvent,
  ServerToSdkEvent,
  UI,
  WSUtils,
  Generator,
  compress,
  dateUtils,
  u as uPublic,
  u,
} from "@composehq/ts-public";
import { v4 as uuid } from "uuid";

import * as api from "../../api";

import { AppDefinition } from "../appDefinition";
import {
  AppHandlerOptions,
  UIRenderLayout,
  UIRenderStaticLayout,
  ui,
} from "../constants";
import * as render from "../render";
import State from "../state";
import { TableState, ComponentTree } from "../utils";
import { debug } from "../../utils";

const DELETED_RENDER = "DELETED";

class AppRunner {
  private appDefinition: AppDefinition;
  private api: api.Handler;
  private auditLogRateLimiter: u.RateLimiter | null;
  private debug: boolean;

  executionId: string;
  browserSessionId: string;

  /**
   * Users can only have one confirmation dialog open at a time.
   */
  confirmationDialog: {
    id: string;
    isActive: boolean;
    resolve: (value: boolean) => void;
  } | null;

  state: ProxyHandler<Record<string, any>>;
  manuallyUpdateState: () => void;

  renders: string[];
  rendersById: Record<
    string,
    | {
        resolve: (value: any) => void;
        isResolved: boolean;
        layout: UIRenderLayout<any>;
        staticLayout: UIRenderStaticLayout;
        initialTrasmissionSent: boolean;
        appearance: UI.RenderAppearance;
        modalHeader?: string;
        modalWidth?: UI.ModalWidth;
      }
    | typeof DELETED_RENDER
  >;

  /**
   * We should only process state updates once all renders are synced.
   * (i.e. renders and rendersById). If they're not, we'll
   * defer the update until they are.
   */
  deferStateUpdate: boolean;

  /**
   * Same as deferStateUpdate. We should only process input updates once all
   * renders are synced. If they're not, we'll defer the update until they are.
   */
  deferInputUpdates: boolean;
  queuedInputUpdates: Record<string, any>;

  /**
   * Files are uploaded separately from JSON payloads -
   * we store them in memory until the request is complete
   * and then we delete them.
   */
  private tempFiles: Record<string, ArrayBuffer>;

  private tableState: TableState.Class = new TableState.Class();

  constructor(
    appDefinition: AppDefinition,
    api: api.Handler,
    executionId: string,
    browserSessionId: string,
    options: {
      debug?: boolean;
      auditLogRateLimiter?: u.RateLimiter;
    } = {}
  ) {
    this.appDefinition = appDefinition;
    this.api = api;
    this.executionId = executionId;
    this.browserSessionId = browserSessionId;
    this.debug = options.debug ?? false;
    this.auditLogRateLimiter = options.auditLogRateLimiter ?? null;

    this.confirmationDialog = null;

    this.renders = [];
    this.rendersById = {};

    this.tempFiles = {};

    this.deferStateUpdate = false;
    this.deferInputUpdates = false;
    this.queuedInputUpdates = {};

    this.renderUI = this.renderUI.bind(this);
    this.confirm = this.confirm.bind(this);
    this.toast = this.toast.bind(this);
    this.pageLoading = this.pageLoading.bind(this);
    this.transmitRenders = this.transmitRenders.bind(this);
    this.setConfig = this.setConfig.bind(this);
    this.download = this.download.bind(this);
    this.link = this.link.bind(this);
    this.writeAuditLog = this.writeAuditLog.bind(this);
    this.reload = this.reload.bind(this);
    this.onStateUpdate = this.onStateUpdate.bind(this);
    this.setInputs = this.setInputs.bind(this);
    this.execute = this.execute.bind(this);
    this.onClickHook = this.onClickHook.bind(this);
    this.onSubmitFormHook = this.onSubmitFormHook.bind(this);
    this.onInputHook = this.onInputHook.bind(this);
    this.onTableRowActionHook = this.onTableRowActionHook.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.onFileTransfer = this.onFileTransfer.bind(this);
    this.onTablePageChangeHook = this.onTablePageChangeHook.bind(this);
    this.hookErrorHandler = this.hookErrorHandler.bind(this);
    this.sendError = this.sendError.bind(this);

    const { state, manualUpdate } = new State(this.onStateUpdate).createProxy(
      this.appDefinition.initialState
    );

    this.state = state;
    this.manuallyUpdateState = manualUpdate;
  }

  private async writeAuditLog(
    message: string,
    options?: Partial<{
      severity: uPublic.log.Severity;
      data: Record<string, any>;
    }>
  ) {
    try {
      if (!this.auditLogRateLimiter) {
        return;
      }

      if (this.auditLogRateLimiter.invoke() === "error") {
        throw new Error(
          "Audit log rate limit exceeded. Logs are hard capped at 10,000 per minute. Reach out to support if you need this increased."
        );
      }

      uPublic.log.validateLog(
        message,
        options?.data ?? null,
        options?.severity ?? uPublic.log.SEVERITY.INFO
      );
    } catch (error) {
      this.sendError((error as Error).message, "info");
      return;
    }

    this.api.send(
      {
        type: SdkToServerEvent.TYPE.WRITE_AUDIT_LOG,
        message,
        severity: options?.severity || undefined,
        data: options?.data || undefined,
      },
      this.browserSessionId,
      this.executionId
    );
  }

  private async renderUI<ResolveData>(
    layout: UIRenderLayout<ResolveData>,
    options: Partial<{
      appearance: UI.RenderAppearance;
      modalHeader: string;
      modalWidth: UI.ModalWidth;
      key: string;
    }> = {}
  ) {
    const appearance = options.appearance ?? UI.RENDER_APPEARANCE.DEFAULT;
    const modalHeader = options.modalHeader ?? undefined;
    const modalWidth = options.modalWidth ?? undefined;

    const renderId = options.key ?? uuid();
    this.renders.push(renderId);

    const resolveRenderPromise: Promise<ResolveData> = new Promise(
      async (resolve) => {
        const resolveRender = (data: ResolveData) => {
          resolve(data);

          if (appearance === UI.RENDER_APPEARANCE.MODAL) {
            this.api.send(
              {
                type: SdkToServerEvent.TYPE.CLOSE_MODAL_V2,
                renderId,
              },
              this.browserSessionId,
              this.executionId
            );

            // After the modal is closed, we no longer need to track it.
            this.rendersById[renderId] = DELETED_RENDER;
          }
        };

        let staticLayout: UIRenderStaticLayout;
        try {
          if (this.debug) {
            staticLayout = await debug.asyncMeasureDuration(
              async () =>
                await render.generateStaticLayout(
                  layout,
                  resolveRender,
                  renderId,
                  this.tableState
                ),
              (elapsed) =>
                debug.log(
                  `Page add (fragment: ${renderId})`,
                  `Generated static layout in ${elapsed} ms`,
                  {
                    durationMs: elapsed,
                    warningThresholdMs: 25,
                  }
                )
            );
          } else {
            staticLayout = await render.generateStaticLayout(
              layout,
              resolveRender,
              renderId,
              this.tableState
            );
          }
        } catch (error: any) {
          return this.sendError(
            "stack" in error
              ? `An error occurred while rendering the UI:\n\n${error.stack}`
              : `An error occurred while rendering the UI:\n\n${"message" in error ? error.message : "Unknown error"}`
          );
        }

        let validationError: string | null;

        if (this.debug) {
          validationError = debug.measureDuration(
            () => render.validateStaticLayout(staticLayout),
            (elapsed) =>
              debug.log(
                `Page add (fragment: ${renderId})`,
                `Validated layout in ${elapsed} ms`,
                {
                  durationMs: elapsed,
                  warningThresholdMs: 10,
                }
              )
          );
        } else {
          validationError = render.validateStaticLayout(staticLayout);
        }

        // Note: validation errors MUST error and force an app restart
        // since it takes rendersById out of sync with renders.
        if (validationError !== null) {
          this.sendError(validationError);
          return;
        }

        this.rendersById[renderId] = {
          resolve: resolveRender,
          isResolved: false,
          layout,
          staticLayout,
          initialTrasmissionSent: false,
          appearance,
          modalHeader,
          modalWidth,
        };

        this.transmitRenders();
      }
    );

    return await resolveRenderPromise;
  }

  private async confirm(
    options: Parameters<AppHandlerOptions["page"]["confirm"]>[0]
  ) {
    if (this.confirmationDialog !== null && this.confirmationDialog.isActive) {
      this.sendError(
        "Trying to open a confirmation dialog while another one is already open"
      );
      return false;
    }

    const resolveConfirmPromise: Promise<boolean> = new Promise(
      async (resolve) => {
        const resolveConfirm = (response: boolean) => {
          if (this.confirmationDialog === null) {
            this.sendError(
              "Trying to resolve a confirmation dialog that doesn't exist"
            );
            return;
          }

          this.confirmationDialog.isActive = false;

          resolve(response);
        };

        const id = uuid();

        this.confirmationDialog = {
          id,
          isActive: true,
          resolve: resolveConfirm,
        };

        const component = Generator.page.confirm(id, resolveConfirm, options);

        this.api.send(
          {
            type: SdkToServerEvent.TYPE.CONFIRM_V2,
            component,
          },
          this.browserSessionId,
          this.executionId
        );
      }
    );

    return await resolveConfirmPromise;
  }

  private async toast(
    message: string,
    options?: Omit<Page.toast.Base, "message">
  ) {
    this.api.send(
      {
        type: SdkToServerEvent.TYPE.TOAST_V2,
        message,
        options: options || null,
      },
      this.browserSessionId,
      this.executionId
    );
  }

  private async pageLoading(
    value: Page.loading.Value,
    properties?: Page.loading.Properties
  ) {
    if (this.debug) {
      debug.log("Page", "loading");
    }

    this.api.send(
      {
        type: SdkToServerEvent.TYPE.UPDATE_LOADING_V2,
        value,
        properties: properties,
      },
      this.browserSessionId,
      this.executionId
    );
  }

  private transmitRenders() {
    for (let i = 0; i < this.renders.length; i++) {
      const renderId = this.renders[i];

      // Due to the asynchronous nature of renders, you may have a case where
      // render 2 exists in rendersById while render 1 does not. If we were to
      // continue here, we would send render 2 to the client before render 1,
      // which we don't want. Hence, we just return. Once render 1 is ready
      // to be sent, then the transmit function will be called again and transmit
      // both renders.
      if (renderId in this.rendersById === false) {
        return;
      }

      // It's a deleted render (i.e. modal). We can skip it.
      if (this.rendersById[renderId] === DELETED_RENDER) {
        continue;
      }

      if (this.rendersById[renderId].initialTrasmissionSent === true) {
        continue;
      }

      this.rendersById[renderId].initialTrasmissionSent = true;

      let compressed: UIRenderStaticLayout;
      if (this.debug) {
        compressed = debug.measureDuration(
          // @ts-expect-error the function scope makes it forget it can't be "DELETED" type
          () => compress.uiTree(this.rendersById[renderId].staticLayout),
          (elapsed) =>
            debug.log(
              `Page add (fragment: ${renderId})`,
              `Compressed layout in ${elapsed} ms`,
              {
                durationMs: elapsed,
                warningThresholdMs: 25,
              }
            )
        );
      } else {
        compressed = compress.uiTree(this.rendersById[renderId].staticLayout);
      }

      this.api.send(
        {
          type: SdkToServerEvent.TYPE.RENDER_UI_V2,
          ui: compressed,
          renderId,
          idx: i,
          appearance: this.rendersById[renderId].appearance,
          modalHeader: this.rendersById[renderId].modalHeader,
          modalWidth: this.rendersById[renderId].modalWidth,
        },
        this.browserSessionId,
        this.executionId
      );

      const tables = this.tableState.getByRenderId(renderId);

      for (const table of tables) {
        if (table.stale === UI.Stale.OPTION.INITIALLY_STALE) {
          this.api.send(
            {
              type: SdkToServerEvent.TYPE.STALE_STATE_UPDATE_V2,
              renderId: table.renderId,
              componentId: table.tableId,
              stale: table.stale,
            },
            this.browserSessionId,
            this.executionId
          );
          this.onTablePageChangeHook(
            renderId,
            table.tableId,
            table.searchQuery,
            table.offset,
            table.pageSize,
            table.activeSortBy
          );
        }
      }
    }

    if (this.deferStateUpdate === true) {
      this.deferStateUpdate = false;
      this.onStateUpdate();
    }

    if (this.deferInputUpdates === true) {
      this.deferInputUpdates = false;
      this.setInputs({ ...this.queuedInputUpdates });
      this.queuedInputUpdates = {};
    }
  }

  private async setConfig(config: Partial<Page.Config>) {
    this.api.send(
      {
        type: SdkToServerEvent.TYPE.PAGE_CONFIG_V2,
        config,
      },
      this.browserSessionId,
      this.executionId
    );
  }

  private async download(file: Buffer, filename: string) {
    if (Buffer.isBuffer(file) === false) {
      this.sendError(
        "An error occured while trying to download the file:\n\nThe file is not a valid buffer"
      );
      return;
    }

    const metadata: SdkToServerEvent.FileTransferV2.Data["metadata"] = {
      name: filename,
      download: true,
      id: uuid(),
    };

    const metadataStr = JSON.stringify(metadata);

    const headerBinary = WSUtils.Message.stringToBinary(
      SdkToServerEvent.TYPE.FILE_TRANSFER_V2 +
        this.browserSessionId +
        this.executionId
    );

    const metadataLengthBinary = WSUtils.Message.numToFourByteBinary(
      metadataStr.length
    );

    const metadataBinary = WSUtils.Message.stringToBinary(metadataStr);

    const fileContentsBinary = new Uint8Array(file);

    const buffer = WSUtils.Message.combineBuffers(
      headerBinary,
      metadataLengthBinary,
      metadataBinary,
      fileContentsBinary
    );

    this.api.sendRaw(buffer);
  }

  private async link(
    appRouteOrUrl: string,
    options?: Partial<{
      newTab: boolean;
      params: Page.Params;
    }>
  ) {
    const newTab = options?.newTab ?? false;
    const params = options?.params ?? {};

    this.api.send(
      {
        type: SdkToServerEvent.TYPE.LINK_V2,
        appRouteOrUrl,
        newTab,
        params,
      },
      this.browserSessionId,
      this.executionId
    );
  }

  private async reload() {
    this.api.send(
      {
        type: SdkToServerEvent.TYPE.RELOAD_PAGE_V2,
      },
      this.browserSessionId,
      this.executionId
    );
  }

  private async onStateUpdate() {
    // Defer state updates until all renders have been synced.
    if (this.renders.length !== Object.keys(this.rendersById).length) {
      this.deferStateUpdate = true;
      return;
    }

    // If we're still deferring state updates, then return. It's
    // up to other functions to flip this to false before calling
    // this function again.
    if (this.deferStateUpdate === true) {
      return;
    }

    // Everytime we set state, we should check to see if any layouts
    // need to be re-rendered.
    const updatedRenders: SdkToServerEvent.RerenderUIV2.Data["diff"] = {};

    const algoStart = this.debug ? performance.now() : null;

    for (const renderId in this.rendersById) {
      // It's a deleted render (i.e. modal). We can skip it.
      if (this.rendersById[renderId] === DELETED_RENDER) {
        continue;
      }

      const { layout, resolve, staticLayout } = this.rendersById[renderId];

      // If the layout is not a function, then it is a static layout and
      // we don't need to check for changes.
      if (typeof layout !== "function") {
        continue;
      }

      let newLayout: UIRenderStaticLayout;
      try {
        if (this.debug) {
          newLayout = await debug.asyncMeasureDuration(
            async () =>
              await render.generateStaticLayout(
                layout,
                resolve,
                renderId,
                this.tableState
              ),
            (elapsed) =>
              debug.log(
                `Page update (fragment: ${renderId})`,
                `generated new layout in ${elapsed} ms`,
                {
                  durationMs: elapsed,
                  warningThresholdMs: 25,
                }
              )
          );
        } else {
          newLayout = await render.generateStaticLayout(
            layout,
            resolve,
            renderId,
            this.tableState
          );
        }
      } catch (error: any) {
        this.sendError(
          "stack" in error
            ? `An error occurred while updating the UI from a page.update() call:\n\n${error.stack}`
            : `An error occurred while updating the UI from a page.update() call:\n\n${"message" in error ? error.message : "Unknown error"}`
        );
        return;
      }

      let validationError: string | null;

      if (this.debug) {
        validationError = debug.measureDuration(
          () => render.validateStaticLayout(newLayout),
          (elapsed) =>
            debug.log(
              `Page update (fragment: ${renderId})`,
              `validated layout in ${elapsed} ms`,
              {
                durationMs: elapsed,
                warningThresholdMs: 10,
              }
            )
        );
      } else {
        validationError = render.validateStaticLayout(newLayout);
      }

      if (validationError !== null) {
        this.sendError(validationError);
        return;
      }

      let diff: ReturnType<typeof render.diffStaticLayouts>;
      if (this.debug) {
        diff = debug.measureDuration(
          () => render.diffStaticLayouts(staticLayout, newLayout),
          (elapsed) =>
            debug.log(
              `Page update (fragment: ${renderId})`,
              `generated diff in ${elapsed} ms`,
              {
                durationMs: elapsed,
                warningThresholdMs: 50,
              }
            )
        );
      } else {
        diff = render.diffStaticLayouts(staticLayout, newLayout);
      }

      // When we perform a diff, we don't update the IDs of existing
      // components (even if they're updated). Instead, in these cases,
      // we apply the old IDs onto the new layout so that the SDK layout
      // stays in sync with the client-side layout.
      //
      // For example, if we have an initial render, then a state update where
      // the render doesn't change, then a 2nd state update where we delete
      // a component, both state updates will produce a new static layout
      // with completely new IDs. But, after the first state update, we
      // don't send anything to the client, hence the client IDs will
      // still be the old IDs.
      //
      // By applying the old IDs onto the new layout, we ensure that
      // the render mappings between SDK and client stay in sync so
      // that when we finally do send a delete command to the client,
      // the ID is recognized.
      this.rendersById[renderId].staticLayout = diff.newLayoutWithIDsApplied;

      if (!diff.didChange) {
        continue;
      }

      updatedRenders[renderId] = {
        add: diff.add,
        delete: diff.delete,
        update: diff.update,
        rootId: diff.rootId,
        metadata: diff.metadata,
      };
    }

    if (algoStart) {
      const elapsed = parseFloat((performance.now() - algoStart).toFixed(2));
      debug.log("Page update", `computed page diff in ${elapsed} ms`, {
        durationMs: elapsed,
        warningThresholdMs: 75,
      });
    }

    if (Object.keys(updatedRenders).length > 0) {
      this.api.send(
        {
          type: SdkToServerEvent.TYPE.RERENDER_UI_V3,
          diff: updatedRenders,
        },
        this.browserSessionId,
        this.executionId
      );
    }

    const tables = Object.values(this.tableState.state);

    for (const table of tables) {
      if (
        table.stale === UI.Stale.OPTION.UPDATE_NOT_DISABLED ||
        table.stale === UI.Stale.OPTION.INITIALLY_STALE
      ) {
        this.api.send(
          {
            type: SdkToServerEvent.TYPE.STALE_STATE_UPDATE_V2,
            renderId: table.renderId,
            componentId: table.tableId,
            stale: table.stale,
          },
          this.browserSessionId,
          this.executionId
        );
        table.pageUpdateDebouncer.run(() => {
          // Refetch table state since it might have changed during the debounce
          // period.
          const newTable = this.tableState.get(table.renderId, table.tableId);
          if (newTable === undefined) {
            return;
          }
          this.onTablePageChangeHook(
            table.renderId,
            table.tableId,
            newTable.searchQuery,
            newTable.offset,
            newTable.pageSize,
            newTable.activeSortBy,
            true
          );
        });
      }
    }
  }

  private async setInputs(values: Record<string, any>) {
    if (typeof values !== "object" || values === null) {
      this.sendError(
        "An error occurred while trying to set input values:\n\nExpected a dictionary, but received " +
          typeof values,
        "warning"
      );
      return;
    }

    // Defer input updates until all renders have been synced.
    if (this.renders.length !== Object.keys(this.rendersById).length) {
      this.deferInputUpdates = true;
      this.queuedInputUpdates = { ...this.queuedInputUpdates, ...values };
      return;
    }

    // If we're still deferring input updates, then return. It's
    // up to other functions to flip this to false before calling
    // this function again.
    if (this.deferInputUpdates === true) {
      this.queuedInputUpdates = { ...this.queuedInputUpdates, ...values };
      return;
    }

    try {
      const correctedValues: Record<string, any> = {};

      for (const inputId in values) {
        let wasFound: boolean = false;

        for (const renderId in this.rendersById) {
          if (this.rendersById[renderId] === DELETED_RENDER) {
            continue;
          }

          const { staticLayout } = this.rendersById[renderId];

          const component = ComponentTree.findById(staticLayout, inputId);

          if (component) {
            if (wasFound === true) {
              this.sendError(
                `An error occurred while trying to set an input value:\n\nMultiple inputs were found with the same ID: ${inputId}`,
                "warning"
              );
              return;
            } else if (
              UI.InputComponentTypes.isSettableInputType(component.type) ===
              false
            ) {
              this.sendError(
                `An error occurred while trying to set an input value:\n\nInputs of type ${component.type} cannot be set using the page.setInput method`,
                "warning"
              );
              return;
            }

            if (component.type === UI.TYPE.INPUT_DATE) {
              correctedValues[inputId] = dateUtils.getDateModel(
                values[inputId]
              );
            } else if (component.type === UI.TYPE.INPUT_DATE_TIME) {
              correctedValues[inputId] = dateUtils.getDateTimeModel(
                values[inputId]
              );
            } else if (component.type === UI.TYPE.INPUT_TIME) {
              correctedValues[inputId] = dateUtils.getTimeModel(
                values[inputId]
              );
            } else {
              correctedValues[inputId] = values[inputId];
            }

            wasFound = true;
          }
        }

        if (wasFound === false) {
          this.sendError(
            `An error occurred while trying to set an input value:\n\nNo input was found with the ID: ${inputId}`,
            "warning"
          );
          return;
        }
      }

      this.api.send(
        {
          type: SdkToServerEvent.TYPE.SET_INPUTS_V2,
          inputs: correctedValues,
        },
        this.browserSessionId,
        this.executionId
      );
    } catch (error: any) {
      this.sendError(
        "stack" in error
          ? `An error occurred while trying to set input values:\n\n${error.stack}`
          : `An error occurred while trying to set input values:\n\n${"message" in error ? error.message : "Unknown error"}`,
        "warning"
      );
      return;
    }
  }

  async execute(params: Page.Params) {
    try {
      await this.appDefinition.handler({
        page: {
          add: <ResolveData>(
            layout: UIRenderLayout<ResolveData>,
            options: Partial<{ key: string }> = {}
          ) => {
            if (this.debug) {
              if (options.key) {
                debug.log("Page", `add (fragment: ${options.key})`);
              } else {
                debug.log("Page", "add");
              }
            }

            return this.renderUI<ResolveData>(layout, { key: options.key });
          },
          modal: <ResolveData>(
            layout: UIRenderLayout<ResolveData>,
            options: Partial<{
              title: string;
              width: UI.ModalWidth;
              key: string;
            }> = {}
          ) => {
            if (this.debug) {
              if (options.key) {
                debug.log("Page", `modal (fragment: ${options.key})`);
              } else {
                debug.log("Page", "modal");
              }
            }

            return this.renderUI<ResolveData>(layout, {
              key: options.key,
              modalHeader: options.title,
              modalWidth: options.width,
              appearance: UI.RENDER_APPEARANCE.MODAL,
            });
          },
          confirm: (
            options: Parameters<AppHandlerOptions["page"]["confirm"]>[0]
          ) => {
            if (this.debug) {
              debug.log("Page", "confirm");
            }

            return this.confirm(options);
          },
          set: (config: Partial<Page.Config>) => {
            if (this.debug) {
              debug.log("Page", "set config");
            }

            this.setConfig(config);
          },
          download: (file: Buffer, filename: string) => {
            if (this.debug) {
              debug.log("Page", `download file (${filename})`);
            }

            this.download(file, filename);
          },
          log: (
            message: string,
            options?: Partial<{
              severity: uPublic.log.Severity;
              data: Record<string, any>;
            }>
          ) => {
            if (this.debug) {
              debug.log("Page", "write to audit log");
            }

            this.writeAuditLog(message, options);
          },
          link: (
            appRouteOrUrl: string,
            options?: Partial<{
              newTab: boolean;
              params: Page.Params;
            }>
          ) => {
            if (this.debug) {
              debug.log("Page", "link");
            }

            this.link(appRouteOrUrl, options);
          },
          params,
          reload: () => {
            if (this.debug) {
              debug.log("Page", "reload");
            }

            this.reload();
          },
          toast: (
            message: string,
            options?: Omit<Page.toast.Base, "message">
          ) => {
            if (this.debug) {
              debug.log("Page", "toast");
            }

            this.toast(message, options);
          },
          setInputs: (idsToValue: Record<string, any>) => {
            if (this.debug) {
              debug.log("Page", "set inputs");
            }

            this.setInputs(idsToValue);
          },
          loading: this.pageLoading,
          update: () => {
            if (this.debug) {
              debug.log("Page", "update");
            }

            this.manuallyUpdateState();
          },
        },
        ui,
        // Lie about the actual type of this.state. We type it separately so that
        // the user doesn't see that it's a proxy.
        state: this.state as any,
      });
    } catch (error: any) {
      this.sendError(
        "stack" in error
          ? `An error occurred while running the app:\n\n${error.stack}`
          : `An error occurred while running the app:\n\n${"message" in error ? error.message : "Unknown error"}`
      );
    }
  }

  async onClickHook(componentId: string, renderId: string) {
    if (renderId in this.rendersById === false) {
      this.sendError(
        "An error occurred while trying to execute a click hook:\n\nThe render container was not found",
        "warning"
      );
      return;
    }

    // Don't error in this case since maybe the user triggered an action twice
    // very quickly before the first action completed.
    if (this.rendersById[renderId] === DELETED_RENDER) {
      return;
    }

    const { staticLayout } = this.rendersById[renderId];

    const component = ComponentTree.findById(staticLayout, componentId);

    if (
      component === null ||
      component.interactionType !== UI.INTERACTION_TYPE.BUTTON ||
      component.type === UI.TYPE.BUTTON_BAR_CHART ||
      component.type === UI.TYPE.BUTTON_LINE_CHART
    ) {
      return;
    }

    const hookFunc = component.hooks.onClick;
    if (hookFunc !== null) {
      this.hookErrorHandler(() => hookFunc());
    }
  }

  async onSubmitFormHook(
    formComponentId: string,
    renderId: string,
    formData: Record<string, any>
  ) {
    if (renderId in this.rendersById === false) {
      this.sendError(
        "An error occurred while trying to execute a form submission hook:\n\nThe render container was not found",
        "warning"
      );
      return;
    }

    // Don't error in this case since maybe the user triggered an action twice
    // very quickly before the first action completed.
    if (this.rendersById[renderId] === DELETED_RENDER) {
      return;
    }

    const { staticLayout } = this.rendersById[renderId];

    const component = ComponentTree.findById(staticLayout, formComponentId);

    if (component === null || component.type !== UI.TYPE.LAYOUT_FORM) {
      return;
    }

    const { hydrated, tempFilesToDelete } = render.hydrateFormData(
      formData,
      component,
      this.tempFiles
    );

    for (const fileId of tempFilesToDelete) {
      delete this.tempFiles[fileId];
    }

    const inputErrors = await render.getFormInputErrors(hydrated, staticLayout);
    const formError = await render.getFormError(component, hydrated);

    if (inputErrors !== null || formError !== null) {
      this.api.send(
        {
          type: SdkToServerEvent.TYPE.FORM_VALIDATION_ERROR_V2,
          renderId,
          inputComponentErrors: inputErrors,
          formError:
            formError ??
            "Form validation failed. Please correct the highlighted fields.",
          formComponentId,
        },
        this.browserSessionId,
        this.executionId
      );

      return;
    }

    const hookFunc = component.hooks.onSubmit;
    if (hookFunc !== null) {
      this.api.send(
        {
          type: SdkToServerEvent.TYPE.FORM_SUBMISSION_SUCCESS_V2,
          renderId,
          formComponentId,
        },
        this.browserSessionId,
        this.executionId
      );
      this.hookErrorHandler(() => hookFunc(hydrated));
    }
  }

  async onInputHook(
    eventType: ServerToSdkEvent.Type,
    componentId: string,
    renderId: string,
    value: any
  ) {
    if (renderId in this.rendersById === false) {
      this.sendError(
        "An error occurred while trying to execute an input hook:\n\nThe render container was not found"
      );
      return;
    }

    // Don't error in this case since maybe the user triggered an action twice
    // very quickly before the first action completed.
    if (this.rendersById[renderId] === DELETED_RENDER) {
      return;
    }

    const { staticLayout } = this.rendersById[renderId];

    const component = ComponentTree.findById(staticLayout, componentId);

    if (component === null) {
      this.sendError(
        "An error occurred while trying to execute an input hook:\n\nThe component was not found"
      );
      return;
    }

    const { hydrated, tempFilesToDelete } = render.hydrateFormData(
      { [componentId]: value },
      component,
      this.tempFiles
    );

    for (const fileId of tempFilesToDelete) {
      delete this.tempFiles[fileId];
    }

    if (component.interactionType !== UI.INTERACTION_TYPE.INPUT) {
      this.sendError(
        "An error occurred while trying to execute an input hook:\n\nThe component is not an input"
      );
      return;
    }

    const inputErrors = await render.getFormInputErrors(hydrated, staticLayout);

    if (inputErrors !== null) {
      const error = inputErrors[componentId];

      this.api.send(
        {
          type: SdkToServerEvent.TYPE.INPUT_VALIDATION_ERROR_V2,
          renderId,
          error,
          componentId,
        },
        this.browserSessionId,
        this.executionId
      );

      return;
    }

    if (
      eventType === ServerToSdkEvent.TYPE.ON_ENTER_HOOK &&
      UI.InputComponentTypes.isEnterType(component)
    ) {
      const hookFunc = component.hooks.onEnter;
      if (hookFunc !== null) {
        this.hookErrorHandler(() => hookFunc(hydrated[componentId]));
      }
    }

    if (
      eventType === ServerToSdkEvent.TYPE.ON_SELECT_HOOK &&
      UI.InputComponentTypes.isSelectType(component)
    ) {
      const hookFunc = component.hooks.onSelect;
      if (hookFunc !== null) {
        this.hookErrorHandler(() => hookFunc(hydrated[componentId]));
      }
    }

    if (
      eventType === ServerToSdkEvent.TYPE.ON_FILE_CHANGE_HOOK &&
      UI.InputComponentTypes.isFileChangeType(component)
    ) {
      const hookFunc = component.hooks.onFileChange;
      if (hookFunc !== null) {
        this.hookErrorHandler(() => hookFunc(hydrated[componentId]));
      }
    }
  }

  async onTableRowActionHook(
    componentId: string,
    renderId: string,
    actionIdx: number,
    value: any
  ) {
    if (renderId in this.rendersById === false) {
      this.sendError(
        "An error occurred while trying to execute a table row action hook:\n\nThe render container was not found",
        "warning"
      );
      return;
    }

    // Don't error in this case since maybe the user triggered an action twice
    // very quickly before the first action completed.
    if (this.rendersById[renderId] === DELETED_RENDER) {
      return;
    }

    const { staticLayout } = this.rendersById[renderId];

    const component = ComponentTree.findById(staticLayout, componentId);

    if (component === null) {
      this.sendError(
        "An error occurred while trying to execute a table row action hook:\n\nThe component was not found"
      );
      return;
    }

    if (component.type !== UI.TYPE.INPUT_TABLE) {
      this.sendError(
        "An error occurred while trying to execute a table row action hook:\n\nThe component is not a table"
      );
      return;
    }

    if (
      component.hooks.onRowActions === null ||
      component.hooks.onRowActions.length <= actionIdx
    ) {
      this.sendError(
        "An error occurred while trying to execute a table row action hook:\n\nThe row action was not found"
      );
      return;
    }

    const hookFunc = component.hooks.onRowActions[actionIdx];

    /**
     * In v2, the hook only receives the index of the row that was selected,
     * so we fetch the row from the data array before passing that to the hook.
     */
    if (typeof value === "number") {
      const tableState = this.tableState.get(renderId, componentId);
      const offset = tableState ? tableState.offset : UI.Table.DEFAULT_OFFSET;

      const row = component.model.properties.data[value - offset];

      this.hookErrorHandler(() => hookFunc(row, value));
    } else {
      // This code should never be called, since this is the v1 table model, and
      // this version of the SDK always uses v2. Hence, I feel comfortable just
      // passing in 0 for the index to satisfy the type checker.
      this.hookErrorHandler(() => hookFunc(value, 0));
    }
  }

  async onConfirmResponseHook(id: string, response: boolean) {
    if (this.confirmationDialog === null || this.confirmationDialog.id !== id) {
      this.sendError(
        "An error occurred while trying to resolve a confirmation dialog:\n\nThe confirmation dialog was not found"
      );
      return;
    }

    this.confirmationDialog.resolve(response);
  }

  async onCloseModal(renderId: string) {
    if (renderId in this.rendersById === false) {
      this.sendError(
        "An error occurred while trying to close a modal:\n\nThe render container was not found",
        "warning"
      );
      return;
    }

    if (this.rendersById[renderId] === DELETED_RENDER) {
      return;
    }

    this.rendersById[renderId].resolve(undefined);
  }

  async onFileTransfer(fileId: string, fileContents: ArrayBuffer) {
    this.tempFiles[fileId] = fileContents;
  }

  async onTablePageChangeHook(
    renderId: string,
    componentId: string,
    searchQuery: string | null,
    offset: number,
    pageSize: number,
    sortBy: UI.Table.ColumnSort<UI.Table.DataRow[]>[],
    refreshTotalRecords: boolean = false
  ) {
    try {
      if (renderId in this.rendersById === false) {
        this.sendError(
          "An error occurred while trying to execute a table page change hook:\n\nThe render container was not found",
          "warning"
        );
        return;
      }

      // Don't error in this case since maybe the user triggered an action twice
      // very quickly before the first action completed.
      if (this.rendersById[renderId] === DELETED_RENDER) {
        return;
      }

      const { staticLayout } = this.rendersById[renderId];

      const component = ComponentTree.findById(staticLayout, componentId);

      if (component === null) {
        this.sendError(
          "An error occurred while trying to execute a table page change hook:\n\nThe component was not found"
        );
        return;
      }

      if (component.type !== UI.TYPE.INPUT_TABLE) {
        this.sendError(
          "An error occurred while trying to execute a table page change hook:\n\nThe component is not a table"
        );
        return;
      }

      const tableState = this.tableState.get(renderId, componentId);

      if (tableState === undefined) {
        this.sendError(
          "An error occurred while trying to execute a table page change hook:\n\nThe table state was not found"
        );
        return;
      }

      // Update table state immediately to avoid race conditions with page.update() method calls.
      this.tableState.update(renderId, componentId, {
        offset,
        searchQuery,
      });

      if (component.hooks.onPageChange === null) {
        this.sendError(
          "An error occurred while trying to execute a table page change hook:\n\nThe table does not have a page change handler function."
        );
        return;
      }

      let data: UI.Table.DataRow[];
      let totalRecords: number;

      if (component.hooks.onPageChange.type === UI.Table.PAGINATION_TYPE.AUTO) {
        const all = component.hooks.onPageChange.fn();
        data = all.slice(offset, offset + pageSize);
        totalRecords = all.length;
      } else if (
        component.hooks.onPageChange.type === UI.Table.PAGINATION_TYPE.MANUAL
      ) {
        const response = await component.hooks.onPageChange.fn({
          offset,
          pageSize,
          searchQuery,
          sortBy,
          prevSearchQuery: tableState.searchQuery,
          prevTotalRecords: refreshTotalRecords
            ? null
            : tableState.totalRecords,
        });

        data = response.data;
        totalRecords = response.totalRecords;
      } else {
        this.sendError(
          "An error occurred while trying to execute a table page change hook:\n\nDid not find a valid page change handler function."
        );
        return;
      }

      // Check for the case where the table state is stale (e.g. due to a page.update() call
      // or when the table is first rendered). If it's stale, we check if any of the data actually
      // changed. If not, we just update the client that the table is not stale and nothing
      // changed. This is mostly for the case where the user is running page.update() calls
      // that are unrelated to the table.
      if (tableState.stale !== UI.Stale.OPTION.FALSE) {
        const oldStringified = JSON.stringify({
          offset: tableState.offset,
          searchQuery: tableState.searchQuery,
          totalRecords: tableState.totalRecords,
          data: tableState.data,
          pageSize: tableState.pageSize,
          sortBy: tableState.activeSortBy,
        });

        const newStringified = JSON.stringify({
          offset,
          searchQuery,
          totalRecords,
          data,
          pageSize,
          sortBy,
        });

        if (oldStringified === newStringified) {
          this.api.send(
            {
              type: SdkToServerEvent.TYPE.STALE_STATE_UPDATE_V2,
              renderId,
              componentId,
              stale: this.tableState.hasQueuedUpdate(renderId, componentId)
                ? UI.Stale.OPTION.UPDATE_NOT_DISABLED
                : UI.Stale.OPTION.FALSE,
            },
            this.browserSessionId,
            this.executionId
          );

          this.tableState.update(renderId, componentId, {
            stale: UI.Stale.OPTION.FALSE,
            data,
          });

          return;
        }
      }

      this.tableState.update(renderId, componentId, {
        totalRecords,
        offset,
        searchQuery,
        data,
        stale: UI.Stale.OPTION.FALSE,
        pageSize,
        activeSortBy: sortBy,
      });

      component.model.properties = {
        ...component.model.properties,
        data,
        offset,
        searchQuery,
        totalRecords,
        pageSize,
      };

      const compressedTable = compress.uiTree({
        ...component,
        model: {
          ...component.model,
          properties: {
            ...component.model.properties,
            data,
          },
        },
      });

      const compressedData = compressedTable.model.properties.data;

      this.api.send(
        {
          type: SdkToServerEvent.TYPE.TABLE_PAGE_CHANGE_RESPONSE_V2,
          renderId,
          componentId,
          data: compressedData,
          totalRecords,
          offset,
          searchQuery,
          stale: this.tableState.hasQueuedUpdate(renderId, componentId)
            ? UI.Stale.OPTION.UPDATE_NOT_DISABLED
            : UI.Stale.OPTION.FALSE,
        },
        this.browserSessionId,
        this.executionId
      );
    } catch (error: any) {
      this.sendError(
        "stack" in error
          ? `An error occurred while trying to execute a table page change hook:\n\n${error.stack}`
          : `An error occurred while trying to execute a table page change hook:\n\n${"message" in error ? error.message : "Unknown error"}`,
        "warning"
      );
    }
  }

  async hookErrorHandler(func: Function) {
    try {
      await func();
    } catch (error: any) {
      this.sendError(
        "stack" in error
          ? `An error occurred while executing a callback function:\n\n${error.stack}`
          : `An error occurred while executing a callback function:\n\n${"message" in error ? error.message : "Unknown error"}`,
        "warning"
      );
    }
  }

  private sendError(
    errorMessage: string,
    severity?: "error" | "warning" | "info"
  ) {
    this.api.send(
      {
        type: SdkToServerEvent.TYPE.APP_ERROR_V2,
        errorMessage,
        severity,
      },
      this.browserSessionId,
      this.executionId
    );
  }
}

export { AppRunner };
