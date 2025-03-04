const LANG = {
  ts: "typescript",
  js: "javascript",
  py: "python",
} as const;
type Lang = (typeof LANG)[keyof typeof LANG];

const VENV_NAME = ".venv";

export { LANG, type Lang, VENV_NAME };
