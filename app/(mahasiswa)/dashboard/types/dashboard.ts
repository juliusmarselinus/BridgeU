export type StoredUser = {
  id?: string;
  nama: string;
  universitas: string;
  prodi: string;
  fotoUrl?: string;
  xp?: number;
  streakCount?: number;
  reputationScore?: number;
  responseRate?: number;
  skills?: string[];
  minatKategori?: string[];
  isProfileComplete?: boolean;
};

export type PengajuanStatus = "Menunggu" | "Diproses" | "Diterima" | "Ditolak" | "Selesai";

export type Pengajuan = {
  id: string;
  judul: string;
  perusahaan: string;
  status: PengajuanStatus;
  tanggal: string;
  kategori?: string;
  tujuan?: string;
};

export type RecommendedProject = {
  id: string;
  judul: string;
  perusahaan: string;
  kategori: string;
  matchScore: number;
  tipe: string;
};

export type UserBadge = {
  iconType: "rocket" | "academic" | "lightning" | "trophy" | "star";
  title: string;
  desc: string;
};

export type DashboardStats = {
  total: number;
  menunggu: number;
  diterima: number;
  level: number;
  progressPercent: number;
  sisaMenujuLevel: number;
  xp: number;
  streakCount: number;
  reputationScore: number;
  responseRate: number;
};

export type DashboardApiResponse = {
  user: StoredUser | null;
  pengajuan: Pengajuan[];
  recommendedProjects: RecommendedProject[];
  userBadges: UserBadge[];
  stats: DashboardStats;
};
