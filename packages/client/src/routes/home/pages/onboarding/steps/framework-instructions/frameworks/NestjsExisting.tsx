import AddStarterAppsNode from "../components/AddStarterAppsNode";
import InstallPackageNode from "../components/InstallPackageNode";
import RunYourAppNode from "../components/RunYourAppNode";

function NestjsExisting({ apiKey }: { apiKey: string | null }) {
  return (
    <>
      <InstallPackageNode />
      <AddStarterAppsNode apiKey={apiKey} type="nestjs" />
      <RunYourAppNode command="npm run start:dev" sectionNumber={3} />
    </>
  );
}

export default NestjsExisting;
