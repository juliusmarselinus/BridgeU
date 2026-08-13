"use client";

function IconCheck({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-steel/10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4 text-ink">
          <IconCheck className="w-6 h-6 text-primary" />
          <h3 className="font-display font-bold text-lg">{title}</h3>
        </div>
        <p className="text-sm text-steel mb-6">{message}</p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-steel/10 px-4 py-2 text-sm font-bold text-steel hover:bg-steel/20 transition active:scale-95"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white transition active:scale-95 hover:bg-rose-700"
          >
            Ya, Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}
