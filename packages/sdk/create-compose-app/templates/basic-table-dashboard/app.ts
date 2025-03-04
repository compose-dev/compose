import { Compose } from "@composehq/sdk";

const DOCS_URL =
  "https://docs.composehq.com/get-started/concepts#app-structure";

const usersDashboard = new Compose.App({
  name: "Users Dashboard",
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
  apps: [usersDashboard],
});

client.connect();
