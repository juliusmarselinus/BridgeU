interface KolaborasiEmptyStateProps {
  selectedTab: string;
  onOpenModal: () => void;
}

export function KolaborasiEmptyState({ selectedTab, onOpenModal }: KolaborasiEmptyStateProps) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-steel/30 bg-white/40 p-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink/5 text-ink">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-ink">
        Tidak ada data kolaborasi
      </h3>
      <p className="mt-1 text-xs text-steel max-w-sm mx-auto">
        {selectedTab !== "Semua"
          ? `Tidak ditemukan proyek dengan status moderasi "${selectedTab}".`
          : "Anda belum mempublikasikan proyek kolaborasi akademik maupun posisi magang."}
      </p>
      <button
        onClick={onOpenModal}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 font-mono text-xs font-medium text-paper transition hover:bg-steel"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Buat Kolaborasi Baru
      </button>
    </div>
  );
}