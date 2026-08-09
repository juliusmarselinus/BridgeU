// lib/dummy-data.ts

/* ==========================================================================
   1. AUTH & ROLE DUMMY DATA
   ========================================================================== */

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

/* ==========================================================================
   2. REGISTERED COMPANIES (ADMIN MANAGEMENT)
   ========================================================================== */

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

/* ==========================================================================
   3. MANAGED USERS (ADMIN & SEARCH MANAGEMENT)
   ========================================================================== */

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
  {
    id: "usr-6",
    nama: "Andi Pratama",
    email: "andi.pratama@ugm.ac.id",
    role: "Mahasiswa",
    detail: "Universitas Gadjah Mada • Teknik Informatika",
    status: "Aktif",
    tanggalGabung: "10 Maret 2026",
  },
  {
    id: "usr-7",
    nama: "Maya Anggraini",
    email: "maya.a@its.ac.id",
    role: "Mahasiswa",
    detail: "Institut Teknologi Sepuluh Nopember • Data Science",
    status: "Aktif",
    tanggalGabung: "18 Maret 2026",
  },
  {
    id: "usr-8",
    nama: "Rizky Febrian",
    email: "rizky.f@unair.ac.id",
    role: "Mahasiswa",
    detail: "Universitas Airlangga • Manajemen",
    status: "Aktif",
    tanggalGabung: "22 Maret 2026",
  },
  {
    id: "usr-9",
    nama: "Nadia Putri",
    email: "nadia.p@unpad.ac.id",
    role: "Mahasiswa",
    detail: "Universitas Padjadjaran • Akuntansi",
    status: "Aktif",
    tanggalGabung: "05 April 2026",
  },
  {
    id: "usr-10",
    nama: "Dimas Setyo",
    email: "dimas.s@undip.ac.id",
    role: "Mahasiswa",
    detail: "Universitas Diponegoro • Teknik Industri",
    status: "Aktif",
    tanggalGabung: "12 April 2026",
  },
  {
    id: "usr-11",
    nama: "Aurelia Clarissa",
    email: "aurelia.c@binus.ac.id",
    role: "Mahasiswa",
    detail: "Universitas Bina Nusantara • Bisnis Digital",
    status: "Aktif",
    tanggalGabung: "19 April 2026",
  },
  {
    id: "usr-12",
    nama: "Farhan Ramadhan",
    email: "farhan.r@telkomuniversity.ac.id",
    role: "Mahasiswa",
    detail: "Telkom University • Cyber Security",
    status: "Aktif",
    tanggalGabung: "02 Mei 2026",
  },
  {
    id: "usr-13",
    nama: "Dewa Kusuma",
    email: "dewa.k@ub.ac.id",
    role: "Mahasiswa",
    detail: "Universitas Brawijaya • Ilmu Komputer",
    status: "Aktif",
    tanggalGabung: "15 Mei 2026",
  },
  {
    id: "usr-14",
    nama: "Jessica Tan",
    email: "jessica.t@uph.edu",
    role: "Mahasiswa",
    detail: "Universitas Pelita Harapan • Desain Produk",
    status: "Aktif",
    tanggalGabung: "28 Mei 2026",
  },
  {
    id: "usr-15",
    nama: "Kevin Wijaya",
    email: "kevin.w@atmajaya.ac.id",
    role: "Mahasiswa",
    detail: "Universitas Katolik Indonesia Atma Jaya • Hukum",
    status: "Aktif",
    tanggalGabung: "10 Juni 2026",
  },
];

/* ==========================================================================
   4. APPLICANTS (PELAMAR LOG)
   ========================================================================== */

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

/* ==========================================================================
   5. DROPDOWN & FORM OPTIONS LISTS
   ========================================================================== */

export const universitasList = [
  "Universitas Multimedia Nusantara (UMN)",
  "Universitas Indonesia (UI)",
  "Institut Teknologi Bandung (ITB)",
  "Universitas Gadjah Mada (UGM)",
  "Institut Teknologi Sepuluh Nopember (ITS)",
  "Universitas Airlangga (UNAIR)",
  "Universitas Padjadjaran (UNPAD)",
  "Universitas Diponegoro (UNDIP)",
  "Universitas Bina Nusantara (BINUS)",
  "Telkom University",
  "Universitas Brawijaya (UB)",
  "Universitas Sebelas Maret (UNS)",
  "Universitas Pelita Harapan (UPH)",
  "Universitas Katolik Indonesia Atma Jaya",
  "Universitas Tarumanagara (UNTAR)",
  "Universitas Trisakti",
  "Universitas Hasanuddin (UNHAS)",
  "Universitas Udayana (UNUD)",
  "Universitas Islam Indonesia (UII)",
  "Universitas Sanata Dharma",
  "Universitas Parahyangan (UNPAR)",
  "Perguruan Tinggi Lainnya",
];

