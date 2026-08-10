-- ============================================================================
-- SQL SCRIPT 05: SEED DATA FOR TABEL SKILLS
-- ============================================================================

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
