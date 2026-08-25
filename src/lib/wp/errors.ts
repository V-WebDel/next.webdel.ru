type ErrorWithCause = Error & {
  cause?: unknown;
};

type NodeErrorLike = {
  code?: unknown;
  errno?: unknown;
  syscall?: unknown;
  hostname?: unknown;
  address?: unknown;
  port?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getNodeErrorDetails(error: unknown) {
  if (!isRecord(error)) return undefined;

  const details: NodeErrorLike = {
    code: error.code,
    errno: error.errno,
    syscall: error.syscall,
    hostname: error.hostname,
    address: error.address,
    port: error.port,
  };
  const filtered = Object.fromEntries(
    Object.entries(details).filter(([, value]) => value !== undefined)
  );

  return Object.keys(filtered).length ? filtered : undefined;
}

export function getErrorDetails(error: unknown) {
  if (!(error instanceof Error)) return String(error);

  const parts = [error.message];
  const cause = (error as ErrorWithCause).cause;
  const causeDetails = getNodeErrorDetails(cause);

  if (cause instanceof Error) {
    parts.push(`cause: ${cause.message}`);
  }

  if (causeDetails) {
    parts.push(`details: ${JSON.stringify(causeDetails)}`);
  }

  return parts.join(" | ");
}
