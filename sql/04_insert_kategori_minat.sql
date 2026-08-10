-- ============================================================================
-- SQL SCRIPT 04: SEED DATA FOR TABEL KATEGORI MINAT
-- ============================================================================

INSERT INTO public.kategori_minat (nama_kategori, deskripsi) VALUES
  ('UI/UX & System Design', 'Pengembangan antarmuka pengguna, rancang bangun aplikasi, dan arsitektur sistem digital'),
  ('Data Science & Analytics', 'Pengolahan big data, pemodelan machine learning, visualisasi data, dan bisnis inteligensi'),
  ('Web & Mobile Development', 'Pengembangan aplikasi web modern full-stack dan aplikasi perangkat bergerak iOS/Android'),
  ('Cyber Security & Infrastructure', 'Keamanan jaringan, penetration testing, cloud computing, dan infrastruktur server'),
  ('Digital Marketing & Growth', 'Strategi pemasaran digital, SEO/SEM, pembuatan konten, dan analisis pertumbuhan pengguna'),
  ('Product Management', 'Manajemen riset produk digital, perancangan MVP, roadmap produk, dan pengujian pengguna')
ON CONFLICT (nama_kategori) DO UPDATE SET
  deskripsi = EXCLUDED.deskripsi;
