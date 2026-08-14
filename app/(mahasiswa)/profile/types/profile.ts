export type StoredUser = {
  nama: string;
  email: string;
  universitas?: string;
  prodi?: string;
  semester?: string;
  minatKategori?: string[];
  skills?: string[];
  preferensiTipe?: string;
  preferensiLokasi?: string;
  ringkasan?: string;
  foto?: string;
};

export type Pengajuan = {
  id: string;
  judul: string;
  perusahaan: string;
  status: string;
  tujuan: string;
  tanggal: string;
};

export type ReferenceData = {
  universitas: string[];
  prodi: string[];
  skills: string[];
  kategoriMinat: string[];
};

export type DbBadge = {
  id: number;
  kodeBadge: string;
  namaBadge: string;
  deskripsi: string;
  iconUrl: string;
  kategori: string;
  xpBonus: number;
  isUnlocked: boolean;
  unlockedAt: string | null;
};
