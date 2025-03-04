import prompts from "prompts";
import fs from "fs";
import ora, { Ora } from "ora";
import * as c from "./constants";
import chalk from "chalk";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const isDev = process.env.IS_COMPOSE_DEV === "true";

function validatePathString(value: string) {
  if (value.includes(" ")) {
    return "Path cannot contain spaces";
  }
  if (value.includes("..")) {
    return "Path cannot contain '..'";
  }
  if (value.includes("//")) {
    return "Path cannot contain '//'";
  }
  if (value.match(/[<>:"|?*]/)) {
    return "Path contains invalid characters";
  }

  return true;
}

async function requestDestinationPath() {
  const response = await prompts({
    type: "text",
    name: "path",
    message: "Where should the project be installed?",
    initial: "./compose",
    validate: (value) => {
      if (value.includes(" ")) {
        return "Path cannot contain spaces";
      }

      let sliced = value.startsWith("./") ? value.slice(2) : value;

      const absolutePath = sliced.startsWith("/")
        ? sliced
        : `${process.cwd()}/${sliced}`;

      if (fs.existsSync(absolutePath)) {
        return "Path already exists";
      }

      return validatePathString(value);
    },
  });

  let path = response.path;

  if (path.startsWith("./")) {
    path = path.slice(2);
  }

  const absolutePath = path.startsWith("/") ? path : `${process.cwd()}/${path}`;

  return absolutePath;
}

function safelyCompleteStep(
  message: string,
  callback: () => void,
  onError: (error: Error) => void
) {
  let spinner: Ora | undefined;

  try {
    spinner = ora(message).start();
    callback();
    spinner.succeed();
  } catch (error) {
    if (spinner) {
      spinner.stop();
    }

    onError(error as Error);
  } finally {
    if (spinner) {
      spinner.stop();
    }
  }
}

function deleteDirectory(path: string) {
  fs.rmSync(path, { recursive: true, force: true });
}

function sourceFilePath(lang: c.Lang) {
  const parentFolder = isDev ? __dirname.replace("/src", "") : __dirname;

  if (lang === c.LANG.ts || lang === c.LANG.js) {
    return `${parentFolder}/templates/basic-table-dashboard/app.ts`;
  }

  if (lang === c.LANG.py) {
    return `${parentFolder}/templates/basic-table-dashboard/app.py`;
  }

  throw new Error(`Invalid language: ${lang}`);
}

function destinationFilePath(lang: c.Lang, path: string) {
  if (lang === c.LANG.ts) {
    return `${path}/src/index.ts`;
  }

  if (lang === c.LANG.js) {
    return `${path}/src/index.js`;
  }

  if (lang === c.LANG.py) {
    return `${path}/app.py`;
  }

  throw new Error(`Invalid language: ${lang}`);
}

function replaceApiKey(sourceFilePath: string, apiKey: string) {
  const fileContent = fs.readFileSync(sourceFilePath, "utf8");

  // In the default case, the `apiKey` variable is empty. In that case,
  // we want to just return the file content as is.
  if (!apiKey) {
    return fileContent;
  }

  return fileContent.replace("API_KEY_HERE", apiKey);
}

function activateVirtualEnvironmentCommand(venvName: string) {
  const isWindows = process.platform === "win32";
  const isPowerShell = process.env.ComSpec === "powershell.exe";

  if (isWindows) {
    if (isPowerShell) {
      return `${venvName}\\Scripts\\Activate.ps1`;
    } else {
      return `${venvName}\\Scripts\\activate.bat`;
    }
  }

  return `source ${venvName}/bin/activate`;
}

function printRunInstructions(
  lang: c.Lang,
  venvName: string,
  path: string,
  apiKey: string
) {
  console.log();
  console.log(
    chalk.green.bold("> Finished! To run your app, do the following:\n")
  );

  const relativePath = path.replace(process.cwd(), "").replace(/^[/\\]+/, "");
  if (process.platform === "win32") {
    console.log(`> cd ${relativePath}`);
  } else {
    console.log(`> cd ./${relativePath}`);
  }

  if (!apiKey) {
    console.log(
      `> Get an API key (it's free): https://app.composehq.com/auth/signup`
    );
    console.log(`> Replace "API_KEY_HERE" with your API key in the app file`);
  }

  if (lang === c.LANG.py) {
    console.log(`> ${activateVirtualEnvironmentCommand(venvName)}`);
    console.log(`> pymon app.py`);
    console.log(`> Use your app: https://app.composehq.com/home\n`);
    console.log(
      "> Note: pymon is a lightweight file watcher that will automatically restart your app when you make code changes. You can always run your app manually: python app.py."
    );
  } else if (lang === c.LANG.ts || lang === c.LANG.js) {
    console.log(`> npm run dev`);
    console.log(`> Use your app: https://app.composehq.com/home`);
  }

  console.log();
  console.log();
}

export {
  requestDestinationPath,
  safelyCompleteStep,
  deleteDirectory,
  sourceFilePath,
  destinationFilePath,
  replaceApiKey,
  activateVirtualEnvironmentCommand,
  printRunInstructions,
};
