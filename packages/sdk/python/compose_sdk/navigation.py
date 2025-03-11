from typing import List, Optional, TypedDict
from typing_extensions import NotRequired
from .core import Utils


class NavigationConfiguration(TypedDict):
    id: str
    items: List[str]
    logoUrl: NotRequired[Optional[str]]


class Navigation:
    """
    Create a navigation pane that links between apps.

    >>> import compose_sdk as c
    ...
    ... nav = c.Navigation(
    ...     ["home-page", "settings"],
    ...     logo_url="https://composehq.com/dark-logo-with-text.svg",
    ... )
    ...
    ... home_page = c.App(
    ...     route="home-page",
    ...     handler=lambda page, ui: page.add(ui.text("Home Page")),
    ...     navigation=nav, # show nav pane on home page
    ... )
    ...
    ... settings = c.App(
    ...     route="settings",
    ...     handler=lambda page, ui: page.add(ui.text("Settings")),
    ...     navigation=nav, # show nav pane on settings page
    ... )

    Required arguments:
    - `items`: List of app routes to include in the navigation pane

    Optional keyword arguments:
    - `logo_url`: URL to a logo image to display in the navigation pane

    Read the full documentation: https://docs.composehq.com/components/navigation
    """

    def __init__(self, items: List[str], *, logo_url: Optional[str] = None) -> None:
        self._configuration: NavigationConfiguration = {
            "id": Utils.generate_id(),
            "items": items,
        }

        if logo_url:
            self._configuration["logoUrl"] = logo_url

    @property
    def configuration(self) -> NavigationConfiguration:
        return self._configuration
