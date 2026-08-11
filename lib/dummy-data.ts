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
  id: "comp-1",
  email: "perusahaan@nexora.com",
  password: "password123",
  nama: "Nexora Digital",
  industri: "Teknologi & Produk Digital",
  lokasi: "Jakarta Selatan",
  role: "perusahaan",
  nib: "9120003418921",
  deskripsi: "Perusahaan teknologi terdepan yang berfokus pada pengembangan produk digital modern dan solusi perangkat lunak enterprise.",
  website: "https://nexora.com",
  logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
  kontakPIC: {
    nama: "Budi Pratama",
    email: "hr@nexora.com",
    telepon: "081234567890",
  },
  statusVerifikasi: "Terverifikasi" as const,
  tierAkun: "Free" as const,
  tanggalDaftar: "2024-01-15"
};

export const dummyAdmin = {
  email: "admin@bridgeu.id",
  password: "password123",
  nama: "Administrator BridgeU",
  role: "admin",
};

/* ==========================================================================
   2. REGISTERED COMPANIES (ADMIN & PROFILE MANAGEMENT)
   ========================================================================== */

export type RegisteredCompany = {
  id: string;
  nama: string;
  email: string;
  industri: string;
  nib: string;
  lokasi: string;
  tanggalDaftar: string;
  statusVerifikasi: "Terverifikasi" | "Menunggu Verifikasi" | "Menunggu Verifikasi Ulang" | "Ditolak";
  deskripsi?: string;
  website?: string;
  logo?: string;
  kontakPIC?: {
    nama: string;
    email: string;
    telepon: string;
  };
  tierAkun?: "Free" | "Premium";
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
    deskripsi: "Perusahaan teknologi terdepan yang berfokus pada pengembangan produk digital modern dan solusi perangkat lunak enterprise.",
    website: "https://nexora.com",
    kontakPIC: {
      nama: "Budi Pratama",
      email: "hr@nexora.com",
      telepon: "081234567890",
    },
    tierAkun: "Free",
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

/* Buffer Edit Profil yang Butuh Re-Approval Admin (Fitur #1) */
export type CompanyPendingEdit = {
  perusahaanId: string;
  namaPerusahaan: string;
  industri: string;
  nib: string;
  tanggalDiajukan: string;
};

/* ==========================================================================
   3. MANAGED USERS
   ========================================================================== */

export type ManagedUser = {
  id: string;
  nama: string;
  email: string;
  role: "Mahasiswa" | "Perusahaan";
  detail: string;
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
];

/* ==========================================================================
   4. APPLICANTS (PELAMAR LOG & SHORTLIST)
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
  status: "Menunggu" | "Shortlisted" | "Diterima" | "Ditolak" | "Selesai";
  tanggal: string;
  direkrutSetelahnya?: boolean; // Fitur #8 analytics
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
    status: "Shortlisted",
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
   5. SUBMISSIONS (REVIEW & PENILAIAN SOLUSI MAHASISWA - Fitur #6)
   ========================================================================== */

export type Submission = {
  id: string;
  pelamarId: string;
  kolaborasiId: string;
  kolaborasiJudul: string;
  namaMahasiswa: string;
  fileUrl?: string;
  linkEksternal?: string;
  catatanMahasiswa: string;
  tanggalSubmit: string;
  status: "Menunggu Review" | "Direview" | "Revisi Diminta";
  feedbackPerusahaan?: string;
  rating?: number; // 1-5
  skillDinilai?: string[];
};

export const dummySubmissionsList: Submission[] = [
  {
    id: "sub-1",
    pelamarId: "pelamar-3",
    kolaborasiId: "3",
    kolaborasiJudul: "Magang: Frontend Developer",
    namaMahasiswa: "Budi Santoso",
    linkEksternal: "https://github.com/budisantoso/nexora-dashboard-ui",
    catatanMahasiswa: "Berikut hasil implementasi 5 komponen dashboard responsif menggunakan Next.js App Router dan Tailwind CSS.",
    tanggalSubmit: "08 Agustus 2026",
    status: "Menunggu Review",
  },
];

/* ==========================================================================
   6. MESSAGING & INTERVIEWS (Fitur #7 & Fitur #12)
   ========================================================================== */

export type Message = {
  id: string;
  kolaborasiId: string;
  pelamarId: string;
  pengirim: "perusahaan" | "mahasiswa";
  isi: string;
  timestamp: string;
  dibaca: boolean;
};

export const dummyMessagesList: Message[] = [
  {
    id: "msg-1",
    kolaborasiId: "1",
    pelamarId: "pelamar-1",
    pengirim: "perusahaan",
    isi: "Halo John, terima kasih sudah apply! Bisakah Anda mengirimkan link sampel portofolio Figma yang pernah dibuat?",
    timestamp: "04 Aug 2026, 14:30",
    dibaca: true,
  },
  {
    id: "msg-2",
    kolaborasiId: "1",
    pelamarId: "pelamar-1",
    pengirim: "mahasiswa",
    isi: "Tentu pak, berikut link portofolio saya: figma.com/@johndoe. Mohon masukkannya!",
    timestamp: "04 Aug 2026, 15:10",
    dibaca: false,
  },
];

export type Interview = {
  id: string;
  pelamarId: string;
  namaMahasiswa: string;
  kolaborasiJudul: string;
  tanggalWaktu: string;
  metode: "Online" | "Offline";
  linkMeeting?: string;
  lokasi?: string;
  catatan?: string;
  statusKonfirmasi: "Diajukan" | "Dikonfirmasi Mahasiswa" | "Dibatalkan";
};

/* ==========================================================================
   7. IN-APP NOTIFICATIONS (Fitur #9)
   ========================================================================== */

export type CompanyNotification = {
  id: string;
  judul: string;
  pesan: string;
  timestamp: string;
  dibaca: boolean;
  tipe: "pelamar" | "submission" | "deadline" | "verifikasi" | "pesan";
  link?: string;
};

export const dummyCompanyNotifications: CompanyNotification[] = [
  {
    id: "notif-1",
    judul: "Pelamar Baru Masuk 🎓",
    pesan: "John Doe mengajukan lamaran untuk 'Studi Kasus: Optimasi UX Aplikasi Perbankan'.",
    timestamp: "2 jam yang lalu",
    dibaca: false,
    tipe: "pelamar",
    link: "/perusahaan/pelamar",
  },
  {
    id: "notif-2",
    judul: "Hasil Solusi Di-upload 🚀",
    pesan: "Budi Santoso mengunggah laporan hasil solusi untuk 'Magang: Frontend Developer'.",
    timestamp: "5 jam yang lalu",
    dibaca: false,
    tipe: "submission",
    link: "/perusahaan/pelamar?tab=submission",
  },
  {
    id: "notif-3",
    judul: "Verifikasi Akun Berhasil ✓",
    pesan: "Profil perusahaan Nexora Digital telah disetujui oleh Administrator BridgeU.",
    timestamp: "1 hari yang lalu",
    dibaca: true,
    tipe: "verifikasi",
    link: "/perusahaan/profil",
  },
];

/* ==========================================================================
   8. REVIEWS & RATINGS PERUSAHAAN (Fitur #13)
   ========================================================================== */

export type CompanyReview = {
  id: string;
  perusahaanId: string;
  mahasiswaId: string;
  namaMahasiswa: string;
  kolaborasiId: string;
  kolaborasiJudul: string;
  rating: number; // 1-5
  komentar: string;
  tanggal: string;
};

export const dummyCompanyReviews: CompanyReview[] = [
  {
    id: "rev-1",
    perusahaanId: "comp-1",
    mahasiswaId: "usr-4",
    namaMahasiswa: "Budi Santoso",
    kolaborasiId: "3",
    kolaborasiJudul: "Magang: Frontend Developer",
    rating: 5,
    komentar: "Lingkungan kerja sangat suportif! Mentor dari tim eng Nexora memberikan feedback riset yang relevan.",
    tanggal: "10 Agustus 2026",
  },
];

/* ==========================================================================
   9. DROPDOWN & OPTIONS LISTS
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
  { label: "Manajemen & Bisnis", value: "Manajemen", group: "Ekonomi & Bisnis" },
  { label: "Akuntansi & Keuangan", value: "Akuntansi", group: "Ekonomi & Bisnis" },
  { label: "Bisnis Digital", value: "Bisnis Digital", group: "Ekonomi & Bisnis" },
  { label: "Desain Komunikasi Visual (DKV)", value: "Desain Komunikasi Visual", group: "Desain & Komunikasi" },
  { label: "Ilmu Komunikasi", value: "Ilmu Komunikasi", group: "Desain & Komunikasi" },
  { label: "Sistem Informasi", value: "Sistem Informasi", group: "Teknologi & Komputer" },
  { label: "Teknik Informatika", value: "Teknik Informatika", group: "Teknologi & Komputer" },
  { label: "Data Science & Analitik", value: "Data Science", group: "Teknologi & Komputer" },
  { label: "Ilmu Komputer", value: "Ilmu Komputer", group: "Teknologi & Komputer" },
  { label: "Teknik Industri", value: "Teknik Industri", group: "Teknik & Arsitektur" },
  { label: "Hukum Bisnis", value: "Hukum", group: "Hukum & Humaniora" },
  { label: "Psikologi Organisasi", value: "Psikologi", group: "Hukum & Humaniora" },
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
  "Figma",
  "Adobe Photoshop",
  "Premiere Pro",
  "Copywriting",
  "Branding",
  "Business Planning",
  "Financial Modeling",
  "Market Research",
  "Excel / Sheets",
  "Public Speaking",
  "Social Media Marketing",
  "Python",
  "SQL",
  "React / Next.js",
  "TypeScript",
  "Tableau",
  "SPSS",
  "Project Management",
  "Legal Drafting",
  "HR Analytics",
  "Supply Chain Ops",
];

/* ==========================================================================
   10. COLLABORATIONS DATA (WITH MAGANG & KUOTA FIELDS)
   ========================================================================== */

export type Kolaborasi = {
  id: string;
  perusahaan: string;
  perusahaanId?: string;
  judul: string;
  tipe: "Akademik" | "Magang";
  kategori: string;
  deskripsi: string;
  persyaratan?: string;
  lokasi: string;
  batasWaktu: string;
  statusModerasi?: "Disetujui" | "Menunggu" | "Ditolak";
  tags?: string[];
  matchScore?: number;
  tingkatKesulitan?: "Pemula" | "Menengah" | "Lanjutan";
  rekomendasiProdi?: string[];
  gajiStipend?: string;
  
  // Fitur #3: Field Kuota Peserta
  kuota: number;
  kuotaTerisi?: number;

  // Fitur #4: Field Magang vs Akademik
  durasiKerja?: string;
  kompensasi?: {
    tipe: "Berbayar" | "Uang Saku" | "Tidak Berbayar" | "Sertifikat Saja";
    jumlah?: number | null;
  };
  jamKerja?: string;
  durasiPengerjaan?: string;
  insentif?: string;

  // Fitur #5 & #15: Mode Publikasi & Draft
  statusPublikasi?: "Draft" | "Terbit";
  tipePublikasi?: "Publik" | "Harus Diajukan";
  updated_at?: string;
};

export const dummyKolaborasi: Kolaborasi[] = [
  {
    id: "1",
    perusahaan: "Nexora Digital",
    perusahaanId: "comp-1",
    judul: "Studi Kasus: Optimasi UX Aplikasi Perbankan",
    tipe: "Akademik",
    kategori: "UI/UX & Product Design",
    deskripsi: "Analisis dan usulkan perbaikan alur onboarding serta aksesibilitas pada aplikasi mobile banking berbasis data pengujian pengguna.",
    persyaratan: "Mahasiswa semester 3+, menguasai dasar Figma & Usability Testing.",
    lokasi: "Remote",
    batasWaktu: "20 Agustus 2026",
    statusModerasi: "Disetujui",
    tags: ["Figma", "User Research", "Usability Testing", "UI/UX"],
    matchScore: 98,
    tingkatKesulitan: "Menengah",
    rekomendasiProdi: ["Sistem Informasi", "Desain Komunikasi Visual", "Teknik Informatika"],
    gajiStipend: "E-Sertifikat + Insentif Riset Rp 1.500.000",
    kuota: 3,
    kuotaTerisi: 0,
    durasiPengerjaan: "1 Semester",
    insentif: "E-Sertifikat + Insentif Riset Rp 1.500.000",
    statusPublikasi: "Terbit",
    tipePublikasi: "Publik",
  },
  {
    id: "2",
    perusahaan: "Vertex Logistics",
    perusahaanId: "comp-2",
    judul: "Riset: Prediksi Permintaan Gudang Berbasis AI",
    tipe: "Akademik",
    kategori: "Data Science & Analytics",
    deskripsi: "Membangun model Machine Learning prediktif sederhana untuk kebutuhan pengalokasian stok gudang logistik regional.",
    lokasi: "Jakarta",
    batasWaktu: "25 Agustus 2026",
    statusModerasi: "Disetujui",
    tags: ["Python", "Pandas", "Scikit-Learn", "Machine Learning"],
    matchScore: 94,
    tingkatKesulitan: "Lanjutan",
    rekomendasiProdi: ["Sistem Informasi", "Data Science", "Teknik Informatika", "Teknik Industri"],
    gajiStipend: "Insentif Proyek Rp 2.500.000",
    kuota: 2,
    kuotaTerisi: 0,
    statusPublikasi: "Terbit",
    tipePublikasi: "Publik",
  },
  {
    id: "3",
    perusahaan: "Nexora Digital",
    perusahaanId: "comp-1",
    judul: "Magang: Frontend Developer (Next.js & Tailwind)",
    tipe: "Magang",
    kategori: "Software Development",
    deskripsi: "Membantu tim engineer memproduksi komponen UI dashboard transaksi finansial secara responsif dan performan.",
    persyaratan: "Paham React, Next.js App Router, Tailwind CSS, & TypeScript.",
    lokasi: "Hybrid",
    batasWaktu: "30 Agustus 2026",
    statusModerasi: "Disetujui",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    matchScore: 95,
    tingkatKesulitan: "Menengah",
    rekomendasiProdi: ["Sistem Informasi", "Teknik Informatika", "Ilmu Komputer"],
    gajiStipend: "Rp 3.500.000 / bulan",
    kuota: 2,
    kuotaTerisi: 1,
    durasiKerja: "6 bulan",
    kompensasi: {
      tipe: "Uang Saku",
      jumlah: 3500000,
    },
    jamKerja: "Full-time (40 jam/minggu)",
    statusPublikasi: "Terbit",
    tipePublikasi: "Publik",
  },
];

/* ==========================================================================
   11. PUBLIC USER PROFILES
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
};

export function getUserProfileById(id: string): PublicUserProfile {
  const normalizedId = id.toLowerCase().trim();

  if (dummyPublicUsers[normalizedId]) {
    return dummyPublicUsers[normalizedId];
  }

  const matchedKey = Object.keys(dummyPublicUsers).find((key) =>
    dummyPublicUsers[key].nama.toLowerCase().includes(normalizedId)
  );

  if (matchedKey) {
    return dummyPublicUsers[matchedKey];
  }

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

/* ==========================================================================
   BADGE LIST
   ========================================================================== */

export type Badge = {
  id: string;
  nama: string;
  deskripsi: string;
  check: (totalPengajuan: number, diterima: number) => boolean;
};

export const badgeList: Badge[] = [
  {
    id: "first-step",
    nama: "First Step",
    deskripsi: "Berhasil mengajukan kolaborasi pertama kali di BridgeU.",
    check: (total) => total >= 1,
  },
  {
    id: "rising-star",
    nama: "Rising Star",
    deskripsi: "Telah mengajukan 5 kolaborasi — terus semangat!",
    check: (total) => total >= 5,
  },
  {
    id: "consistent-contributor",
    nama: "Consistent Contributor",
    deskripsi: "Aktif mengajukan 10 kolaborasi di berbagai perusahaan.",
    check: (total) => total >= 10,
  },
  {
    id: "accepted-pro",
    nama: "Accepted Pro",
    deskripsi: "Berhasil diterima atau menyelesaikan 1 kolaborasi.",
    check: (_total, diterima) => diterima >= 1,
  },
  {
    id: "triple-winner",
    nama: "Triple Winner",
    deskripsi: "Sudah diterima atau menyelesaikan 3 kolaborasi berbeda.",
    check: (_total, diterima) => diterima >= 3,
  },
  {
    id: "bridge-champion",
    nama: "Bridge Champion",
    deskripsi: "Menyelesaikan atau diterima di 5 kolaborasi — kamu adalah champion!",
    check: (_total, diterima) => diterima >= 5,
  },
];

export const semesterList = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8+",
];