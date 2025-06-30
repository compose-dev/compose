import { Code } from "~/components/code";
import { InlineCode } from "~/components/inline-code";
import FrameworkStep from "./FrameworkStep";

const CREATE_COMPOSE_FILE = `# From your project root
touch src/compose.ts`;

const STARTER_CODE = (
  apiKey: string | null
) => `import { Compose } from "@composehq/sdk";

const nav = new Compose.Navigation(["view-users", "create-user"])

// For demo purposes. In a real app, you'd use your actual database.
const dbUsers = [
    { name: "John Doe", email: "john@doe.com" },
    { name: "Jane Smith", email: "jane@smith.com" },
]

const viewUsersApp = new Compose.App({
    route: "view-users",
    navigation: nav,
    handler: async ({ page, ui }) => {
        page.add(() => ui.header("View Users", { size: "lg" }))
        const users = [...dbUsers] // fake database call
        page.add(() => ui.table("users-table", users));
    }
})

const createUserApp = new Compose.App({
    route: "create-user",
    navigation: nav,
    handler: async ({ page, ui }) => {
        page.add(() => ui.header("Create User", { size: "lg" }))
        page.add(() => ui.form(
            "create-user-form",
            [
                ui.textInput("name"),
                ui.emailInput("email")
            ],
            {
                onSubmit: async (form) => {
                    dbUsers.push({ name: form.name, email: form.email });
                    page.toast("User created successfully", { appearance: "success" });
                    page.link("view-users");
                }
            }
        ))
    }
})

const composeClient = new Compose.Client({
    apiKey: "${apiKey || "API_KEY_HERE"}",${apiKey ? "" : " // replace with your own API key"}
    apps: [viewUsersApp, createUserApp]
});

export { composeClient };`;

const STARTER_CODE_NEW_PROJECT = (
  apiKey: string | null
) => `import { Compose } from "@composehq/sdk";

const nav = new Compose.Navigation(["view-users", "create-user"])

// For demo purposes. In a real app, you'd use your actual database.
const dbUsers = [
    { name: "John Doe", email: "john@doe.com" },
    { name: "Jane Smith", email: "jane@smith.com" },
]

const viewUsersApp = new Compose.App({
    route: "view-users",
    navigation: nav,
    handler: async ({ page, ui }) => {
        page.add(() => ui.header("View Users", { size: "lg" }))
        const users = [...dbUsers] // fake database call
        page.add(() => ui.table("users-table", users));
    }
})

const createUserApp = new Compose.App({
    route: "create-user",
    navigation: nav,
    handler: async ({ page, ui }) => {
        page.add(() => ui.header("Create User", { size: "lg" }))
        page.add(() => ui.form(
            "create-user-form",
            [
                ui.textInput("name"),
                ui.emailInput("email")
            ],
            {
                onSubmit: async (form) => {
                    dbUsers.push({ name: form.name, email: form.email });
                    page.toast("User created successfully", { appearance: "success" });
                    page.link("view-users");
                }
            }
        ))
    }
})

const client = new Compose.Client({
    apiKey: "${apiKey || "API_KEY_HERE"}",${apiKey ? "" : " // replace with your own API key"}
    apps: [viewUsersApp, createUserApp]
});

client.connect();`;

function AddStarterAppsNode({
  apiKey,
  newProject = false,
}: {
  apiKey: string | null;
  newProject?: boolean;
}) {
  if (newProject) {
    return (
      <FrameworkStep>
        <h4>3. Add starter code</h4>
        <p>
          Create a new file called <InlineCode>index.ts</InlineCode> (or{" "}
          <InlineCode>index.js</InlineCode>) and paste the following starter
          code:
        </p>
        <Code code={STARTER_CODE_NEW_PROJECT(apiKey)} lang="typescript" />
      </FrameworkStep>
    );
  }
  return (
    <FrameworkStep>
      <h4>2. Add starter apps</h4>
      <p>
        Create a new file in your codebase, e.g.{" "}
        <InlineCode>compose.ts</InlineCode>
      </p>
      <Code code={CREATE_COMPOSE_FILE} lang="bash" />
      <p>Then add the following starter code into the file:</p>
      <Code code={STARTER_CODE(apiKey)} lang="typescript" />
    </FrameworkStep>
  );
}

export default AddStarterAppsNode;
