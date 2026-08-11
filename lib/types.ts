export type Kolaborasi = {
  id: string;
  perusahaan: string;
  perusahaanId: string;
  judul: string;
  tipe: "Magang" | "Akademik";
  kategori: string;
  deskripsi: string;
  lokasi: string;
  batasWaktu: string;
  statusModerasi: "Disetujui" | "Ditolak" | "Menunggu";
  tags: string[];
  tingkatKesulitan: "Pemula" | "Menengah" | "Lanjutan";
  rekomendasiProdi: string[];
  gajiStipend?: string;
  slot: number | null;

  // raw IDs, dipakai internal buat matching/scoring, gak ditampilin langsung di UI
  skillIds: number[];
  kategoriMinatIds: number[];
  prodiIds: number[];
};