const SEVERITY = {
  TRACE: "trace",
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
  FATAL: "fatal",
} as const;
type Severity = (typeof SEVERITY)[keyof typeof SEVERITY];

const TYPE = {
  USER: "user",
  SYSTEM: "system",
} as const;
type Type = (typeof TYPE)[keyof typeof TYPE];

const MAX_LOG_METADATA_SIZE_IN_BYTES = 4096; // 4KB
const MAX_LOG_MESSAGE_LENGTH_IN_CHARS = 1024; // 1024 characters

const VALID_SEVERITIES = Object.values(SEVERITY);

const encoder = new TextEncoder();

/**
 * Calculates the size of a JSON object in bytes.
 *
 * @param obj - The object to calculate the size of
 * @returns The size in bytes
 */
function calculateJsonSizeInBytes(obj: Record<string, any> | any[]): number {
  // Convert the object to a JSON string
  const jsonString = JSON.stringify(obj);

  // In JavaScript, each character in a string is 2 bytes (UTF-16 encoding)
  // But when transmitted or stored, JSON is typically UTF-8 where characters can be 1-4 bytes
  // For a more accurate byte count, we can use TextEncoder
  const bytes = encoder.encode(jsonString);

  return bytes.length;
}

/**
 * Validate a log message, e.g. not too long, not too large, etc.
 *
 * @param message - The message to log
 * @param data - Optional metadata to log
 * @param severity - The severity of the log
 * @returns True if the log is valid, otherwise throws an error
 */
function validateLog(
  message: string,
  data: Record<string, any> | null,
  severity: Severity
) {
  if (message.length > MAX_LOG_MESSAGE_LENGTH_IN_CHARS) {
    throw new Error(
      `Failed to write to audit log. Message is too long. Max length is ${MAX_LOG_MESSAGE_LENGTH_IN_CHARS} characters.`
    );
  }

  if (data && calculateJsonSizeInBytes(data) > MAX_LOG_METADATA_SIZE_IN_BYTES) {
    throw new Error(
      `Failed to write to audit log. Metadata is too large. Max size is ${MAX_LOG_METADATA_SIZE_IN_BYTES} bytes.`
    );
  }

  if (!VALID_SEVERITIES.includes(severity)) {
    throw new Error(
      `Failed to write to audit log. Invalid severity. Received: ${severity}. Valid severities are ${VALID_SEVERITIES.join(
        ", "
      )}.`
    );
  }

  return true;
}

export {
  SEVERITY,
  TYPE,
  validateLog,
  MAX_LOG_MESSAGE_LENGTH_IN_CHARS,
  MAX_LOG_METADATA_SIZE_IN_BYTES,
};
export type { Severity, Type };
