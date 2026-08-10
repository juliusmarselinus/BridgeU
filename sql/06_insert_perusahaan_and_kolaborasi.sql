-- ============================================================================
-- SQL SCRIPT 06 (OPSIONAL): SEED DATA UNTUK PERUSAHAAN & KOLABORASI
-- Catatan: Script ini dinonaktifkan sementara karena membutuhkan UUID User
-- terdaftar pada tabel auth.users / public.users.
-- Jalankan script ini secara manual setelah akun perusahaan terbuat.
-- ============================================================================

/*
-- 1. INSERT / UPDATE PERUSAHAAN PROFILE FOR EXISTING PERUSAHAAN USERS
INSERT INTO public.perusahaan_profiles (
  user_id,
  nama_perusahaan,
  industri,
  nib,
  lokasi,
  deskripsi_perusahaan,
  status_verifikasi
)
SELECT 
  id AS user_id,
  'PT Digital Innovate Indonesia' AS nama_perusahaan,
  'Teknologi & Produk Digital' AS industri,
  '9120003418921' AS nib,
  'Jakarta Selatan' AS lokasi,
  'Mitra perusahaan terverifikasi yang bergerak di bidang pengembangan solusi software enterprise dan aplikasi e-commerce.' AS deskripsi_perusahaan,
  'Terverifikasi' AS status_verifikasi
FROM public.users
WHERE role = 'perusahaan'
LIMIT 1
ON CONFLICT (user_id) DO UPDATE SET
  nama_perusahaan = EXCLUDED.nama_perusahaan,
  status_verifikasi = EXCLUDED.status_verifikasi;

-- 2. INSERT KOLABORASI PROJECTS MATCHING ENUM TYPE tipe_kolaborasi ('Akademik', 'Magang')
INSERT INTO public.kolaborasi (
  id,
  perusahaan_id,
  judul,
  tipe,
  kategori_id,
  deskripsi,
  lokasi,
  batas_waktu,
  status_moderasi,
  tingkat_kesulitan,
  gaji_stipend
)
SELECT 
  'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380e11'::uuid AS id,
  p.user_id AS perusahaan_id,
  'Optimasi UI/UX & Redesign E-Commerce Mobile App' AS judul,
  'Akademik' AS tipe,
  COALESCE((SELECT id FROM public.kategori_minat WHERE nama_kategori = 'UI/UX & System Design' LIMIT 1), 1) AS kategori_id,
  'Dibutuhkan mahasiswa berbakat untuk merancang ulang alur pembayaran, perbaikan responsivitas, dan antarmuka belanja mobile.' AS deskripsi,
  'Remote' AS lokasi,
  '2026-09-30'::date AS batas_waktu,
  'Disetujui' AS status_moderasi,
  'Menengah' AS tingkat_kesulitan,
  'Rp 2.500.000 / Proyek' AS gaji_stipend
FROM public.perusahaan_profiles p
LIMIT 1
ON CONFLICT (id) DO UPDATE SET
  judul = EXCLUDED.judul,
  status_moderasi = EXCLUDED.status_moderasi;

-- 3. LINK TARGET PRODI FOR KOLABORASI PROJECTS
INSERT INTO public.kolaborasi_target_prodi (kolaborasi_id, prodi_id)
SELECT 
  'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380e11'::uuid,
  id
FROM public.program_studi
WHERE nama_prodi LIKE '%Sistem Informasi%' OR nama_prodi LIKE '%Informatika%'
ON CONFLICT DO NOTHING;

-- 4. LINK REQUIRED SKILLS FOR KOLABORASI PROJECTS
INSERT INTO public.kolaborasi_skills (kolaborasi_id, skill_id)
SELECT 
  'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380e11'::uuid,
  id
FROM public.skills
WHERE nama_skill LIKE '%UI/UX%' OR nama_skill LIKE '%React%'
ON CONFLICT DO NOTHING;
*/
