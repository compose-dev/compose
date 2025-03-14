import compose_sdk as c

nav = c.Navigation(
    ["view-users", "create-user"],
    logo_url="https://composehq.com/dark-logo-with-text.svg",  # replace with your own logo
)

# fake list of users
db_users = [
    {"name": "John Doe", "email": "john@doe.com"},
    {"name": "Jane Smith", "email": "jane@smith.com"},
]


def view_users_handler(page: c.Page, ui: c.UI):
    users = [*db_users]  # fake database call
    page.add(lambda: ui.table("users-table", users))


def create_user_handler(page: c.Page, ui: c.UI):
    def on_submit(form):
        db_users.append({"name": form["name"], "email": form["email"]})
        page.toast("User created successfully", appearance="success")
        page.link("view-users")

    page.add(
        lambda: ui.form(
            "create-user-form",
            [ui.text_input("name"), ui.email_input("email")],
            on_submit=on_submit,
        )
    )


client = c.Client(
    api_key="API_KEY_HERE",
    apps=[
        c.App(route="view-users", navigation=nav, handler=view_users_handler),
        c.App(route="create-user", navigation=nav, handler=create_user_handler),
    ],
)

client.connect()
