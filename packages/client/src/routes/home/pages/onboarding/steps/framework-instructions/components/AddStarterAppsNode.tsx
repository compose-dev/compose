import { Code } from "~/components/code";
import { InlineCode } from "~/components/inline-code";
import FrameworkStep from "./FrameworkStep";

const CREATE_COMPOSE_FILE = `# From your project root
touch src/compose.ts`;

const CREATE_COMPOSE_FILE_NESTJS = `mkdir -p src/compose
touch src/compose/compose.module.ts
touch src/compose/compose.service.ts`;

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

const STARTER_CODE_NESTJS = (
  apiKey: string | null
) => `import { Injectable, OnModuleInit } from '@nestjs/common';
import { Compose } from '@composehq/sdk';

// For demo purposes. In a real app, you'd use your actual database.
const dbUsers = [
  { name: 'John Doe', email: 'john@doe.com' },
  { name: 'Jane Smith', email: 'jane@smith.com' },
];

@Injectable()
export class ComposeService implements OnModuleInit {
  // Hook into NestJS lifecycle to start the Compose client once all modules are loaded.
  onModuleInit() {
    const nav = new Compose.Navigation(['view-users', 'create-user']);

    const viewUsersApp = new Compose.App({
      route: 'view-users',
      navigation: nav,
      handler: ({ page, ui }) => {
        page.add(() => ui.header('View Users', { size: 'lg' }));
        const users = [...dbUsers]; // fake database call
        page.add(() => ui.table('users-table', users));
      },
    });

    const createUserApp = new Compose.App({
      route: 'create-user',
      navigation: nav,
      handler: ({ page, ui }) => {
        page.add(() => ui.header('Create User', { size: 'lg' }));
        page.add(() =>
          ui.form(
            'create-user-form',
            [ui.textInput('name'), ui.emailInput('email')],
            {
              onSubmit: (form) => {
                dbUsers.push({ name: form.name, email: form.email });
                page.toast('User created successfully', {
                  appearance: 'success',
                });
                page.link('view-users');
              },
            },
          ),
        );
      },
    });

    const client = new Compose.Client({
      apiKey: '${apiKey || "API_KEY_HERE"}',${apiKey ? "" : " // replace with your own API key"}
      apps: [viewUsersApp, createUserApp],
    });

    client.connect();
  }
}`;

const COMPOSE_MODULE_NESTJS = `import { Module } from '@nestjs/common';
import { ComposeService } from './compose.service';

@Module({
  providers: [ComposeService],
  exports: [ComposeService],
})
export class ComposeModule {}`;

const APP_MODULE_NESTJS = `import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ComposeModule } from './compose/compose.module';

@Module({
  imports: [ComposeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}`;

function AddStarterAppsNode({
  apiKey,
  type = "default",
}: {
  apiKey: string | null;
  type?: "default" | "new-project" | "nestjs";
}) {
  if (type === "new-project") {
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

  if (type === "nestjs") {
    return (
      <FrameworkStep>
        <h4>2. Add starter code</h4>
        <h6 className="mt-2">Folder structure</h6>
        <p>
          The best way to integrate Compose is via a module that will contain
          all the Compose related code.
        </p>
        <p>
          Create a <InlineCode>compose</InlineCode> folder in your codebase, and
          within it create two files: <InlineCode>compose.module.ts</InlineCode>
          and <InlineCode>compose.service.ts</InlineCode>
        </p>
        <Code code={CREATE_COMPOSE_FILE_NESTJS} lang="bash" />
        <br />
        <h6>
          <InlineCode>compose.service.ts</InlineCode>
        </h6>
        <p>
          Our service will contain the Compose client and starter apps. As you
          build more apps, you can break them out into separate files. Creating
          a service will also allow you to easily import other services and use
          them in your Compose apps.
        </p>
        <Code code={STARTER_CODE_NESTJS(apiKey)} lang="typescript" />
        <br />
        <h6>
          <InlineCode>compose.module.ts</InlineCode>
        </h6>
        <p>Our module will register the service.</p>
        <Code code={COMPOSE_MODULE_NESTJS} lang="typescript" />
        <br />
        <h6>
          <InlineCode>src/app.module.ts</InlineCode>
        </h6>
        <p>Register the Compose module in your main file.</p>
        <Code code={APP_MODULE_NESTJS} lang="typescript" />
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
