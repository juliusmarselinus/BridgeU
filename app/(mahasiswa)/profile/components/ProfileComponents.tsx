import { motion } from "framer-motion";
import { DbBadge } from "../types/profile";

export function BadgeUnlockModal({
  badge,
  onClose,
}: {
  badge: DbBadge;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-ink/70 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        transition={{ type: "spring", stiffness: 350, damping: 22 }}
        className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-sky/40 bg-card p-6 text-center shadow-2xl"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky/30 blur-2xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-amber-200/30 blur-2xl" />

        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
            className="relative mb-4 flex h-24 w-24 items-center justify-center rounded-3xl border-2 border-sky/40 bg-sky/15 p-4 shadow-xl"
          >
            <span className="text-5xl">{badge.iconUrl || "🏆"}</span>
          </motion.div>

          <span className="mb-1 rounded-full bg-sky/20 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-sky">
            Pencapaian Baru Terbuka!
          </span>
          <h3 className="font-display text-xl font-black text-ink">{badge.namaBadge}</h3>
          <p className="mt-2 font-sans text-xs font-medium leading-relaxed text-steel">
            {badge.deskripsi}
          </p>

          {badge.xpBonus > 0 && (
            <div className="mt-3 flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 font-mono text-xs font-bold text-amber-800 border border-amber-200">
              <span>⚡ +{badge.xpBonus} XP Bonus</span>
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-6 w-full rounded-2xl bg-primary py-3 font-mono text-xs font-bold text-white shadow-lg transition hover:brightness-110 active:scale-95"
          >
            Klaim &amp; Lanjutkan
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-steel/20 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className="font-display text-base font-bold text-ink">Profil Diperbarui</h3>
          <p className="font-mono text-[11px] text-steel mt-1 leading-relaxed">
            Perubahan profil mahasiswa kamu berhasil disimpan ke database.
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full rounded-full bg-ink py-2.5 font-mono text-xs font-bold text-white hover:bg-steel transition"
        >
          Selesai
        </button>
      </div>
    </div>
  );
}
