import { createContext, useCallback, useContext, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [confirmState, setConfirmState] = useState(null);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      setConfirmState({
        title: options.title ?? "Are you sure?",
        message: options.message ?? "",
        confirmText: options.confirmText ?? "Confirm",
        cancelText: options.cancelText ?? "Cancel",
        danger: options.danger ?? false,
        resolve,
      });
    });
  }, []);

  const close = (result) => {
    confirmState?.resolve?.(result);
    setConfirmState(null);
  };

  return (
    <ModalContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialog
        open={Boolean(confirmState)}
        title={confirmState?.title}
        message={confirmState?.message}
        confirmText={confirmState?.confirmText}
        cancelText={confirmState?.cancelText}
        danger={confirmState?.danger}
        onCancel={() => close(false)}
        onConfirm={() => close(true)}
      />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}
