function log(
  title: string,
  json: object | null = null,
  color: "blue" | "red" | "green" | "purple" | "yellow" = "blue"
) {
  switch (color) {
    case "red":
      printRedBold(title);
      break;
    case "green":
      printGreenBold(title);
      break;
    case "purple":
      printPurpleBold(title);
      break;
    case "yellow":
      printYellowBold(title);
      break;
    default:
      printBlueBold(title);
  }

  if (json !== null) {
    console.dir(json, { colors: true, depth: 5, compact: false });
  }
}

const bold = "\x1b[1m"; // Bold code
const reset = "\x1b[0m"; // Reset code

function printBlueBold(text: string) {
  const brightBlue = "\x1b[94m"; // Bright blue color code
  console.log(`${bold}${brightBlue}%s${reset}`, text);
}

function printRedBold(text: string) {
  const brightRed = "\x1b[91m"; // Bright red color code
  console.log(`${bold}${brightRed}%s${reset}`, text);
}

function printGreenBold(text: string) {
  const brightGreen = "\x1b[92m"; // Bright green color code
  console.log(`${bold}${brightGreen}%s${reset}`, text);
}

function printPurpleBold(text: string) {
  const brightPurple = "\x1b[95m"; // Bright purple color code
  console.log(`${bold}${brightPurple}%s${reset}`, text);
}

function printYellowBold(text: string) {
  const brightYellow = "\x1b[93m"; // Bright yellow color code, adjusted for better readability
  console.log(`${bold}${brightYellow}%s${reset}`, text);
}

export { log };
