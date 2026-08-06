export const dummyUser = {
  email: "mahasiswa@umn.ac.id",
  password: "password123",
  nama: "John Doe",
  universitas: "Universitas Multimedia Nusantara",
  prodi: "Sistem Informasi",
};

export type Kolaborasi = {
  id: string;
  perusahaan: string;
  judul: string;
  tipe: "Akademik" | "Magang";
  kategori: string;
  deskripsi: string;
  lokasi: string;
  batasWaktu: string;
};

export const dummyKolaborasi: Kolaborasi[] = [
  {
    id: "1",
    perusahaan: "Nexora Digital",
    judul: "Studi Kasus: Optimasi UX Aplikasi Perbankan",
    tipe: "Akademik",
    kategori: "UI/UX",
    deskripsi:
      "Analisis dan usulkan perbaikan alur onboarding pada aplikasi mobile banking.",
    lokasi: "Remote",
    batasWaktu: "20 Agustus 2026",
  },
  {
    id: "2",
    perusahaan: "Vertex Logistics",
    judul: "Riset: Prediksi Permintaan Gudang",
    tipe: "Akademik",
    kategori: "Data Science",
    deskripsi:
      "Membangun model prediksi sederhana untuk kebutuhan stok gudang regional.",
    lokasi: "Jakarta",
    batasWaktu: "25 Agustus 2026",
  },
  {
    id: "3",
    perusahaan: "Skyline Fintech",
    judul: "Magang: Frontend Developer",
    tipe: "Magang",
    kategori: "Software Development",
    deskripsi:
      "Membantu tim frontend membangun fitur dashboard transaksi pengguna.",
    lokasi: "Hybrid",
    batasWaktu: "30 Agustus 2026",
  },
  {
    id: "4",
    perusahaan: "Harmoni Retail Group",
    judul: "Studi Kasus: Strategi Loyalitas Pelanggan",
    tipe: "Akademik",
    kategori: "Business Case",
    deskripsi:
      "Merancang strategi program loyalitas untuk retail berbasis data transaksi.",
    lokasi: "Remote",
    batasWaktu: "18 Agustus 2026",
  },
  {
    id: "5",
    perusahaan: "Cakra Health Tech",
    judul: "Magang: Data Analyst",
    tipe: "Magang",
    kategori: "Data Science",
    deskripsi:
      "Mengolah data rekam medis anonim untuk mendukung riset internal tim produk.",
    lokasi: "Jakarta",
    batasWaktu: "28 Agustus 2026",
  },
];
export type Badge = {
  id: string;
  nama: string;
  deskripsi: string;
  check: (totalPengajuan: number, totalDiterima: number) => boolean;
};

export const badgeList: Badge[] = [
  {
    id: "first-collab",
    nama: "First Collaboration",
    deskripsi: "Mengajukan kolaborasi pertama kali",
    check: (total) => total >= 1,
  },
  {
    id: "rising-star",
    nama: "Rising Star",
    deskripsi: "Pengajuan pertama diterima perusahaan",
    check: (_, diterima) => diterima >= 1,
  },
  {
    id: "quick-learner",
    nama: "Quick Learner",
    deskripsi: "Mengajukan 3 kolaborasi berbeda",
    check: (total) => total >= 3,
  },
  {
    id: "consistent-contributor",
    nama: "Consistent Contributor",
    deskripsi: "2 kolaborasi diterima oleh perusahaan",
    check: (_, diterima) => diterima >= 2,
  },
];