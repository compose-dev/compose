type ConnectionError = {
  success: false;
  message: string;
  code: string;
  internalMetadata: Record<string, string>;
};

function generateConnectionError(
  message: string,
  errorId: string,
  internalMetadata: Record<string, string> = {}
): ConnectionError {
  return {
    success: false,
    message: `Failed to connect to Compose server. ${message}`,
    code: errorId,
    internalMetadata,
  };
}

export { generateConnectionError as generate, type ConnectionError as Type };
