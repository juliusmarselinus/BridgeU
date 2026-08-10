-- ============================================================================
-- SQL SCRIPT 01: SCHEMA DEFINITIONS, SEQUENCES & ALTER STATEMENTS
-- Matches dbs.sql PostgreSQL / Supabase Schema
-- ============================================================================

-- 1. CREATE SEQUENCES FOR AUTO-INCREMENT IDS
CREATE SEQUENCE IF NOT EXISTS public.ref_universitas_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.ref_program_studi_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.ref_kategori_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.ref_skills_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.admin_audit_logs_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.notifikasi_id_seq START WITH 1 INCREMENT BY 1;

-- 2. CREATE CORE LOOKUP TABLES MATCHING DBS.SQL
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

-- 3. ALTER MAHASISWA_PROFILES METRICS COLUMNS
ALTER TABLE public.mahasiswa_profiles 
  ADD COLUMN IF NOT EXISTS xp integer DEFAULT 150 NOT NULL,
  ADD COLUMN IF NOT EXISTS streak_count integer DEFAULT 5 NOT NULL,
  ADD COLUMN IF NOT EXISTS last_active_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS reputation_score integer DEFAULT 98 NOT NULL,
  ADD COLUMN IF NOT EXISTS response_rate numeric(5,2) DEFAULT 98.50 NOT NULL;
