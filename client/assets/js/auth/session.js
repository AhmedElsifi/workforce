const SESSION_EXPIRED_PATH = "../../pages/auth/session-expired.html";
const UNAUTHORIZED_PATH = "../../pages/auth/unauthorized.html";

export function redirectToSessionExpired() {
    window.location.href = SESSION_EXPIRED_PATH;
}

export function redirectToUnauthorized() {
    window.location.href = UNAUTHORIZED_PATH;
}

export function handleAuthError(status) {
    if (status === 401) {
        redirectToSessionExpired();
        return true;
    }
    if (status === 403) {
        redirectToUnauthorized();
        return true;
    }
    return false;
}

export function installAuthRedirect() {
    if (window.__workforceAuthRedirectInstalled) return;
    window.__workforceAuthRedirectInstalled = true;

    const originalFetch = window.fetch.bind(window);

    window.fetch = async (...args) => {
        const response = await originalFetch(...args);

        if (response.status === 401) {
            redirectToSessionExpired();
            throw new Error("Session expired");
        }

        if (response.status === 403) {
            redirectToUnauthorized();
            throw new Error("Access denied");
        }

        return response;
    };
}