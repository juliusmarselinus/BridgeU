import { ModerasiStatus } from "../../dashboard/types/company";

interface KolaborasiHeaderProps {
  selectedTab: "Semua" | ModerasiStatus;
  onSelectTab: (tab: "Semua" | ModerasiStatus) => void;
  onOpenModal: () => void;
  onExportCSV: () => void;
  totalCount: number;
}

export function KolaborasiHeader({
  selectedTab,
  onSelectTab,
  onOpenModal,
  onExportCSV,
  totalCount,
}: KolaborasiHeaderProps) {
  const tabs: ("Semua" | ModerasiStatus)[] = ["Semua", "Menunggu", "Disetujui", "Ditolak"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">
            Manajemen Kolaborasi
          </h1>
          <p className="font-mono text-xs text-steel mt-1">
            Total {totalCount} peluang proyek dan magang yang Anda daftarkan
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 font-mono text-xs font-medium text-ink transition hover:bg-[#F2F7FB] shadow-[4px_4px_12px_rgba(151,184,216,0.25),-4px_-4px_12px_rgba(255,255,255,0.9)]"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>

          <button
            onClick={onOpenModal}
            className="inline-flex items-center gap-2 rounded-full bg-[#97B8D8] px-5 py-2.5 font-mono text-xs font-semibold text-[#12284B] transition hover:bg-[#ADC9E2] shadow-md"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Buat Kolaborasi Baru
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-[#E6F0F8] pb-3 font-mono text-xs overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onSelectTab(tab)}
            className={`rounded-full px-4 py-1.5 font-medium transition whitespace-nowrap ${
              selectedTab === tab
                ? "bg-[#97B8D8] text-[#12284B]"
                : "text-steel hover:bg-[#F2F7FB]"
            }`}
          >
            {tab === "Semua" ? "Semua Proyek" : `Status: ${tab}`}
          </button>
        ))}
      </div>
    </div>
  );
}