import { PelamarDetail, StatusLamaran } from "../types/pelamar";

interface PelamarProfilModalProps {
  pelamar: PelamarDetail | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: StatusLamaran) => void;
}

export function PelamarProfilModal({
  pelamar,
  onClose,
  onUpdateStatus,
}: PelamarProfilModalProps) {
  if (!pelamar) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-steel/10 pb-4">
          <h3 className="font-display text-lg font-bold text-ink">Profil Pelamar</h3>
          <button
            onClick={onClose}
            className="rounded-full bg-steel/10 p-2 text-steel hover:bg-steel/20 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="mt-5 space-y-4 font-mono text-xs">
          <div>
            <span className="text-steel">Nama Lengkap:</span>
            <p className="font-sans text-sm font-bold text-ink">{pelamar.nama_lengkap}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-steel">Universitas:</span>
              <p className="font-sans text-xs text-ink">{pelamar.universitas}</p>
            </div>
            <div>
              <span className="text-steel">Program Studi:</span>
              <p className="font-sans text-xs text-ink">
                {pelamar.program_studi} (Smtr {pelamar.semester})
              </p>
            </div>
          </div>

          <div>
            <span className="text-steel">Skor Reputasi Platform:</span>
            <p className="font-sans text-xs font-bold text-bridge-gold">
              {pelamar.reputation_score} Pts
            </p>
          </div>

          <div>
            <span className="text-steel">Ringkasan Profil / Self Description:</span>
            <p className="mt-1 rounded-xl bg-steel/5 p-3 font-sans text-xs text-ink leading-relaxed">
              {pelamar.ringkasan_self}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2 pt-4 border-t border-steel/10">
          <button
            onClick={() => {
              onUpdateStatus(pelamar.id, "Ditolak");
              onClose();
            }}
            className="rounded-full bg-red-50 px-4 py-2 font-mono text-xs text-red-600 hover:bg-red-100 transition"
          >
            Tolak
          </button>
          <button
            onClick={() => {
              onUpdateStatus(pelamar.id, "Diterima");
              onClose();
            }}
            className="rounded-full bg-emerald-600 px-4 py-2 font-mono text-xs text-white hover:bg-emerald-700 font-semibold transition"
          >
            Terima Pelamar
          </button>
        </div>
      </div>
    </div>
  );
}