import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import Toast from "./Toast";

const ToastContext = createContext(null);
let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type, message, duration = 4000) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, type, message }]);
      if (duration > 0) setTimeout(() => remove(id), duration);
      return id;
    },
    [remove],
  );

  const toast = useMemo(
    () => ({
      success: (m, d) => push("success", m, d),
      error: (m, d) => push("error", m, d),
      info: (m, d) => push("info", m, d),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-5 right-5 z-[300] flex max-w-sm flex-col gap-2.5 max-md:left-3 max-md:right-3 max-md:top-3 max-md:max-w-none">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            type={t.type}
            message={t.message}
            onClose={() => remove(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
