import io
from typing import (
    TYPE_CHECKING,
    Any,
    Awaitable,
    TypedDict,
    Union,
    Callable,
    Literal,
    List,
    Dict,
)
from ..core import (
    ComponentReturn,
    CONFIRM_APPEARANCE,
    CONFIRM_APPEARANCE_DEFAULT,
    MODAL_WIDTH,
    MODAL_WIDTH_DEFAULT,
    Debug,
)
from .state import State  # type: ignore[attr-defined]

if TYPE_CHECKING:
    from .appRunner import AppRunner  # type: ignore[attr-defined]


class Config(TypedDict, total=False):
    width: str
    padding_top: str
    padding_bottom: str
    padding_left: str
    padding_right: str
    padding_x: str
    padding_y: str
    spacing_y: str


TOAST_APPEARANCE = Literal["success", "error", "warning", "info"]
TOAST_DURATION = Literal["shortest", "short", "medium", "long", "longest", "infinite"]
DEFAULT_TOAST_APPEARANCE: TOAST_APPEARANCE = "info"
DEFAULT_TOAST_DURATION: TOAST_DURATION = "medium"


Resolve = Callable[..., None]
staticLayout = Union[ComponentReturn, List[ComponentReturn]]

Params = Dict[str, Union[str, int, bool]]

Layout = Union[
    staticLayout, Callable[[Resolve], staticLayout], Callable[[], staticLayout]
]


