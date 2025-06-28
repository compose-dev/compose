const INSTALL_STRATEGY = {
  GITHUB_REPO: "github-repo",
  MANUAL: "manual",
} as const;

type InstallStrategy = (typeof INSTALL_STRATEGY)[keyof typeof INSTALL_STRATEGY];

export { INSTALL_STRATEGY };
export type { InstallStrategy };
