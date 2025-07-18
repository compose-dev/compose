import { log } from "@compose/ts";

function getNodeEnvironment() {
  const applicationMode = import.meta.env.MODE;

  if (applicationMode === "development") {
    return "development";
  }

  return "production";
}

function logIfDevelopment(
  title: Parameters<typeof log>[0],
  json: Parameters<typeof log>[1] = null,
  color: Parameters<typeof log>[2] = "blue"
) {
  if (getNodeEnvironment() !== "development") {
    return;
  }

  log(title, json, color);
}

export { getNodeEnvironment, logIfDevelopment };
