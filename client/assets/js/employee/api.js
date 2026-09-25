import { API_URL } from "../config.js";

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }

  get isAuthError() {
    return this.status === 401;
  }
}


const GENERIC_MESSAGES = {
  401: "Please sign in again to continue.",
  403: "You do not have permission to view this information.",
  404: "We could not find what you were looking for.",
  500: "Something went wrong on our side. Please try again in a moment.",
};


const PASS_THROUGH_STATUSES = new Set([400, 409]);

const NETWORK_MESSAGE =
  "Unable to reach the server. Check your connection and try again.";

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";

async function parseBody(response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

function buildMessage(status, body) {
  if (PASS_THROUGH_STATUSES.has(status) && typeof body?.message === "string") {
    return body.message;
  }

  return GENERIC_MESSAGES[status] ?? FALLBACK_MESSAGE;
}

export async function apiRequest(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      credentials: "include",
      ...options,
    });
  } catch {
    throw new ApiError(0, NETWORK_MESSAGE);
  }

  const body = await parseBody(response);

  if (!response.ok) {
    throw new ApiError(response.status, buildMessage(response.status, body));
  }

  return body;
}
