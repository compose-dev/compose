import compose_sdk as c

DOCS_URL = "https://docs.composehq.com/get-started/concepts#app-structure"


def users_dashboard(page: c.Page, ui: c.UI):
    users = [
        {"id": 1, "name": "Lisa Su", "is_approved": True},
        {"id": 2, "name": "Jensen Huang", "is_approved": False},
        {"id": 3, "name": "Brian Chesky", "is_approved": True},
    ]

    page.add(
        lambda: ui.distributed_row(
            [
                ui.header("Users Dashboard"),
                ui.button(
                    "See what's possible",
                    on_click=lambda: page.link(DOCS_URL, new_tab=True),
                ),
            ]
        )
    )
    page.add(lambda: ui.text("Open your source code to view this app's code..."))
    page.add(lambda: ui.table("table-id", users))


client = c.Client(
    api_key="API_KEY_HERE",
    apps=[c.App("Users Dashboard", users_dashboard, route="users-dashboard")],
)

client.connect()
