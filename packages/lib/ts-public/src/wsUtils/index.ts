import * as Message from "./message";
import * as Routes from "./routes";

const NOT_FOUND_RESPONSE =
  "HTTP/1.1 404 Not Found\r\n" +
  "Content-Type: text/plain\r\n" +
  "\r\n" +
  "Not Found: The requested WebSocket endpoint does not exist";

const SERVER_UPDATE_CODE = 3782;
const PING_TIMEOUT_CODE = 3783;

const SERVER_UPDATE_CLIENT_RECONNECTION_INTERVAL_SECONDS = 10;

export {
  NOT_FOUND_RESPONSE,
  Message,
  Routes,
  SERVER_UPDATE_CODE,
  PING_TIMEOUT_CODE,
  SERVER_UPDATE_CLIENT_RECONNECTION_INTERVAL_SECONDS,
};
