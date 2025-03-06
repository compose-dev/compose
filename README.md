<p align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://composehq.com/light-logo-with-text.svg" width="480">
  <source media="(prefers-color-scheme: light)" srcset="https://composehq.com/dark-logo-with-text.svg" width="480">
  <img alt="Compose logo" src="https://composehq.com/dark-logo-with-text.svg" width="480">
</picture>
</p>

<p align="center">
    Open-source platform for building custom internal tools
    <br />
    <a href="https://composehq.com">Website</a>
    ·
    <a href="https://docs.composehq.com">Documentation</a>
  </p>

## About

Compose is a dramatically faster way for developers to build custom internal tools.

Compose provides:
- Backend SDKs for TypeScript and Python that expose high-level building blocks like tables, forms, charts, and more that integrate seamlessly with your existing services and logic.
- A hosted web app (composehq.com or self-hosted) that handles auth, permissions, audit logs, and generates exceptionally great UIs for your team.

The examples below show how you can build a dashboard to view and create users in ~20 lines of code.

See the [docs](https://docs.composehq.com) to learn more.

## Examples

### TypeScript

```typescript
import { Compose } from "@composehq/sdk";

new Compose.App({
    name: "Users Dashboard",
    handler: ({ page, ui }) => {
        // Display a table of users
        const users = await database.selectUsers();
        page.add(() => ui.table("users", users))

        // Display a form to create new users
        page.add(() => ui.form(
            "new-user",
            [
                ui.textInput("name"),
                ui.emailInput("email"),
                ui.selectBox("role", ["admin", "user", "guest"]),
            ],
            {
                onSubmit: async (values) => { // fully-typed response
                    await database.createUser(values)
                }
            }
        ))
    }
})
```

### Python

```python
import compose_sdk as c

def handler(page: c.Page, ui: c.UI):
    # Display a table of users
    users = database.select_users()
    page.add(lambda: ui.table("users", users))

    # Display a form to create new users
    page.add(lambda: ui.form(
        "new-user",
        [
            ui.text_input("name"),
            ui.email_input("email"),
            ui.select_box("role", ["admin", "user", "guest"])
        ],
        on_submit=lambda values: database.create_user(values) # fully validated response
    ))

c.App(
    name="Users Dashboard",
    handler=handler
)
```

## Getting started

### Compose Cloud (recommended)

Compose offers a generous free tier that includes unlimited usage for solo-developers, no credit card required. You can sign up at [app.composehq.com](https://app.composehq.com/auth/signup).

### Self-hosted

You can self-host Compose on your own servers for greater control over your data and infrastructure. This guide will walk you through the entire process of running Compose on your own servers.

#### Requirements

Compose requires the following resources to run:
- A postgres database
- A virtual machine that can run the Compose docker image
- Google OAuth2 credentials to enable sign-in with Google

#### Step 1: Clone the repo

Clone the Compose repo.

```bash
git clone https://github.com/composehq/compose.git
```

#### Step 1: Environment variables

- Create a copy of `.env.example` in the root of the repo.
- Rename the copied file to `.env`.
- Fill in the values for the environment variables.

