import Modal from "./Modal";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal open={open} title={title} onClose={onCancel} size="sm">
      <p className="text-sm leading-relaxed text-slate-600">{message}</p>
      <div className="mt-4 flex justify-end gap-2">
        <button
          className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          onClick={onCancel}
        >
          {cancelText}
        </button>
        <button
          className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white ${danger ? "bg-red-500 hover:bg-red-600" : "bg-indigo-500 hover:bg-indigo-600"}`}
          onClick={onConfirm}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
