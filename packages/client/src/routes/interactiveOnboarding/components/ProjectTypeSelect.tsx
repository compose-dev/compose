import { PROJECT_TYPE, ProjectType } from "../constants";
import DescriptiveButton from "./DescriptiveButton";

function ProjectTypeSelect({
  setProjectType,
}: {
  setProjectType: (projectType: ProjectType) => void;
}) {
  return (
    <>
      <p className="text-center">Choose how you'd like to setup Compose.</p>
      <div className="flex flex-col gap-4 w-full">
        <DescriptiveButton
          onClick={() => setProjectType(PROJECT_TYPE.existingProject)}
          iconName="plus"
          iconColor="brand-primary"
          name="Add Compose to existing project"
          description="The recommended way to use Compose. Enables simple code sharing and deployment."
        />
        <DescriptiveButton
          onClick={() => setProjectType(PROJECT_TYPE.newProject)}
          iconName="lightning"
          iconColor="brand-success"
          name="Initialize a new project"
          description="Best if you're just exploring, or want to start from scratch."
        />
      </div>
    </>
  );
}

export default ProjectTypeSelect;
