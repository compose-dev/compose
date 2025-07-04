import { FRAMEWORK, type Framework } from "../../../utils";

const addToProject = (label: string) => `Add Compose to your ${label} project`;
const createNewProject = (label: string) =>
  `Create a new ${label} project with Compose`;

const isNotSupportedFramework = (label: string) =>
  `Compose does not support ${label} yet`;

const FRAMEWORK_TO_PAGE_TITLE: Record<Framework, string> = {
  [FRAMEWORK["nodejs-existing"]]: addToProject("Node.js"),
  [FRAMEWORK["nodejs-new"]]: createNewProject("Node.js"),
  [FRAMEWORK["python-existing"]]: addToProject("Python"),
  [FRAMEWORK["python-new"]]: createNewProject("Python"),
  [FRAMEWORK["express"]]: addToProject("Express"),
  [FRAMEWORK["fastify"]]: addToProject("Fastify"),
  [FRAMEWORK["koa"]]: addToProject("Koa"),
  [FRAMEWORK["django"]]: addToProject("Django"),
  [FRAMEWORK["flask"]]: addToProject("Flask"),
  [FRAMEWORK["fastapi"]]: addToProject("FastAPI"),
  [FRAMEWORK["nextjs"]]: isNotSupportedFramework("Next.js"),
  [FRAMEWORK["hono"]]: isNotSupportedFramework("Hono"),
  [FRAMEWORK["nestjs"]]: addToProject("NestJS"),
};

function PageTitle({ framework }: { framework: Framework | undefined }) {
  if (!framework) {
    return null;
  }

  return <h3>{FRAMEWORK_TO_PAGE_TITLE[framework]}</h3>;
}

export default PageTitle;
