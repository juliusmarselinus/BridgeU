import { ProyekPelamarSummary, PelamarDetail, StatusLamaran } from "../types/pelamar";

interface ProyekDetailModalProps {
  proyek: ProyekPelamarSummary | null;
  onClose: () => void;
  onSelectPelamar: (pelamar: PelamarDetail) => void;
  onUpdateStatus: (id: string, status: StatusLamaran) => void;
}

export function ProyekDetailModal({
  proyek,
  onClose,
  onSelectPelamar,
  onUpdateStatus,
}: ProyekDetailModalProps) {
  if (!proyek) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl bg-white p-6 sm:p-8 shadow-2xl flex flex-col overflow-hidden">
        {/* Header Modal */}
        <div className="flex items-start justify-between border-b border-steel/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-steel/10 px-3 py-0.5 font-mono text-[10px] text-steel">
                {proyek.nama_kategori}
              </span>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-mono text-[10px] text-blue-700 font-semibold">
                {proyek.tipe}
              </span>
            </div>
            <h3 className="mt-2 font-display text-2xl font-bold text-ink">
              {proyek.judul}
            </h3>
          </div>
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

        {/* Modal Body */}
        <div className="mt-6 space-y-6 overflow-y-auto pr-2">
          {/* Info Proyek */}
          <div className="rounded-2xl bg-steel/5 p-4 space-y-3">
            <h4 className="font-mono text-xs font-bold text-steel uppercase tracking-wider">
              Deskripsi Proyek
            </h4>
            <p className="font-sans text-xs text-ink leading-relaxed">
              {proyek.deskripsi}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs border-t border-steel/10">
              <div>
                <span className="text-steel block text-[10px]">Kuota Slot:</span>
                <strong className="text-ink">{proyek.slot || 0} Mahasiswa</strong>
              </div>
              <div>
                <span className="text-steel block text-[10px]">Status Moderasi:</span>
                <strong className="text-emerald-700">{proyek.status_moderasi}</strong>
              </div>
            </div>
          </div>

          {/* List Pelamar */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display font-bold text-ink text-base">
                Daftar Pelamar Mahasiswa
              </h4>
              <span className="font-mono text-xs text-steel">
                Total: <strong>{proyek.pelamar_list.length}</strong>
              </span>
            </div>

            <div className="space-y-3">
              {proyek.pelamar_list.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-steel/20 p-8 text-center font-mono text-xs text-steel">
                  Belum ada mahasiswa yang melamar pada proyek ini.
                </div>
              ) : (
                proyek.pelamar_list.map((pelamar) => (
                  <div
                    key={pelamar.id}
                    className="rounded-2xl border border-steel/15 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-steel/30 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bridge-gold/30 font-display font-bold text-ink text-sm">
                        {pelamar.nama_lengkap.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-display font-bold text-ink text-sm">
                            {pelamar.nama_lengkap}
                          </h5>
                          <span
                            className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold ${
                              pelamar.status === "Diterima"
                                ? "bg-emerald-100 text-emerald-800"
                                : pelamar.status === "Ditolak"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {pelamar.status}
                          </span>
                        </div>
                        <p className="font-mono text-[11px] text-steel">
                          {pelamar.program_studi} • {pelamar.universitas}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => onSelectPelamar(pelamar)}
                        className="rounded-full bg-steel/10 px-3 py-1.5 font-mono text-xs font-medium text-ink hover:bg-steel/20 transition"
                      >
                        Detail Profil
                      </button>
                      <button
                        onClick={() => onUpdateStatus(pelamar.id, "Diterima")}
                        className="rounded-full bg-emerald-600 px-3 py-1.5 font-mono text-xs font-semibold text-white hover:bg-emerald-700 transition"
                      >
                        Terima
                      </button>
                      <button
                        onClick={() => onUpdateStatus(pelamar.id, "Ditolak")}
                        className="rounded-full bg-red-500/10 px-3 py-1.5 font-mono text-xs font-medium text-red-600 hover:bg-red-500/20 transition"
                      >
                        Tolak
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 border-t border-steel/10 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full border border-steel/20 bg-white px-5 py-2 font-mono text-xs font-medium text-ink hover:bg-steel/5 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}