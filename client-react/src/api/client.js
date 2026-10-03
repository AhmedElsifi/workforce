const API_BASE = "";

export class ApiError extends Error {
    constructor(status, message, errors = null) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.errors = errors || {};
    }
}

async function parseBody(response) {
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) return undefined;
    try {
        return await response.json();
    } catch {
        return undefined;
    }
}

export async function apiRequest(path, options = {}) {
    const { skipAuthRedirect = false, headers, ...rest } = options;

    let response;
    try {
        response = await fetch(`${API_BASE}${path}`, {
            credentials: "include",
            headers: { "Content-Type": "application/json", ...(headers || {}) },
            ...rest,
        });
    } catch {
        throw new ApiError(0, "Unable to reach the server.");
    }

    const body = await parseBody(response);

    if (response.status === 401 && !skipAuthRedirect) {
        if (!window.location.pathname.startsWith("/auth/")) {
            window.location.href = "/auth/session-expired";
        }
        throw new ApiError(401, "Session expired");
    }

    if (response.status === 403 && !skipAuthRedirect) {
        if (!window.location.pathname.startsWith("/auth/")) {
            window.location.href = "/auth/unauthorized";
        }
        throw new ApiError(403, "Access denied");
    }

    if (!response.ok) {
        const errs = body?.errors || {};
        const message =
            errs.message || body?.message || `Request failed (${response.status})`;
        throw new ApiError(response.status, message, errs);
    }

    if (body === undefined || body === null) {
        throw new ApiError(
            response.status,
            `Server returned an empty response for ${path}.`,
        );
    }

    return body;
}