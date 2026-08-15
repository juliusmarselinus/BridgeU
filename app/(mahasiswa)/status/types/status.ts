export type StatusKey = "Menunggu" | "Diproses" | "Diterima" | "Evaluasi" | "Revisi" | "Ditolak" | "Selesai" | "Dibatalkan";

export type StatusItem = {
  id: string;
  kolaborasi_id: string;
  judul: string;
  perusahaan: string;
  tipe: string;
  status: StatusKey;
  tanggal_daftar: string;
  tanggal_raw: number;
  catatan_perusahaan?: string;
  catatan_pembatalan?: string;
  url_hasil_kolaborasi?: string;
  ratings?: number | null;
  gajiStipend?: string;
  urlBuktiBayar?: string;
  statusPembayaran?: string;
  tanggalSelesai?: string;
  batasWaktu?: string;
  interview?: {
    id: string;
    scheduled_at: string;
    meeting_link: string;
    status: string;
    notes?: string | null;
  } | null;
};

export const STAGES = ["Diajukan", "Diproses", "Dievaluasi", "Selesai"] as const;

export const statusMeta: Record<
  StatusKey,
  {
    label: string;
    stage: number;
    tone: string;
    chipBg: string;
    needsAction: boolean;
    rejected: boolean;
    group: "berjalan" | "aksi" | "selesai";
  }
> = {
  Menunggu: { label: "Menunggu Review", stage: 0, tone: "text-amber-700", chipBg: "bg-amber-50", needsAction: false, rejected: false, group: "berjalan" },
  Diproses: { label: "Sedang Berjalan", stage: 1, tone: "text-blue-700", chipBg: "bg-blue-50", needsAction: false, rejected: false, group: "berjalan" },
  Diterima: { label: "Pendaftaran Diterima", stage: 1, tone: "text-blue-700", chipBg: "bg-blue-50", needsAction: false, rejected: false, group: "berjalan" },
  Evaluasi: { label: "Sedang Dievaluasi", stage: 2, tone: "text-purple-700", chipBg: "bg-purple-50", needsAction: false, rejected: false, group: "berjalan" },
  Revisi: { label: "Perlu Revisi", stage: 2, tone: "text-orange-700", chipBg: "bg-orange-50", needsAction: true, rejected: false, group: "aksi" },
  Ditolak: { label: "Tidak Lolos", stage: 2, tone: "text-rose-700", chipBg: "bg-rose-50", needsAction: true, rejected: true, group: "aksi" },
  Selesai: { label: "Kolaborasi Selesai", stage: 3, tone: "text-emerald-700", chipBg: "bg-emerald-50", needsAction: false, rejected: false, group: "selesai" },
  Dibatalkan: { label: "Proyek Dibatalkan", stage: 1, tone: "text-rose-700", chipBg: "bg-rose-50", needsAction: false, rejected: true, group: "aksi" },
};

export const TABS = [
  { key: "semua", label: "Semua" },
  { key: "aksi", label: "Perlu Aksi" },
  { key: "berjalan", label: "Berjalan" },
  { key: "selesai", label: "Selesai" },
] as const;

export type TabKey = (typeof TABS)[number]["key"];

export const PAGE_SIZE = 5;

export function initials(name: string) {
  if (!name) return "CP";
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}
