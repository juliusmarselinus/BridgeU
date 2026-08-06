"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { dummyKolaborasi, Kolaborasi } from "@/lib/dummy-data";

export default function BuatKolaborasiPage() {
  const router = useRouter();

  const [judul, setJudul] = useState("");
  const [tipe, setTipe] = useState<"Akademik" | "Magang">("Akademik");
  const [kategori, setKategori] = useState("UI/UX");
  const [lokasi, setLokasi] = useState("Remote");
  const [batasWaktu, setBatasWaktu] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [persyaratan, setPersyaratan] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!judul || !deskripsi || !batasWaktu) return;

    // Retrieve company info
    const storedCompany = localStorage.getItem("bridgeu_company");
    const companyNama = storedCompany ? JSON.parse(storedCompany).nama : "Nexora Digital";

    const newKolaborasi: Kolaborasi = {
      id: Date.now().toString(),
      perusahaan: companyNama,
      judul,
      tipe,
      kategori,
      deskripsi: `${deskripsi}${persyaratan ? ` Persyaratan: ${persyaratan}` : ""}`,
      lokasi,
      batasWaktu: batasWaktu || "31 Agustus 2026",
    };

    // Save to Company Kolaborasi Storage
    const existingCompany = localStorage.getItem("bridgeu_company_kolaborasi");
    const companyList: Kolaborasi[] = existingCompany
      ? JSON.parse(existingCompany)
      : dummyKolaborasi.filter((k) => k.perusahaan === companyNama || k.id === "1");

    const updatedCompanyList = [newKolaborasi, ...companyList];
    localStorage.setItem("bridgeu_company_kolaborasi", JSON.stringify(updatedCompanyList));

    // Also sync to general Kolaborasi List for students
    const existingGlobal = localStorage.getItem("bridgeu_kolaborasi_list");
    const globalList: Kolaborasi[] = existingGlobal ? JSON.parse(existingGlobal) : dummyKolaborasi;
    localStorage.setItem("bridgeu_kolaborasi_list", JSON.stringify([newKolaborasi, ...globalList]));

    setSuccessMsg(true);
    setTimeout(() => {
      router.push("/perusahaan/dashboard");
    }, 1200);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 pt-8">
      <div className="mb-6">
        <Link
          href="/perusahaan/dashboard"
          className="font-mono text-xs text-steel hover:text-ink transition inline-flex items-center gap-1.5"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>

      <div className="rounded-3xl border border-steel/15 bg-white/70 p-8 sm:p-10 shadow-lg">
        <div className="border-b border-steel/15 pb-6">
          <span className="rounded-full bg-bridge-gold/20 px-3 py-1 font-mono text-xs font-semibold text-bridge-gold border border-bridge-gold/30">
            Form Publikasi Proyek
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold text-ink">
            Buka Peluang Kolaborasi Baru
          </h1>
          <p className="mt-1 text-sm text-steel">
            Isi rincian peluang proyek studi kasus akademik atau posisi magang yang ditawarkan untuk mahasiswa.
          </p>
        </div>

        {successMsg && (
          <div className="mt-6 rounded-2xl bg-emerald-100 border border-emerald-300 p-4 text-emerald-800 font-mono text-xs flex items-center gap-2">
            ✓ Peluang kolaborasi berhasil dipublikasikan! Mengalihkan ke dashboard...
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
              Judul Kolaborasi / Proyek *
            </label>
            <input
              type="text"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Riset & Optimasi UX Aplikasi Mobile Banking"
              className="mt-2 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-bridge-gold focus:ring-2 focus:ring-bridge-gold/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                Tipe Kolaborasi *
              </label>
              <select
                value={tipe}
                onChange={(e) => setTipe(e.target.value as "Akademik" | "Magang")}
                className="mt-2 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-bridge-gold"
              >
                <option value="Akademik">Akademik (Studi Kasus / Riset)</option>
                <option value="Magang">Magang (Internship)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                Kategori Spesialisasi *
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="mt-2 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-bridge-gold"
              >
                <option value="UI/UX">UI/UX Design</option>
                <option value="Data Science">Data Science & Analytics</option>
                <option value="Software Development">Software Development</option>
                <option value="Business Case">Business Case & Strategy</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Artificial Intelligence">Artificial Intelligence / Machine Learning</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                Lokasi / Sistem Kerja *
              </label>
              <select
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className="mt-2 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-bridge-gold"
              >
                <option value="Remote">Remote (Kerja Jarak Jauh)</option>
                <option value="Hybrid">Hybrid (Remote & Onsite)</option>
                <option value="Jakarta">Jakarta (Onsite)</option>
                <option value="Bandung">Bandung (Onsite)</option>
                <option value="Surabaya">Surabaya (Onsite)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                Batas Waktu Pendaftaran *
              </label>
              <input
                type="text"
                required
                value={batasWaktu}
                onChange={(e) => setBatasWaktu(e.target.value)}
                placeholder="Contoh: 30 Agustus 2026"
                className="mt-2 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-bridge-gold"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
              Deskripsi Proyek & Tujuan *
            </label>
            <textarea
              rows={4}
              required
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan latar belakang permasalahan, tujuan studi kasus/posisi magang, dan hasil (deliverable) yang diharapkan..."
              className="mt-2 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-bridge-gold"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
              Kualifikasi & Persyaratan Mahasiswa
            </label>
            <textarea
              rows={3}
              value={persyaratan}
              onChange={(e) => setPersyaratan(e.target.value)}
              placeholder="Contoh: Mahasiswa semester 5+, memiliki kemampuan dasar Figma / Python, menyukai tantangan riset bisnis..."
              className="mt-2 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-bridge-gold"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Link
              href="/perusahaan/dashboard"
              className="rounded-full border border-steel/25 px-6 py-3 font-mono text-xs text-steel hover:bg-steel/10 transition"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="rounded-full bg-ink px-8 py-3 font-mono text-xs font-semibold text-paper hover:bg-steel transition shadow-md"
            >
              Publikasikan Peluang
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
