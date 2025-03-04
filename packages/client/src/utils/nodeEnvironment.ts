function getNodeEnvironment() {
  const applicationMode = import.meta.env.MODE;

  if (applicationMode === "development") {
    return "development";
  }

  return "production";
}

export { getNodeEnvironment };
