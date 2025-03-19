const LANG = {
  typescript: "typescript",
  javascript: "javascript",
  python: "python",
} as const;
type Lang = (typeof LANG)[keyof typeof LANG];

const PROJECT_TYPE = {
  existingProject: "existing-project",
  newProject: "new-project",
} as const;

type ProjectType = (typeof PROJECT_TYPE)[keyof typeof PROJECT_TYPE];

const STEP = {
  langSelect: "lang-select",
  projectTypeSelect: "project-type-select",
  existingProjectDownload: "existing-project-download",
  npxDownload: "npx-download",
  manualDownload: "manual-download",
  apiKeyNpx: "api-key-npx",
  apiKeyManual: "api-key-manual",
  sdkInstalledNpx: "sdk-installed-npx",
  sdkInstalledManual: "sdk-installed-manual",
} as const;

type Step = (typeof STEP)[keyof typeof STEP];

const MANUAL_INSTALL_TS = `# Create a new project
mkdir compose && cd compose
npm init -y

# Enable modern import/export syntax
npm pkg set type=module

# Install the Compose SDK
npm install @composehq/sdk

# Install typescript dependencies
npm install --save-dev typescript tsx
`;

const MANUAL_INSTALL_JS = `# Create a new project
mkdir compose && cd compose
npm init -y

# Enable modern import/export syntax
npm pkg set type=module

# Install the Compose SDK
npm install @composehq/sdk
`;

const MANUAL_INSTALL_PYTHON = `# Create a project folder
mkdir compose && cd compose

# Create a virtual environment
python -m venv .venv

# Activate the virtual environment 
source .venv/bin/activate # mac/linux
.venv\\Scripts\\activate.bat # windows command prompt
.venv\\Scripts\\Activate.ps1 # windows powershell

# Install the Compose SDK
pip install compose-sdk

# Optional: install py-mon to enable live reloading on file change.
pip install py-mon
`;

const APP_CODE_PYTHON = `import compose_sdk as c

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
    page.add(lambda: ui.header("View Users", size="lg"))
    users = [*db_users]  # fake database call
    page.add(lambda: ui.table("users-table", users))


def create_user_handler(page: c.Page, ui: c.UI):
    def on_submit(form):
        db_users.append({"name": form["name"], "email": form["email"]})
        page.toast("User created successfully", appearance="success")
        page.link("view-users")

    page.add(lambda: ui.header("Create User", size="lg"))
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

client.connect()`;

const APP_CODE_TS = `import { Compose } from "@composehq/sdk";

const nav = new Compose.Navigation(["view-users", "create-user"], {
  logoUrl: "https://composehq.com/dark-logo-with-text.svg", // replace with your own logo
});

// fake list of users
const dbUsers = [
  { name: "John Doe", email: "john@doe.com" },
  { name: "Jane Smith", email: "jane@smith.com" },
];

const viewUsersApp = new Compose.App({
  route: "view-users",
  navigation: nav,
  handler: async ({ page, ui }) => {
    page.add(() => ui.header("View Users", { size: "lg" }));
    const users = [...dbUsers]; // fake database call
    page.add(() => ui.table("users-table", users));
  },
});

const createUserApp = new Compose.App({
  route: "create-user",
  navigation: nav,
  handler: async ({ page, ui }) => {
    page.add(() => ui.header("Create User", { size: "lg" }));
    page.add(() =>
      ui.form(
        "create-user-form",
        [ui.textInput("name"), ui.emailInput("email")],
        {
          onSubmit: async (form) => {
            dbUsers.push({ name: form.name, email: form.email });
            page.toast("User created successfully", { appearance: "success" });
            page.link("view-users");
          },
        }
      )
    );
  },
});

const client = new Compose.Client({
  apiKey: "API_KEY_HERE",
  apps: [viewUsersApp, createUserApp],
});

client.connect();`;

const EXPRESS_INTEGRATION_TS = `import express from "express";
import { composeClient } from "./compose";

const app = express();

app.listen(3000, () => {
    console.log("Server is running on port 3000");
    // Connect to your team's Compose web dashboard.
    composeClient.connect();
});`;

const FLASK_INTEGRATION_PY = `# Example Flask server
from flask import Flask
from compose import compose_client

# Connect to your team's Compose web dashboard.
compose_client.connect_async()

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"`;

export {
  MANUAL_INSTALL_TS,
  MANUAL_INSTALL_JS,
  MANUAL_INSTALL_PYTHON,
  APP_CODE_PYTHON,
  APP_CODE_TS,
  EXPRESS_INTEGRATION_TS,
  FLASK_INTEGRATION_PY,
  LANG,
  type Lang,
  STEP,
  type Step,
  PROJECT_TYPE,
  type ProjectType,
};
