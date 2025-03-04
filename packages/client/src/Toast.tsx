import { useEffect } from "react";
import { toast as toastModule } from "~/utils/toast";
import { classNames } from "./utils/classNames";

function Toast({ toast }: { toast: toastModule.Type }) {
  return (
    <div
      className={classNames(
        "p-4 border-brand-neutral rounded-brand w-72 text-sm shadow flex flex-col justify-center gap-2",
        {
          "bg-brand-btn-error text-white/95 font-medium":
            toast.appearance === toastModule.APPEARANCE.error,
          "bg-brand-btn-success text-white/95 font-medium":
            toast.appearance === toastModule.APPEARANCE.success,
          "bg-brand-btn-warning text-white/95 font-medium":
            toast.appearance === toastModule.APPEARANCE.warning,
          "bg-brand-overlay text-brand-neutral border border-brand-neutral":
            toast.appearance === toastModule.APPEARANCE.info,
        }
      )}
    >
      {toast.title && <p className="font-semibold text-base">{toast.title}</p>}
      {toast.message}
    </div>
  );
}

function ToastHandler() {
  const { toasts, addListener, removeListener, removeToast } =
    toastModule.useStore();

  useEffect(() => {
    const listener = (toast: toastModule.Type) => {
      setTimeout(() => {
        removeToast(toast.id);
      }, toast.durationMs);
    };

    addListener("toast-listener", listener);

    return () => removeListener("toast-listener");
  }, [addListener, removeListener, removeToast]);

  return (
    <div className="fixed bottom-4 right-4 transition-all duration-300 ease-in-out space-y-2 z-20">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className={classNames({
            "animate-slide-fade-in duration-300": index === toasts.length - 1,
          })}
        >
          <Toast toast={toast} />
        </div>
      ))}
    </div>
  );
}

export default ToastHandler;
