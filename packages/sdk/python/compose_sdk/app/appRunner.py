# type: ignore

import asyncio
import inspect
import io
import traceback
from typing import Any, TypedDict, Callable, Union, Dict, Literal
import time

from ..scheduler import Scheduler
from ..api import (
    ApiHandler,
    encode_string,
    encode_num_to_four_bytes,
    combine_buffers,
)
from ..core import (
    Utils,
    EventType,
    Render,
    ComponentInstance,
    INTERACTION_TYPE,
    TYPE,
    JSON,
    page_confirm,
    CONFIRM_APPEARANCE,
    CONFIRM_APPEARANCE_DEFAULT,
    RENDER_APPEARANCE,
    MODAL_WIDTH,
    RENDER_APPEARANCE_DEFAULT,
    MODAL_WIDTH_DEFAULT,
    Compress,
    DateUtils,
    StaticTree,
    TableState,
    TablePagination,
    Stale,
    TableDefault,
    Debug,
)

from .appDefinition import AppDefinition
from .state import State
from .page import Page, Params as PageParams


class ConfirmationDialog(TypedDict):
    id: str
    is_active: bool
    resolve: Callable[[bool], None]
    cleanup: Callable[[], None]


class RenderObj(TypedDict):
    resolve: Callable[[Any], None]
    cleanup: Callable[[], None]
    layout: Any
    static_layout: Any
    appearance: RENDER_APPEARANCE
    modal_header: Union[str, None]
    modal_width: MODAL_WIDTH


DELETED_RENDER = "DELETED"
DeletedRender = Literal["DELETED"]


