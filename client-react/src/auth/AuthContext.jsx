import { createContext, useCallback, useEffect, useState } from "react";
import { apiRequest, ApiError } from "../api/client";

export const AuthContext = createContext(null);

// Routes where we know the user is unauthenticated (or we don't care),
// so there's no point calling /auth/me and getting a 401 back.
const PUBLIC_PATHS = new Set([
  "/",
  "/marketing",
  "/auth/session-expired",
  "/auth/unauthorized",
]);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const data = await apiRequest("/auth/me", { skipAuthRedirect: true });
      setUser(data);
      return data;
    } catch (error) {
      if (!(error instanceof ApiError)) {
        console.error("Unexpected auth error:", error);
      }
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email, password) => {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        skipAuthRedirect: true,
      });
      await loadUser();
      return data;
    },
    [loadUser],
  );

  const logout = useCallback(async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch {
      // ignore — we still want to clear local state
    }
    setUser(null);
    window.location.href = "/";
  }, []);

  useEffect(() => {
    // On public routes we already know the user isn't authenticated,
    // so skip the probe and render immediately.
    if (PUBLIC_PATHS.has(window.location.pathname)) {
      setLoading(false);
      return;
    }
    loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, reload: loadUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