class Page:
    """
    Page methods instruct Compose on what to render in the browser.

    Methods
    ----------
    - `add`: Add UI components to the page.
    - `modal`: Add UI components to the page inside a modal.
    - `download`: Download a file to the user's device.
    - `set`: Edit the default page configuration.
    - `link`: Navigate to another Compose App, or link to an external URL.
    - `reload`: Reload the page.
    - `confirm`: Quickly confirm an action with a confirmation dialog.
    - `toast`: Provide feedback to the user with an unobtrusive toast notification.
    - `set_inputs`: Set the values of one or more input components.
    - `loading`: Display a loading indicator on the page.
    - `update`: Rerender the UI to reflect the latest data.
    - `params`: Access any URL params that were passed to the app.
    """

    def __init__(
        self,
        appRunner: "AppRunner",
        params: Union[Params, None],
        state: State,
        *,
        debug: bool = False,
    ):
        self.__appRunner = appRunner
        self.__params = params if params is not None else {}
        self.__state = state
        self.__debug = debug

    @property
    def params(self) -> Params:
        """
        Access any URL params that were passed to the app.

        Returns
        ----------
        A dictionary containing the URL parameters.

        Example
        ----------
        >>> # Access params
        ... user_id = page.params.get("user_id")
        """
        return self.__params

    def add(
        self, layout: Layout, *, key: Union[str, None] = None
    ) -> Union[Awaitable[Any], Any]:
        """
        Add UI components to the page.

        Documentation
        ----------
        https://docs.composehq.com/page-actions/add


        Parameters
        ----------
        layout : `Layout`
            A function that returns the component to add to the page. The
            function passes a `resolve` callback that can be used to resolve
            the `add` method with whatever value is passed to the callback.

        Returns
        ----------
        An awaitable that resolves to nothing or the value passed to the
        `resolve` callback.

        Examples
        ----------
        >>> # Add a single component
        ... page.add(lambda: ui.text("Hello, World!"))
        ...

        >>> # Add multiple components
        ... page.add(lambda: ui.stack(
        ...     [
        ...         ui.text("Hello, World!"),
        ...         ui.text("Hello, World!"),
        ...     ]
        ... ))
        ...

        >>> # Block handler execution until the page.add() call resolves
        ... email = await page.add(lambda resolve:
        ...     ui.email_input(
        ...         "email",
        ...         on_enter=lambda email: resolve(email)
        ...     )
        ... )
        """
        if self.__debug:
            if key:
                Debug.log("Page", f"add (fragment: {key})")
            else:
                Debug.log("Page", "add")

        return self.__appRunner.scheduler.ensure_future(
            self.__appRunner.render_ui(layout, key=key)
        )

    def modal(
        self,
        layout: Layout,
        *,
        title: Union[str, None] = None,
        width: MODAL_WIDTH = MODAL_WIDTH_DEFAULT,
        key: Union[str, None] = None,
    ) -> Union[Awaitable[Any], Any]:
        """
        Add UI components to the page inside a modal.

        Documentation
        ----------
        https://docs.composehq.com/page-actions/modal

        Parameters
        ----------
        layout : `Layout`
            A function that returns the component to display in the modal. The
            function passes a `resolve` callback that can be called to close the
            modal and resolve the `page.modal()` method with whatever value is
            passed to the callback.

        title : `str`, optional
            Give the modal a title.

        width : 'sm' | 'md' | 'lg' | 'xl' | '2xl', optional
            The width of the modal. Defaults to "md".

        Returns
        ----------
        An awaitable that resolves to nothing or the value passed to the
        `resolve` callback.

        Examples
        ----------
        >>> # Display a simple modal
        ... page.modal(
        ...     lambda: ui.text("Modal content"),
        ...     title="My Modal"
        ... )
        ...
        >>> # Close the modal programmatically
        ... email = await page.modal(lambda resolve:
        ...     ui.button("close-modal", label="Close", on_click=lambda: resolve())
        ... )
        """
        if self.__debug:
            if key:
                Debug.log("Page", f"modal (fragment: {key})")
            else:
                Debug.log("Page", "modal")

        return self.__appRunner.scheduler.ensure_future(
            self.__appRunner.render_ui(
                layout,
                appearance="modal",
                modal_header=title,
                modal_width=width,
                key=key,
            )
        )

    def download(self, file: Union[bytes, io.BufferedIOBase], filename: str) -> None:
        """
        Download a file to the user's device.

        Documentation
        ----------
        https://docs.composehq.com/page-actions/download

        Parameters
        ----------
        file : `bytes` | `io.BufferedIOBase`
            The file content to download.

        filename : `str`
            The name to give the downloaded file.

        Examples
        ----------
        >>> # Download a text file
        ... content = "Hello World"
        ... bytes_content = content.encode("utf-8")
        ... page.download(bytes_content, "hello.txt")
        """
        if self.__debug:
            Debug.log("Page", f"download file ({filename})")

        self.__appRunner.scheduler.create_task(
            self.__appRunner.download(file, filename)
        )

    def set(self, config: Config) -> None:
        """
        Edit the default page configuration.

        Documentation
        ----------
        https://docs.composehq.com/page-actions/set-config

        Parameters
        ----------
        config : `Config`
            Configuration dictionary with the following options:
            - `width`: The width of the page. Defaults to `"72rem"`.
            - `padding_top`: The padding at the top of the page. Supersedes `padding_y`. Defaults to `"4rem"`.
            - `padding_bottom`: The padding at the bottom of the page. Supersedes `padding_y`. Defaults to `"4rem"`.
            - `padding_left`: The padding at the left of the page. Supersedes `padding_x`. Defaults to `"1rem"`.
            - `padding_right`: The padding at the right of the page. Supersedes `padding_x`. Defaults to `"1rem"`.
            - `padding_x`: The padding at the left and right of the page. Defaults to `"1rem"`.
            - `padding_y`: The padding at the top and bottom of the page. Defaults to `"4rem"`.
            - `spacing_y`: vertical spacing between page.add() renders. Defaults to `"2rem"`.

        Examples
        ----------
        >>> # Set default page width and padding
        ... page.set({
        ...     "width": "48rem",
        ...     "padding_x": "2rem"
        ... })
        """
        if self.__debug:
            Debug.log("Page", "set config")

        # Convert snake_case keys to camelCase
        camel_case_config: Dict[str, Any] = {}
        for key, value in config.items():
            if "_" in key:
                words = key.split("_")
                camel_key = words[0] + "".join(word.capitalize() for word in words[1:])
                camel_case_config[camel_key] = value
            else:
                camel_case_config[key] = value

        # Use the converted camelCase config
        self.__appRunner.scheduler.create_task(
            self.__appRunner.set_config(camel_case_config)
        )

    def link(
        self,
        appRouteOrUrl: str,
        *,
        newTab: bool = False,
        new_tab: bool = False,
        params: Params = {},
    ) -> None:
        """
        Navigate to another Compose App, or link to an external URL.

        Documentation
        ----------
        https://docs.composehq.com/page-actions/link

        Parameters
        ----------
        appRouteOrUrl : `str`
            The route of another Compose App or an external URL.

        new_tab : `bool`, optional
            Open the link in a new tab. Defaults to `False`.

        params : `Params`, optional
            URL parameters to pass to the linked app. Defaults to nothing (`{}`).

        Examples
        ----------
        >>> # Link to another Compose App
        ... page.link("other-app", params={"id": "123"})
        ...
        >>> # Link to external URL in new tab
        ... page.link("https://example.com", new_tab=True)
        """
        if self.__debug:
            Debug.log("Page", "link")

        self.__appRunner.scheduler.create_task(
            self.__appRunner.link(appRouteOrUrl, new_tab or newTab, params)
        )

    def reload(self) -> None:
        """
        Reload the page, which restarts the app.

        Documentation
        ----------
        https://docs.composehq.com/page-actions/reload

        Examples
        ----------
        >>> # Reload the page
        ... page.reload()
        """
        if self.__debug:
            Debug.log("Page", "reload")

        self.__appRunner.scheduler.create_task(self.__appRunner.reload())

    def confirm(
        self,
        *,
        title: Union[str, None] = None,
        message: Union[str, None] = None,
        type_to_confirm_text: Union[str, None] = None,
        confirm_button_label: Union[str, None] = None,
        cancel_button_label: Union[str, None] = None,
        appearance: CONFIRM_APPEARANCE = CONFIRM_APPEARANCE_DEFAULT,
    ) -> Awaitable[bool]:
        """
        Display a confirmation dialog to the user.

        Documentation
        ----------
        https://docs.composehq.com/page-actions/confirm-modal

        Parameters
        ----------
        title : `str`, optional
            The title of the confirmation dialog.

        message : `str`, optional
            The message to display in the dialog.

        type_to_confirm_text : `str`, optional
            Text that user must type to confirm the action.

        confirm_button_label : `str`, optional
            Custom label for the confirm button.

        cancel_button_label : `str`, optional
            Custom label for the cancel button.

        appearance : 'primary', 'outline', 'warning', 'danger', optional
            Visual style of the dialog. Defaults to "primary".

        Returns
        ----------
        An awaitable that resolves to True if confirmed, False if cancelled.

        Examples
        ----------
        >>> # Simple confirmation
        ... if await page.confirm(
        ...     title="Delete item?",
        ...     message="This action cannot be undone"
        ... ):
        ...     delete_item()
        """
        if self.__debug:
            Debug.log("Page", "confirm")

        return self.__appRunner.scheduler.ensure_future(  # type: ignore[no-any-return]
            self.__appRunner.confirm(
                title=title,
                message=message,
                type_to_confirm_text=type_to_confirm_text,
                confirm_button_label=confirm_button_label,
                cancel_button_label=cancel_button_label,
                appearance=appearance,
            )
        )

    def toast(
        self,
        message: str,
        *,
        title: Union[str, None] = None,
        appearance: TOAST_APPEARANCE = DEFAULT_TOAST_APPEARANCE,
        duration: TOAST_DURATION = DEFAULT_TOAST_DURATION,
    ) -> None:
        """
        Display a temporary toast notification to the user.

        Documentation
        ----------
        https://docs.composehq.com/page-actions/toast

        Parameters
        ----------
        message : `str`
            The message to display in the toast.

        title : `str`, optional
            The title of the toast.

        appearance : 'success' | 'error' | 'warning' | 'info', optional
            Visual style of the toast. Defaults to "info".

        duration : 'shortest' | 'short' | 'medium' | 'long' | 'longest' | 'infinite', optional
            How long to display the toast. Defaults to "medium".

        Examples
        ----------
        >>> # Success toast
        ... page.toast("Item saved!", appearance="success")
        ...
        >>> # Error toast with title
        ... page.toast(
        ...     "Please try again",
        ...     title="Error",
        ...     appearance="error",
        ...     duration="long"
        ... )
        """
        if self.__debug:
            Debug.log("Page", "toast")

        # Pass None if the default value is used so that we know not to send
        # that property over to the browser.
        _appearance = appearance if appearance is not DEFAULT_TOAST_APPEARANCE else None
        _duration = duration if duration is not DEFAULT_TOAST_DURATION else None

        self.__appRunner.scheduler.create_task(
            self.__appRunner.toast(message, title, _appearance, _duration)
        )

    def set_inputs(self, values: Dict[str, Any]) -> None:
        """
        Set the values of one or more inputs.

        Documentation
        ----------
        https://docs.composehq.com/page-actions/set-inputs

        Parameters
        ----------
        values : `Dict[str, Any]`
            Dictionary with input IDs as keys and new values as values.

        Examples
        ----------
        >>> # Set multiple input values
        ... page.set_inputs({
        ...     "name": "John Doe",
        ...     "email": "john@example.com",
        ...     "active": True
        ... })
        """
        if self.__debug:
            Debug.log("Page", "set inputs")

        self.__appRunner.scheduler.create_task(self.__appRunner.set_inputs(values))

    def loading(
        self,
        value: bool,
        *,
        text: Union[str, None] = None,
        disable_interaction: Union[bool, None] = None,
    ) -> None:
        """
        Display a loading indicator on the page.

        Documentation
        ----------
        https://docs.composehq.com/page-actions/loading

        Parameters
        ----------
        value : `bool`
            True to show the indicator, False to hide it.

        text : `str`, optional
            Text to display next to the loading indicator.

        disable_interaction : `bool`, optional
            Disable all user interaction on the page while loading.

        Examples
        ----------
        >>> # Show loading with text
        ... page.loading(True, text="Saving...")
        ... long_operation()
        ... page.loading(False)
        ...
        >>> # Disable interaction while loading
        ... page.loading(True, disable_interaction=True)
        ... long_operation()
        ... page.loading(False)
        ...
        >>> # Multi-step loading
        ... page.loading(True, text="Processing...")
        ... long_operation()
        ... page.loading(True, text="Saving to disk...")
        ... long_operation()
        ... page.loading(False)
        """
        if self.__debug:
            Debug.log("Page", "loading")

        self.__appRunner.scheduler.create_task(
            self.__appRunner.page_loading(value, text, disable_interaction)
        )

    def update(self) -> None:
        """
        Rerender the UI to reflect the latest data.

        Documentation
        ----------
        https://docs.composehq.com/page-actions/update

        Notes
        ----------
        For changes to be detected, you must reassign variables that
        are passed to UI components entirely instead of modifying nested
        properties.

        Examples
        ----------
        >>> # Update after changing data
        ... count = 0
        ... page.add(lambda: ui.text(f"Count: {count}"))
        ... count += 1
        ... page.update()
        """
        if self.__debug:
            Debug.log("Page", "update")

        self.__state.merge({})
