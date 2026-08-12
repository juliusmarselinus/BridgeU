"use client";

import { PelamarDetail, StatusLamaran } from "../types/pelamar";

interface PelamarCardProps {
  pelamar: PelamarDetail;
  onViewDetail: (pelamar: PelamarDetail) => void;
  onUpdateStatus: (pendaftaranId: string, newStatus: StatusLamaran) => void;
}

const statusStyles: Record<string, { badge: string; border: string }> = {
  Diterima: {
    badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
    border: "border-l-emerald-500",
  },
  Ditolak: {
    badge: "bg-red-50 text-red-800 border-red-200",
    border: "border-l-red-400",
  },
  Selesai: {
    badge: "bg-blue-50 text-blue-800 border-blue-200",
    border: "border-l-blue-400",
  },
  Menunggu: {
    badge: "bg-amber-50 text-amber-800 border-amber-200",
    border: "border-l-amber-400",
  },
};

function getStatusStyle(status: string) {
  return statusStyles[status] || statusStyles["Menunggu"];
}

export function PelamarCard({ pelamar, onViewDetail, onUpdateStatus }: PelamarCardProps) {
  const style = getStatusStyle(pelamar.status);

  return (
    <div
      className={`group rounded-2xl border border-steel/15 bg-white p-5 flex flex-col gap-4 shadow-sm border-l-4 ${style.border} transition hover:-translate-y-0.5 hover:shadow-md`}
    >
      {/* Header: Avatar + Nama + Status */}
      <div className="flex items-start gap-3">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-bridge-gold/20 font-display font-bold text-ink text-lg ring-2 ring-bridge-gold/10">
          {pelamar.foto_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pelamar.foto_url}
              alt={pelamar.nama_lengkap}
              className="h-full w-full object-cover"
            />
          ) : (
            pelamar.nama_lengkap.charAt(0).toUpperCase()
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-display font-bold text-ink text-sm leading-tight truncate">
            {pelamar.nama_lengkap}
          </h4>
          <p className="font-mono text-[10px] text-steel mt-1 truncate">
            {pelamar.program_studi}
          </p>
          <p className="font-mono text-[10px] text-steel/70 truncate">
            Smtr {pelamar.semester} • {pelamar.universitas}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[9px] font-semibold border ${style.badge}`}
        >
          {pelamar.status}
        </span>
      </div>

      {/* Ringkasan Profil */}
      <p className="font-sans text-[11px] text-steel leading-relaxed line-clamp-2 border-t border-steel/10 pt-3">
        {pelamar.ringkasan_self || "Tidak ada deskripsi profil."}
      </p>

      {/* Stats */}
      <div className="flex items-center justify-between font-mono text-[10px] text-steel border-t border-steel/10 pt-3">
        <span className="inline-flex items-center gap-1">
          <svg className="h-3 w-3 text-bridge-gold" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.538 1.118l-3.367-2.446a1 1 0 00-1.176 0l-3.367 2.446c-.783.57-1.838-.196-1.538-1.118l1.287-3.957a1 1 0 00-.363-1.118L2.062 9.385c-.784-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.958z" />
          </svg>
          <strong className="text-ink font-bold">{pelamar.reputation_score}</strong> Pts
        </span>
        <span className="inline-flex items-center gap-1">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {new Date(pelamar.tanggal_daftar).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
          })}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => onViewDetail(pelamar)}
          className="flex-1 rounded-full bg-steel/10 px-4 py-2 font-mono text-xs font-medium text-ink hover:bg-steel/20 transition"
        >
          Detail Profil
        </button>
        {pelamar.status === "Menunggu" && (
          <>
            <button
              onClick={() => onUpdateStatus(pelamar.id, "Diterima")}
              className="rounded-full bg-emerald-600 px-4 py-2 font-mono text-xs font-semibold text-white hover:bg-emerald-700 transition"
            >
              Terima
            </button>
            <button
              onClick={() => onUpdateStatus(pelamar.id, "Ditolak")}
              className="rounded-full bg-red-50 p-2 text-red-600 hover:bg-red-100 transition border border-red-200 shrink-0"
              title="Tolak Pelamar"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}