const LANG = {
  typescript: "typescript",
  javascript: "javascript",
  python: "python",
} as const;
type Lang = (typeof LANG)[keyof typeof LANG];

const STEP = {
  langSelect: "lang-select",
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
    apps=[
        c.App(route="users-dashboard", handler=users_dashboard)
    ],
)

client.connect()`;

const APP_CODE_TS = `import { Compose } from "@composehq/sdk"

const DOCS_URL =
  "https://docs.composehq.com/get-started/concepts#app-structure";

const usersDashboard = new Compose.App({
  route: "users-dashboard",
  handler: ({ page, ui }) => {
    const users = [
      { id: 1, name: "Lisa Su", isApproved: true },
      { id: 2, name: "Jensen Huang", isApproved: false },
      { id: 3, name: "Brian Chesky", isApproved: true },
    ];

    page.add(() =>
      ui.distributedRow([
        ui.header("Users Dashboard"),
        ui.button("See what's possible", {
          onClick: () => page.link(DOCS_URL, { newTab: true }),
        }),
      ])
    );
    page.add(() => ui.text("Open your source code to view this app's code..."));
    page.add(() => ui.table("table-id", users));
  },
});

const client = new Compose.Client({
    apiKey: "API_KEY_HERE",
    apps: [usersDashboard]
});

client.connect();`;

export {
  MANUAL_INSTALL_TS,
  MANUAL_INSTALL_JS,
  MANUAL_INSTALL_PYTHON,
  APP_CODE_PYTHON,
  APP_CODE_TS,
  LANG,
  type Lang,
  STEP,
  type Step,
};