export const prodiList = [
  // Ekonomi & Bisnis
  { label: "Manajemen & Bisnis", value: "Manajemen", group: "Ekonomi & Bisnis" },
  { label: "Akuntansi & Keuangan", value: "Akuntansi", group: "Ekonomi & Bisnis" },
  { label: "Bisnis Digital", value: "Bisnis Digital", group: "Ekonomi & Bisnis" },
  { label: "Ekonomi Pembangunan", value: "Ekonomi Pembangunan", group: "Ekonomi & Bisnis" },
  { label: "Manajemen Pemasaran", value: "Pemasaran", group: "Ekonomi & Bisnis" },

  // Seni, Desain & Komunikasi
  { label: "Desain Komunikasi Visual (DKV)", value: "Desain Komunikasi Visual", group: "Desain & Komunikasi" },
  { label: "Ilmu Komunikasi", value: "Ilmu Komunikasi", group: "Desain & Komunikasi" },
  { label: "Hubungan Masyarakat (PR)", value: "Hubungan Masyarakat", group: "Desain & Komunikasi" },
  { label: "Desain Produk", value: "Desain Produk", group: "Desain & Komunikasi" },
  { label: "Broadcasting & Film", value: "Broadcasting", group: "Desain & Komunikasi" },

  // Teknologi & Komputer
  { label: "Sistem Informasi", value: "Sistem Informasi", group: "Teknologi & Komputer" },
  { label: "Teknik Informatika", value: "Teknik Informatika", group: "Teknologi & Komputer" },
  { label: "Data Science & Analitik", value: "Data Science", group: "Teknologi & Komputer" },
  { label: "Cyber Security", value: "Cyber Security", group: "Teknologi & Komputer" },
  { label: "Ilmu Komputer", value: "Ilmu Komputer", group: "Teknologi & Komputer" },

  // Teknik & Arsitektur
  { label: "Teknik Industri", value: "Teknik Industri", group: "Teknik & Arsitektur" },
  { label: "Arsitektur", value: "Arsitektur", group: "Teknik & Arsitektur" },
  { label: "Teknik Sipil", value: "Teknik Sipil", group: "Teknik & Arsitektur" },
  { label: "Teknik Elektro", value: "Teknik Elektro", group: "Teknik & Arsitektur" },

  // Hukum & Humaniora
  { label: "Hukum Bisnis & Keperdataan", value: "Hukum", group: "Hukum & Humaniora" },
  { label: "Psikologi Organisasi", value: "Psikologi", group: "Hukum & Humaniora" },
  { label: "Hubungan Internasional", value: "Hubungan Internasional", group: "Hukum & Humaniora" },
  { label: "Sastra & Bahasa Inggris", value: "Sastra Inggris", group: "Hukum & Humaniora" },

  // Kesehatan & Sains
  { label: "Kesehatan Masyarakat", value: "Kesehatan Masyarakat", group: "Kesehatan & Sains" },
  { label: "Farmasi", value: "Farmasi", group: "Kesehatan & Sains" },
  { label: "Bioteknologi", value: "Bioteknologi", group: "Kesehatan & Sains" },
];

export const allCategoriesList = [
  "UI/UX & Product Design",
  "Business Strategy & Marketing",
  "Data Science & Analytics",
  "Software Development",
  "Content & Brand Communications",
  "Finance & Financial Modeling",
  "Human Resources & Psychology",
  "Legal & Regulatory Affairs",
  "Supply Chain & Logistics",
  "Cyber Security & Cloud",
];

export const allSkillsList = [
  // Design & Media
  "Figma",
  "Adobe Photoshop",
  "Premiere Pro",
  "Copywriting",
  "Branding",
  // Business & Finance
  "Business Planning",
  "Financial Modeling",
  "Market Research",
  "Excel / Sheets",
  "Public Speaking",
  "Social Media Marketing",
  // Tech & Data
  "Python",
  "SQL",
  "React / Next.js",
  "TypeScript",
  "Tableau",
  "SPSS",
  // Management & Legal
  "Project Management",
  "Legal Drafting",
  "HR Analytics",
  "Supply Chain Ops",
];

