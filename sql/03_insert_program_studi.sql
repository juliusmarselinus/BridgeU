-- ============================================================================
-- SQL SCRIPT 03: SEED DATA FOR TABEL PROGRAM STUDI
-- ============================================================================

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
