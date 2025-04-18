# Self-host Compose

You can easily self-host Compose on your own servers for greater control over your infrastructure. This guide will walk you through the entire process of setting up Compose on your servers.

Support is available on the Compose [Discord server](https://discord.gg/82rk2N8ZE6).

## Step-by-step guide

### Prerequisites

Compose requires the following resources to run:
- A postgres database
- A virtual machine that can run the Compose docker image
- Google OAuth2 credentials to enable sign-in with Google

### Step 1: Provision resources

Choose a hosting provider (AWS, GCP, Render, etc.) and provision the following resources:

- A Postgres database.
- A virtual machine with at least 2GB of ram. The virtual machine will run the Compose docker image.

Ensure that resources are provisioned in the same region to prevent unecessary latency.

#### SSL-enabled domain

The virtual machine should be configured with an SSL-enabled domain (i.e. the domain you'll be hosting the web app at). This is because both the browser and Compose SDK will only connect to the server using a secure, encrypted connection.

Providers like Render and Railway automatically provide custom, SSL-enabled domains for web services. For other providers, we recommend putting a load balancer in front of the virtual machine that does SSL termination.

### Step 2: Obtain Google OAuth2 credentials

To use Google as a social provider, you need to obtain OAuth2 credentials from the [Google Cloud Console](https://console.cloud.google.com/apis/dashboard).

When creating the OAuth2 credentials, you'll need to specify the following:

- Redirect URIs: `https://<your-domain>/auth/google-oauth/redirect`
- JavaScript Origins: `https://<your-domain>`

We'll use the client ID and client secret later when configuring environment variables.

### Step 3: Run database migrations

Run all the [database migrations](https://github.com/compose-dev/compose/tree/main/db-migrations) on the database to bring it up to date with the current schema. The easiest way to do this is to connect to your database through the terminal and run all the migrations at once using the `all.sql` file. For example:

```bash
psql <database-url> -f all.sql
```

### Step 4: Configure environment variables

Configure environment variables based on instructions from your hosting provider so that they're available to the virtual machine's docker container at runtime.

You can find a list of all the environment variables needed to run Compose in the [.env.example file](https://github.com/compose-dev/compose/blob/main/.env.example).

Here's a quick rundown of what each of the environment variables do:

- `NODE_ENV`: Set to `production`.
- `POSTGRES_USER`: The username for the postgres database, obtained when provisioning the database.
- `POSTGRES_PASSWORD`: The password for the postgres database, obtained when provisioning the database.
- `POSTGRES_DB`: The name of the postgres database, obtained when provisioning the database.
- `POSTGRES_HOSTNAME`: The hostname for the postgres database, obtained when provisioning the database.
- `POSTGRES_PORT`: The port for the postgres database, obtained when provisioning the database.
- `PROD_API_KEY_SECRET`: A secret key to use when generating production API keys.
- `DEV_API_KEY_SECRET`: A secret key to use when generating development API keys.
- `GOOGLE_OAUTH_CLIENT_ID`: The client ID for the Google OAuth2 credentials.
- `GOOGLE_OAUTH_CLIENT_SECRET`: The client secret for the Google OAuth2 credentials.

`PROD_API_KEY_SECRET` and `DEV_API_KEY_SECRET` are both used by the server to securely generate API keys for users. `PROD_API_KEY_SECRET` should be a random 64 byte string, and `DEV_API_KEY_SECRET` should be a random 32 byte string.

If you're on a Unix-like system, you can generate these secrets using the following commands:

```bash
# For PROD_API_KEY_SECRET
openssl rand -hex 64

# For DEV_API_KEY_SECRET
openssl rand -hex 32
```

You can also pass an optional `BUILD_VERSION` environment variable. This should be a unique value for each deployment of the server and enables the server to gracefully terminate websocket connections when a new deployment is detected. Learn more about this in the notes section below.

### Step 5: Deploy the Docker image

Use the Dockerfile that's located in the root of the repository to build the Docker image.

### Step 6: Configure the Compose SDK

The last step is to configure the Compose SDK to connect to your self-hosted server, which you can do by passing the `host` parameter to the client constructor.

#### Python

```python
client = c.Client(
    api_key="your_api_key",
    host="example.com"
)
```

#### TypeScript/JavaScript

```typescript
const client = new Compose.Client({
    apiKey: "your_api_key",
    host: "example.com"
})
```

Don't include the protocol (e.g. `wss://`) or path (e.g. `/api/v1`) in this value.

Note: if you're having trouble connecting, you can enable `debug` mode to get better error messages in your console.

### Step 7: Upgrade to the Pro plan

Once you have Compose running and you've created an account, go to the settings page from the homepage and click "upgrade to pro". In the open-source build, Compose will automatically upgrade that account to the Pro plan, which will enable you to use the full Compose feature set.

Note: refresh the page after clicking "upgrade to pro" to confirm the upgrade.

## Maintenance

Compose is under active development. We recommend regularly checking and applying the latest updates from the main branch of the repository to your self-hosted deployment. Also check the following when upgrading:

- Any new database migrations (to date, all migrations are idempotent, so you don't need to track which migrations have already been applied)
- Any new versions to the Compose SDK (in general, always upgrade the SDK to the most recent version after upgrading the server)
- Any new environment variables

If you're looking for additional support and assistance with your self-hosted deployment, we offer a high priority dedicated support plan. Reach out to us at atul@composehq.com to learn more.

## Local Development

Local development is quite similar to the normal self-hosting guide.

1. Get a Postgres database up and running. You can use Docker to run a local Postgres instance.
2. Run the database migrations on the local database
3. Configure the environment variables.
4. Clone the repository and run `pnpm install` to install dependencies.
5. Run `pnpm run build:compose-app` to create local builds of all the packages. This is necessary since the monorepo contains internal packages that are consumed by the client and server, and thus need to be built locally.
6. Run `pnpm --filter server run dev` to start the Node server.
7. Run `pnpm --filter client run dev` to start the React client.
8. In order to get the SDK to connect to the local server, you'll need to pass a local development flag to the constructor.


#### Python

```python
client = c.Client(
    api_key="your_api_key",
    DANGEROUS_ENABLE_DEV_MODE=True
)
```

#### TypeScript/JavaScript

```typescript
const client = new Compose.Client({
    apiKey: "your_api_key",
    // @ts-expect-error this field is intentionally hidden from typescript
    DANGEROUS_ENABLE_DEV_MODE: true,
})
```

Running the SDK in dev mode will disable SSL verification and prompt the SDK to connect to `localhost:8080`, which is the default port for the local server.

## Notes

#### Build version

Since the Compose server acts as a proxy between the browser and Compose SDK, it's important that websocket connections are transferred gracefully during deployments.

To faciliate this, we use a `BUILD_VERSION` environment variable that is used to identify the active deployment. When a new deployment is detected, the old deployment begins a process to inform all connected clients to terminate their existing connections and reconnect after a brief delay. This helps clients differentiate between unexpected disconnections and normal server restarts.

Websocket clients will still reconnect during the deployment process without the above process, but may show error messages during the reconnection process.

#### SDK versions

Compose SDK versions are tightly coupled to the Compose server version. When self-hosting, you should pin the SDK version and avoid upgrading until you've upgraded the server to the most recent version.