type classNameArg = string | Record<string, boolean>;

function classNames(...args: Array<classNameArg>): string {
  let returnStr = "";

  args.forEach((arg) => {
    if (typeof arg === "string") {
      returnStr += " " + arg;
    } else if (typeof arg === "object") {
      Object.keys(arg).forEach((key) => {
        if (arg[key] === true) {
          returnStr += " " + key;
        }
      });
    }
  });

  return returnStr.trimStart();
}

export { classNames };
