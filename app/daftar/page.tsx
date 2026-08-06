"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  dummyUser,
  dummyPerusahaan,
  universitasList,
  prodiList,
  allCategoriesList,
  allSkillsList,
} from "@/lib/dummy-data";
import { ModalPicker } from "@/components/ModalPicker";

type Role = "mahasiswa" | "perusahaan";

export default function RegistrationPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("mahasiswa");

  // Mahasiswa Form State
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [universitas, setUniversitas] = useState("Universitas Multimedia Nusantara (UMN)");
  const [prodi, setProdi] = useState("Sistem Informasi");
  const [semester, setSemester] = useState("Semester 5");
  const [selectedMinat, setSelectedMinat] = useState<string[]>([
    "UI/UX & Product Design",
    "Business Strategy & Marketing",
  ]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "Figma",
    "Business Planning",
    "Social Media Marketing",
  ]);
  const [preferensiTipe, setPreferensiTipe] = useState("Semua");
  const [preferensiLokasi, setPreferensiLokasi] = useState("Remote");
  const [ringkasanSelf, setRingkasanSelf] = useState("");

  // Modals state
  const [univModalOpen, setUnivModalOpen] = useState(false);
  const [prodiModalOpen, setProdiModalOpen] = useState(false);

  // Perusahaan Form State
  const [namaPerusahaan, setNamaPerusahaan] = useState("");
  const [emailPerusahaan, setEmailPerusahaan] = useState("");
  const [passwordPerusahaan, setPasswordPerusahaan] = useState("");
  const [industri, setIndustri] = useState("Teknologi & Produk Digital");
  const [nib, setNib] = useState("");
  const [lokasiPerusahaan, setLokasiPerusahaan] = useState("Jakarta Selatan");
  const [deskripsiPerusahaan, setDeskripsiPerusahaan] = useState("");

  const [successMsg, setSuccessMsg] = useState(false);

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

  // Convert arrays for ModalPicker options
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

  const handleSubmitMahasiswa = (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      nama: nama || dummyUser.nama,
      email: email || dummyUser.email,
      password: password || dummyUser.password,
      universitas: universitas || dummyUser.universitas,
      prodi: prodi || dummyUser.prodi,
      semester,
      minatKategori: selectedMinat,
      skills: selectedSkills,
      preferensiTipe,
      preferensiLokasi,
      ringkasan: ringkasanSelf,
      role: "mahasiswa",
    };

    localStorage.setItem("bridgeu_user", JSON.stringify(userData));
    setSuccessMsg(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  const handleSubmitPerusahaan = (e: React.FormEvent) => {
    e.preventDefault();

    const companyData = {
      nama: namaPerusahaan || dummyPerusahaan.nama,
      email: emailPerusahaan || dummyPerusahaan.email,
      password: passwordPerusahaan || dummyPerusahaan.password,
      industri: industri || dummyPerusahaan.industri,
      nib: nib || "9120009988112",
      lokasi: lokasiPerusahaan || dummyPerusahaan.lokasi,
      deskripsi: deskripsiPerusahaan,
      role: "perusahaan",
    };

    localStorage.setItem("bridgeu_company", JSON.stringify(companyData));
    setSuccessMsg(true);
    setTimeout(() => {
      router.push("/perusahaan/dashboard");
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-paper text-ink pb-20 pt-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Header Navigation */}
        <div className="flex items-center justify-between pb-6 border-b border-steel/15">
          <Link href="/" className="font-display text-2xl font-bold tracking-tight">
            Bridge<span className="text-bridge-gold">U</span>
          </Link>
          <Link href="/" className="font-mono text-xs text-steel hover:text-ink transition">
            ← Kembali ke Beranda
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border border-steel/15 bg-white/70 p-8 sm:p-10 shadow-xl">
          <div className="text-center max-w-lg mx-auto">
            <span className="inline-block rounded-full bg-bridge-gold/20 px-3.5 py-1 font-mono text-xs font-semibold text-ink border border-bridge-gold/30">
              Registrasi Profil Lintas Disiplin
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold text-ink">
              Buat Akun BridgeU
            </h1>
            <p className="mt-2 text-sm text-steel">
              Terbuka untuk <span className="font-semibold text-ink">seluruh bidang program studi</span> (Bisnis, Desain, Komunikasi, Teknik, Hukum, Kesehatan &amp; Teknologi). Profil Anda digunakan oleh <span className="font-semibold text-ink">Smart Recommendation Engine</span>.
            </p>

            {/* Role Switcher Pills */}
            <div className="mt-6 flex justify-center gap-2 rounded-full bg-ink/10 p-1.5 font-mono text-xs">
              <button
                onClick={() => setRole("mahasiswa")}
                className={`flex-1 rounded-full py-2.5 px-6 font-semibold transition ${
                  role === "mahasiswa"
                    ? "bg-ink text-paper shadow-md"
                    : "text-steel hover:text-ink"
                }`}
              >
                🎓 Mahasiswa
              </button>
              <button
                onClick={() => setRole("perusahaan")}
                className={`flex-1 rounded-full py-2.5 px-6 font-semibold transition ${
                  role === "perusahaan"
                    ? "bg-ink text-paper shadow-md"
                    : "text-steel hover:text-ink"
                }`}
              >
                🏢 Perusahaan Mitra
              </button>
            </div>
          </div>

          {successMsg && (
            <div className="mt-6 rounded-2xl bg-emerald-100 border border-emerald-300 p-4 text-emerald-800 font-mono text-xs text-center">
              ✓ Registrasi Berhasil! Menyiapkan rekomendasi proyek khusus untuk Anda...
            </div>
          )}

          {/* FORM MAHASISWA */}
          {role === "mahasiswa" && (
            <form onSubmit={handleSubmitMahasiswa} className="mt-8 space-y-6">
              <div className="border-b border-steel/10 pb-4">
                <h2 className="font-display text-lg font-bold text-ink">
                  1. Informasi Akun &amp; Perguruan Tinggi
                </h2>
                <p className="font-mono text-xs text-steel">
                  Identitas akademik mahasiswa
                </p>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
                />
              </div>

              {/* MODAL PICKER TRIGGERS for Universitas & Prodi */}
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
                    <span className="font-mono text-xs text-steel font-bold">🔍 Cari</span>
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
                    <span className="font-mono text-xs text-steel font-bold">🔍 Cari</span>
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

              {/* SECTION PREFERENSI SMART RECOMMENDATION AI */}
              <div className="pt-4 border-t border-steel/10">
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg font-bold text-ink">
                    2. Profil Preferensi &amp; Keahlian Lintas Disiplin
                  </span>
                  <span className="rounded-full bg-bridge-gold/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-ink">
                    ✨ Smart Engine Profile
                  </span>
                </div>
                <p className="font-mono text-xs text-steel mt-0.5">
                  Pilih bidang minat dan skill Anda untuk kalkulasi persentase kecocokan rekomendasi proyek.
                </p>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium mb-2">
                  Kategori Proyek Minat (Pilih beberapa)
                </label>
                <div className="flex flex-wrap gap-2">
                  {allCategoriesList.map((m) => {
                    const selected = selectedMinat.includes(m);
                    return (
                      <button
                        type="button"
                        key={m}
                        onClick={() => toggleMinat(m)}
                        className={`rounded-full px-4 py-2 font-mono text-xs font-medium transition ${
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
                  Skill &amp; Tools yang Dikuasai
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
                    <option value="Onsite">Onsite (Jakarta/Bandung/Surabaya)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                  Ringkasan Pengalaman &amp; Motivasi (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={ringkasanSelf}
                  onChange={(e) => setRingkasanSelf(e.target.value)}
                  placeholder="Ceritakan minat riset, organisasi, atau proyek akademik yang pernah Anda ikuti..."
                  className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-ink py-4 text-center font-mono text-sm font-semibold text-paper hover:bg-steel transition shadow-lg"
              >
                Selesaikan Registrasi &amp; Lihat Rekomendasi →
              </button>
            </form>
          )}

          {/* FORM PERUSAHAAN */}
          {role === "perusahaan" && (
            <form onSubmit={handleSubmitPerusahaan} className="mt-8 space-y-6">
              <div className="border-b border-steel/10 pb-4">
                <h2 className="font-display text-lg font-bold text-ink">
                  Informasi Perusahaan Mitra
                </h2>
                <p className="font-mono text-xs text-steel">
                  Registrasi resmi perusahaan untuk mempublikasikan proyek kolaborasi
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
                    placeholder="Contoh: Nexora Digital"
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
                    placeholder="Teknologi / Ritel / Konsultan / Media"
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
                  placeholder="Jelaskan bidang usaha dan fokus proyek perusahaan Anda..."
                  className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-ink py-4 text-center font-mono text-sm font-semibold text-paper hover:bg-steel transition shadow-lg"
              >
                Registrasi Perusahaan &amp; Masuk Dashboard →
              </button>
            </form>
          )}

          <div className="mt-8 text-center border-t border-steel/10 pt-6">
            <p className="text-sm text-steel">
              Sudah punya akun?{" "}
              <Link href="/" className="font-semibold text-bridge-gold hover:underline">
                Masuk di Halaman Utama
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* MODAL PICKERS */}
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
    </main>
  );
}
