# A completely made up suffix that we use to make sure our autogenerated
# routes don't conflict with user-provided routes.
AUTOGEN_SUFFIX = "auto-suffix"


def add_auto_generation_suffix(name: str) -> str:
    return f"{name}-{AUTOGEN_SUFFIX}"


def format_route(route: str) -> str:
    """
    Format a user-provided route to be used as a Compose route.

    Does the following:
    - Replaces spaces with hyphens
    - Converts to lowercase
    - Removes all leading forward slashes

    Note: lstrip("/") will remove all consecutive forward slashes at the start of the string.
    """
    return route.strip().replace(" ", "-").lower().lstrip("/")


def is_valid_route(route: str) -> bool:
    """
    Check if a route is valid.
    """
    if not route or not isinstance(route, str):  # type: ignore[unused-ignore]
        raise ValueError("Invalid route, should be a string")

    if len(route) > 250:
        raise ValueError("Routes cannot be longer than 250 characters")

    valid_chars = set("abcdefghijklmnopqrstuvwxyz0123456789-")

    if not all(c in valid_chars for c in route):
        raise ValueError(
            "Routes can only contain lowercase alphanumeric characters and hyphens"
        )

    if route.startswith("-") or route.endswith("-"):
        raise ValueError("Routes cannot start or end with a hyphen")

    return True