/* ==========================================================================
   6. COLLABORATIONS DATA
   ========================================================================== */

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
  tags?: string[];
  matchScore?: number;
  tingkatKesulitan?: "Pemula" | "Menengah" | "Lanjutan";
  rekomendasiProdi?: string[];
  gajiStipend?: string;
};

export const dummyKolaborasi: Kolaborasi[] = [
  {
    id: "1",
    perusahaan: "Nexora Digital",
    judul: "Studi Kasus: Optimasi UX Aplikasi Perbankan",
    tipe: "Akademik",
    kategori: "UI/UX & Product Design",
    deskripsi:
      "Analisis dan usulkan perbaikan alur onboarding serta aksesibilitas pada aplikasi mobile banking berbasis data pengujian pengguna.",
    lokasi: "Remote",
    batasWaktu: "20 Agustus 2026",
    statusModerasi: "Disetujui",
    tags: ["Figma", "User Research", "Usability Testing", "UI/UX"],
    matchScore: 98,
    tingkatKesulitan: "Menengah",
    rekomendasiProdi: ["Sistem Informasi", "Desain Komunikasi Visual", "Teknik Informatika"],
    gajiStipend: "E-Sertifikat + Insentif Riset Rp 1.500.000",
  },
  {
    id: "2",
    perusahaan: "Vertex Logistics",
    judul: "Riset: Prediksi Permintaan Gudang Berbasis AI",
    tipe: "Akademik",
    kategori: "Data Science & Analytics",
    deskripsi:
      "Membangun model Machine Learning prediktif sederhana untuk kebutuhan pengalokasian stok gudang logistik regional.",
    lokasi: "Jakarta",
    batasWaktu: "25 Agustus 2026",
    statusModerasi: "Disetujui",
    tags: ["Python", "Pandas", "Scikit-Learn", "Machine Learning"],
    matchScore: 94,
    tingkatKesulitan: "Lanjutan",
    rekomendasiProdi: ["Sistem Informasi", "Data Science", "Teknik Informatika", "Teknik Industri"],
    gajiStipend: "Insentif Proyek Rp 2.500.000",
  },
  {
    id: "3",
    perusahaan: "Harmoni Retail Group",
    judul: "Studi Kasus: Strategi Branding & Campaign Media Sosial",
    tipe: "Akademik",
    kategori: "Content & Brand Communications",
    deskripsi:
      "Merancang konsep pesan komunikasi digital dan perencanaan konten pemasaran omnichannel untuk memperluas jangkauan brand ritel ke Gen-Z.",
    lokasi: "Remote",
    batasWaktu: "18 Agustus 2026",
    statusModerasi: "Disetujui",
    tags: ["Branding", "Copywriting", "Social Media Marketing", "Public Speaking"],
    matchScore: 96,
    tingkatKesulitan: "Pemula",
    rekomendasiProdi: ["Ilmu Komunikasi", "Desain Komunikasi Visual", "Pemasaran", "Hubungan Masyarakat"],
    gajiStipend: "E-Sertifikat + Hadiah Produk Retail & Insentif",
  },
  {
    id: "4",
    perusahaan: "Nusantara Capital Partners",
    judul: "Magang: Business Strategy & Financial Analyst",
    tipe: "Magang",
    kategori: "Finance & Financial Modeling",
    deskripsi:
      "Membantu tim investasi menyusun analisis kelayakan finansial dan riset persaingan industri pasar berkembang.",
    lokasi: "Jakarta Pusat",
    batasWaktu: "31 Agustus 2026",
    statusModerasi: "Disetujui",
    tags: ["Financial Modeling", "Business Planning", "Excel / Sheets", "Market Research"],
    matchScore: 97,
    tingkatKesulitan: "Menengah",
    rekomendasiProdi: ["Manajemen", "Akuntansi", "Ekonomi Pembangunan", "Bisnis Digital"],
    gajiStipend: "Rp 4.000.000 / bulan",
  },
  {
    id: "5",
    perusahaan: "Skyline Fintech",
    judul: "Magang: Frontend Developer (Next.js & Tailwind)",
    tipe: "Magang",
    kategori: "Software Development",
    deskripsi:
      "Membantu tim engineer memproduksi komponen UI dashboard transaksi finansial secara responsif dan performan.",
    lokasi: "Hybrid",
    batasWaktu: "30 Agustus 2026",
    statusModerasi: "Disetujui",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    matchScore: 95,
    tingkatKesulitan: "Menengah",
    rekomendasiProdi: ["Sistem Informasi", "Teknik Informatika", "Ilmu Komputer"],
    gajiStipend: "Rp 3.500.000 / bulan",
  },
  {
    id: "6",
    perusahaan: "Cakra Health Tech",
    judul: "Magang: Data Analyst Telemedisin",
    tipe: "Magang",
    kategori: "Data Science & Analytics",
    deskripsi:
      "Mengolah data rekam konsul medis anonim untuk mendukung insight peningkatan layanan aplikasi kesehatan internal.",
    lokasi: "Jakarta",
    batasWaktu: "28 Agustus 2026",
    statusModerasi: "Disetujui",
    tags: ["SQL", "Tableau", "Data Analysis", "Healthcare Tech"],
    matchScore: 91,
    tingkatKesulitan: "Menengah",
    rekomendasiProdi: ["Sistem Informasi", "Data Science", "Kesehatan Masyarakat", "Farmasi"],
    gajiStipend: "Rp 3.000.000 / bulan",
  },
  {
    id: "7",
    perusahaan: "LegalTech Mitra Utama",
    judul: "Studi Kasus: Analisis Regulasi Pelindungan Data Pribadi (UU PDP)",
    tipe: "Akademik",
    kategori: "Legal & Regulatory Affairs",
    deskripsi:
      "Menyusun draf rekomendasi kepatuhan tata kelola data perusahaan startup terhadap ketentuan UU PDP Indonesia.",
    lokasi: "Remote",
    batasWaktu: "08 September 2026",
    statusModerasi: "Disetujui",
    tags: ["Legal Drafting", "Cyber Law", "Compliance", "UU PDP"],
    matchScore: 93,
    tingkatKesulitan: "Menengah",
    rekomendasiProdi: ["Hukum", "Hubungan Internasional", "Sistem Informasi"],
    gajiStipend: "Insentif Riset Rp 2.000.000",
  },
  {
    id: "8",
    perusahaan: "Kreatif Studio Indonesia",
    judul: "Studi Kasus: Redesign Packaging & Visual Identity Produk Lokal",
    tipe: "Akademik",
    kategori: "UI/UX & Product Design",
    deskripsi:
      "Merancang ulang identitas visual, kemasan produk, dan ilustrasi digital untuk brand kuliner lokal Nusantara.",
    lokasi: "Remote",
    batasWaktu: "12 September 2026",
    statusModerasi: "Disetujui",
    tags: ["Adobe Photoshop", "Branding", "Desain Produk", "Illustration"],
    matchScore: 94,
    tingkatKesulitan: "Pemula",
    rekomendasiProdi: ["Desain Komunikasi Visual", "Desain Produk", "Pemasaran"],
    gajiStipend: "E-Sertifikat + Award Portofolio Terbaik",
  },
  {
    id: "9",
    perusahaan: "TalentFlow Consulting",
    judul: "Riset: Evaluasi Budaya Kerja Hybrid & Employee Engagement",
    tipe: "Akademik",
    kategori: "Human Resources & Psychology",
    deskripsi:
      "Melakukan survei dan analisis indikator kepuasan karyawan pada skema kerja hybrid pasca-pandemi.",
    lokasi: "Remote",
    batasWaktu: "15 September 2026",
    statusModerasi: "Disetujui",
    tags: ["HR Analytics", "Psikologi", "Survey Research", "SPSS"],
    matchScore: 92,
    tingkatKesulitan: "Pemula",
    rekomendasiProdi: ["Psikologi", "Manajemen", "Ilmu Komunikasi"],
    gajiStipend: "Insentif Riset Rp 1.800.000",
  },
];

