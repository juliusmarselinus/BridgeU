"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { dummyKolaborasi, dummyPelamarList, Kolaborasi, Pelamar } from "@/lib/dummy-data";

type StoredCompany = {
  nama: string;
  industri: string;
  email: string;
};

type KolaborasiStatus = "Terbit" | "Draft" | "Selesai";

// Omit statusPublikasi dan kuota agar tidak bentrok dengan tipe induk di dummy-data.ts
interface KolaborasiWithMeta extends Omit<Kolaborasi, "statusPublikasi" | "kuota"> {
  kuota?: number;
  statusPublikasi?: KolaborasiStatus;
}

export default function CompanyDashboardPage() {
  const [company, setCompany] = useState<StoredCompany | null>(null);
  const [kolaborasiList, setKolaborasiList] = useState<KolaborasiWithMeta[]>([]);
  const [pelamarList, setPelamarList] = useState<Pelamar[]>([]);
  const [selectedTab, setSelectedTab] = useState<"Semua" | "Terbit" | "Draft" | "Selesai">("Semua");

  // State Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    judul: "",
    tipe: "Akademik" as "Akademik" | "Magang", // Disesuaikan dengan tipe "Akademik" | "Magang"
    kategori: "Riset & Pengembangan",
    deskripsi: "",
    lokasi: "Remote",
    batasWaktu: "",
    kuota: 5,
    statusPublikasi: "Terbit" as KolaborasiStatus,
  });

  useEffect(() => {
    // 1. Hydrate Perusahaan
    const storedCompany = localStorage.getItem("bridgeu_company");
    if (storedCompany) {
      try {
        const parsed = JSON.parse(storedCompany);
        queueMicrotask(() => setCompany(parsed));
      } catch (e) {
        console.error("Gagal parse data perusahaan", e);
      }
    } else {
      queueMicrotask(() =>
        setCompany({
          nama: "Nexora Digital",
          industri: "Teknologi & Produk Digital",
          email: "perusahaan@nexora.com",
        })
      );
    }

    // 2. Hydrate Kolaborasi
    const storedKolaborasi = localStorage.getItem("bridgeu_company_kolaborasi");
    if (storedKolaborasi) {
      try {
        const parsed = JSON.parse(storedKolaborasi);
        queueMicrotask(() => setKolaborasiList(parsed));
      } catch (e) {
        console.error("Gagal parse data kolaborasi", e);
      }
    } else {
      const nexoraItems = dummyKolaborasi.filter(
        (k) => k.perusahaan.toLowerCase().includes("nexora") || k.id === "1"
      );
      queueMicrotask(() => setKolaborasiList(nexoraItems as KolaborasiWithMeta[]));
    }

    // 3. Hydrate Pelamar
    const storedPelamar = localStorage.getItem("bridgeu_pelamar_list");
    if (storedPelamar) {
      try {
        const parsed = JSON.parse(storedPelamar);
        queueMicrotask(() => setPelamarList(parsed));
      } catch (e) {
        console.error("Gagal parse data pelamar", e);
      }
    } else {
      queueMicrotask(() => setPelamarList(dummyPelamarList));
    }
  }, []);

  const companyName = company?.nama || "Nexora Digital";
  const myKolaborasi =
    kolaborasiList.length > 0
      ? kolaborasiList
      : (dummyKolaborasi.filter(
          (k) => k.perusahaan === companyName || k.id === "1"
        ) as KolaborasiWithMeta[]);

  // Statistik
  const totalPelamar = pelamarList.length;
  const MenungguReview = pelamarList.filter((p) => p.status === "Menunggu").length;
  const Diterima = pelamarList.filter((p) => p.status === "Diterima").length;
  const Selesai = pelamarList.filter((p) => p.status === "Selesai").length;
  const successRate =
    myKolaborasi.length > 0 ? Math.round((Selesai / myKolaborasi.length) * 100) : 0;

  // Filter Tab
  const filteredKolaborasi = myKolaborasi.filter((item) => {
    const status = item.statusPublikasi || "Terbit";
    if (selectedTab === "Semua") return true;
    return status === selectedTab;
  });

  // Hapus Proyek
  const handleDeleteKolaborasi = (id: string, judul: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus proyek "${judul}"?`)) {
      const updated = myKolaborasi.filter((k) => k.id !== id);
      setKolaborasiList(updated);
      localStorage.setItem("bridgeu_company_kolaborasi", JSON.stringify(updated));
    }
  };

  // Submit Modal Form
  const handleSubmitForm = (e: FormEvent) => {
    e.preventDefault();

    const newKolaborasi: KolaborasiWithMeta = {
      id: Date.now().toString(),
      judul: formData.judul,
      perusahaan: companyName,
      tipe: formData.tipe,
      kategori: formData.kategori,
      deskripsi: formData.deskripsi,
      lokasi: formData.lokasi,
      batasWaktu: formData.batasWaktu || "30 Des 2026",
      kuota: Number(formData.kuota),
      statusPublikasi: formData.statusPublikasi,
      tags: [formData.kategori, formData.tipe],
    };

    const updatedList = [newKolaborasi, ...myKolaborasi];
    setKolaborasiList(updatedList);
    localStorage.setItem("bridgeu_company_kolaborasi", JSON.stringify(updatedList));

    // Reset Form & Tutup Modal
    setIsModalOpen(false);
    setFormData({
      judul: "",
      tipe: "Akademik",
      kategori: "Riset & Pengembangan",
      deskripsi: "",
      lokasi: "Remote",
      batasWaktu: "",
      kuota: 5,
      statusPublikasi: "Terbit",
    });
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Judul Proyek", "Tipe", "Kategori", "Lokasi", "Batas Waktu", "Status"];
    const rows = myKolaborasi.map((k) => [
      `"${k.judul}"`,
      k.tipe,
      k.kategori,
      `"${k.lokasi}"`,
      k.batasWaktu,
      k.statusPublikasi || "Terbit",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Kolaborasi_${companyName.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl bg-ink p-8 sm:p-10 text-paper shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-bridge-gold/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-bridge-gold/20 px-3 py-1 font-mono text-xs font-semibold text-bridge-gold border border-bridge-gold/30">
                Portal Perusahaan Mitra
              </span>
              <span className="font-mono text-xs text-paper/60">
                {company?.industri || "Teknologi & Produk Digital"}
              </span>
            </div>

            <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Selamat Datang, <span className="text-bridge-gold">{companyName}</span>
            </h1>
            <p className="mt-2 text-paper/70 max-w-xl text-sm leading-relaxed">
              Buka peluang kolaborasi riset akademik dan magang untuk terhubung dengan mahasiswa
              berbakat dari berbagai universitas di Indonesia.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-bridge-gold px-6 py-3.5 font-medium text-ink transition hover:bg-bridge-gold/90 shadow-lg shadow-bridge-gold/20 text-sm font-semibold"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              + Buka Peluang Baru
            </button>
            <Link
              href="/perusahaan/pelamar"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 font-mono text-xs font-medium text-paper transition hover:bg-white/10"
            >
              Kelola Pelamar ({MenungguReview})
            </Link>
          </div>
        </div>

        {/* Ringkasan Statistik */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-5 gap-3 border-t border-white/10 pt-8">
          <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
            <p className="font-mono text-[10px] sm:text-xs text-paper/60 uppercase tracking-wider">
              Total Peluang
            </p>
            <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-paper">
              {myKolaborasi.length}
            </p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
            <p className="font-mono text-[10px] sm:text-xs text-paper/60 uppercase tracking-wider">
              Total Pelamar
            </p>
            <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-bridge-gold">
              {totalPelamar}
            </p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
            <p className="font-mono text-[10px] sm:text-xs text-paper/60 uppercase tracking-wider">
              Menunggu Review
            </p>
            <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-yellow-400">
              {MenungguReview}
            </p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
            <p className="font-mono text-[10px] sm:text-xs text-paper/60 uppercase tracking-wider">
              Diterima
            </p>
            <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-emerald-400">
              {Diterima}
            </p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 border border-white/5 col-span-2 sm:col-span-1">
            <p className="font-mono text-[10px] sm:text-xs text-paper/60 uppercase tracking-wider">
              Success Rate
            </p>
            <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-blue-400">
              {successRate}%
            </p>
          </div>
        </div>
      </div>

      {/* Section Peluang Kolaborasi */}
      <section className="mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">
              Kelola Kolaborasi & Peluang
            </h2>
            <p className="font-mono text-xs text-steel mt-0.5">
              Daftar proyek akademik dan posisi magang yang Anda kelola
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-full border border-steel/20 bg-white px-4 py-2 font-mono text-xs font-medium text-ink transition hover:bg-steel/5 shadow-sm"
            >
              📥 Export CSV
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="font-mono text-xs text-bridge-gold font-medium hover:underline hidden sm:inline"
            >
              + Tambah Baru
            </button>
          </div>
        </div>

        {/* Tab Filter */}
        <div className="mt-6 flex items-center gap-2 border-b border-steel/15 pb-3 font-mono text-xs overflow-x-auto">
          {(["Semua", "Terbit", "Draft", "Selesai"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`rounded-full px-4 py-1.5 font-medium transition whitespace-nowrap ${
                selectedTab === tab
                  ? "bg-ink text-paper"
                  : "text-steel hover:bg-steel/10"
              }`}
            >
              {tab === "Terbit" ? "Terbit (Aktif)" : tab === "Selesai" ? "Riwayat (Selesai)" : tab}
            </button>
          ))}
        </div>

        {/* Card Proyek */}
        {filteredKolaborasi.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-steel/30 bg-white/40 p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-bridge-gold/20 text-bridge-gold">
              💼
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-ink">
              Tidak Ada Peluang {selectedTab !== "Semua" ? `dengan Status "${selectedTab}"` : ""}
            </h3>
            <p className="mt-1 text-sm text-steel">
              Mulai buat proyek kolaborasi akademik atau magang baru Anda.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 inline-block rounded-full bg-ink px-6 py-2.5 font-mono text-xs font-medium text-paper transition hover:bg-steel"
            >
              Buat Kolaborasi Baru
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredKolaborasi.map((item) => {
              const pelamarCount = pelamarList.filter(
                (p) => p.kolaborasiId === item.id || item.id === "1"
              ).length;
              const status = item.statusPublikasi || "Terbit";
              const kuota = item.kuota || 5;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-steel/15 bg-white/60 p-6 shadow-sm transition hover:shadow-md hover:border-bridge-gold/40 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-steel/10 px-3 py-1 font-mono text-[11px] font-medium text-steel">
                          {item.kategori}
                        </span>
                        <span className="rounded-full bg-bridge-gold/15 border border-bridge-gold/30 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-ink">
                          Slot: {pelamarCount}/{kuota}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold ${
                            status === "Draft"
                              ? "bg-gray-200 text-gray-700"
                              : status === "Selesai"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {status}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 font-mono text-[11px] font-semibold ${
                            item.tipe === "Akademik"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {item.tipe}
                        </span>
                      </div>
                    </div>

                    <h3 className="mt-4 font-display text-lg font-bold text-ink leading-snug">
                      {item.judul}
                    </h3>
                    <p className="mt-2 text-xs text-steel line-clamp-2 leading-relaxed">
                      {item.deskripsi}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-steel/10 flex items-center justify-between font-mono text-xs text-steel">
                    <div className="flex items-center gap-3 text-[11px]">
                      <span>📍 {item.lokasi}</span>
                      <span>📅 s.d {item.batasWaktu}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/perusahaan/pelamar?kolaborasiId=${item.id}`}
                        className="rounded-full bg-ink/10 px-3 py-1.5 font-medium text-ink hover:bg-ink hover:text-paper transition text-xs"
                      >
                        Pelamar ({pelamarCount})
                      </Link>

                      <button
                        onClick={() => handleDeleteKolaborasi(item.id, item.judul)}
                        className="rounded-full bg-red-50 p-1.5 text-red-500 hover:bg-red-100 transition"
                        title="Hapus Kolaborasi"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* MODAL POP-UP FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-steel/20 my-8">
            <div className="flex items-center justify-between border-b border-steel/10 pb-4">
              <div>
                <h3 className="font-display text-xl font-bold text-ink">
                  Buka Peluang Kolaborasi
                </h3>
                <p className="font-mono text-xs text-steel">
                  Isi form di bawah untuk mempublikasikan proyek atau magang
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full bg-steel/10 p-2 text-steel hover:bg-steel/20 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="mt-6 space-y-4">
              <div>
                <label className="block font-mono text-xs font-medium text-ink mb-1">
                  Judul Proyek / Posisi Magang *
                </label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Contoh: Optimasi Model AI untuk Klasifikasi Medis"
                  className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold focus:ring-1 focus:ring-bridge-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-medium text-ink mb-1">
                    Tipe Kolaborasi
                  </label>
                  <select
                    value={formData.tipe}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tipe: e.target.value as "Akademik" | "Magang",
                      })
                    }
                    className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm bg-white outline-none focus:border-bridge-gold"
                  >
                    <option value="Akademik">Akademik (Riset/Tugas Akhir)</option>
                    <option value="Magang">Magang (Proyek/Industri)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs font-medium text-ink mb-1">
                    Kategori Proyek
                  </label>
                  <input
                    type="text"
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    placeholder="Contoh: Data Science, Software Eng"
                    className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-xs font-medium text-ink mb-1">
                    Lokasi Kerja
                  </label>
                  <input
                    type="text"
                    value={formData.lokasi}
                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                    placeholder="Remote / Jakarta"
                    className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-medium text-ink mb-1">
                    Kuota Mahasiswa
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.kuota}
                    onChange={(e) => setFormData({ ...formData, kuota: Number(e.target.value) })}
                    className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-medium text-ink mb-1">
                    Status Publikasi
                  </label>
                  <select
                    value={formData.statusPublikasi}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        statusPublikasi: e.target.value as KolaborasiStatus,
                      })
                    }
                    className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm bg-white outline-none focus:border-bridge-gold"
                  >
                    <option value="Terbit">Terbit (Aktif)</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs font-medium text-ink mb-1">
                  Batas Waktu Pendaftaran
                </label>
                <input
                  type="text"
                  value={formData.batasWaktu}
                  onChange={(e) => setFormData({ ...formData, batasWaktu: e.target.value })}
                  placeholder="Contoh: 15 Nov 2026"
                  className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-medium text-ink mb-1">
                  Deskripsi Proyek & Kualifikasi *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Jelaskan kebutuhan proyek, ekspektasi luaran, serta skill mahasiswa yang dibutuhkan..."
                  className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-steel/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full px-5 py-2.5 font-mono text-xs font-medium text-steel hover:bg-steel/10 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-bridge-gold px-6 py-2.5 font-mono text-xs font-semibold text-ink hover:bg-bridge-gold/90 shadow-md transition"
                >
                  Simpan & Publikasikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}