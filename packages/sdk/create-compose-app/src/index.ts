#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import fs from "fs";
import { execSync } from "child_process";

import * as c from "./constants";
import * as u from "./utils";

async function run(options: { path: string; lang: c.Lang; apiKey: string }) {
  // Print welcome message
  console.log(
    chalk.bold.green("> Welcome to the Compose interactive installer.")
  );
  console.log();

  // Request installation path
  const absolutePath = await u.requestDestinationPath();
  console.log();

  // Create installation directory
  u.safelyCompleteStep(
    `Creating directory ${absolutePath}`,
    () => {
      fs.mkdirSync(absolutePath, { recursive: true });
    },
    (error) => {
      console.log();
      console.error(chalk.red("Failed to create directory"));
      console.error("Received error:", error);
      process.exit(1);
    }
  );

  // Create an npm or pip project
  if (options.lang === c.LANG.ts || options.lang === c.LANG.js) {
    u.safelyCompleteStep(
      "Setting up npm project",
      () => {
        execSync(`npm init -y`, { cwd: absolutePath });
        execSync(`npm pkg set type=module`, { cwd: absolutePath });
        execSync(`npm install @composehq/sdk`, { cwd: absolutePath });

        if (options.lang === c.LANG.ts) {
          execSync(`npm pkg set scripts.dev="tsx --watch src/index.ts"`, {
            cwd: absolutePath,
          });
        } else if (options.lang === c.LANG.js) {
          execSync(`npm pkg set scripts.dev="node --watch src/index.js"`, {
            cwd: absolutePath,
          });
        }
      },
      (error) => {
        console.log();
        console.error(chalk.red("Failed to create project"));
        console.error("Received error:", error);
        u.deleteDirectory(absolutePath);
        process.exit(1);
      }
    );
  } else if (options.lang === c.LANG.py) {
    u.safelyCompleteStep(
      "Setting up pip project",
      () => {
        execSync(`python -m venv ${c.VENV_NAME}`, { cwd: absolutePath });

        const pythonPath =
          process.platform === "win32"
            ? `${c.VENV_NAME}\\Scripts\\python`
            : `${c.VENV_NAME}/bin/python`;

        execSync(`${pythonPath} -m pip install compose-sdk`, {
          cwd: absolutePath,
        });
        execSync(`${pythonPath} -m pip install py-mon`, { cwd: absolutePath });
        execSync(`${pythonPath} -m pip freeze > requirements.txt`, {
          cwd: absolutePath,
        });
      },
      (error) => {
        console.log();
        console.error(chalk.red("Failed to create project"));
        console.error("Received error:", error);
        u.deleteDirectory(absolutePath);
        process.exit(1);
      }
    );
  } else {
    console.log();
    console.error(chalk.red("Failed to create project"));
    console.error(chalk.red(`Unrecognized language: ${options.lang}`));
    process.exit(1);
  }

  // Optional: add typescript dependencies
  if (options.lang === c.LANG.ts) {
    u.safelyCompleteStep(
      "Adding typescript dependencies",
      () => {
        execSync(`npm install --save-dev typescript tsx`, {
          cwd: absolutePath,
        });
        execSync(`npx tsc --init`, { cwd: absolutePath });
      },
      (error) => {
        console.log();
        console.error(chalk.red("Failed to add typescript dependencies"));
        console.error("Received error:", error);
        u.deleteDirectory(absolutePath);
        process.exit(1);
      }
    );
  }

  // Copy project files
  u.safelyCompleteStep(
    "Copying project files",
    () => {
      if (options.lang === c.LANG.ts || options.lang === c.LANG.js) {
        fs.mkdirSync(`${absolutePath}/src`, { recursive: true });
      }

      const sourceFilePath = u.sourceFilePath(options.lang);
      const destinationFilePath = u.destinationFilePath(
        options.lang,
        absolutePath
      );

      const fileContent = u.replaceApiKey(sourceFilePath, options.apiKey);

      fs.writeFileSync(destinationFilePath, fileContent);
    },
    (error) => {
      console.log();
      console.error(chalk.red("Failed to copy project files"));
      console.error("Received error:", error);
      u.deleteDirectory(absolutePath);
      process.exit(1);
    }
  );

  u.printRunInstructions(
    options.lang,
    c.VENV_NAME,
    absolutePath,
    options.apiKey
  );
}

const program = new Command();

program
  .name("create-compose-app")
  .description("Bootstrap a new Compose app")
  .version("0.1.0")
  .option("-p, --path <path>", "The path to create the app in", "./compose")
  .option(
    "-l, --lang <lang>",
    "The language to use (typescript, javascript, python)",
    "typescript"
  )
  .option("-k, --api-key <api-key>", "The API key to use", "")
  .action(run);

program.parse(process.argv);
