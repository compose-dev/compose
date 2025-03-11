type classNameArg = string | Record<string, boolean>;

function toVal(mix: classNameArg) {
  let k,
    y,
    str = "";

  if (typeof mix === "string" || typeof mix === "number") {
    str += mix;
  } else if (typeof mix === "object") {
    if (Array.isArray(mix)) {
      const len = mix.length;
      for (k = 0; k < len; k++) {
        if (mix[k]) {
          if ((y = toVal(mix[k]))) {
            str && (str += " ");
            str += y;
          }
        }
      }
    } else {
      for (y in mix) {
        if (mix[y]) {
          str && (str += " ");
          str += y;
        }
      }
    }
  }

  return str;
}

/**
 * Implementation is copied from clsx package. 1.5x faster than our
 * previous implementation in benchmarks.
 * https://github.com/lukeed/clsx/blob/master/src/index.js
 */
function classNames(...args: classNameArg[]) {
  let i = 0,
    tmp,
    x,
    str = "";

  const len = args.length;

  for (; i < len; i++) {
    if ((tmp = args[i])) {
      if ((x = toVal(tmp))) {
        str && (str += " ");
        str += x;
      }
    }
  }
  return str;
}

export { classNames };
