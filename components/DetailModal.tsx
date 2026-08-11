"use client";

import { Kolaborasi } from "@/lib/types";

function IconX({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-wide text-steel/60 uppercase">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-ink/90">{value}</p>
    </div>
  );
}

export function DetailModal({
  data,
  onClose,
  onAjukan,
}: {
  data: Kolaborasi;
  onClose: () => void;
  onAjukan: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 animate-in fade-in duration-200">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-paper shadow-2xl border border-steel/20 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-steel/10 px-7 py-5 shrink-0">
          <div className="min-w-0">
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 font-mono text-[10px] font-extrabold mb-2 ${
                data.tipe === "Akademik"
                  ? "bg-slate-100 text-slate-800 border border-slate-300"
                  : "bg-bridge-gold text-ink font-black"
              }`}
            >
              {data.tipe}
            </span>
            <h3 className="text-lg font-bold text-ink leading-snug">{data.judul}</h3>
            <p className="text-xs text-steel mt-0.5">{data.perusahaan}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-8 w-8 items-center justify-center rounded-full text-steel/70 hover:bg-steel/10 hover:text-steel transition active:scale-90 shrink-0"
          >
            <IconX className="w-4 h-4 text-bridge-gold" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-7 py-6 space-y-6">
          <div className="rounded-xl border border-steel/15 bg-steel/5 p-5 grid grid-cols-2 gap-x-6 gap-y-4">
            <DetailRow label="Kategori" value={data.kategori} />
            <DetailRow label="Tingkat Kesulitan" value={data.tingkatKesulitan} />
            <DetailRow label="Lokasi" value={data.lokasi} />
            <DetailRow label="Batas Waktu" value={data.batasWaktu} />
            {data.gajiStipend && <DetailRow label="Gaji / Stipend" value={data.gajiStipend} />}
            {data.slot != null && <DetailRow label="Slot Tersedia" value={String(data.slot)} />}
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-wider text-steel/70 uppercase mb-2">
              Deskripsi
            </p>
            <p className="text-sm text-ink/80 leading-relaxed whitespace-pre-line">
              {data.deskripsi}
            </p>
          </div>

          {data.tags && data.tags.length > 0 && (
            <div>
              <p className="text-[10px] font-bold tracking-wider text-steel/70 uppercase mb-2">
                Skill yang Dibutuhkan
              </p>
              <div className="flex flex-wrap gap-1.5">
                {data.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-slate-100/80 border border-slate-200 px-2.5 py-1 font-mono text-xs text-steel font-bold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.rekomendasiProdi && data.rekomendasiProdi.length > 0 && (
            <div>
              <p className="text-[10px] font-bold tracking-wider text-steel/70 uppercase mb-2">
                Program Studi yang Direkomendasikan
              </p>
              <div className="flex flex-wrap gap-1.5">
                {data.rekomendasiProdi.map((prodi) => (
                  <span
                    key={prodi}
                    className="rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/25 px-3 py-1 font-mono text-xs font-bold"
                  >
                    {prodi}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-steel/10 px-7 py-5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-steel/20 px-5 py-2.5 text-sm font-semibold text-steel hover:bg-paper transition active:scale-95"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={onAjukan}
            className="rounded-xl bg-ink px-6 py-2.5 text-sm font-bold text-paper transition-colors active:scale-95"
          >
            Ajukan Kolaborasi →
          </button>
        </div>
      </div>
    </div>
  );
}