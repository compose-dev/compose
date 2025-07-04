import StepContainer from "../../StepContainer";
import { FRAMEWORK, Step, type Framework } from "../../utils";
import PageTitle from "./components/PageTitle";
import FastifyExisting from "./frameworks/FastifyExisting";
import ExpressExisting from "./frameworks/ExpressExisting";
import KoaExisting from "./frameworks/KoaExisting";
import NodeExisting from "./frameworks/NodeExisting";
import { useNavigate } from "@tanstack/react-router";
import { Spinner } from "~/components/spinner";
import Icon from "~/components/icon";
import Button from "~/components/button";
import PythonExisting from "./frameworks/PythonExisting";
import { classNames } from "~/utils/classNames";
import { api } from "~/api";
import DjangoExisting from "./frameworks/DjangoExisting";
import FlaskExisting from "./frameworks/FlaskExisting";
import FastapiExisting from "./frameworks/FastapiExisting";
import PythonNew from "./frameworks/PythonNew";
import NodeNew from "./frameworks/NodeNew";
import NextjsExisting from "./frameworks/NextjsExisting";
import HonoExisting from "./frameworks/HonoExisting";
import NestjsExisting from "./frameworks/NestjsExisting";

function FrameworkInstructions({
  framework,
  apiKey,
  isSdkConnected,
  environmentHasApps,
  setStep,
}: {
  framework: Framework | undefined;
  apiKey: string | null;
  isSdkConnected: boolean | undefined;
  environmentHasApps: boolean | undefined;
  setStep: (step: Step, framework?: Framework) => void;
}) {
  const navigate = useNavigate();

  const isUnsupportedFramework =
    framework === FRAMEWORK["nextjs"] || framework === FRAMEWORK["hono"];

  return (
    <StepContainer className="mb-16">
      <PageTitle framework={framework} />
      {framework === FRAMEWORK["nodejs-existing"] && (
        <NodeExisting apiKey={apiKey} />
      )}
      {framework === FRAMEWORK["express"] && (
        <ExpressExisting apiKey={apiKey} />
      )}
      {framework === FRAMEWORK["fastify"] && (
        <FastifyExisting apiKey={apiKey} />
      )}
      {framework === FRAMEWORK["koa"] && <KoaExisting apiKey={apiKey} />}
      {framework === FRAMEWORK["python-existing"] && (
        <PythonExisting apiKey={apiKey} />
      )}
      {framework === FRAMEWORK["django"] && <DjangoExisting apiKey={apiKey} />}
      {framework === FRAMEWORK["flask"] && <FlaskExisting apiKey={apiKey} />}
      {framework === FRAMEWORK["fastapi"] && (
        <FastapiExisting apiKey={apiKey} />
      )}
      {framework === FRAMEWORK["nodejs-new"] && <NodeNew apiKey={apiKey} />}
      {framework === FRAMEWORK["python-new"] && <PythonNew apiKey={apiKey} />}
      {framework === FRAMEWORK["nextjs"] && (
        <NextjsExisting setStep={setStep} />
      )}
      {framework === FRAMEWORK["nestjs"] && <NestjsExisting apiKey={apiKey} />}
      {framework === FRAMEWORK["hono"] && <HonoExisting setStep={setStep} />}
      {!isUnsupportedFramework && (
        <div className="sticky bottom-8 left-0 right-0 w-full items-center justify-center flex flex-row">
          <div
            className={classNames(
              "p-4 border rounded-lg shadow backdrop-blur",
              {
                "slate-tag border-brand-neutral":
                  !isSdkConnected || !environmentHasApps,
                "blue-tag border-brand-primary":
                  (isSdkConnected && environmentHasApps) === true,
              }
            )}
          >
            {!isSdkConnected && (
              <div className="flex flex-row items-center justify-center gap-x-2">
                <Spinner
                  size="6"
                  variant={
                    !isSdkConnected || !environmentHasApps
                      ? "neutral"
                      : "primary"
                  }
                />
                <p>Waiting for SDK to connect...</p>
              </div>
            )}
            {isSdkConnected && !environmentHasApps && (
              <div className="flex flex-row items-center justify-center gap-x-2">
                <Spinner size="6" />
                <p>SDK is connected, but no apps have been added yet.</p>
              </div>
            )}
            {isSdkConnected && environmentHasApps && (
              <div className="flex flex-row items-center justify-center gap-x-8">
                <div className="flex flex-row items-center justify-center gap-x-2">
                  <Icon name="checkmark" />
                  <p>SDK connected</p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => {
                    api.routes.updateUserMetadata({
                      metadata: {
                        "show-onboarding": false,
                      },
                    });
                    navigate({
                      to: "/home",
                    });
                  }}
                >
                  Use your apps
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </StepContainer>
  );
}

export default FrameworkInstructions;