class AppRunner:
    def __init__(
        self,
        scheduler: Scheduler,
        api: ApiHandler,
        appDefinition: AppDefinition,
        executionId: str,
        browserSessionId: str,
        *,
        debug: bool = False,
    ):
        self.scheduler = scheduler
        self.api = api
        self.appDefinition = appDefinition
        self.executionId = executionId
        self.browserSessionId = browserSessionId
        self.debug = debug

        self.renders: Dict[str, Union[RenderObj, DeletedRender]] = {}
        self.tempFiles = {}

        self.execution_task: Union[asyncio.Task[Any], None] = None

        self.confirmationDialog: Union[ConfirmationDialog, None] = None

        self.table_state = TableState(self.scheduler)

    async def render_ui(
        self,
        layout: Any,
        *,
        appearance: RENDER_APPEARANCE = RENDER_APPEARANCE_DEFAULT,
        modal_header: Union[str, None] = None,
        modal_width: MODAL_WIDTH = MODAL_WIDTH_DEFAULT,
        key: Union[str, None] = None,
    ) -> Any:
        try:
            future = self.scheduler.create_future()

            async def _resolve_render(data=None):
                if not future.done():
                    future.set_result(data)

                if appearance == "modal":
                    await self.api.send(
                        {
                            "type": EventType.SdkToServer.CLOSE_MODAL_V2,
                            "renderId": renderId,
                        },
                        self.browserSessionId,
                        self.executionId,
                    )

                    # After the modal is closed, we no longer need to track it.
                    self.renders[renderId] = DELETED_RENDER

            def resolve_render(data=None):
                self.scheduler.create_task(_resolve_render(data))

            def cleanup():
                if not future.done():
                    future.cancel()

            if key:
                renderId = key

                if renderId in self.renders:
                    await self.__send_error(
                        f"An error occurred while rendering the UI:\n\nThe render ID is already in use: {key}",
                        "error",
                    )
                    return
            else:
                renderId = Utils.generate_id()

            if self.debug:
                async with Debug.async_measure_duration(
                    lambda elapsed: Debug.log(
                        f"Page add (fragment: {renderId})",
                        f"Generated static layout in {elapsed:.2f} ms",
                        duration_ms=elapsed,
                        warning_threshold_ms=25,
                    )
                ):
                    static_layout = await StaticTree.generate(
                        layout, resolve_render, renderId, self.table_state
                    )
            else:
                static_layout = await StaticTree.generate(
                    layout, resolve_render, renderId, self.table_state
                )

            self.renders[renderId] = {
                "resolve": resolve_render,
                "layout": layout,
                "static_layout": static_layout,
                "cleanup": cleanup,
                "appearance": appearance,
                "modal_header": modal_header,
                "modal_width": modal_width,
            }

            optional_params = {
                "modalHeader": modal_header,
                "modalWidth": modal_width,
            }

            if self.debug:
                with Debug.measure_duration(
                    lambda elapsed: Debug.log(
                        f"Page add (fragment: {renderId})",
                        f"Compressed static layout in {elapsed:.2f} ms",
                        duration_ms=elapsed,
                        warning_threshold_ms=25,
                    )
                ):
                    compressed = Compress.ui_tree(static_layout)
            else:
                compressed = Compress.ui_tree(static_layout)

            final_params = {
                "type": EventType.SdkToServer.RENDER_UI_V2,
                "ui": compressed,
                "renderId": renderId,
                "appearance": appearance,
            }

            for key, value in optional_params.items():
                if value is not None:
                    final_params[key] = value

            await self.api.send(
                final_params,
                self.browserSessionId,
                self.executionId,
            )

            tables = self.table_state.get_by_render_id(renderId)

            for table in tables:
                if table["stale"] == Stale.INITIALLY_STALE:
                    self.scheduler.create_task(
                        self.on_table_page_change_hook(
                            renderId,
                            table["table_id"],
                            table["search_query"],
                            table["offset"],
                            table["page_size"],
                        )
                    )

            return await future
        except Exception as error:
            await self.__send_error(
                f"An error occurred in the page.add fragment:\n\n{str(error)}\n\n{''.join(traceback.format_tb(error.__traceback__))}"
            )

    async def confirm(
        self,
        *,
        title: Union[str, None] = None,
        message: Union[str, None] = None,
        type_to_confirm_text: Union[str, None] = None,
        confirm_button_label: Union[str, None] = None,
        cancel_button_label: Union[str, None] = None,
        appearance: CONFIRM_APPEARANCE = CONFIRM_APPEARANCE_DEFAULT,
    ) -> bool:
        if self.confirmationDialog is not None and self.confirmationDialog["is_active"]:
            await self.__send_error(
                "Trying to open a confirmation dialog while another one is already open"
            )

            return False

        future = self.scheduler.create_future()

        def resolve_confirm(response: bool):
            if not future.done():
                future.set_result(response)

            if self.confirmationDialog is not None:
                self.confirmationDialog["is_active"] = False

        def cleanup():
            if not future.done():
                future.cancel()

            if self.confirmationDialog is not None:
                self.confirmationDialog["is_active"] = False

        id = Utils.generate_id()

        self.confirmationDialog = {
            "id": id,
            "is_active": True,
            "resolve": resolve_confirm,
            "cleanup": cleanup,
        }

        component = page_confirm(
            id,
            resolve_confirm,
            title=title,
            message=message,
            type_to_confirm_text=type_to_confirm_text,
            confirm_button_label=confirm_button_label,
            cancel_button_label=cancel_button_label,
            appearance=appearance,
        )

        await self.api.send(
            {
                "type": EventType.SdkToServer.CONFIRM_V2,
                "component": component,
            },
            self.browserSessionId,
            self.executionId,
        )

        return await future

    async def toast(
        self,
        message: str,
        title: Union[str, None] = None,
        appearance: Union[str, None] = None,
        duration: Union[str, None] = None,
    ):
        def get_options():
            options = {}

            if title is not None:
                options["title"] = title
            if appearance is not None:
                options["appearance"] = appearance
            if duration is not None:
                options["duration"] = duration

            if len(options) == 0:
                return None

            return options

        options = get_options()

        await self.api.send(
            {
                "type": EventType.SdkToServer.TOAST_V2,
                "message": message,
                "options": options,
            },
            self.browserSessionId,
            self.executionId,
        )

    async def page_loading(
        self,
        value: bool,
        text: Union[str, None] = None,
        disable_interaction: Union[bool, None] = None,
    ):
        def get_options():
            options = {}

            if text is not None:
                options["text"] = text
            if disable_interaction is not None:
                options["disableInteraction"] = disable_interaction

            if len(options) == 0:
                return None

            return options

        options = get_options()

        ws_message = {
            "type": EventType.SdkToServer.UPDATE_LOADING_V2,
            "value": value,
        }

        if options is not None:
            ws_message["properties"] = options

        await self.api.send(
            ws_message,
            self.browserSessionId,
            self.executionId,
        )

    async def set_config(self, config: Dict[str, Any]):
        await self.api.send(
            {
                "type": EventType.SdkToServer.PAGE_CONFIG_V2,
                "config": config,
            },
            self.browserSessionId,
            self.executionId,
        )

    async def on_state_update(self):
        try:
            updated_renders = {}

            if self.debug:
                algorithm_start_time = time.time()

            for renderId in self.renders:
                render = self.renders[renderId]

                if render == DELETED_RENDER:
                    continue

                layout = render["layout"]

                # No need to check for changes for static layouts
                if not callable(layout):
                    continue

                resolve_fn = render["resolve"]

                try:
                    if self.debug:
                        async with Debug.async_measure_duration(
                            lambda elapsed: Debug.log(
                                f"Page update (fragment: {renderId})",
                                f"generated new layout in {elapsed:.2f} ms",
                                duration_ms=elapsed,
                                warning_threshold_ms=25,
                            )
                        ):
                            new_static_layout = await StaticTree.generate(
                                layout, resolve_fn, renderId, self.table_state
                            )
                    else:
                        new_static_layout = await StaticTree.generate(
                            layout, resolve_fn, renderId, self.table_state
                        )
                except Exception as error:
                    return await self.__send_error(
                        f"An error occurred while re-rendering the UI:\n\n{str(error)}\n\n{''.join(traceback.format_tb(error.__traceback__))}"
                    )

                if self.debug:
                    with Debug.measure_duration(
                        lambda elapsed: Debug.log(
                            f"Page update (fragment: {renderId})",
                            f"validated layout in {elapsed:.2f} ms",
                            duration_ms=elapsed,
                            warning_threshold_ms=10,
                        )
                    ):
                        validation_error = StaticTree.validate(new_static_layout)
                else:
                    validation_error = StaticTree.validate(new_static_layout)

                if validation_error is not None:
                    return await self.__send_error(
                        f"An error occurred while re-rendering the UI:\n\n{validation_error}"
                    )

                if self.debug:
                    with Debug.measure_duration(
                        lambda elapsed: Debug.log(
                            f"Page update (fragment: {renderId})",
                            f"generated diff in {elapsed:.2f} ms",
                            duration_ms=elapsed,
                            warning_threshold_ms=50,
                        )
                    ):
                        diff = StaticTree.diff(
                            render["static_layout"], new_static_layout
                        )
                else:
                    diff = StaticTree.diff(render["static_layout"], new_static_layout)

                # When we perform a diff, we don't update the IDs of existing
                # components (even if they're updated). Instead, in these cases,
                # we apply the old IDs onto the new layout so that the SDK layout
                # stays in sync with the client-side layout.
                #
                # For example, if we have an initial render, then a state update where
                # the render doesn't change, then a 2nd state update where we delete
                # a component, both state updates will produce a new static layout
                # with completely new IDs. But, after the first state update, we
                # don't send anything to the client, hence the client IDs will
                # still be the old IDs.
                #
                # By applying the old IDs onto the new layout, we ensure that
                # the render mappings between SDK and client stay in sync so
                # that when we finally do send a delete command to the client,
                # the ID is recognized.
                render["static_layout"] = diff["new_layout_with_ids_applied"]

                if not diff["did_change"]:
                    continue

                updated_renders[renderId] = {
                    "add": diff["add"],
                    "delete": diff["delete"],
                    "update": diff["update"],
                    "rootId": diff["root_id"],
                    "metadata": diff["metadata"],
                }

            if self.debug:
                algorithm_time = time.time() - algorithm_start_time
                Debug.log(
                    "Page update",
                    f"computed page diff in {(algorithm_time * 1000):.2f} ms",
                    duration_ms=algorithm_time * 1000,
                    warning_threshold_ms=75,
                )

            if len(updated_renders) > 0:
                await self.api.send(
                    {
                        "type": EventType.SdkToServer.RERENDER_UI_V3,
                        "diff": updated_renders,
                    },
                    self.browserSessionId,
                    self.executionId,
                )

            tables = self.table_state.state.values()

            for table in tables:
                if (
                    table["stale"] == Stale.INITIALLY_STALE
                    or table["stale"] == Stale.UPDATE_NOT_DISABLED
                ):
                    await self.api.send(
                        {
                            "type": EventType.SdkToServer.STALE_STATE_UPDATE_V2,
                            "renderId": table["render_id"],
                            "componentId": table["table_id"],
                            "stale": table["stale"],
                        },
                        self.browserSessionId,
                        self.executionId,
                    )

                    def cancelable_hook():
                        self.scheduler.create_task(
                            self.on_table_page_change_hook(
                                table["render_id"],
                                table["table_id"],
                                table["search_query"],
                                table["offset"],
                                table["page_size"],
                                True,
                            )
                        )

                    table["page_update_debouncer"].debounce(cancelable_hook)
        except Exception as error:
            await self.__send_error(
                f"An error occurred while updating the page:\n\n{str(error)}\n\n{''.join(traceback.format_tb(error.__traceback__))}"
            )

    async def set_inputs(self, values: Dict[str, Any]):
        if not isinstance(values, dict):
            await self.__send_error(
                f"An error occurred while trying to set input values:\n\nExpected a dictionary, but received {type(values).__name__}",
                "warning",
            )
            return

        corrected_values = {}

        try:
            for input_id in values:
                was_found = False

                for render_id in self.renders:
                    render = self.renders[render_id]

                    if render == DELETED_RENDER:
                        continue

                    static_layout = render["static_layout"]
                    component = StaticTree.find_component.by_id(static_layout, input_id)

                    if component is not None:
                        if was_found is True:
                            await self.__send_error(
                                f"An error occurred while trying to set an input value:\n\nMultiple inputs were found with the same ID: {input_id}",
                                "warning",
                            )
                            return
                        elif component["type"] == TYPE.INPUT_FILE_DROP:
                            await self.__send_error(
                                f"Inputs of type {component['type']} cannot be set using the page.setInput method",
                                "warning",
                            )
                            return

                        if component["type"] == TYPE.INPUT_DATE:
                            corrected_values[input_id] = DateUtils.convert_date(
                                values[input_id]
                            )
                        elif component["type"] == TYPE.INPUT_TIME:
                            corrected_values[input_id] = DateUtils.convert_time(
                                values[input_id]
                            )
                        elif component["type"] == TYPE.INPUT_DATE_TIME:
                            corrected_values[input_id] = DateUtils.convert_datetime(
                                values[input_id]
                            )
                        else:
                            corrected_values[input_id] = values[input_id]

                        was_found = True

                if was_found is False:
                    await self.__send_error(
                        f"An error occurred while trying to set an input value:\n\nNo input was found with the ID: {input_id}",
                        "warning",
                    )
                    return

            await self.api.send(
                {
                    "type": EventType.SdkToServer.SET_INPUTS_V2,
                    "inputs": corrected_values,
                },
                self.browserSessionId,
                self.executionId,
            )
        except Exception as error:
            await self.__send_error(
                f"An error occurred while trying to set input values:\n\n{str(error)}\n\n{''.join(traceback.format_tb(error.__traceback__))}",
                "warning",
            )

    async def download(self, file: Union[bytes, io.BufferedIOBase], filename: str):
        if isinstance(file, io.BufferedIOBase):
            file.seek(0)
            file_content = file.read()
        elif isinstance(file, bytes):
            file_content = file
        else:
            raise TypeError(
                "The 'file' argument must be of type 'bytes' or a bytes-like object that supports the read() method (e.g., BytesIO). "
                "Please provide the file content as bytes or a bytes-like object."
            )

        metadata = {
            "name": filename,
            "download": True,
            "id": Utils.generate_id(),
        }

        metadata_str = JSON.stringify(metadata)

        header_binary = encode_string(
            EventType.SdkToServer.FILE_TRANSFER_V2
            + self.browserSessionId
            + self.executionId
        )

        metadata_length_binary = encode_num_to_four_bytes(len(metadata_str))

        metadata_binary = encode_string(metadata_str)

        message = combine_buffers(
            header_binary, metadata_length_binary, metadata_binary, file_content
        )

        await self.api.send_raw(message)

    async def link(
        self, appRouteOrUrl: str, newTab: bool = True, params: PageParams = {}
    ):
        await self.api.send(
            {
                "type": EventType.SdkToServer.LINK_V2,
                "appRouteOrUrl": appRouteOrUrl,
                "newTab": newTab,
                "params": params,
            },
            self.browserSessionId,
            self.executionId,
        )

    async def reload(self):
        await self.api.send(
            {
                "type": EventType.SdkToServer.RELOAD_PAGE_V2,
            },
            self.browserSessionId,
            self.executionId,
        )

    async def __send_error(
        self, errorMsg: str, severity: Literal["error", "warning"] = "error"
    ):
        await self.api.send(
            {
                "type": EventType.SdkToServer.APP_ERROR_V2,
                "errorMessage": errorMsg,
                "severity": severity,
            },
            self.browserSessionId,
            self.executionId,
        )

    async def execute(self, params: PageParams):
        state = State(self, self.appDefinition.initial_state)
        page = Page(self, params, state, debug=self.debug)

        try:
            handler = self.appDefinition.handler
            handler_params = inspect.signature(handler).parameters
            kwargs = {}
            if "page" in handler_params:
                kwargs["page"] = page
            if "state" in handler_params:
                kwargs["state"] = state
            if "ui" in handler_params:
                kwargs["ui"] = ComponentInstance

            if inspect.iscoroutinefunction(self.appDefinition.handler):
                await self.appDefinition.handler(**kwargs)
            else:
                self.appDefinition.handler(**kwargs)
        except Exception as error:
            await self.__send_error(
                f"An error occurred while running the app:\n\n{str(error)}\n\n{''.join(traceback.format_tb(error.__traceback__))}"
            )

    async def on_click_hook(self, component_id: str, render_id: str):
        if render_id not in self.renders:
            return

        render = self.renders[render_id]

        if render == DELETED_RENDER:
            return

        static_layout = render["static_layout"]

        component = StaticTree.find_component.by_id(static_layout, component_id)

        if (
            component is None
            or component["interactionType"] is not INTERACTION_TYPE.BUTTON
        ):
            return

        hookFunc = component["hooks"]["onClick"]

        if hookFunc is not None:
            try:
                await Render.run_hook_function(hookFunc)
            except Exception as error:
                await self.__send_error(
                    f"An error occurred while executing an on_click callback function:\n\n{str(error)}\n\n{''.join(traceback.format_tb(error.__traceback__))}"
                )

    async def on_submit_form_hook(
        self, form_component_id: str, render_id: str, form_data: dict
    ):
        if render_id not in self.renders:
            return

        render = self.renders[render_id]

        if render == DELETED_RENDER:
            return

        static_layout = render["static_layout"]
        component = StaticTree.find_component.by_id(static_layout, form_component_id)

        if component is None or component["type"] != TYPE.LAYOUT_FORM:
            return

        hydrated, temp_files_to_delete = Render.hydrate_form_data(
            form_data, component, self.tempFiles
        )

        for file_id in temp_files_to_delete:
            del self.tempFiles[file_id]

        input_errors = await Render.get_form_input_errors(hydrated, static_layout)
        form_error = await Render.get_form_error(component, hydrated)

        if input_errors is not None or form_error is not None:
            await self.api.send(
                {
                    "type": EventType.SdkToServer.FORM_VALIDATION_ERROR_V2,
                    "renderId": render_id,
                    "inputComponentErrors": input_errors,
                    "formError": form_error
                    or "Form validation failed. Please correct the highlighted fields.",
                    "formComponentId": form_component_id,
                },
                self.browserSessionId,
                self.executionId,
            )

            return

        hookFunc = component["hooks"]["onSubmit"]

        if hookFunc is not None:
            await self.api.send(
                {
                    "type": EventType.SdkToServer.FORM_SUBMISSION_SUCCESS_V2,
                    "renderId": render_id,
                    "formComponentId": form_component_id,
                },
                self.browserSessionId,
                self.executionId,
            )

            try:
                await Render.run_hook_function(hookFunc, hydrated)
            except Exception as error:
                await self.__send_error(
                    f"An error occurred while executing form submit callback function:\n\n{str(error)}\n\n{''.join(traceback.format_tb(error.__traceback__))}"
                )

    async def on_input_hook(
        self, event_type: str, component_id: str, render_id: str, value: Any
    ):
        if render_id not in self.renders:
            return

        render = self.renders[render_id]

        if render == DELETED_RENDER:
            return

        static_layout = render["static_layout"]
        component = StaticTree.find_component.by_id(static_layout, component_id)

        if component is None or component["interactionType"] != INTERACTION_TYPE.INPUT:
            return

        hydrated, temp_files_to_delete = Render.hydrate_form_data(
            {component_id: value}, component, self.tempFiles
        )

        for file_id in temp_files_to_delete:
            del self.tempFiles[file_id]

        input_errors = await Render.get_form_input_errors(hydrated, static_layout)

        if input_errors is not None:
            error = input_errors[component_id]

            await self.api.send(
                {
                    "type": EventType.SdkToServer.INPUT_VALIDATION_ERROR_V2,
                    "renderId": render_id,
                    "error": error,
                    "componentId": component_id,
                },
                self.browserSessionId,
                self.executionId,
            )

            return

        hookFunc = None
        if event_type == EventType.ServerToSdk.ON_ENTER_HOOK:
            hookFunc = component["hooks"]["onEnter"]
        elif event_type == EventType.ServerToSdk.ON_SELECT_HOOK:
            hookFunc = component["hooks"]["onSelect"]
        elif event_type == EventType.ServerToSdk.ON_FILE_CHANGE_HOOK:
            hookFunc = component["hooks"]["onFileChange"]

        if hookFunc is not None:
            try:
                await Render.run_hook_function(hookFunc, hydrated[component_id])
            except Exception as error:
                await self.__send_error(
                    f"An error occurred while executing input component callback function:\n\n{str(error)}\n\n{''.join(traceback.format_tb(error.__traceback__))}"
                )

    async def on_table_row_action_hook(
        self, component_id: str, render_id: str, action_idx: int, value: Any
    ):
        if render_id not in self.renders:
            await self.__send_error(
                "An error occurred while trying to execute a table row action hook:\n\nThe render container was not found",
                "warning",
            )
            return

        render = self.renders[render_id]

        if render == DELETED_RENDER:
            return

        static_layout = render["static_layout"]
        component = StaticTree.find_component.by_id(static_layout, component_id)

        if component is None:
            await self.__send_error(
                "An error occurred while trying to execute a table row action hook:\n\nThe component was not found",
                "warning",
            )
            return

        if component["type"] != TYPE.INPUT_TABLE:
            await self.__send_error(
                "An error occurred while trying to execute a table row action hook:\n\nThe component is not a table",
                "warning",
            )
            return

        if (
            component["hooks"]["onRowActions"] is None
            or len(component["hooks"]["onRowActions"]) <= action_idx
        ):
            await self.__send_error(
                "An error occurred while trying to execute a table row action hook:\n\nThe row action was not found",
                "warning",
            )
            return

        hookFunc = component["hooks"]["onRowActions"][action_idx]

        table_state = self.table_state.get(render_id, component_id)

        offset = table_state["offset"] if table_state else TableDefault.OFFSET

        # In v2, the hook only receives the index of the row that was selected,
        # so we fetch the row from the data array before passing that to the
        # hook.
        selected_row = (
            component["model"]["properties"]["data"][value - offset]
            if isinstance(value, int)
            else value
        )

        # This code only runs with v2 of the SDK, so its fine to just pass 0
        # if the value is not an integer, since that should never actually
        # happen.
        selected_row_index = value if isinstance(value, int) else 0

        try:
            await Render.run_hook_function(hookFunc, selected_row, selected_row_index)
        except Exception as error:
            await self.__send_error(
                f"An error occurred while executing table row action callback function:\n\n{str(error)}\n\n{''.join(traceback.format_tb(error.__traceback__))}"
            )

    async def on_confirm_response_hook(self, id: str, response: bool):
        if self.confirmationDialog is None or self.confirmationDialog["id"] != id:
            await self.__send_error(
                "An error occurred while trying to resolve a confirmation dialog:\n\nThe confirmation dialog was not found",
                "warning",
            )
            return

        self.confirmationDialog["resolve"](response)

    def on_close_modal(self, render_id: str):
        if render_id not in self.renders:
            return

        render = self.renders[render_id]

        if render == DELETED_RENDER:
            return

        render["resolve"](None)

    def on_file_transfer(self, file_id: str, file_contents: bytes):
        self.tempFiles[file_id] = file_contents

    async def on_table_page_change_hook(
        self,
        render_id: str,
        component_id: str,
        search_query: Union[str, None],
        offset: int,
        page_size: int,
        refresh_total_records: bool = False,
    ):
        try:
            if render_id not in self.renders:
                await self.__send_error(
                    "An error occurred while trying to execute a table page change hook:\n\nThe render container was not found",
                    "warning",
                )
                return

            render = self.renders[render_id]

            if render == DELETED_RENDER:
                return

            static_layout = render["static_layout"]
            component = StaticTree.find_component.by_id(static_layout, component_id)

            if component is None:
                await self.__send_error(
                    "An error occurred while trying to execute a table page change hook:\n\nThe component was not found",
                    "warning",
                )
                return

            if component["type"] != TYPE.INPUT_TABLE:
                await self.__send_error(
                    "An error occurred while trying to execute a table page change hook:\n\nThe component is not a table",
                    "warning",
                )
                return

            table_state = self.table_state.get(render_id, component_id)

            if table_state is None:
                await self.__send_error(
                    "An error occurred while trying to execute a table page change hook:\n\nThe table state was not found",
                    "warning",
                )
                return

            # Update table state immediately to avoid race conditions with page.update() method calls.
            self.table_state.update(
                render_id,
                component_id,
                {
                    "offset": offset,
                    "searchQuery": search_query,
                },
            )

            if component["hooks"]["onPageChange"] is None:
                await self.__send_error(
                    "An error occurred while trying to execute a table page change hook:\n\nThe table does not have a page change handler function.",
                    "warning",
                )
                return

            if component["hooks"]["onPageChange"]["type"] == TablePagination.AUTO:
                all_data = component["hooks"]["onPageChange"]["fn"]()
                data = all_data[offset : offset + page_size]
                total_records = len(all_data)
            elif component["hooks"]["onPageChange"]["type"] == TablePagination.MANUAL:
                arguments = {
                    "offset": offset,
                    "page_size": page_size,
                    "search_query": search_query,
                    "prev_search_query": table_state["search_query"],
                    "prev_total_records": (
                        None if refresh_total_records else table_state["total_records"]
                    ),
                }

                response = await Render.run_hook_function(
                    component["hooks"]["onPageChange"]["fn"], arguments
                )

                data = response["data"]
                total_records = response["total_records"]
            else:
                await self.__send_error(
                    "An error occurred while trying to execute a table page change hook:\n\nDid not find a valid page change handler function.",
                    "warning",
                )
                return

            if table_state["stale"] != Stale.FALSE:
                old_bytes = JSON.to_bytes(
                    {
                        "offset": table_state["offset"],
                        "search_query": table_state["search_query"],
                        "total_records": table_state["total_records"],
                        "data": table_state["data"],
                        "page_size": table_state["page_size"],
                    }
                )

                new_bytes = JSON.to_bytes(
                    {
                        "offset": offset,
                        "search_query": search_query,
                        "total_records": total_records,
                        "data": data,
                        "page_size": page_size,
                    }
                )

                if old_bytes == new_bytes:
                    await self.api.send(
                        {
                            "type": EventType.SdkToServer.STALE_STATE_UPDATE_V2,
                            "renderId": render_id,
                            "componentId": component_id,
                            "stale": (
                                Stale.UPDATE_NOT_DISABLED
                                if self.table_state.has_queued_update(
                                    render_id, component_id
                                )
                                else Stale.FALSE
                            ),
                        },
                        self.browserSessionId,
                        self.executionId,
                    )

                    self.table_state.update(
                        render_id,
                        component_id,
                        {
                            "stale": Stale.FALSE,
                            "data": data,
                        },
                    )

                    return

            self.table_state.update(
                render_id,
                component_id,
                {
                    "total_records": total_records,
                    "offset": offset,
                    "search_query": search_query,
                    "data": data,
                    "stale": Stale.FALSE,
                    "page_size": page_size,
                },
            )

            component["model"]["properties"] = {
                **component["model"]["properties"],
                "data": data,
                "offset": offset,
                "searchQuery": search_query,
                "totalRecords": total_records,
                "pageSize": page_size,
            }

            compressed_table = Compress.ui_tree(component)
            compressed_data = compressed_table["model"]["properties"]["data"]

            await self.api.send(
                {
                    "type": EventType.SdkToServer.TABLE_PAGE_CHANGE_RESPONSE_V2,
                    "renderId": render_id,
                    "componentId": component_id,
                    "data": compressed_data,
                    "totalRecords": total_records,
                    "offset": offset,
                    "searchQuery": search_query,
                    "stale": (
                        Stale.UPDATE_NOT_DISABLED
                        if self.table_state.has_queued_update(render_id, component_id)
                        else Stale.FALSE
                    ),
                },
                self.browserSessionId,
                self.executionId,
            )

        except Exception as error:
            await self.__send_error(
                f"An error occurred while executing table page change callback function:\n\n{str(error)}\n\n{''.join(traceback.format_tb(error.__traceback__))}"
            )

    def cleanup(self):
        try:
            for render in self.renders.values():
                if render == DELETED_RENDER:
                    continue

                render["cleanup"]()

            if self.confirmationDialog is not None:
                self.confirmationDialog["cleanup"]()

            if self.execution_task is not None and not self.execution_task.done():
                self.execution_task.cancel()

            self.table_state.cleanup()
        except Exception as error:
            print(f"Error cleaning up app runner: {error}")
