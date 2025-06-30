# type: ignore

from typing import Union
import ssl
import websockets
import queue
import urllib.parse
import math
import asyncio

from ..scheduler import Scheduler
from ..core import EventType, Debug
from .ws_message import (
    encode_json,
    encode_ws_message,
    decode_file_transfer_message,
    decode_json_message,
)

from .constants import WS_CLIENT

YELLOW = "\033[93m"
RESET = "\033[0m"


class DisconnectionError(Exception):
    pass


class ServerUpdateError(Exception):
    pass


def get_error_reason_and_code(e: Exception) -> tuple[str, str]:
    try:
        response_headers = e.response.headers
        error_reason = urllib.parse.unquote(
            response_headers.get(WS_CLIENT["ERROR_RESPONSE_HEADERS"]["REASON"])
        )
        error_code = urllib.parse.unquote(
            response_headers.get(WS_CLIENT["ERROR_RESPONSE_HEADERS"]["CODE"])
        )
        return error_reason, error_code
    except Exception:
        return None, None


def print_warning(message: str) -> None:
    print(f"⚠️ {YELLOW}{message}{RESET}")


class APIHandler:
    def __init__(
        self,
        scheduler: Scheduler,
        isDevelopment: bool,
        apiKey: str,
        package_name: str,
        package_version: str,
        *,
        debug: bool = False,
        host: Union[str, None] = None,
    ) -> None:
        self.scheduler = scheduler

        self.isDevelopment = isDevelopment
        self.apiKey = apiKey
        self.package_name = package_name
        self.package_version = package_version
        self.debug = debug

        self.WS_URL = (
            WS_CLIENT["URL"]["DEV"]
            if self.isDevelopment
            else (
                WS_CLIENT["URL"]["PROD"]
                if host is None
                else f"wss://{host}/{WS_CLIENT['WS_URL_PATH']}"
            )
        )

        self.reconnection_interval = WS_CLIENT["RECONNECTION_INTERVAL"][
            "BASE_IN_SECONDS"
        ]

        self.listeners: dict[str, callable] = {}

        self.ws = None
        self.is_connected = False
        self.push = None

        self.shutting_down = False

        self.send_queue = queue.Queue()

    def add_listener(self, id: str, listener: callable) -> None:
        if id in self.listeners:
            raise ValueError(f"Listener with id {id} already exists")

        self.listeners[id] = listener

    def remove_listener(self, id: str) -> None:
        if id not in self.listeners:
            return

        del self.listeners[id]

    def connect(self, on_connect_data: dict) -> None:
        self.scheduler.run_endless_task(self.__makeConnectionRequest(on_connect_data))

    def shutdown(self) -> None:
        self.shutting_down = True
        self.scheduler.shutdown()

    async def send_raw(self, data: bytes) -> None:
        if self.is_connected == True:
            await self.push(data)
        else:
            self.send_queue.put(data)

    async def send(
        self,
        data: object,
        sessionId: Union[str, None] = None,
        executionId: Union[str, None] = None,
    ) -> None:
        if self.debug:
            data_type_pretty = EventType.SdkToServerPretty.get(data["type"], "Unknown")
            Debug.log("Send websocket message", f"{data_type_pretty}")

        headerStr = (
            data["type"]
            if data["type"] == EventType.SdkToServer.INITIALIZE
            else data["type"] + sessionId + executionId
        )

        binary = encode_ws_message(headerStr, encode_json(data))

        await self.send_raw(binary)

    async def __makeConnectionRequest(self, on_connect_data: dict) -> None:
        headers = {
            WS_CLIENT["CONNECTION_HEADERS"]["API_KEY"]: self.apiKey,
            WS_CLIENT["CONNECTION_HEADERS"]["PACKAGE_NAME"]: self.package_name,
            WS_CLIENT["CONNECTION_HEADERS"]["PACKAGE_VERSION"]: self.package_version,
        }

        ssl_context = None
        if not self.isDevelopment:
            ssl_context = ssl.create_default_context()
            ssl_context.check_hostname = True
            ssl_context.verify_mode = ssl.CERT_REQUIRED

        try:
            async with websockets.connect(
                uri=self.WS_URL,
                additional_headers=headers,
                ssl=ssl_context,
                max_size=10485760,  # 10 MB
            ) as ws:
                self.ws = ws

                try:
                    print("🌐 Connected to Compose server.")

                    self.reconnection_interval = WS_CLIENT["RECONNECTION_INTERVAL"][
                        "BASE_IN_SECONDS"
                    ]
                    self.is_connected = True

                    async def push(data):
                        if ws is not None:
                            await ws.send(data)

                    self.push = push

                    await self.send(on_connect_data)

                    async for message in ws:
                        self.__flush_send_queue()
                        self.scheduler.run_async(self.__on_message(message))

                except asyncio.CancelledError:
                    raise DisconnectionError("Server shutting down")

                except websockets.ConnectionClosed as e:
                    if e.code == WS_CLIENT["SERVER_UPDATE_CODE"]:
                        raise ServerUpdateError("Server update")
                    else:
                        raise DisconnectionError("Disconnected from Compose server")

                except Exception as e:
                    raise DisconnectionError(
                        "Disconnected from Compose server during connection"
                    )
                finally:
                    self.is_connected = False
                    self.ws = None

        except Exception as e:
            if self.shutting_down:
                return

            is_server_update = isinstance(e, ServerUpdateError)

            if is_server_update:
                reconnect_after = 10
            else:
                reconnect_after = self.reconnection_interval

            self.reconnection_interval = math.ceil(
                WS_CLIENT["RECONNECTION_INTERVAL"]["BACKOFF_MULTIPLIER"]
                * self.reconnection_interval
            )

            error_reason, error_code = get_error_reason_and_code(e)

            if is_server_update:
                print(
                    f"🔄 Compose server update in progress. Attempting to reconnect after {reconnect_after} seconds...",
                )
            elif error_reason and error_code:
                print_warning(f"{error_reason} Error Code: {error_code}")

                # If we get a known error, we want to double the backoff rate
                reconnect_after = self.reconnection_interval
                self.reconnection_interval = math.ceil(
                    WS_CLIENT["RECONNECTION_INTERVAL"]["BACKOFF_MULTIPLIER"]
                    * self.reconnection_interval
                )

                print(f"Attempting to reconnect after {reconnect_after} seconds...")
            elif isinstance(e, DisconnectionError):
                print(
                    f"🔄 Disconnected from Compose server. Attempting to reconnect after {reconnect_after} seconds...",
                )
            else:
                print(e)
                print(
                    f"🔄 Failed to connect to Compose server. Attempting to reconnect after {reconnect_after} seconds...",
                )

            await self.scheduler.sleep(reconnect_after)
            await self.__makeConnectionRequest(on_connect_data)

            return

    async def __on_message(self, message) -> None:
        # First 2 bytes are always event type
        event_type = message[:2].decode("utf-8")

        if event_type == EventType.ServerToSdk.FILE_TRANSFER:
            data = decode_file_transfer_message(message)
        else:
            data = decode_json_message(message)

        for listener in self.listeners.values():
            await listener(data)

    def __flush_send_queue(self) -> None:
        if self.is_connected:
            while not self.send_queue.empty():
                binary = self.send_queue.get()
                self.scheduler.run_async(self.ws.send(binary))
