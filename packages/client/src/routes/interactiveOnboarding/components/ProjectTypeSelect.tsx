import Button from "~/components/button";
import { PROJECT_TYPE, ProjectType } from "../constants";
import Icon from "~/components/icon";

function ProjectTypeSelect({
  setProjectType,
}: {
  setProjectType: (projectType: ProjectType) => void;
}) {
  return (
    <>
      <p className="text-center">
        Choose how you'd like to setup your project.
      </p>
      <div className="flex flex-col gap-4 w-full">
        <Button
          variant="outline"
          onClick={() => setProjectType(PROJECT_TYPE.existingProject)}
          className="w-full max-w-md"
        >
          <div className="flex flex-row items-center gap-4 w-full">
            <Icon name="plus" size="lg" color="brand-primary" />{" "}
            <div className="flex flex-col items-start text-left flex-1">
              <span className="text-lg font-medium">
                Add Compose to existing project
              </span>
              <span className="text-brand-neutral-2 text-sm">
                The recommended way to use Compose. Enables simple code sharing
                and deployment.
              </span>
            </div>
          </div>
        </Button>
        <Button
          variant="outline"
          onClick={() => setProjectType(PROJECT_TYPE.newProject)}
          className="w-full max-w-md"
        >
          <div className="flex flex-row items-center gap-4 w-full">
            <Icon name="lightning" size="lg" color="brand-success" />{" "}
            <div className="flex flex-col items-start text-left flex-1">
              <span className="text-lg font-medium">
                Initialize a new project
              </span>
              <span className="text-brand-neutral-2 text-sm">
                Best if you're just exploring, or want to start from scratch.
              </span>
            </div>
          </div>
        </Button>
      </div>
    </>
  );
}

export default ProjectTypeSelect;
