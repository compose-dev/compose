type ConnectionError = {
  success: false;
  message: string;
  code: string;
};

function generateConnectionError(
  message: string,
  errorId: string
): ConnectionError {
  return {
    success: false,
    message: `Failed to connect to Compose server. ${message}`,
    code: errorId,
  };
}

export { generateConnectionError as generate, type ConnectionError as Type };
