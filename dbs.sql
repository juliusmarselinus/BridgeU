-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email character varying NOT NULL UNIQUE,
  role USER-DEFINED NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'aktif'::user_status,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  username character varying UNIQUE,
  password_hash text,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_auth_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.universitas (
  id integer NOT NULL DEFAULT nextval('ref_universitas_id_seq'::regclass),
  nama_universitas character varying NOT NULL UNIQUE,
  singkatan character varying,
  kota character varying,
  CONSTRAINT universitas_pkey PRIMARY KEY (id)
);
CREATE TABLE public.program_studi (
  id integer NOT NULL DEFAULT nextval('ref_program_studi_id_seq'::regclass),
  nama_prodi character varying NOT NULL UNIQUE,
  jenjang character varying DEFAULT 'S1'::character varying,
  fakultas_id integer,
  CONSTRAINT program_studi_pkey PRIMARY KEY (id),
  CONSTRAINT fk_prodi_fakultas FOREIGN KEY (fakultas_id) REFERENCES public.fakultas(id)
);
CREATE TABLE public.kategori_minat (
  id integer NOT NULL DEFAULT nextval('ref_kategori_id_seq'::regclass),
  nama_kategori character varying NOT NULL UNIQUE,
  prodi_id integer,
  CONSTRAINT kategori_minat_pkey PRIMARY KEY (id),
  CONSTRAINT kategori_minat_prodi_id_fkey FOREIGN KEY (prodi_id) REFERENCES public.program_studi(id)
);
CREATE TABLE public.skills (
  id integer NOT NULL DEFAULT nextval('ref_skills_id_seq'::regclass),
  nama_skill character varying NOT NULL UNIQUE,
  prodi_id integer,
  CONSTRAINT skills_pkey PRIMARY KEY (id),
  CONSTRAINT skills_prodi_id_fkey FOREIGN KEY (prodi_id) REFERENCES public.program_studi(id)
);
CREATE TABLE public.mahasiswa_profiles (
  user_id uuid NOT NULL,
  nama_lengkap character varying NOT NULL,
  universitas_id integer NOT NULL,
  prodi_id integer NOT NULL,
  semester character varying NOT NULL,
  preferensi_tipe character varying DEFAULT 'Semua'::character varying,
  preferensi_lokasi character varying DEFAULT 'Remote'::character varying,
  ringkasan_self text,
  foto_url text,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  xp integer NOT NULL DEFAULT 0,
  streak_count integer NOT NULL DEFAULT 0,
  last_active_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  reputation_score integer NOT NULL DEFAULT 0,
  response_rate numeric NOT NULL DEFAULT '0'::numeric,
  CONSTRAINT mahasiswa_profiles_pkey PRIMARY KEY (user_id),
  CONSTRAINT mahasiswa_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT mahasiswa_profiles_universitas_id_fkey FOREIGN KEY (universitas_id) REFERENCES public.universitas(id),
  CONSTRAINT mahasiswa_profiles_prodi_id_fkey FOREIGN KEY (prodi_id) REFERENCES public.program_studi(id)
);
CREATE TABLE public.mahasiswa_minat (
  mahasiswa_id uuid NOT NULL,
  kategori_id integer NOT NULL,
  CONSTRAINT mahasiswa_minat_pkey PRIMARY KEY (mahasiswa_id, kategori_id),
  CONSTRAINT mahasiswa_minat_mahasiswa_id_fkey FOREIGN KEY (mahasiswa_id) REFERENCES public.mahasiswa_profiles(user_id),
  CONSTRAINT mahasiswa_minat_kategori_id_fkey FOREIGN KEY (kategori_id) REFERENCES public.kategori_minat(id)
);
CREATE TABLE public.mahasiswa_skills (
  mahasiswa_id uuid NOT NULL,
  skill_id integer NOT NULL,
  CONSTRAINT mahasiswa_skills_pkey PRIMARY KEY (mahasiswa_id, skill_id),
  CONSTRAINT mahasiswa_skills_mahasiswa_id_fkey FOREIGN KEY (mahasiswa_id) REFERENCES public.mahasiswa_profiles(user_id),
  CONSTRAINT mahasiswa_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id)
);
CREATE TABLE public.perusahaan_profiles (
  user_id uuid NOT NULL,
  nama_perusahaan character varying NOT NULL,
  nib character varying NOT NULL UNIQUE,
  deskripsi_perusahaan text,
  status_verifikasi USER-DEFINED NOT NULL DEFAULT 'Menunggu Verifikasi'::verifikasi_status,
  tanggal_verifikasi timestamp with time zone,
  verified_by_admin_id uuid,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  sektor_id integer NOT NULL,
  kota_id integer NOT NULL,
  logo_url character varying,
  alamat_lengkap text,
  situs_web character varying,
  ukuran_perusahaan character varying DEFAULT '1-10'::character varying,
  tahun_berdiri integer,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT perusahaan_profiles_pkey PRIMARY KEY (user_id),
  CONSTRAINT perusahaan_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT perusahaan_profiles_verified_by_admin_id_fkey FOREIGN KEY (verified_by_admin_id) REFERENCES public.users(id),
  CONSTRAINT fk_perusahaan_sektor FOREIGN KEY (sektor_id) REFERENCES public.sektor_perusahaan(id),
  CONSTRAINT fk_perusahaan_kota FOREIGN KEY (kota_id) REFERENCES public.kota(id)
);
CREATE TABLE public.kolaborasi (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  perusahaan_id uuid NOT NULL,
  judul character varying NOT NULL,
  tipe USER-DEFINED NOT NULL,
  kategori_id integer NOT NULL,
  deskripsi text NOT NULL,
  lokasi character varying NOT NULL,
  batas_waktu date NOT NULL,
  status_moderasi USER-DEFINED NOT NULL DEFAULT 'Menunggu'::moderasi_status,
  tingkat_kesulitan USER-DEFINED DEFAULT 'Menengah'::tingkat_kesulitan,
  gaji_stipend character varying,
  moderated_by_admin_id uuid,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT kolaborasi_pkey PRIMARY KEY (id),
  CONSTRAINT kolaborasi_perusahaan_id_fkey FOREIGN KEY (perusahaan_id) REFERENCES public.perusahaan_profiles(user_id),
  CONSTRAINT kolaborasi_kategori_id_fkey FOREIGN KEY (kategori_id) REFERENCES public.kategori_minat(id),
  CONSTRAINT kolaborasi_moderated_by_admin_id_fkey FOREIGN KEY (moderated_by_admin_id) REFERENCES public.users(id)
);
CREATE TABLE public.kolaborasi_target_prodi (
  kolaborasi_id uuid NOT NULL,
  prodi_id integer NOT NULL,
  CONSTRAINT kolaborasi_target_prodi_pkey PRIMARY KEY (kolaborasi_id, prodi_id),
  CONSTRAINT kolaborasi_target_prodi_kolaborasi_id_fkey FOREIGN KEY (kolaborasi_id) REFERENCES public.kolaborasi(id),
  CONSTRAINT kolaborasi_target_prodi_prodi_id_fkey FOREIGN KEY (prodi_id) REFERENCES public.program_studi(id)
);
CREATE TABLE public.kolaborasi_skills (
  kolaborasi_id uuid NOT NULL,
  skill_id integer NOT NULL,
  CONSTRAINT kolaborasi_skills_pkey PRIMARY KEY (kolaborasi_id, skill_id),
  CONSTRAINT kolaborasi_skills_kolaborasi_id_fkey FOREIGN KEY (kolaborasi_id) REFERENCES public.kolaborasi(id),
  CONSTRAINT kolaborasi_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id)
);
CREATE TABLE public.pendaftaran_kolaborasi (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  kolaborasi_id uuid NOT NULL,
  mahasiswa_id uuid NOT NULL,
  tanggal_daftar timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  status USER-DEFINED NOT NULL DEFAULT 'Menunggu'::status_lamaran,
  catatan_perusahaan text,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pendaftaran_kolaborasi_pkey PRIMARY KEY (id),
  CONSTRAINT pendaftaran_kolaborasi_kolaborasi_id_fkey FOREIGN KEY (kolaborasi_id) REFERENCES public.kolaborasi(id),
  CONSTRAINT pendaftaran_kolaborasi_mahasiswa_id_fkey FOREIGN KEY (mahasiswa_id) REFERENCES public.mahasiswa_profiles(user_id)
);
CREATE TABLE public.admin_audit_logs (
  id bigint NOT NULL DEFAULT nextval('admin_audit_logs_id_seq'::regclass),
  admin_id uuid NOT NULL,
  aksi character varying NOT NULL,
  target_id uuid NOT NULL,
  detail jsonb,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT admin_audit_logs_pkey PRIMARY KEY (id),
  CONSTRAINT admin_audit_logs_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.users(id)
);
CREATE TABLE public.notifikasi (
  id bigint NOT NULL DEFAULT nextval('notifikasi_id_seq'::regclass),
  recipient_user_id uuid NOT NULL,
  judul character varying NOT NULL,
  pesan text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT notifikasi_pkey PRIMARY KEY (id),
  CONSTRAINT notifikasi_recipient_user_id_fkey FOREIGN KEY (recipient_user_id) REFERENCES public.users(id)
);
CREATE TABLE public.fakultas (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nama_fakultas character varying,
  CONSTRAINT fakultas_pkey PRIMARY KEY (id)
);
CREATE TABLE public.sektor_perusahaan (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nama_sektor character varying NOT NULL,
  CONSTRAINT sektor_perusahaan_pkey PRIMARY KEY (id)
);
CREATE TABLE public.kota (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nama_kota character varying NOT NULL,
  provinsi character varying,
  CONSTRAINT kota_pkey PRIMARY KEY (id)
);