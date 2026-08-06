export const dummyUser = {
  email: "mahasiswa@umn.ac.id",
  password: "password123",
  nama: "John Doe",
  universitas: "Universitas Multimedia Nusantara",
  prodi: "Sistem Informasi",
  role: "mahasiswa",
};

export const dummyPerusahaan = {
  email: "perusahaan@nexora.com",
  password: "password123",
  nama: "Nexora Digital",
  industri: "Teknologi & Produk Digital",
  lokasi: "Jakarta Selatan",
  role: "perusahaan",
};

export const dummyAdmin = {
  email: "admin@bridgeu.id",
  password: "password123",
  nama: "Administrator BridgeU",
  role: "admin",
};

export type RegisteredCompany = {
  id: string;
  nama: string;
  email: string;
  industri: string;
  nib: string;
  lokasi: string;
  tanggalDaftar: string;
  statusVerifikasi: "Terverifikasi" | "Menunggu Verifikasi" | "Ditolak";
};

export const dummyRegisteredCompanies: RegisteredCompany[] = [
  {
    id: "comp-1",
    nama: "Nexora Digital",
    email: "perusahaan@nexora.com",
    industri: "Teknologi & Produk Digital",
    nib: "9120003418921",
    lokasi: "Jakarta Selatan",
    tanggalDaftar: "12 Januari 2026",
    statusVerifikasi: "Terverifikasi",
  },
  {
    id: "comp-2",
    nama: "Vertex Logistics",
    email: "hr@vertexlogistics.co.id",
    industri: "Logistik & Supply Chain",
    nib: "8190001237722",
    lokasi: "Jakarta Barat",
    tanggalDaftar: "01 Februari 2026",
    statusVerifikasi: "Menunggu Verifikasi",
  },
  {
    id: "comp-3",
    nama: "Skyline Fintech",
    email: "contact@skylinefintech.id",
    industri: "Financial Technology",
    nib: "9120009988112",
    lokasi: "Tangerang",
    tanggalDaftar: "18 Juli 2026",
    statusVerifikasi: "Terverifikasi",
  },
  {
    id: "comp-4",
    nama: "Cakra Health Tech",
    email: "admin@cakrahealth.com",
    industri: "HealthTech & Medis",
    nib: "9120005544332",
    lokasi: "Bandung",
    tanggalDaftar: "02 Agustus 2026",
    statusVerifikasi: "Menunggu Verifikasi",
  },
];

export type ManagedUser = {
  id: string;
  nama: string;
  email: string;
  role: "Mahasiswa" | "Perusahaan";
  detail: string; // Universitas & Prodi or Industri & Lokasi
  status: "Aktif" | "Suspended";
  tanggalGabung: string;
};

export const dummyManagedUsers: ManagedUser[] = [
  {
    id: "usr-1",
    nama: "John Doe",
    email: "mahasiswa@umn.ac.id",
    role: "Mahasiswa",
    detail: "Universitas Multimedia Nusantara • Sistem Informasi",
    status: "Aktif",
    tanggalGabung: "10 Januari 2026",
  },
  {
    id: "usr-2",
    nama: "Nexora Digital",
    email: "perusahaan@nexora.com",
    role: "Perusahaan",
    detail: "Teknologi & Produk Digital • Jakarta Selatan",
    status: "Aktif",
    tanggalGabung: "12 Januari 2026",
  },
  {
    id: "usr-3",
    nama: "Siti Rahma",
    email: "siti.rahma@itb.ac.id",
    role: "Mahasiswa",
    detail: "Institut Teknologi Bandung • DKV",
    status: "Aktif",
    tanggalGabung: "15 Februari 2026",
  },
  {
    id: "usr-4",
    nama: "Budi Santoso",
    email: "budi.s@ui.ac.id",
    role: "Mahasiswa",
    detail: "Universitas Indonesia • Ilmu Komputer",
    status: "Aktif",
    tanggalGabung: "01 Maret 2026",
  },
  {
    id: "usr-5",
    nama: "Vertex Logistics",
    email: "hr@vertexlogistics.co.id",
    role: "Perusahaan",
    detail: "Logistik & Supply Chain • Jakarta Barat",
    status: "Aktif",
    tanggalGabung: "01 Februari 2026",
  },
];

export type Pelamar = {
  id: string;
  kolaborasiId: string;
  kolaborasiJudul: string;
  namaMahasiswa: string;
  universitas: string;
  prodi: string;
  emailMahasiswa: string;
  tujuan: string;
  status: "Menunggu" | "Diterima" | "Ditolak" | "Selesai";
  tanggal: string;
};

export const dummyPelamarList: Pelamar[] = [
  {
    id: "pelamar-1",
    kolaborasiId: "1",
    kolaborasiJudul: "Studi Kasus: Optimasi UX Aplikasi Perbankan",
    namaMahasiswa: "John Doe",
    universitas: "Universitas Multimedia Nusantara",
    prodi: "Sistem Informasi",
    emailMahasiswa: "mahasiswa@umn.ac.id",
    tujuan: "Ingin menerapkan riset UX perbankan untuk tugas akhir dan portofolio profesional.",
    status: "Menunggu",
    tanggal: "04 Agustus 2026",
  },
  {
    id: "pelamar-2",
    kolaborasiId: "1",
    kolaborasiJudul: "Studi Kasus: Optimasi UX Aplikasi Perbankan",
    namaMahasiswa: "Siti Rahma",
    universitas: "Institut Teknologi Bandung",
    prodi: "Desain Komunikasi Visual",
    emailMahasiswa: "siti.rahma@itb.ac.id",
    tujuan: "Fokus pada pembuatan perancangan visual antarmuka mobile banking yang inklusif.",
    status: "Menunggu",
    tanggal: "05 Agustus 2026",
  },
  {
    id: "pelamar-3",
    kolaborasiId: "3",
    kolaborasiJudul: "Magang: Frontend Developer",
    namaMahasiswa: "Budi Santoso",
    universitas: "Universitas Indonesia",
    prodi: "Ilmu Komputer",
    emailMahasiswa: "budi.s@ui.ac.id",
    tujuan: "Pengalaman praktis Next.js dan Tailwind CSS dalam proyek finansial nyata.",
    status: "Diterima",
    tanggal: "02 Agustus 2026",
  },
];

export type Kolaborasi = {
  id: string;
  perusahaan: string;
  judul: string;
  tipe: "Akademik" | "Magang";
  kategori: string;
  deskripsi: string;
  lokasi: string;
  batasWaktu: string;
  statusModerasi?: "Disetujui" | "Menunggu" | "Ditolak";
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