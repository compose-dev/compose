from ...ui import ComponentReturn, INTERACTION_TYPE


def apply_ids(layout: ComponentReturn, id_map: dict[str, str]) -> ComponentReturn:
    if layout["model"]["id"] in id_map:
        layout["model"]["id"] = id_map[layout["model"]["id"]]

    if layout["interactionType"] == INTERACTION_TYPE.LAYOUT:
        if isinstance(layout["model"]["children"], list):
            layout["model"]["children"] = [
                apply_ids(child, id_map) for child in layout["model"]["children"]
            ]
        else:
            layout["model"]["children"] = apply_ids(layout["model"]["children"], id_map)

    return layout
