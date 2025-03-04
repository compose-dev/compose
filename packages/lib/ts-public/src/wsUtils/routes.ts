const BROWSER_TO_SERVER_PATH = "api/v1/browser/ws";
const SDK_TO_SERVER_PATH = "api/v1/sdk/ws";

const SERVER_DEV_HOST = "ws://localhost:8080";
const SERVER_PROD_HOST = "wss://app.composehq.com";

function getBrowserWSUrl(isDev: boolean) {
  if (isDev) {
    return `${SERVER_DEV_HOST}/${BROWSER_TO_SERVER_PATH}`;
  }

  return `${SERVER_PROD_HOST}/${BROWSER_TO_SERVER_PATH}`;
}

export {
  BROWSER_TO_SERVER_PATH,
  SDK_TO_SERVER_PATH,
  SERVER_DEV_HOST,
  SERVER_PROD_HOST,
  getBrowserWSUrl,
};
