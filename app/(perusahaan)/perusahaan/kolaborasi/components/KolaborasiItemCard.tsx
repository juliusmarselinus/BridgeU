import Link from "next/link";
import { KolaborasiWithMeta } from "../../dashboard/types/company";

interface KolaborasiItemCardProps {
  item: KolaborasiWithMeta;
  onDelete: (id: string, judul: string) => void;
}

export function KolaborasiItemCard({ item, onDelete }: KolaborasiItemCardProps) {
  const statusModerasi = item.status_moderasi;

  return (
    <div className="rounded-2xl border border-steel/15 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-bridge-gold/40 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-steel/10 px-3 py-1 font-mono text-[11px] font-medium text-steel">
              {item.nama_kategori || "Umum"}
            </span>
            <span className="rounded-full bg-bridge-gold/15 border border-bridge-gold/30 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-ink">
              Slot: {item.slot || 0}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold ${
                statusModerasi === "Menunggu"
                  ? "bg-amber-50 text-amber-800 border border-amber-200"
                  : statusModerasi === "Ditolak"
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              Moderasi: {statusModerasi}
            </span>

            <span
              className={`rounded-full px-3 py-1 font-mono text-[11px] font-semibold ${
                item.tipe === "Akademik"
                  ? "bg-blue-50 text-blue-800 border border-blue-200"
                  : "bg-emerald-50 text-emerald-800 border border-emerald-200"
              }`}
            >
              {item.tipe}
            </span>
          </div>
        </div>

        <h3 className="mt-4 font-display text-lg font-bold text-ink leading-snug hover:text-bridge-gold transition">
          <Link href={`/perusahaan/kolaborasi/${item.id}`}>
            {item.judul}
          </Link>
        </h3>
        <p className="mt-2 text-xs text-steel line-clamp-3 leading-relaxed">
          {item.deskripsi}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-steel/10 flex items-center justify-between font-mono text-xs text-steel">
        <div className="flex items-center gap-4 text-[11px]">
          <span className="inline-flex items-center gap-1">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {item.nama_kota || "Remote"}
          </span>
          <span className="inline-flex items-center gap-1">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            s.d {item.batas_waktu}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/perusahaan/kolaborasi/${item.id}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-3 py-1.5 font-medium text-ink hover:bg-ink hover:text-paper transition text-xs"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            Detail & Pelamar ({item.pelamar_count || 0})
          </Link>

          <button
            onClick={() => onDelete(item.id, item.judul)}
            className="rounded-full bg-red-50 p-2 text-red-600 hover:bg-red-100 transition"
            title="Hapus Kolaborasi"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}