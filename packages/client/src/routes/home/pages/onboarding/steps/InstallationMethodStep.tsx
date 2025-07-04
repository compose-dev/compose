import Icon from "~/components/icon";
import { type Step, type Framework, FRAMEWORK, STEP } from "../utils";
import Button from "~/components/button";
import StepContainer from "../StepContainer";
import { Alert } from "~/components/alert";

const FrameworkCard = ({
  icon,
  name,
  onClick,
}: {
  icon: React.ReactNode;
  name: string;
  onClick: () => void;
}) => {
  return (
    <Button variant="ghost" onClick={onClick}>
      <div className="card flex flex-row justify-between items-center hover:bg-brand-overlay">
        <div className="flex flex-row gap-x-2 items-center">
          {icon}
          <p>{name}</p>
        </div>
        <Icon name="chevron-right" />
      </div>
    </Button>
  );
};

function InstallationMethodStep({
  setStep,
}: {
  step: Step;
  setStep: (step: Step, framework: Framework) => void;
}) {
  return (
    <StepContainer>
      <h3>Install the Compose SDK</h3>
      <div className="flex flex-col gap-y-6">
        <h4 className="-mb-2">Add Compose to your existing project</h4>
        <p>
          The easiest way to use Compose is by installing it as a dependency in
          your server-side application. That way, your Compose Apps live
          alongside your existing code - letting you share models, utilities,
          and logic just by importing them.
        </p>
        <div className="flex flex-col gap-y-4">
          <p>Node.js guides</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            <FrameworkCard
              icon={
                <img
                  src="https://nodejs.org/static/images/favicons/favicon.png"
                  className="w-6 h-6"
                />
              }
              name="Node.js"
              onClick={() =>
                setStep(
                  STEP["framework-instructions"],
                  FRAMEWORK["nodejs-existing"]
                )
              }
            />
            <FrameworkCard
              icon={
                <img
                  src="https://expressjs.com/images/favicon.png"
                  className="w-6 h-6"
                />
              }
              name="Express"
              onClick={() =>
                setStep(STEP["framework-instructions"], FRAMEWORK["express"])
              }
            />
            <FrameworkCard
              icon={<Icon name="fastify" size="1.5" />}
              name="Fastify"
              onClick={() =>
                setStep(STEP["framework-instructions"], FRAMEWORK["fastify"])
              }
            />
            <FrameworkCard
              icon={<Icon name="hono" size="1.5" color="brand-warning" />}
              name="Hono"
              onClick={() =>
                setStep(STEP["framework-instructions"], FRAMEWORK["hono"])
              }
            />
            <FrameworkCard
              icon={<Icon name="koa" size="1.5" />}
              name="Koa"
              onClick={() =>
                setStep(STEP["framework-instructions"], FRAMEWORK["koa"])
              }
            />
            <FrameworkCard
              icon={<Icon name="nestjs-brand-color" size="1.5" />}
              name="NestJS"
              onClick={() =>
                setStep(STEP["framework-instructions"], FRAMEWORK["nestjs"])
              }
            />
            <FrameworkCard
              icon={<Icon name="nextjs" size="1.5" />}
              name="Next.js"
              onClick={() =>
                setStep(STEP["framework-instructions"], FRAMEWORK["nextjs"])
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <p>Python guides</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            <FrameworkCard
              icon={<Icon name="python-brand-color" size="1.5" />}
              name="Python"
              onClick={() =>
                setStep(
                  STEP["framework-instructions"],
                  FRAMEWORK["python-existing"]
                )
              }
            />
            <FrameworkCard
              icon={<Icon name="django" color="brand-success" size="1.5" />}
              name="Django"
              onClick={() =>
                setStep(STEP["framework-instructions"], FRAMEWORK["django"])
              }
            />
            <FrameworkCard
              icon={<Icon name="fastapi-brand-color" size="1.5" />}
              name="FastAPI"
              onClick={() =>
                setStep(STEP["framework-instructions"], FRAMEWORK["fastapi"])
              }
            />
            <FrameworkCard
              icon={<Icon name="flask" size="1.5" />}
              name="Flask"
              onClick={() =>
                setStep(STEP["framework-instructions"], FRAMEWORK["flask"])
              }
            />
          </div>
        </div>
        <Alert appearance="neutral" iconName="exclamation-circle">
          <>
            Don't see your framework? Use the general{" "}
            <Button
              variant="ghost"
              onClick={() =>
                setStep(
                  STEP["framework-instructions"],
                  FRAMEWORK["nodejs-existing"]
                )
              }
            >
              <span className="underline hover:text-brand-neutral">
                Node.js
              </span>
            </Button>{" "}
            or{" "}
            <Button
              variant="ghost"
              onClick={() =>
                setStep(
                  STEP["framework-instructions"],
                  FRAMEWORK["python-existing"]
                )
              }
            >
              <span className="underline hover:text-brand-neutral">Python</span>
            </Button>{" "}
            guides - the instructions are virtually the same for all frameworks.
          </>
        </Alert>
      </div>
      <div className="flex flex-col gap-y-6">
        <h4 className="-mb-2">Create a new project with Compose installed</h4>
        <p>
          If you're just exploring for now or prefer to start from scratch, you
          can also create a new project with the SDK and some starter apps.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <FrameworkCard
            icon={
              <img
                src="https://nodejs.org/static/images/favicons/favicon.png"
                className="w-6 h-6"
              />
            }
            name="Create a new Node.js project"
            onClick={() =>
              setStep(STEP["framework-instructions"], FRAMEWORK["nodejs-new"])
            }
          />
          <FrameworkCard
            icon={<Icon name="python-brand-color" size="1.5" />}
            name="Create a new Python project"
            onClick={() =>
              setStep(STEP["framework-instructions"], FRAMEWORK["python-new"])
            }
          />
        </div>
      </div>
    </StepContainer>
  );
}

export default InstallationMethodStep;
