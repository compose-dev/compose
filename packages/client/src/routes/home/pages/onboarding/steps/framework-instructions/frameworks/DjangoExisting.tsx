import { Code } from "~/components/code";
import AddStarterAppsPython from "../components/AddStarterAppsPython";
import FrameworkStep from "../components/FrameworkStep";
import InstallPackagePython from "../components/InstallPackagePython";
import RunYourAppPython from "../components/RunYourAppNode copy";
import StartClientPython from "../components/StartClientPython";

const START_COMPOSE_CLIENT_CODE = `from django.apps import AppConfig
import os
import compose_sdk as c


class ComposeConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'compose'

    def ready(self):
        # Don't start in the auto-reload process
        if os.environ.get("RUN_MAIN") != "true":
            return

        # Do dynamic imports to avoid AppRegistryNotReady errors
        from .starter_apps import view_users_app, create_user_app

        client = c.Client(
            api_key="API_KEY_HERE",
            apps=[view_users_app, create_user_app]
        )

        client.connect_async()`;

function CreateDjangoApp() {
  return (
    <FrameworkStep>
      <h4>2. Create a new Django app</h4>
      <p>
        Creating a separate Django app for Compose will help organize your code
        better.
      </p>
      <Code code={`python manage.py startapp compose`} lang="bash" />
    </FrameworkStep>
  );
}

function DjangoExisting({ apiKey }: { apiKey: string | null }) {
  return (
    <>
      <InstallPackagePython />
      <CreateDjangoApp />
      <AddStarterAppsPython
        apiKey={apiKey}
        framework="django"
        sectionNumber={3}
      />
      <StartClientPython
        code={START_COMPOSE_CLIENT_CODE}
        django
        sectionNumber={4}
      />
      <RunYourAppPython
        label="Start your Django server"
        command="python manage.py runserver"
        sectionNumber={5}
      />
    </>
  );
}

export default DjangoExisting;
