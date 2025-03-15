import { useEffect, useMemo } from "react";
import { api } from "~/api";
import { Code } from "~/components/code";
import { DashedWrapper } from "~/components/dashed-wrapper";
import { Favicon } from "~/components/favicon";
import { fetcher } from "~/utils/fetcher";
import { theme } from "~/utils/theme";
import { Lang, PROJECT_TYPE } from "./constants";
import {
  FooterActions,
  LanguageSelect,
  ManualInstall,
  ProjectTypeSelect,
  ExistingProjectInstall,
} from "./components";
import { motion } from "motion/react";
import Icon from "~/components/icon";
import Button from "~/components/button";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ConnectionStatus, useWSContext, WSProvider } from "~/utils/wsContext";
import { ServerToBrowserEvent } from "@compose/ts";
import { Spinner } from "~/components/spinner";
import { classNames } from "~/utils/classNames";

function CodeInline({ children }: { children: React.ReactNode }) {
  return (
    <code className="text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950 px-1 py-0.5 rounded-md">
      {children}
    </code>
  );
}

function NpxInstruction({ lang }: { lang: Lang | null }) {
  if (lang === "typescript") {
    return (
      <p>
        Run the following <CodeInline>npx</CodeInline> command in your terminal.
        It will create a fresh TypeScript Node.js project, install the SDK, and
        add a basic ~10 line Compose app.
      </p>
    );
  }

  if (lang === "javascript") {
    return (
      <p>
        Run the following <CodeInline>npx</CodeInline> command in your terminal.
        It will create a fresh Node.js project, install the SDK, and add a basic
        ~10 line Compose app.
      </p>
    );
  }

  if (lang === "python") {
    return (
      <p>
        Run the following <CodeInline>npx</CodeInline> command in your terminal.
        It will create a fresh Python project, install the SDK, and add a basic
        ~10 line Compose app.
      </p>
    );
  }

  throw new Error(`Invalid language: ${lang}`);
}

function getNpxInstallCommand(lang: Lang | null, apiKey: string | null) {
  let command = `npx @composehq/create@latest`;

  if (lang) {
    command += ` --lang=${lang}`;
  }

  if (apiKey) {
    command += ` --api-key=${apiKey}`;
  }

  return command;
}

function StepContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="flex flex-col gap-8 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="flex flex-row items-center space-x-2"
    >
      <Icon name="arrow-back-up" />
      <p>Back</p>
    </Button>
  );
}

