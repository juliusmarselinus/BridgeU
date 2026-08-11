"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  universitasList,
  prodiList,
  allCategoriesList,
  allSkillsList,
} from "@/lib/dummy-data";
import { ModalPicker } from "@/components/ModalPicker";

type Tab = "masuk" | "daftar";
type Role = "mahasiswa" | "perusahaan";

export function AuthModal({
  isOpen,
  onClose,
  defaultTab = "masuk",
}: {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: Tab;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [role, setRole] = useState<Role>("mahasiswa");

  useEffect(() => {
    if (isOpen && defaultTab === "daftar") {
      onClose();
      router.push("/daftar");
    }

    if (isOpen && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("blocked") === "true") {
        setErrorMessage("Akun Anda telah ditangguhkan/diblokir oleh administrator. Silakan hubungi dukungan BridgeU.");
      }
    }
  }, [isOpen, defaultTab, router, onClose]);

  // ===== State Login =====
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // ===== State Form Mahasiswa =====
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [universitas, setUniversitas] = useState("Universitas Multimedia Nusantara (UMN)");
  const [prodi, setProdi] = useState("Sistem Informasi");
  const [semester, setSemester] = useState("Semester 5 - 6");
  const [selectedMinat, setSelectedMinat] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [preferensiTipe, setPreferensiTipe] = useState("Semua");
  const [preferensiLokasi, setPreferensiLokasi] = useState("Remote");
  const [ringkasanSelf, setRingkasanSelf] = useState("");

  const [univModalOpen, setUnivModalOpen] = useState(false);
  const [prodiModalOpen, setProdiModalOpen] = useState(false);

  // ===== State Form Perusahaan =====
  const [namaPerusahaan, setNamaPerusahaan] = useState("");
  const [emailPerusahaan, setEmailPerusahaan] = useState("");
  const [passwordPerusahaan, setPasswordPerusahaan] = useState("");
  const [industri, setIndustri] = useState("");
  const [nib, setNib] = useState("");
  const [lokasiPerusahaan, setLokasiPerusahaan] = useState("");
  const [deskripsiPerusahaan, setDeskripsiPerusahaan] = useState("");

  // ===== State Status =====
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const toggleMinat = (m: string) => {
    setSelectedMinat((prev) =>
      prev.includes(m) ? prev.filter((item) => item !== m) : [...prev, m]
    );
  };

  const toggleSkill = (s: string) => {
    setSelectedSkills((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const univPickerOptions = universitasList.map((u) => ({
    label: u,
    value: u,
    icon: "🎓",
  }));

  const prodiPickerOptions = prodiList.map((p) => ({
    label: p.label,
    value: p.value,
    group: p.group,
    icon: "📚",
  }));

  // Helper cari/insert data referensi (universitas, prodi, minat, skills)
  const getOrCreateRefId = async (table: string, column: string, value: string) => {
    const { data: existingData } = await supabase
      .from(table)
      .select("id")
      .eq(column, value)
      .maybeSingle();

    if (existingData) return existingData.id;

    const { data: newData, error: insertError } = await supabase
      .from(table)
      .insert([{ [column]: value }])
      .select("id")
      .single();

    if (insertError) {
      throw new Error(`Gagal menyimpan referensi ${table}: ${insertError.message}`);
    }

    return newData.id;
  };

  // Generate username unik otomatis dari nama
  const generateUsername = async (namaLengkap: string): Promise<string> => {
    const baseSlug =
      namaLengkap
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 40) || "user";

    const { data: existing } = await supabase
      .from("users")
      .select("username")
      .eq("username", baseSlug)
      .maybeSingle();

    if (!existing) return baseSlug;

    const suffix = Math.random().toString(36).substring(2, 6);
    return `${baseSlug}-${suffix}`;
  };

  const redirectByRole = (userRole: string) => {
    if (userRole === "admin") {
      router.push("/admin/dashboard");
    } else if (userRole === "perusahaan") {
      router.push("/perusahaan/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  // ===== HANDLER LOGIN =====
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword,
        });

      if (authError) {
        throw new Error("Email atau kata sandi salah / belum terdaftar.");
      }

      if (!authData.user) {
        throw new Error("Gagal mendapatkan data akun.");
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role, status")
        .eq("id", authData.user.id)
        .single();

      if (userError || !userData) {
        onClose();
        router.push("/dashboard");
        return;
      }

      const statusDb = (userData.status || "aktif").toLowerCase();
      if (statusDb === "ditangguhkan" || statusDb === "suspended") {
        await supabase.auth.signOut();
        throw new Error("Akun Anda telah ditangguhkan/diblokir oleh administrator. Silakan hubungi dukungan BridgeU.");
      }

      onClose();
      redirectByRole(userData.role);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal masuk. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // ===== HANDLER SUBMIT MAHASISWA =====
  const handleSubmitMahasiswa = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error("Gagal mendapatkan User ID dari Auth.");

      const username = await generateUsername(nama);
      const { error: userError } = await supabase.from("users").insert([
        { id: userId, email, role: "mahasiswa", username },
      ]);
      if (userError) throw userError;

      const univId = await getOrCreateRefId("universitas", "nama_universitas", universitas);
      const prodiId = await getOrCreateRefId("program_studi", "nama_prodi", prodi);

      const { error: profileError } = await supabase.from("mahasiswa_profiles").insert([
        {
          user_id: userId,
          nama_lengkap: nama,
          universitas_id: univId,
          prodi_id: prodiId,
          semester,
          preferensi_tipe: preferensiTipe,
          preferensi_lokasi: preferensiLokasi,
          ringkasan_self: ringkasanSelf,
        },
      ]);
      if (profileError) throw profileError;

      for (const minatName of selectedMinat) {
        const minatId = await getOrCreateRefId("kategori_minat", "nama_kategori", minatName);
        await supabase.from("mahasiswa_minat").insert([
          { mahasiswa_id: userId, kategori_id: minatId },
        ]);
      }

      for (const skillName of selectedSkills) {
        const skillId = await getOrCreateRefId("skills", "nama_skill", skillName);
        await supabase.from("mahasiswa_skills").insert([
          { mahasiswa_id: userId, skill_id: skillId },
        ]);
      }

      setSuccessMsg(true);
      setTimeout(() => {
        onClose();
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      console.error("🔥 REGISTRASI MAHASISWA GAGAL:", err);
      setErrorMessage(err.message || "Gagal melakukan registrasi mahasiswa.");
    } finally {
      setLoading(false);
    }
  };

  // ===== HANDLER SUBMIT PERUSAHAAN =====
  const handleSubmitPerusahaan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: emailPerusahaan,
        password: passwordPerusahaan,
      });
      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error("Gagal mendapatkan User ID dari Auth.");

      const username = await generateUsername(namaPerusahaan);
      const { error: userError } = await supabase.from("users").insert([
        { id: userId, email: emailPerusahaan, role: "perusahaan", username },
      ]);
      if (userError) throw userError;

      const { error: profileError } = await supabase.from("perusahaan_profiles").insert([
        {
          user_id: userId,
          nama_perusahaan: namaPerusahaan,
          industri,
          nib,
          lokasi: lokasiPerusahaan,
          deskripsi_perusahaan: deskripsiPerusahaan,
        },
      ]);
      if (profileError) throw profileError;

      setSuccessMsg(true);
      setTimeout(() => {
        onClose();
        router.push("/perusahaan/dashboard");
      }, 1500);
    } catch (err: any) {
      console.error("🔥 REGISTRASI PERUSAHAAN GAGAL:", err);
      setErrorMessage(err.message || "Gagal melakukan registrasi perusahaan.");
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (newTab: Tab) => {
    setTab(newTab);
    setErrorMessage("");
    setSuccessMsg(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-ink/50 px-4 py-8 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl border border-steel/15 bg-paper p-6 sm:p-10 shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-steel transition hover:text-ink"
          aria-label="Tutup"
        >
          ✕
        </button>

        <div className="text-center max-w-lg mx-auto">
          <span className="font-display text-2xl font-bold tracking-tight text-ink">
            Bridge<span className="text-bridge-gold">U</span>
          </span>
          <h1 className="mt-3 font-display text-2xl font-bold text-ink">
            {tab === "masuk" ? "Masuk ke Akun" : "Buat Akun BridgeU"}
          </h1>
          {tab === "daftar" && (
            <p className="mt-1 text-sm text-steel">
              Terbuka untuk <span className="font-semibold text-ink">seluruh bidang program studi</span>.
            </p>
          )}

          {/* Tab Switcher */}
          <div className="mt-6 flex justify-center gap-2 rounded-full bg-ink/10 p-1.5 font-mono text-xs">
            <button
              type="button"
              onClick={() => switchTab("masuk")}
              className={`flex-1 rounded-full py-2.5 px-6 font-semibold transition ${
                tab === "masuk" ? "bg-ink text-paper shadow-md" : "text-steel hover:text-ink"
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                router.push("/daftar");
              }}
              className={`flex-1 rounded-full py-2.5 px-6 font-semibold transition ${
                tab === "daftar" ? "bg-ink text-paper shadow-md" : "text-steel hover:text-ink"
              }`}
            >
              Daftar
            </button>
          </div>

          {/* Role Switcher (khusus tab daftar) */}
          {tab === "daftar" && (
            <div className="mt-4 flex justify-center gap-2 rounded-full bg-ink/10 p-1.5 font-mono text-xs">
              <button
                type="button"
                onClick={() => setRole("mahasiswa")}
                className={`flex-1 rounded-full py-2.5 px-6 font-semibold transition ${
                  role === "mahasiswa" ? "bg-ink text-paper shadow-md" : "text-steel hover:text-ink"
                }`}
              >
                🎓 Mahasiswa
              </button>
              <button
                type="button"
                onClick={() => setRole("perusahaan")}
                className={`flex-1 rounded-full py-2.5 px-6 font-semibold transition ${
                  role === "perusahaan" ? "bg-ink text-paper shadow-md" : "text-steel hover:text-ink"
                }`}
              >
                🏢 Perusahaan Mitra
              </button>
            </div>
          )}
        </div>

        {/* Pesan Error / Sukses */}
        {errorMessage && (
          <div className="mt-6 rounded-2xl bg-rose-100 border border-rose-300 p-4 text-rose-800 font-mono text-xs text-center">
            ✕ {errorMessage}
          </div>
        )}
        {successMsg && (
          <div className="mt-6 rounded-2xl bg-emerald-100 border border-emerald-300 p-4 text-emerald-800 font-mono text-xs text-center">
            ✓ Berhasil! Mengalihkan...
          </div>
        )}

        {/* ===== FORM MASUK ===== */}
        {tab === "masuk" && (
          <form onSubmit={handleLogin} className="mt-8 space-y-5 max-w-sm mx-auto">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="email@domain.com"
                className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                Kata Sandi
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-ink py-4 text-center font-mono text-sm font-semibold text-paper hover:bg-steel transition shadow-lg disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        )}

        {/* ===== FORM DAFTAR MAHASISWA ===== */}
        {tab === "daftar" && role === "mahasiswa" && (
          <form onSubmit={handleSubmitMahasiswa} className="mt-8 space-y-6">
            <div className="border-b border-steel/10 pb-4">
              <h2 className="font-display text-lg font-bold text-ink">
                1. Informasi Akun &amp; Perguruan Tinggi
              </h2>
              <p className="font-mono text-xs text-steel">Identitas akademik mahasiswa</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: John Doe"
                  className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
                />
              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                  Email Kampus / Personal *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mahasiswa@umn.ac.id"
                  className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                Kata Sandi *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="sm:col-span-1">
                <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                  Perguruan Tinggi *
                </label>
                <button
                  type="button"
                  onClick={() => setUnivModalOpen(true)}
                  className="mt-1.5 w-full text-left rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition hover:border-ink flex items-center justify-between shadow-sm"
                >
                  <span className="truncate">{universitas}</span>
                  <span className="font-mono text-xs text-steel font-bold">🔍</span>
                </button>
              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                  Program Studi *
                </label>
                <button
                  type="button"
                  onClick={() => setProdiModalOpen(true)}
                  className="mt-1.5 w-full text-left rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition hover:border-ink flex items-center justify-between shadow-sm"
                >
                  <span className="truncate">{prodi}</span>
                  <span className="font-mono text-xs text-steel font-bold">🔍</span>
                </button>
              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                  Semester *
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
                >
                  <option value="Semester 1 - 2">Semester 1 - 2 (Tingkat 1)</option>
                  <option value="Semester 3 - 4">Semester 3 - 4 (Tingkat 2)</option>
                  <option value="Semester 5 - 6">Semester 5 - 6 (Tingkat 3)</option>
                  <option value="Semester 7+">Semester 7+ (Tingkat Akhir)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-steel/10">
              <h2 className="font-display text-lg font-bold text-ink">
                2. Profil Preferensi &amp; Keahlian
              </h2>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium mb-2">
                Kategori Proyek Minat
              </label>
              <div className="flex flex-wrap gap-2">
                {allCategoriesList.map((m) => {
                  const selected = selectedMinat.includes(m);
                  return (
                    <button
                      type="button"
                      key={m}
                      onClick={() => toggleMinat(m)}
                      className={`rounded-full px-4 py-2 font-mono text-xs transition ${
                        selected
                          ? "bg-ink text-paper shadow-sm"
                          : "bg-white border border-steel/25 text-steel hover:border-ink"
                      }`}
                    >
                      {selected ? "✓ " : "+ "}
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium mb-2">
                Skill &amp; Tools Dikuasai
              </label>
              <div className="flex flex-wrap gap-2">
                {allSkillsList.map((s) => {
                  const selected = selectedSkills.includes(s);
                  return (
                    <button
                      type="button"
                      key={s}
                      onClick={() => toggleSkill(s)}
                      className={`rounded-full px-3.5 py-1.5 font-mono text-xs transition ${
                        selected
                          ? "bg-bridge-gold text-ink font-bold shadow-sm"
                          : "bg-white/50 border border-steel/20 text-steel hover:border-ink"
                      }`}
                    >
                      {selected ? "✓ " : "# "}
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                  Preferensi Tipe Kolaborasi
                </label>
                <select
                  value={preferensiTipe}
                  onChange={(e) => setPreferensiTipe(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
                >
                  <option value="Semua">Semua (Studi Kasus &amp; Magang)</option>
                  <option value="Akademik">Hanya Studi Kasus / Riset Akademik</option>
                  <option value="Magang">Hanya Posisi Magang (Internship)</option>
                </select>
              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                  Preferensi Sistem Kerja
                </label>
                <select
                  value={preferensiLokasi}
                  onChange={(e) => setPreferensiLokasi(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
                >
                  <option value="Remote">Remote (Kerja Jarak Jauh)</option>
                  <option value="Hybrid">Hybrid (Flexible)</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                Ringkasan Pengalaman (Opsional)
              </label>
              <textarea
                rows={3}
                value={ringkasanSelf}
                onChange={(e) => setRingkasanSelf(e.target.value)}
                placeholder="Ceritakan minat riset, organisasi, atau proyek yang pernah Anda ikuti..."
                className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-ink py-4 text-center font-mono text-sm font-semibold text-paper hover:bg-steel transition shadow-lg disabled:opacity-50"
            >
              {loading ? "Menyimpan Ke Supabase..." : "Selesaikan Registrasi & Lihat Rekomendasi →"}
            </button>
          </form>
        )}

        {/* ===== FORM DAFTAR PERUSAHAAN ===== */}
        {tab === "daftar" && role === "perusahaan" && (
          <form onSubmit={handleSubmitPerusahaan} className="mt-8 space-y-6">
            <div className="border-b border-steel/10 pb-4">
              <h2 className="font-display text-lg font-bold text-ink">
                Informasi Perusahaan Mitra
              </h2>
              <p className="font-mono text-xs text-steel">
                Registrasi resmi perusahaan untuk mempublikasikan proyek
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                  Nama Perusahaan *
                </label>
                <input
                  type="text"
                  required
                  value={namaPerusahaan}
                  onChange={(e) => setNamaPerusahaan(e.target.value)}
                  placeholder="Contoh: PT Nexora Digital"
                  className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
                />
              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                  Email Perusahaan *
                </label>
                <input
                  type="email"
                  required
                  value={emailPerusahaan}
                  onChange={(e) => setEmailPerusahaan(e.target.value)}
                  placeholder="perusahaan@nexora.com"
                  className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                  Kata Sandi *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={passwordPerusahaan}
                  onChange={(e) => setPasswordPerusahaan(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
                />
              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                  Nomor Induk Berusaha (NIB) *
                </label>
                <input
                  type="text"
                  required
                  value={nib}
                  onChange={(e) => setNib(e.target.value)}
                  placeholder="Contoh: 9120009988112"
                  className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                  Bidang Industri *
                </label>
                <input
                  type="text"
                  required
                  value={industri}
                  onChange={(e) => setIndustri(e.target.value)}
                  placeholder="Teknologi / Media / Konsultan"
                  className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
                />
              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                  Kota / Lokasi Kantor *
                </label>
                <input
                  type="text"
                  required
                  value={lokasiPerusahaan}
                  onChange={(e) => setLokasiPerusahaan(e.target.value)}
                  placeholder="Jakarta Selatan"
                  className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                Deskripsi Perusahaan (Opsional)
              </label>
              <textarea
                rows={3}
                value={deskripsiPerusahaan}
                onChange={(e) => setDeskripsiPerusahaan(e.target.value)}
                placeholder="Jelaskan bidang usaha dan profil singkat perusahaan Anda..."
                className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-ink py-4 text-center font-mono text-sm font-semibold text-paper hover:bg-steel transition shadow-lg disabled:opacity-50"
            >
              {loading ? "Menyimpan Ke Supabase..." : "Registrasi Perusahaan & Masuk Dashboard →"}
            </button>
          </form>
        )}

        <div className="mt-8 text-center border-t border-steel/10 pt-6">
          <p className="text-sm text-steel">
            {tab === "masuk" ? (
              <>
                Belum punya akun?{" "}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push("/daftar");
                  }}
                  className="font-semibold text-bridge-gold hover:underline"
                >
                  Daftar di sini
                </button>
              </>
            ) : (
              <>
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => switchTab("masuk")}
                  className="font-semibold text-bridge-gold hover:underline"
                >
                  Masuk
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      {/* MODAL PICKERS (nested di atas AuthModal) */}
      <ModalPicker
        isOpen={univModalOpen}
        onClose={() => setUnivModalOpen(false)}
        title="Pilih Perguruan Tinggi / Universitas"
        options={univPickerOptions}
        selectedValue={universitas}
        onSelect={(val) => setUniversitas(val)}
      />

      <ModalPicker
        isOpen={prodiModalOpen}
        onClose={() => setProdiModalOpen(false)}
        title="Pilih Program Studi / Jurusan"
        options={prodiPickerOptions}
        selectedValue={prodi}
        onSelect={(val) => setProdi(val)}
      />
    </div>
  );
}