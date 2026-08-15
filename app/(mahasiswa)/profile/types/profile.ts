export type BankItem = {
  id: number;
  bankCode: string;
  bankName: string;
  shortName: string;
  bankType: string;
};

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
  bankId?: number | null;
  nomorRekening?: string;
  bankName?: string | null;
  bankCode?: string | null;
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
  banks: BankItem[];
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
