-- ============================================================================
-- SQL SCRIPT 02: SEED DATA FOR TABEL UNIVERSITAS
-- ============================================================================

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
