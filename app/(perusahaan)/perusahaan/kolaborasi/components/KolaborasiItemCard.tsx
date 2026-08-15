import Link from "next/link";
import { KolaborasiWithMeta } from "../../dashboard/types/company";

interface KolaborasiItemCardProps {
  item: KolaborasiWithMeta;
  onDelete: (id: string, judul: string) => void;
  unreadCount?: number;
}


const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  Menunggu: { label: "Menunggu", bg: "bg-amber-100", text: "text-amber-800" },
  Disetujui: { label: "Tayang", bg: "bg-emerald-100", text: "text-emerald-800" },
  Ditolak: { label: "Ditolak", bg: "bg-red-100", text: "text-red-800" },
  Dibatalkan: { label: "Dibatalkan", bg: "bg-rose-100", text: "text-rose-800" },
  Selesai: { label: "Selesai", bg: "bg-blue-100", text: "text-blue-800" },
};

export function KolaborasiItemCard({ item, onDelete, unreadCount = 0 }: KolaborasiItemCardProps) {
  const statusModerasi = item.status_moderasi;
  const isAkademik = item.tipe === "Akademik";
  const isDibatalkan = item.status_aktif === "Dibatalkan";
  const isSelesai = !isDibatalkan && item.semua_pelamar_selesai;
  const status = isDibatalkan
    ? statusConfig.Dibatalkan
    : isSelesai
    ? statusConfig.Selesai
    : statusConfig[statusModerasi] || statusConfig.Menunggu;
  const isPending = !isDibatalkan && !isSelesai && statusModerasi === "Menunggu";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_rgba(151,184,216,0.18)] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(151,184,216,0.3)] hover:-translate-y-1">
      <div className={`absolute inset-y-0 left-0 w-1 group-hover:w-1.5 transition-all duration-300 ${isAkademik ? "bg-[#4A7DA6]" : "bg-emerald-500"}`} />

      {/* Badge unread chat — floating pojok kanan atas */}
      {unreadCount > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <span className="relative flex h-6 min-w-6 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
            <span className="relative inline-flex items-center justify-center h-6 min-w-6 rounded-full bg-red-500 text-white text-[10px] font-bold px-1.5 shadow-md gap-0.5">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </span>
        </div>
      )}

      <div className="flex-1 p-5 pl-6 space-y-3">
        {/* Baris atas: kategori + tipe di kiri, status pill di kanan */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-steel min-w-0">
            <span className="truncate">{item.nama_kategori || "Umum"}</span>
            <span className="text-steel/30 shrink-0">•</span>
            <span className={`shrink-0 font-semibold ${isAkademik ? "text-[#4A7DA6]" : "text-emerald-700"}`}>
              {item.tipe}
            </span>
          </div>
          <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[9.5px] font-bold ${status.bg} ${status.text} ${unreadCount > 0 ? "mr-7" : ""}`}>
            {isPending && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-600" />
              </span>
            )}
            {status.label}
          </span>
        </div>

        {/* Judul */}
        <h3 className="font-display text-base sm:text-lg font-bold text-ink leading-snug">
          <Link href={`/perusahaan/kolaborasi/${item.id}`} className="hover:text-[#4A7DA6] transition">
            {item.judul}
          </Link>
        </h3>

        {/* Deskripsi */}
        <p className="text-xs text-steel line-clamp-2 leading-relaxed">
          {item.deskripsi}
        </p>

        {/* Info praktis */}
        <div className="flex items-center gap-3.5 pt-1 font-mono text-[11px] text-steel/80">
          <span className="inline-flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {item.nama_kota || "Remote"}
          </span>
          <span className="inline-flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            s.d {item.batas_waktu}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-ink">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            Sisa Slot: <strong className={item.current_slot === 0 ? "text-red-600" : "text-emerald-700"}>{item.current_slot ?? item.slot ?? 0}</strong> / {item.slot || 0}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pl-6 pb-5 pt-1">
        <Link
          href={`/perusahaan/kolaborasi/${item.id}`}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-[#97B8D8]/40 bg-[#97B8D8]/8 px-4 py-2.5 font-mono text-xs font-bold text-[#2C5478] hover:bg-[#97B8D8]/15 hover:border-[#97B8D8]/70 transition-all duration-300"
        >
          Detail & Pelamar ({item.pelamar_count || 0})
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </div>
  );
}