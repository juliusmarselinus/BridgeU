-- ============================================================================
-- MASTER MIGRATION SCRIPT FOR BRIDGEU PLATFORM
-- Matches dbs.sql PostgreSQL / Supabase Schema Exactly
-- Modular SQL files available in /sql/ directory:
--   01_schema_and_alter.sql
--   02_insert_universitas.sql
--   03_insert_program_studi.sql
--   04_insert_kategori_minat.sql
--   05_insert_skills.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- STEP 1: SEQUENCES & SCHEMA ALTERATIONS
-- ----------------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.ref_universitas_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.ref_program_studi_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.ref_kategori_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.ref_skills_id_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE IF NOT EXISTS public.universitas (
  id integer NOT NULL DEFAULT nextval('public.ref_universitas_id_seq'::regclass),
  nama_universitas character varying NOT NULL UNIQUE,
  singkatan character varying,
  kota character varying,
  CONSTRAINT universitas_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.program_studi (
  id integer NOT NULL DEFAULT nextval('public.ref_program_studi_id_seq'::regclass),
  nama_prodi character varying NOT NULL UNIQUE,
  CONSTRAINT program_studi_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.kategori_minat (
  id integer NOT NULL DEFAULT nextval('public.ref_kategori_id_seq'::regclass),
  nama_kategori character varying NOT NULL UNIQUE,
  deskripsi text,
  CONSTRAINT kategori_minat_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.skills (
  id integer NOT NULL DEFAULT nextval('public.ref_skills_id_seq'::regclass),
  nama_skill character varying NOT NULL UNIQUE,
  CONSTRAINT skills_pkey PRIMARY KEY (id)
);

ALTER TABLE public.mahasiswa_profiles 
  ADD COLUMN IF NOT EXISTS xp integer DEFAULT 150 NOT NULL,
  ADD COLUMN IF NOT EXISTS streak_count integer DEFAULT 5 NOT NULL,
  ADD COLUMN IF NOT EXISTS last_active_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS reputation_score integer DEFAULT 98 NOT NULL,
  ADD COLUMN IF NOT EXISTS response_rate numeric(5,2) DEFAULT 98.50 NOT NULL;

-- ----------------------------------------------------------------------------
-- STEP 2: INSERT TABEL UNIVERSITAS
-- ----------------------------------------------------------------------------
INSERT INTO public.universitas (nama_universitas, singkatan, kota) VALUES
  ('Universitas Multimedia Nusantara', 'UMN', 'Tangerang'),
  ('Universitas Indonesia', 'UI', 'Depok'),
  ('Institut Teknologi Bandung', 'ITB', 'Bandung'),
  ('Universitas Gadjah Mada', 'UGM', 'Yogyakarta'),
  ('Institut Teknologi Sepuluh Nopember', 'ITS', 'Surabaya'),
  ('Universitas Bina Nusantara', 'BINUS', 'Jakarta'),
  ('Universitas Telkom', 'Tel-U', 'Bandung'),
  ('Universitas Padjadjaran', 'UNPAD', 'Sumedang'),
  ('Universitas Diponegoro', 'UNDIP', 'Semarang'),
  ('Universitas Airlangga', 'UNAIR', 'Surabaya')
ON CONFLICT (nama_universitas) DO UPDATE SET
  singkatan = EXCLUDED.singkatan,
  kota = EXCLUDED.kota;

-- ----------------------------------------------------------------------------
-- STEP 3: INSERT TABEL PROGRAM STUDI
-- ----------------------------------------------------------------------------
INSERT INTO public.program_studi (nama_prodi) VALUES
  ('Sistem Informasi'),
  ('Informatika / Teknik Informatika'),
  ('Desain Komunikasi Visual (DKV)'),
  ('Manajemen & Bisnis'),
  ('Akuntansi'),
  ('Teknik Elektro'),
  ('Cyber Security'),
  ('Data Science / Sains Data'),
  ('Bisnis Digital'),
  ('Ilmu Komunikasi'),
  ('Teknik Komputer'),
  ('Arsitektur')
ON CONFLICT (nama_prodi) DO NOTHING;

-- ----------------------------------------------------------------------------
-- STEP 4: INSERT TABEL KATEGORI MINAT
-- ----------------------------------------------------------------------------
INSERT INTO public.kategori_minat (nama_kategori, deskripsi) VALUES
  ('UI/UX & System Design', 'Pengembangan antarmuka pengguna, rancang bangun aplikasi, dan arsitektur sistem digital'),
  ('Data Science & Analytics', 'Pengolahan big data, pemodelan machine learning, visualisasi data, dan bisnis inteligensi'),
  ('Web & Mobile Development', 'Pengembangan aplikasi web modern full-stack dan aplikasi perangkat bergerak iOS/Android'),
  ('Cyber Security & Infrastructure', 'Keamanan jaringan, penetration testing, cloud computing, dan infrastruktur server'),
  ('Digital Marketing & Growth', 'Strategi pemasaran digital, SEO/SEM, pembuatan konten, dan analisis pertumbuhan pengguna'),
  ('Product Management', 'Manajemen riset produk digital, perancangan MVP, roadmap produk, dan pengujian pengguna')
ON CONFLICT (nama_kategori) DO UPDATE SET
  deskripsi = EXCLUDED.deskripsi;

-- ----------------------------------------------------------------------------
-- STEP 5: INSERT TABEL SKILLS
-- ----------------------------------------------------------------------------
INSERT INTO public.skills (nama_skill) VALUES
  ('React / Next.js'),
  ('TypeScript'),
  ('UI/UX Design (Figma)'),
  ('Python & Machine Learning'),
  ('PostgreSQL & SQL'),
  ('Node.js & Express'),
  ('TailwindCSS'),
  ('Flutter & Dart'),
  ('Docker & Kubernetes'),
  ('Git & GitHub Workflow')
ON CONFLICT (nama_skill) DO NOTHING;
