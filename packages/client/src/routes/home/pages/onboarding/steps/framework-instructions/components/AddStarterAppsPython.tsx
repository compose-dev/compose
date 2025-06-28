import { Code } from "~/components/code";
import { InlineCode } from "~/components/inline-code";
import FrameworkStep from "./FrameworkStep";

const STARTER_CODE = (apiKey: string | null) => `import compose_sdk as c

# For demo purposes. In a real app, you'd use your actual database.
db_users = [
    { "name": "John Doe", "email": "john@doe.com" },
    { "name": "Jane Smith", "email": "jane@smith.com" },
]

def view_users_handler(page: c.Page, ui: c.UI):
    page.add(lambda: ui.header("View Users", size="lg"))
    users = [*db_users] # fake database call
    page.add(lambda: ui.table("users-table", users))

def create_user_handler(page: c.Page, ui: c.UI):
    def on_submit(form):
        db_users.append({ "name": form["name"], "email": form["email"] })
        page.toast("User created successfully", appearance="success")
        page.link("view-users")

    page.add(lambda: ui.header("Create User", size="lg"))
    page.add(lambda: ui.form(
        "create-user-form",
        [
            ui.text_input("name"),
            ui.email_input("email")
        ],
        on_submit=on_submit
    ))

nav = c.Navigation(["view-users", "create-user"])

compose_client = c.Client(
    api_key="${apiKey || "API_KEY_HERE"}",${apiKey ? "" : " # replace with your own API key"}
    apps=[
        c.App(route="view-users", nav=nav, handler=view_users_handler),
        c.App(route="create-user", nav=nav, handler=create_user_handler)
    ]
)`;

const DJANGO_STARTER_CODE = `import compose_sdk as c

# For demo purposes. In a real app, you'd use your actual database.
db_users = [
    { "name": "John Doe", "email": "john@doe.com" },
    { "name": "Jane Smith", "email": "jane@smith.com" },
]

def view_users_handler(page: c.Page, ui: c.UI):
    page.add(lambda: ui.header("View Users", size="lg"))
    users = [*db_users] # fake database call
    page.add(lambda: ui.table("users-table", users))

def create_user_handler(page: c.Page, ui: c.UI):
    def on_submit(form):
        db_users.append({ "name": form["name"], "email": form["email"] })
        page.toast("User created successfully", appearance="success")
        page.link("view-users")

    page.add(lambda: ui.header("Create User", size="lg"))
    page.add(lambda: ui.form(
        "create-user-form",
        [
            ui.text_input("name"),
            ui.email_input("email")
        ],
        on_submit=on_submit
    ))


nav = c.Navigation(["view-users", "create-user"])

view_users_app = c.App(route="view-users", nav=nav, handler=view_users_handler)
create_user_app = c.App(route="create-user", nav=nav, handler=create_user_handler)`;

const MANUAL_INSTALL_STARTER_CODE = (
  apiKey: string | null
) => `import compose_sdk as c

# For demo purposes. In a real app, you'd use your actual database.
db_users = [
    { "name": "John Doe", "email": "john@doe.com" },
    { "name": "Jane Smith", "email": "jane@smith.com" },
]

def view_users_handler(page: c.Page, ui: c.UI):
    page.add(lambda: ui.header("View Users", size="lg"))
    users = [*db_users] # fake database call
    page.add(lambda: ui.table("users-table", users))

def create_user_handler(page: c.Page, ui: c.UI):
    def on_submit(form):
        db_users.append({ "name": form["name"], "email": form["email"] })
        page.toast("User created successfully", appearance="success")
        page.link("view-users")

    page.add(lambda: ui.header("Create User", size="lg"))
    page.add(lambda: ui.form(
        "create-user-form",
        [
            ui.text_input("name"),
            ui.email_input("email")
        ],
        on_submit=on_submit
    ))

nav = c.Navigation(["view-users", "create-user"])

client = c.Client(
    api_key="${apiKey || "API_KEY_HERE"}",${apiKey ? "" : " # replace with your own API key"}
    apps=[
        c.App(route="view-users", navigation=nav, handler=view_users_handler),
        c.App(route="create-user", navigation=nav, handler=create_user_handler)
    ]
)

client.connect()`;

function AddStarterAppsPython({
  apiKey,
  framework = "default",
  sectionNumber = 2,
}: {
  apiKey: string | null;
  framework?: "default" | "django" | "manual-install";
  sectionNumber?: number;
}) {
  if (framework === "manual-install") {
    return (
      <FrameworkStep>
        <h4>{sectionNumber}. Add starter code</h4>
        <p>
          Create a new file called <InlineCode>app.py</InlineCode> and paste the
          following code:
        </p>
        <Code code={MANUAL_INSTALL_STARTER_CODE(apiKey)} lang="python" />
      </FrameworkStep>
    );
  }

  if (framework === "django") {
    return (
      <FrameworkStep>
        <h4>{sectionNumber}. Add starter apps</h4>
        <p>
          In the <InlineCode>compose</InlineCode> folder that you just created,
          create a new file called <InlineCode>starter_apps.py</InlineCode>, and
          add the following:
        </p>
        <Code code={DJANGO_STARTER_CODE} lang="python" />
      </FrameworkStep>
    );
  }

  return (
    <FrameworkStep>
      <h4>{sectionNumber}. Add starter apps</h4>
      <p>
        Create a new file in your codebase where you'll add your Compose apps,
        e.g. <InlineCode>compose.py</InlineCode>, and paste the following code:
      </p>
      <Code code={STARTER_CODE(apiKey)} lang="python" />
    </FrameworkStep>
  );
}

export default AddStarterAppsPython;
