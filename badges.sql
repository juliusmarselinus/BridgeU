INSERT INTO public.badges (kode_badge, nama_badge, deskripsi, icon_url, kategori, xp_bonus)
VALUES
  -- A. PENGALAMAN & AKTIVITAS PERTAMA (ONBOARDING & FIRST STEPS)
  ('FIRST_PROFILE', 'Langkah Awal', 'Melengkapi 100% data profil mahasiswa dan portofolio.', 'https://img.icons8.com/color/96/user-check.png', 'Onboarding', 50),
  ('FIRST_APPLY', 'Pencari Peluang', 'Mengirimkan pengajuan lamaran kolaborasi pertama.', 'https://img.icons8.com/color/96/paper-plane.png', 'Aktivitas', 50),
  ('FIRST_ACCEPT', 'Pendatang Baru', 'Diterima dalam proyek kolaborasi atau magang untuk pertama kali.', 'https://img.icons8.com/color/96/handshake.png', 'Pencapaian', 100),
  ('FIRST_FINISH', 'Misi Tuntas', 'Berhasil menyelesaikan 1 proyek kolaborasi hingga tahap evaluasi.', 'https://img.icons8.com/color/96/checked-checkbox.png', 'Pencapaian', 150),
  ('FIRST_REVIEW', 'Sudut Pandang Mitra', 'Mendapatkan ulasan dan evaluasi resmi pertama dari Perusahaan Mitra.', 'https://img.icons8.com/color/96/star.png', 'Evaluasi', 75),

  -- B. PRODUKTIVITAS & KONSISTENSI (MILESTONES)
  ('PROJ_3', 'Pekerja Gigih', 'Menyelesaikan 3 proyek kolaborasi lintas bidang.', 'https://img.icons8.com/color/96/diploma.png', 'Produktivitas', 200),
  ('PROJ_5', 'Pro-Collaborator', 'Menyelesaikan 5 proyek kolaborasi dengan hasil yang disetujui.', 'https://img.icons8.com/color/96/trophy.png', 'Produktivitas', 350),
  ('PROJ_10', 'Legenda Kolaborasi', 'Menyelesaikan 10 proyek kolaborasi selama masa studi.', 'https://img.icons8.com/color/96/crown.png', 'Produktivitas', 500),
  ('STREAK_7', 'Konsistensi Murni', 'Aktif di platform selama 7 hari berturut-turut.', 'https://img.icons8.com/color/96/fire.png', 'Aktivitas', 100),
  ('STREAK_30', 'Dedikasi Tanpa Batas', 'Aktif di platform selama 30 hari berturut-turut.', 'https://img.icons8.com/color/96/lightning-bolt.png', 'Aktivitas', 300),

  -- C. KATEGORI SPESIALISASI AKADEMIK & INDUSTRI (MULTI-DISIPLIN)
  ('CAT_COMMUNICATION', 'Pakar Komunikasi', 'Menyelesaikan proyek di bidang Public Relations, Branding, atau Media.', 'https://img.icons8.com/color/96/megaphone.png', 'Komunikasi', 150),
  ('CAT_BUSINESS', 'Strategis Bisnis', 'Menyelesaikan studi kasus Analisis Pasar, Kelayakan Bisnis, atau Manajemen.', 'https://img.icons8.com/color/96/chart-line.png', 'Bisnis', 150),
  ('CAT_CREATIVE', 'Kreator Visual', 'Menyelesaikan proyek di bidang Desain Grafis, Video, atau Identitas Merek.', 'https://img.icons8.com/color/96/palette.png', 'Kreatif', 150),
  ('CAT_RESEARCH', 'Peneliti Andal', 'Menyelesaikan studi kasus berbasis Riset Akademik, Survei, atau Data Kualitatif.', 'https://img.icons8.com/color/96/test-tube.png', 'Riset', 150),
  ('CAT_LEGAL', 'Pengawal Kepatuhan', 'Menyelesaikan analisis studi kasus Hukum, Kontrak Bisnis, atau Legal Drafting.', 'https://img.icons8.com/color/96/scale.png', 'Hukum', 150),
  ('CAT_FINANCE', 'Master Keuangan', 'Menyelesaikan studi kasus Keuangan, Audit, atau Perencanaan Anggaran.', 'https://img.icons8.com/color/96/money-bag.png', 'Keuangan', 150),
  ('CAT_HR', 'Pengembang Talenta', 'Menyelesaikan studi kasus Manajemen SDM, Pelatihan, atau Budaya Kerja.', 'https://img.icons8.com/color/96/conference-call.png', 'SDM', 150),
  ('CAT_ESG', 'Pahlawan Keberlanjutan', 'Menyelesaikan studi kasus Lingkungan, ESG, atau Program Bank Sampah.', 'https://img.icons8.com/color/96/leaf.png', 'Lingkungan', 150),
  ('CAT_EDUCATION', 'Pendidik Inspiratif', 'Menyelesaikan proyek Modul Edukasi, Pengajaran, atau Pengembangan Anak.', 'https://img.icons8.com/color/96/open-book.png', 'Pendidikan', 150),
  ('CAT_SOCIAL', 'Penggerak Sosial', 'Menyelesaikan studi kasus Pengabdian Masyarakat atau Dampak Sosio-Ekonomi.', 'https://img.icons8.com/color/96/filled-like.png', 'Sosial', 150),

  -- D. KUALITAS PEKERJAAN & EVALUASI PERUSAHAAN (PERFORMENCE)
  ('PERFECT_SCORE', 'Bintang Lima', 'Mendapatkan evaluasi dengan pujian sempurna dari Perusahaan Mitra.', 'https://img.icons8.com/color/96/five-star.png', 'Kualitas', 200),
  ('FAST_DELIVERY', 'Tepat Waktu', 'Mengumpulkan hasil pekerjaan jauh sebelum batas waktu yang ditentukan.', 'https://img.icons8.com/color/96/clock.png', 'Kualitas', 100),
  ('ZERO_REVISION', 'Satu Kali Tuntas', 'Hasil pengumpulan langsung disetujui tanpa perlu proses revisi.', 'https://img.icons8.com/color/96/approval.png', 'Kualitas', 150),
  ('INNOVATION_HERO', 'Solusi Inovatif', 'Mendapatkan apresiasi khusus atas ide gagasan yang sangat kreasional.', 'https://img.icons8.com/color/96/idea.png', 'Kualitas', 175),
  ('DETAILED_ANALYST', 'Analisis Tajam', 'Dipuji karena kedalaman analisis dan kerapian dokumentasi laporan.', 'https://img.icons8.com/color/96/search.png', 'Kualitas', 125),

  -- E. EXCELLENCE & SKILLS MULTI-ARAH (SOFT SKILLS & WORK ETHIC)
  ('FAST_RESPONDER', 'Respon Cepat', 'Memiliki tingkat respon komunikasi di atas 90% saat dipanggil mitra.', 'https://img.icons8.com/color/96/chat.png', 'Soft Skills', 100),
  ('PROBLEM_SOLVER', 'Pemecah Masalah', 'Menyelesaikan proyek studi kasus dengan tingkat kesulitan Lanjut.', 'https://img.icons8.com/color/96/puzzle.png', 'Soft Skills', 200),
  ('ADAPTIVE_TALENT', 'Talenta Serba Bisa', 'Menyelesaikan kolaborasi di 3 kategori industri yang berbeda.', 'https://img.icons8.com/color/96/services.png', 'Fleksibilitas', 250),
  ('CRITICAL_THINKER', 'Pemikir Kritis', 'Menyusun laporan rekomendasi strategis yang memuaskan mitra bisnis.', 'https://img.icons8.com/color/96/brainstorming.png', 'Soft Skills', 150),
  ('PRESENTATION_PRO', 'Komunikator Ulung', 'Menyampaikan hasil paparan proyek/studi kasus secara komunikatif.', 'https://img.icons8.com/color/96/presentation.png', 'Soft Skills', 125),

  -- F. TINGKAT INTERNSHIP & PENGALAMAN KERJA (MAGANG)
  ('INTERN_STARTER', 'Magang Pertama', 'Resmi menyelesaikan durasi magang industri pertama.', 'https://img.icons8.com/color/96/briefcase.png', 'Magang', 200),
  ('INTERN_PRO', 'Pengalaman Lapangan', 'Menyelesaikan magang dengan durasi minimal 3 bulan.', 'https://img.icons8.com/color/96/businesswoman.png', 'Magang', 300),
  ('HIGH_STIPEND', 'Nilai Tinggi', 'Diterima pada posisi magang/studi kasus berskema stipend/insentif tinggi.', 'https://img.icons8.com/color/96/diamond.png', 'Pencapaian', 150),
  ('WORK_READY', 'Siap Kerja', 'Mendapatkan surat rekomendasi langsung dari pimpinan Perusahaan Mitra.', 'https://img.icons8.com/color/96/verified-account.png', 'Karier', 300),
  ('REHIRED_TALENT', 'Talenta Favorit', 'Ditawari perpanjangan kolaborasi/kontrak oleh perusahaan yang sama.', 'https://img.icons8.com/color/96/loop.png', 'Karier', 250),

  -- G. GAMIFIKASI REPUTASI & XP LEVEL (EXPERIENCE & COMMUNITY)
  ('XP_1000', 'Mahasiswa Berprestasi I', 'Mencapai total akumulasi 1.000 XP di dalam platform.', 'https://img.icons8.com/color/96/bronze-medal.png', 'Reputasi', 100),
  ('XP_5000', 'Mahasiswa Berprestasi II', 'Mencapai total akumulasi 5.000 XP di dalam platform.', 'https://img.icons8.com/color/96/silver-medal.png', 'Reputasi', 250),
  ('XP_10000', 'Mahasiswa Berprestasi III', 'Mencapai total akumulasi 10.000 XP di dalam platform.', 'https://img.icons8.com/color/96/gold-medal.png', 'Reputasi', 500),
  ('NETWORK_BUILDER', 'Koneksi Luas', 'Terhubung dan berkolaborasi dengan minimal 3 perusahaan berbeda.', 'https://img.icons8.com/color/96/network.png', 'Jaringan', 150),
  ('COMMUNITY_HERO', 'Aktif Berdampak', 'Berhasil mengumpulkan 5 karya kolaborasi yang berdampak positif.', 'https://img.icons8.com/color/96/group.png', 'Komunitas', 200),

  -- H. SPESIALISASI PENULISAN & PUBLIKASI (LITERASI & LAPORAN)
  ('CASE_STUDY_MASTER', 'Master Studi Kasus', 'Menyelesaikan 3 riset studi kasus akademik berskala industri.', 'https://img.icons8.com/color/96/book.png', 'Akademik', 200),
  ('REPORT_EXPERT', 'Penulis Laporan Profesional', 'Menyusun laporan akhir proyek dengan format dan struktur standar publikasi.', 'https://img.icons8.com/color/96/document.png', 'Akademik', 150),
  ('POLICY_MAKER', 'Perancang Kebijakan', 'Menyelesaikan studi kasus draft regulasi atau standar operasional (SOP).', 'https://img.icons8.com/color/96/law.png', 'Hukum', 175),
  ('MARKET_RESEARCHER', 'Riset Pasar Ulung', 'Menyusun riset analisis pasar kompetitor untuk lini bisnis mitra.', 'https://img.icons8.com/color/96/bullseye.png', 'Bisnis', 175),
  ('ESG_CONTRIBUTOR', 'Penggerak ESG', 'Menyusun dokumen pelaporan isu keberlanjutan dan dampak sosial.', 'https://img.icons8.com/color/96/recycling.png', 'Lingkungan', 175),

  -- I. SPESIALISASI DESAIN & KONTEN (KREATIF & MEDIA)
  ('BRAND_BUILDER', 'Pengembang Identitas Merek', 'Menyusun buku panduan logo dan identitas merek lokal.', 'https://img.icons8.com/color/96/design.png', 'Kreatif', 150),
  ('CAMPAIGN_HERO', 'Konseptor Kampanye', 'Merancang ide strategi kampanye promosi produk UMKM/Industri.', 'https://img.icons8.com/color/96/advertising.png', 'Komunikasi', 150),
  ('CONTENT_CREATOR', 'Kreator Konten Berdampak', 'Membuat materi video/foto komersial yang dipublikasikan mitra.', 'https://img.icons8.com/color/96/video-camera.png', 'Kreatif', 150),
  ('INCLUSIVE_DESIGNER', 'Desainer Inklusif', 'Merancang desain/alat bantu yang memperhatikan aksesibilitas ramah lansia/disabilitas.', 'https://img.icons8.com/color/96/accessibility.png', 'Kreatif', 200),
  ('EDUTAINMENT_PRO', 'Edukator Kreatif', 'Merancang materi pembelajaran interaktif bagi usia dini atau komunitas.', 'https://img.icons8.com/color/96/graduation-cap.png', 'Pendidikan', 175)
ON CONFLICT (kode_badge) DO NOTHING;