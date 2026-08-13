"use client";

function IconAlert({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

export function ActionModal({
  isOpen,
  onClose,
  title,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-steel/10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4 text-rose-600">
          <IconAlert className="w-6 h-6" />
          <h3 className="font-display font-bold text-lg">{title}</h3>
        </div>
        <p className="text-sm text-steel mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full rounded-xl bg-ink px-4 py-2 text-sm font-bold text-white transition active:scale-95"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
