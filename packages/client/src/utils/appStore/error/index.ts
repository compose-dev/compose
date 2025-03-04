type Severity = "error" | "warning";

class AppError extends Error {
  severity: Severity;

  constructor(severity: Severity, message: string) {
    super(message);
    this.severity = severity;
  }
}

function isAppError(error: Error): error is AppError {
  return error instanceof AppError;
}

export { AppError, isAppError, type Severity };
