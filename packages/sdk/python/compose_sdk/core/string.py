def prettify_key(key: str, title_case: bool = True) -> str:
    """
    Tries to prettify a key string. Will convert camelCase, snake_case, and dash-case to
    a space-separated string. Will also convert id and uuid to ID and UUID.

    Args:
        `key`: The key to prettify
        `title_case`: Whether to use title case (capitalize first letter of each word). If False, will only capitalize first word. Defaults to `True`.

    Returns:
        The prettified key string
    """
    # Split on camelCase, snake_case, dash-case and spaces
    import re

    words = [w for w in re.split(r"(?=[A-Z][a-z])|_|-|\s", key) if len(w) > 0]

    # Process each word
    result: list[str] = []
    for idx, word in enumerate(words):
        upper_word = word.upper()

        # Preserve acronyms
        if upper_word == word:
            result.append(word)
            continue

        # Handle ID/UUID cases
        if upper_word in ["ID", "UUID"]:
            result.append(upper_word)
            continue

        # Apply capitalization rules
        if title_case or idx == 0:
            result.append(word.capitalize())
        else:
            result.append(word.lower())

    final = " ".join(result)

    # Special case for single letters
    if len(final) == 1:
        return final.upper()

    return final