/* ==========================================================================
   7. BADGES LIST
   ========================================================================== */

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

/* ==========================================================================
   8. PUBLIC USER PROFILES & PROFILE SEARCH LOOKUP
   ========================================================================== */

export type PublicUserProfile = {
  id: string;
  nama: string;
  email: string;
  universitas?: string;
  prodi?: string;
  semester?: string;
  sistemKerja?: string;
  minatKategori?: string[];
  skills?: string[];
  preferensiTipe?: string;
  ringkasan?: string;
  foto?: string;
  level?: number;
};

export const dummyPublicUsers: Record<string, PublicUserProfile> = {
  john: {
    id: "john",
    nama: "John Doe",
    email: "mahasiswa@umn.ac.id",
    universitas: "Universitas Multimedia Nusantara",
    prodi: "Sistem Informasi",
    semester: "Semester 3",
    sistemKerja: "Remote",
    preferensiTipe: "Akademik & Magang",
    ringkasan: "Passionate Data & UI/UX Student.",
    skills: ["Figma", "SQL", "Python", "React / Next.js"],
    minatKategori: ["UI/UX & Product Design", "Software Development"],
    level: 1,
  },
  julius: {
    id: "wijaya",
    nama: "andi wijaya ",
    email: "andi.wijaya@student.umn.ac.id",
    universitas: "Universitas Multimedia Nusantara",
    prodi: "Sistem Informasi",
    semester: "Semester 3",
    sistemKerja: "Remote",
    preferensiTipe: "Akademik & Proyek",
    ringkasan: "Passionate Data Analyst & Tech Enthusiast.",
    skills: ["Premiere Pro", "Public Speaking", "SQL", "Python"],
    minatKategori: ["Legal & Regulatory Affairs", "Content & Brand Communications"],
    level: 1,
  },
  siti: {
    id: "siti",
    nama: "Siti Rahma",
    email: "siti.rahma@itb.ac.id",
    universitas: "Institut Teknologi Bandung",
    prodi: "Desain Komunikasi Visual",
    semester: "Semester 5",
    sistemKerja: "Hybrid",
    preferensiTipe: "Proyek & Magang",
    ringkasan: "UI/UX Designer & Graphic Specialist.",
    skills: ["Figma", "Adobe Photoshop", "Branding", "Copywriting"],
    minatKategori: ["UI/UX & Product Design", "Content & Brand Communications"],
    level: 2,
  },
  budi: {
    id: "budi",
    nama: "Budi Santoso",
    email: "budi.s@ui.ac.id",
    universitas: "Universitas Indonesia",
    prodi: "Ilmu Komputer",
    semester: "Semester 5",
    sistemKerja: "Hybrid",
    preferensiTipe: "Magang",
    ringkasan: "Software Engineering & Fullstack Web Developer.",
    skills: ["React / Next.js", "TypeScript", "SQL", "Python"],
    minatKategori: ["Software Development", "Cyber Security & Cloud"],
    level: 2,
  },
  andi: {
    id: "andi",
    nama: "Andi Pratama",
    email: "andi.pratama@ugm.ac.id",
    universitas: "Universitas Gadjah Mada",
    prodi: "Teknik Informatika",
    semester: "Semester 5",
    sistemKerja: "Remote",
    preferensiTipe: "Akademik & Magang",
    ringkasan: "Backend Developer & AI Practitioner.",
    skills: ["Python", "SQL", "Project Management"],
    minatKategori: ["Software Development", "Data Science & Analytics"],
    level: 1,
  },
  maya: {
    id: "maya",
    nama: "Maya Anggraini",
    email: "maya.a@its.ac.id",
    universitas: "Institut Teknologi Sepuluh Nopember",
    prodi: "Data Science",
    semester: "Semester 3",
    sistemKerja: "Remote",
    preferensiTipe: "Akademik",
    ringkasan: "Data Enthusiast specializing in Machine Learning.",
    skills: ["Python", "Tableau", "SPSS", "SQL"],
    minatKategori: ["Data Science & Analytics"],
    level: 1,
  },
  rizky: {
    id: "rizky",
    nama: "Rizky Febrian",
    email: "rizky.f@unair.ac.id",
    universitas: "Universitas Airlangga",
    prodi: "Manajemen",
    semester: "Semester 5",
    sistemKerja: "Onsite / Hybrid",
    preferensiTipe: "Magang",
    ringkasan: "Marketing Strategy & Business Development Student.",
    skills: ["Business Planning", "Market Research", "Social Media Marketing"],
    minatKategori: ["Business Strategy & Marketing", "Finance & Financial Modeling"],
    level: 1,
  },
  nadia: {
    id: "nadia",
    nama: "Nadia Putri",
    email: "nadia.p@unpad.ac.id",
    universitas: "Universitas Padjadjaran",
    prodi: "Akuntansi",
    semester: "Semester 5",
    sistemKerja: "Hybrid",
    preferensiTipe: "Magang & Akademik",
    ringkasan: "Financial Modeling & Corporate Accounting Student.",
    skills: ["Financial Modeling", "Excel / Sheets", "Market Research"],
    minatKategori: ["Finance & Financial Modeling"],
    level: 1,
  },
  dimas: {
    id: "dimas",
    nama: "Dimas Setyo",
    email: "dimas.s@undip.ac.id",
    universitas: "Universitas Diponegoro",
    prodi: "Teknik Industri",
    semester: "Semester 7",
    sistemKerja: "Remote",
    preferensiTipe: "Akademik",
    ringkasan: "Supply Chain & Operations Enthusiast.",
    skills: ["Supply Chain Ops", "Project Management", "Excel / Sheets"],
    minatKategori: ["Supply Chain & Logistics", "Business Strategy & Marketing"],
    level: 2,
  },
  aurelia: {
    id: "aurelia",
    nama: "Aurelia Clarissa",
    email: "aurelia.c@binus.ac.id",
    universitas: "Universitas Bina Nusantara",
    prodi: "Bisnis Digital",
    semester: "Semester 3",
    sistemKerja: "Remote",
    preferensiTipe: "Magang",
    ringkasan: "Digital Marketer & E-Commerce Strategist.",
    skills: ["Social Media Marketing", "Copywriting", "Branding"],
    minatKategori: ["Business Strategy & Marketing", "Content & Brand Communications"],
    level: 1,
  },
  farhan: {
    id: "farhan",
    nama: "Farhan Ramadhan",
    email: "farhan.r@telkomuniversity.ac.id",
    universitas: "Telkom University",
    prodi: "Cyber Security",
    semester: "Semester 5",
    sistemKerja: "Remote",
    preferensiTipe: "Proyek & Magang",
    ringkasan: "Cybersecurity Analyst & Ethical Hacking Trainee.",
    skills: ["Python", "SQL", "Project Management"],
    minatKategori: ["Cyber Security & Cloud", "Software Development"],
    level: 2,
  },
  dewa: {
    id: "dewa",
    nama: "Dewa Kusuma",
    email: "dewa.k@ub.ac.id",
    universitas: "Universitas Brawijaya",
    prodi: "Ilmu Komputer",
    semester: "Semester 5",
    sistemKerja: "Hybrid",
    preferensiTipe: "Magang",
    ringkasan: "Fullstack Web & Mobile App Developer.",
    skills: ["React / Next.js", "TypeScript", "Python"],
    minatKategori: ["Software Development"],
    level: 1,
  },
  jessica: {
    id: "jessica",
    nama: "Jessica Tan",
    email: "jessica.t@uph.edu",
    universitas: "Universitas Pelita Harapan",
    prodi: "Desain Produk",
    semester: "Semester 3",
    sistemKerja: "Remote",
    preferensiTipe: "Akademik & Proyek",
    ringkasan: "Industrial & Visual Product Designer.",
    skills: ["Adobe Photoshop", "Branding", "Figma"],
    minatKategori: ["UI/UX & Product Design"],
    level: 1,
  },
  kevin: {
    id: "kevin",
    nama: "Kevin Wijaya",
    email: "kevin.w@atmajaya.ac.id",
    universitas: "Universitas Katolik Indonesia Atma Jaya",
    prodi: "Hukum",
    semester: "Semester 7",
    sistemKerja: "Remote",
    preferensiTipe: "Akademik",
    ringkasan: "Corporate & Cyber Law Researcher.",
    skills: ["Legal Drafting", "Public Speaking"],
    minatKategori: ["Legal & Regulatory Affairs"],
    level: 2,
  },
};

/**
 * Helper untuk mengambil profil pengguna berdasarkan ID / Nama pencarian URL slug.
 */
export function getUserProfileById(id: string): PublicUserProfile {
  const normalizedId = id.toLowerCase().trim();

  if (dummyPublicUsers[normalizedId]) {
    return dummyPublicUsers[normalizedId];
  }

  // Fallback pencarian parsial berdasarkan nama jika slug tidak persis sama
  const matchedKey = Object.keys(dummyPublicUsers).find((key) =>
    dummyPublicUsers[key].nama.toLowerCase().includes(normalizedId)
  );

  if (matchedKey) {
    return dummyPublicUsers[matchedKey];
  }

  // Fallback default jika ID acak dimasukkan
  return {
    id: normalizedId,
    nama: normalizedId.charAt(0).toUpperCase() + normalizedId.slice(1),
    email: `${normalizedId}@student.umn.ac.id`,
    universitas: "Universitas Multimedia Nusantara",
    prodi: "Sistem Informasi",
    semester: "Semester 3",
    sistemKerja: "Remote",
    preferensiTipe: "Akademik",
    ringkasan: "Mahasiswa Aktif BridgeU",
    skills: ["General Skill"],
    minatKategori: ["Umum"],
    level: 1,
  };
}