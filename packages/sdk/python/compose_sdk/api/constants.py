WS_URL_PATH = "api/v1/sdk/ws"

WS_CLIENT = {
    "URL": {
        "DEV": f"ws://localhost:8080/{WS_URL_PATH}",
        "PROD": f"wss://app.composehq.com/{WS_URL_PATH}",
    },
    "RECONNECTION_INTERVAL": {
        "BASE_IN_SECONDS": 5,
        "BACKOFF_MULTIPLIER": 1.7,
    },
    "CONNECTION_HEADERS": {
        "API_KEY": "x-compose-api-key",
        "PACKAGE_NAME": "x-compose-package-name",
        "PACKAGE_VERSION": "x-compose-package-version",
    },
    "ERROR_RESPONSE_HEADERS": {
        "REASON": "x-compose-error-reason",
        "CODE": "x-compose-error-code",
    },
    "SERVER_UPDATE_CODE": 3782,
}
