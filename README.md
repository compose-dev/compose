<p align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://composehq.com/light-logo-with-text.svg" width="480">
  <source media="(prefers-color-scheme: light)" srcset="https://composehq.com/dark-logo-with-text.svg" width="480">
  <img alt="Compose logo" src="https://composehq.com/dark-logo-with-text.svg" width="480">
</picture>
</p>

<p align="center">
    Open-source platform for building custom internal tools fast
    <br />
    <a href="https://composehq.com">Website</a>
    ·
    <a href="https://docs.composehq.com">Documentation</a>
  </p>

## About

Compose is an open-source platform that makes it dramatically faster for developers to build and share internal tools with their team - without leaving their codebase.

The platform has two parts:
- Build internal tools with just backend code using our SDKs for Python and TypeScript.
- Use and share those tools via your team's Compose web dashboard.

Here's a simple tool that displays a table of users from your database:

#### TypeScript
```typescript
import { Compose } from "@composehq/sdk";
import { database } from "../database";

const viewUsersApp = new Compose.App({
    route: "view-users",
    handler: async ({ page, ui }) => {
        const users = await database.selectUsers() // query your database
        page.add(() => ui.table("users-table", users)); // display results in a table
    }
})
```

#### Python
```python
import compose_sdk as c
from database import database

def view_users_handler(page: c.Page, ui: c.UI):
    users = database.select_users() # query your database
    page.add(lambda: ui.table("users-table", users)) # display results in a table

view_users_app = c.App(route="view-users", handler=view_users_handler)
```

#### Result in the Compose web dashboard

<img src="https://raw.githubusercontent.com/compose-dev/compose/refs/heads/main/docs/readme-table-example.png" style="margin-top: 16px; margin-bottom: 16px; max-height: 400px; border-radius: 8px;">

**The Compose SDK** includes tables, forms, charts, file uploads, and 40+ other components to build whatever you need in just a few lines of code. Since the SDK is installed into your backend, connecting these components to your own data and logic is as easy as importing functions and calling them within the Compose Apps that you define.

**The Compose web dashboard** renders beautiful, responsive UIs for your tools and enables you to share them with your entire team. It also includes audit logs, RBAC, and other useful features to manage your tools without any configuration on your end.

Under the hood, the web dashboard maintains a secure, proxied websocket connection to the Compose SDK to run the tools you build.

Compose's biggest benefit is speed and simplicity, but it's also fully featured and scales to support complex, reactive, multi-page tools when you need it.

See the [docs](https://docs.composehq.com) to learn more.

## Getting started

### Compose Cloud (recommended)

Compose offers a generous free tier that includes unlimited usage for solo-developers, no credit card required. You can sign up at [app.composehq.com](https://app.composehq.com/auth/signup).

### Self-hosted

You can self-host Compose on your own servers for greater control over your data and infrastructure. Read the [self-hosting guide](https://github.com/compose-dev/compose/blob/main/SELF_HOSTING.md) for instructions on how to set it up.