function InteractiveOnboarding() {
  theme.use();

  const {
    connectionStatus,
    setEnvironmentOnline,
    setEnvironmentsOnline,
    addWSListener,
  } = useWSContext();

  const navigate = useNavigate({ from: "/start" });
  const { lang, step, projectType } = useSearch({ from: "/start" });

  const { data, refetch } = fetcher.use(api.routes.getUserDevEnvironment, {
    initialData: { environments: [] },
  });

  const apiKey = useMemo(() => {
    return data && data.environments.length > 0
      ? data.environments[0].decryptableKey
      : null;
  }, [data]);

  function getAppRoute() {
    if (!data || data.environments.length === 0) {
      return null;
    }

    const environmentId = data.environments[0].id;
    const apps = data.environments[0].apps;

    if (apps.length === 0) {
      return null;
    }

    return {
      environmentId,
      appRoute: apps[0].route,
    };
  }
  const appRoute = getAppRoute();

  const isConnected =
    Object.values(connectionStatus).length > 0 &&
    Object.values(connectionStatus).every(
      (status) => status === ConnectionStatus.TYPE.ONLINE
    );

  useEffect(() => {
    function listener(data: ServerToBrowserEvent.Data) {
      if (
        data.type ===
        ServerToBrowserEvent.TYPE.REPORT_ACTIVE_COMPANY_CONNECTIONS
      ) {
        setEnvironmentsOnline(data.connections);
      }
      if (
        data.type === ServerToBrowserEvent.TYPE.SDK_CONNECTION_STATUS_CHANGED
      ) {
        setEnvironmentOnline(data.environmentId, data.isOnline);
      }
      if (data.type === ServerToBrowserEvent.TYPE.ENVIRONMENT_INITIALIZED) {
        refetch();
      }
    }

    const destroy = addWSListener(listener);

    return destroy;
  }, [addWSListener, setEnvironmentsOnline, setEnvironmentOnline, refetch]);

  useEffect(() => {
    api.routes.logEvent({
      event: "INTERACTIVE_ONBOARDING_STEP",
      data: {
        step,
        lang: lang || "no-lang",
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const npxInstallCommand = getNpxInstallCommand(lang, apiKey);

  const header =
    step === "lang-select"
      ? "Onboarding"
      : step === "existing-project-download"
        ? "Download the SDK"
        : step === "npx-download"
          ? "Install the SDK"
          : step === "manual-download"
            ? "Manual install"
            : step === "sdk-installed-npx" || step === "sdk-installed-manual"
              ? "Run your app"
              : step === "api-key-npx" || step === "api-key-manual"
                ? "Get an API key"
                : "Onboarding";

  return (
    <DashedWrapper footer={<FooterActions />}>
      <div
        className={classNames(
          "flex items-center justify-center flex-col gap-8 text-brand-neutral",
          {
            "max-w-2xl":
              step === "existing-project-download" ||
              step === "manual-download",
            "max-w-xl":
              step !== "existing-project-download" &&
              step !== "manual-download",
          }
        )}
      >
        <Favicon className="w-10 h-10" />{" "}
        <h3 className="font-medium text-2xl text-center">{header}</h3>
        {/* STEP 1: Platform Selection */}
        {step === "lang-select" && (
          <StepContainer>
            <LanguageSelect
              setLang={(lang) => {
                navigate({
                  search: {
                    lang,
                    step: "project-type-select",
                    projectType,
                  },
                });
              }}
            />
          </StepContainer>
        )}
        {/* STEP 2: Project Type Selection */}
        {step === "project-type-select" && (
          <StepContainer>
            <BackButton
              onClick={() => {
                navigate({
                  search: {
                    lang: null,
                    step: "lang-select",
                    projectType: null,
                  },
                });
              }}
            />
            <ProjectTypeSelect
              setProjectType={(projectType) => {
                navigate({
                  search: {
                    lang,
                    step:
                      projectType === PROJECT_TYPE.existingProject
                        ? "existing-project-download"
                        : "npx-download",
                    projectType,
                  },
                });
              }}
            />
          </StepContainer>
        )}
        {/* STEP 3.A: Existing Project Download */}
        {step === "existing-project-download" && (
          <StepContainer>
            <BackButton
              onClick={() =>
                navigate({
                  search: (prev) => ({
                    ...prev,
                    step: "project-type-select",
                    projectType: null,
                  }),
                })
              }
            />
            <ExistingProjectInstall
              lang={lang}
              apiKey={apiKey}
              onSuccess={() => {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    step: apiKey ? "sdk-installed-npx" : "api-key-npx",
                  }),
                });
              }}
            />
          </StepContainer>
        )}
        {/* STEP 3.B: NPX Download */}
        {step === "npx-download" && (
          <StepContainer>
            <BackButton
              onClick={() => {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    step: "project-type-select",
                    projectType: null,
                  }),
                });
              }}
            />
            <NpxInstruction lang={lang} />
            <Code code={npxInstallCommand} lang="bash" />
            {lang === "python" && (
              <p>
                If you don't have <CodeInline>npx</CodeInline> on your machine,
                you can always install the SDK manually.
              </p>
            )}
            <div className="flex flex-row space-x-4">
              <Button
                variant="outline"
                onClick={() =>
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      step: "manual-download",
                    }),
                  })
                }
                className="w-full"
              >
                Install manually with {lang === "python" ? "pip" : "npm"}
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      step: apiKey ? "sdk-installed-npx" : "api-key-npx",
                    }),
                  })
                }
                className="w-full"
              >
                Ok, I've installed the SDK
              </Button>
            </div>
          </StepContainer>
        )}
        {/* STEP 3.C: Manual Download */}
        {step === "manual-download" && (
          <StepContainer>
            <BackButton
              onClick={() =>
                navigate({
                  search: (prev) => ({
                    ...prev,
                    step: "project-type-select",
                    projectType: null,
                  }),
                })
              }
            />
            <ManualInstall
              lang={lang}
              apiKey={apiKey}
              onSuccess={() => {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    step: apiKey ? "sdk-installed-manual" : "api-key-manual",
                  }),
                });
              }}
            />
          </StepContainer>
        )}
        {/* STEP 4: API Key */}
        {(step === "api-key-npx" || step === "api-key-manual") && (
          <StepContainer>
            <BackButton
              onClick={() =>
                navigate({
                  search: (prev) => ({
                    ...prev,
                    step:
                      projectType === PROJECT_TYPE.existingProject
                        ? "existing-project-download"
                        : step === "api-key-npx"
                          ? "npx-download"
                          : "manual-download",
                  }),
                })
              }
            />
            <p>Get an API key to run your app (it's free).</p>
            <Button
              variant="primary"
              onClick={() => {
                navigate({
                  to: "/auth/signup",
                });
              }}
              className="w-full"
            >
              Get an API key
            </Button>
          </StepContainer>
        )}
        {/* STEP 5: Run your app */}
        {(step === "sdk-installed-npx" || step === "sdk-installed-manual") && (
          <StepContainer>
            <BackButton
              onClick={() => {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    step:
                      projectType === PROJECT_TYPE.existingProject
                        ? "existing-project-download"
                        : step === "sdk-installed-npx"
                          ? "npx-download"
                          : "manual-download",
                  }),
                });
              }}
            />
            <p>
              {projectType === PROJECT_TYPE.existingProject
                ? "Run your project's normal dev command. For example:"
                : lang === "python"
                  ? "Run your app like you'd run any other python script."
                  : "Run your app like you'd run any other Node.js script."}
            </p>
            {lang === "typescript" && (
              <Code
                code={
                  step === "sdk-installed-npx"
                    ? `npm run dev`
                    : `npx tsx --watch app.ts`
                }
                lang="bash"
              />
            )}
            {lang === "javascript" && (
              <Code
                code={
                  step === "sdk-installed-npx"
                    ? `npm run dev`
                    : `node --watch app.js`
                }
                lang="bash"
              />
            )}
            {lang === "python" && (
              <Code
                code={
                  projectType === PROJECT_TYPE.existingProject
                    ? "# Flask\nflask --app app.py run\n\n# Django\npython manage.py runserver\n\n# Default\npython app.py"
                    : `python app.py`
                }
                lang="bash"
              />
            )}
            <div className="flex flex-row p-4 rounded-brand border border-brand-neutral">
              {(!isConnected || !appRoute) && (
                <Spinner size="6" text="Waiting for SDK to connect..." />
              )}
              {isConnected && appRoute && (
                <div className="flex flex-row items-center justify-between w-full">
                  <div className="flex flex-row items-center space-x-2">
                    <Icon name="checkmark" color="brand-primary" />
                    <p>SDK connected!</p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => {
                      navigate({
                        to: "/app/$environmentId/$appRoute",
                        params: {
                          environmentId: appRoute.environmentId,
                          appRoute: appRoute.appRoute,
                        },
                      });
                    }}
                  >
                    Use your app
                  </Button>
                </div>
              )}
            </div>
          </StepContainer>
        )}
      </div>
    </DashedWrapper>
  );
}

export default function InteractiveOnboardingWrapper() {
  return (
    <WSProvider>
      <InteractiveOnboarding />
    </WSProvider>
  );
}
