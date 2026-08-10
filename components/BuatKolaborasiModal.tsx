"use client";

import { useState } from "react";
import { allCategoriesList, dummyKolaborasi, Kolaborasi } from "@/lib/dummy-data";

interface BuatKolaborasiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function BuatKolaborasiModal({
  isOpen,
  onClose,
  onSuccess,
}: BuatKolaborasiModalProps) {
  const [judul, setJudul] = useState("");
  const [tipe, setTipe] = useState<"Akademik" | "Magang">("Akademik");
  const [kategori, setKategori] = useState("UI/UX & Product Design");
  const [lokasi, setLokasi] = useState("Remote");
  const [batasWaktu, setBatasWaktu] = useState("31 Agustus 2026");
  const [kuota, setKuota] = useState<number>(2);

  // Field Khusus Magang (Fitur #4)
  const [durasiKerja, setDurasiKerja] = useState("3 Bulan");
  const [tipeKompensasi, setTipeKompensasi] = useState<"Berbayar" | "Uang Saku" | "Tidak Berbayar" | "Sertifikat Saja">("Uang Saku");
  const [nominalKompensasi, setNominalKompensasi] = useState<string>("3500000");
  const [jamKerja, setJamKerja] = useState("Full-time (40 jam/minggu)");

  // Field Khusus Akademik (Fitur #4)
  const [durasiPengerjaan, setDurasiPengerjaan] = useState("1 Semester");
  const [insentif, setInsentif] = useState("E-Sertifikat + Insentif Riset Rp 1.500.000");

  const [deskripsi, setDeskripsi] = useState("");
  const [persyaratan, setPersyaratan] = useState("");

  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleSave = (statusPublikasi: "Draft" | "Terbit") => {
    if (!judul || !deskripsi) return;

    const storedCompany = localStorage.getItem("bridgeu_company");
    const companyObj = storedCompany
      ? JSON.parse(storedCompany)
      : { id: "comp-1", nama: "Nexora Digital" };

    const newKolaborasi: Kolaborasi = {
      id: Date.now().toString(),
      perusahaan: companyObj.nama || "Nexora Digital",
      perusahaanId: companyObj.id || "comp-1",
      judul,
      tipe,
      kategori,
      deskripsi,
      persyaratan,
      lokasi,
      batasWaktu: batasWaktu || "31 Agustus 2026",
      kuota: Number(kuota) || 1,
      kuotaTerisi: 0,
      statusModerasi: "Disetujui",
      statusPublikasi,
      tipePublikasi: "Publik",
      updated_at: new Date().toISOString(),

      ...(tipe === "Magang"
        ? {
            durasiKerja,
            kompensasi: {
              tipe: tipeKompensasi,
              jumlah: tipeKompensasi === "Tidak Berbayar" ? 0 : Number(nominalKompensasi) || 0,
            },
            jamKerja,
            gajiStipend:
              tipeKompensasi === "Tidak Berbayar"
                ? "Tidak Berbayar"
                : `Rp ${Number(nominalKompensasi).toLocaleString("id-ID")} / bulan`,
          }
        : {
            durasiPengerjaan,
            insentif,
            gajiStipend: insentif,
          }),
    };

    const existingCompany = localStorage.getItem("bridgeu_company_kolaborasi");
    const companyList: Kolaborasi[] = existingCompany
      ? JSON.parse(existingCompany)
      : dummyKolaborasi.filter((k) => k.perusahaan === companyObj.nama || k.id === "1");

    const updatedCompanyList = [newKolaborasi, ...companyList];
    localStorage.setItem("bridgeu_company_kolaborasi", JSON.stringify(updatedCompanyList));

    if (statusPublikasi === "Terbit") {
      const existingGlobal = localStorage.getItem("bridgeu_kolaborasi_list");
      const globalList: Kolaborasi[] = existingGlobal ? JSON.parse(existingGlobal) : dummyKolaborasi;
      localStorage.setItem("bridgeu_kolaborasi_list", JSON.stringify([newKolaborasi, ...globalList]));
    }

    setSuccessMsg(
      statusPublikasi === "Draft"
        ? "Draft peluang berhasil disimpan!"
        : "Peluang kolaborasi berhasil dipublikasikan!"
    );

    setTimeout(() => {
      setSuccessMsg("");
      onClose();
      if (onSuccess) onSuccess();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 py-6 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl border border-bridge-gold/30 bg-paper p-6 sm:p-8 shadow-2xl my-auto max-h-[90vh] overflow-y-auto text-ink"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 h-8 w-8 rounded-full bg-steel/10 text-steel hover:bg-ink hover:text-paper transition flex items-center justify-center font-mono text-sm"
          aria-label="Tutup Modal"
        >
          ✕
        </button>

        <div className="border-b border-steel/15 pb-4">
          <span className="rounded-full bg-bridge-gold/20 px-3 py-1 font-mono text-xs font-semibold text-bridge-gold border border-bridge-gold/30">
            Form Modal Buka Peluang
          </span>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-ink">
            Buka Peluang Kolaborasi Baru
          </h2>
          <p className="mt-1 text-xs text-steel">
            Publikasikan studi kasus akademik atau posisi magang langsung dari modal ini.
          </p>
        </div>

        {successMsg && (
          <div className="mt-4 rounded-2xl bg-emerald-100 border border-emerald-300 p-4 text-emerald-800 font-mono text-xs text-center font-semibold">
            ✓ {successMsg}
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="mt-6 space-y-5">
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
              className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-bridge-gold focus:ring-2 focus:ring-bridge-gold/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                Tipe Kolaborasi *
              </label>
              <select
                value={tipe}
                onChange={(e) => setTipe(e.target.value as "Akademik" | "Magang")}
                className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-bridge-gold font-medium"
              >
                <option value="Akademik">🎓 Akademik (Studi Kasus / Riset)</option>
                <option value="Magang">💼 Magang (Internship)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                Kategori Spesialisasi *
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-bridge-gold"
              >
                {allCategoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                Sistem Kerja *
              </label>
              <select
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-bridge-gold"
              >
                <option value="Remote">Remote (Jarak Jauh)</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Jakarta">Jakarta (Onsite)</option>
                <option value="Bandung">Bandung (Onsite)</option>
                <option value="Surabaya">Surabaya (Onsite)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                Batas Waktu *
              </label>
              <input
                type="text"
                required
                value={batasWaktu}
                onChange={(e) => setBatasWaktu(e.target.value)}
                placeholder="31 Agustus 2026"
                className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-bridge-gold"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
                Kuota Slot Peserta * (Fitur #3)
              </label>
              <input
                type="number"
                min={1}
                max={50}
                required
                value={kuota}
                onChange={(e) => setKuota(Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-bridge-gold font-bold"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-steel/5 p-4 border border-steel/15 space-y-4">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-bridge-gold">
              ⚙️ Detail Spesifik Tipe {tipe} (Fitur #4)
            </h3>

            {tipe === "Magang" ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-[11px] text-steel font-medium">Durasi Magang</label>
                  <input
                    type="text"
                    value={durasiKerja}
                    onChange={(e) => setDurasiKerja(e.target.value)}
                    placeholder="Misal: 3 bulan / 6 bulan"
                    className="mt-1 w-full rounded-lg border border-steel/25 bg-white px-3 py-2 text-xs text-ink"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-steel font-medium">Tipe Kompensasi</label>
                  <select
                    value={tipeKompensasi}
                    onChange={(e) => setTipeKompensasi(e.target.value as any)}
                    className="mt-1 w-full rounded-lg border border-steel/25 bg-white px-3 py-2 text-xs text-ink"
                  >
                    <option value="Uang Saku">Uang Saku Bulanan</option>
                    <option value="Berbayar">Berbayar (Project-based)</option>
                    <option value="Tidak Berbayar">Tidak Berbayar</option>
                    <option value="Sertifikat Saja">Sertifikat Saja</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-steel font-medium">Nominal (Rp/Bulan)</label>
                  <input
                    type="number"
                    disabled={tipeKompensasi === "Tidak Berbayar"}
                    value={nominalKompensasi}
                    onChange={(e) => setNominalKompensasi(e.target.value)}
                    placeholder="3500000"
                    className="mt-1 w-full rounded-lg border border-steel/25 bg-white px-3 py-2 text-xs text-ink disabled:bg-gray-100"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[11px] text-steel font-medium">Durasi Pengerjaan</label>
                  <input
                    type="text"
                    value={durasiPengerjaan}
                    onChange={(e) => setDurasiPengerjaan(e.target.value)}
                    placeholder="Misal: 1 semester / 6 minggu"
                    className="mt-1 w-full rounded-lg border border-steel/25 bg-white px-3 py-2 text-xs text-ink"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-steel font-medium">Insentif Riset / Reward</label>
                  <input
                    type="text"
                    value={insentif}
                    onChange={(e) => setInsentif(e.target.value)}
                    placeholder="Misal: E-Sertifikat + Insentif Riset Rp 1.500.000"
                    className="mt-1 w-full rounded-lg border border-steel/25 bg-white px-3 py-2 text-xs text-ink"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
              Deskripsi Proyek & Tujuan *
            </label>
            <textarea
              rows={3}
              required
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan latar belakang permasalahan, tujuan studi kasus/posisi magang, dan deliverable yang diharapkan..."
              className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-bridge-gold"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wide text-steel font-medium">
              Kualifikasi & Persyaratan Mahasiswa
            </label>
            <textarea
              rows={2}
              value={persyaratan}
              onChange={(e) => setPersyaratan(e.target.value)}
              placeholder="Contoh: Mahasiswa semester 3+, memiliki minat riset UX, menguasai Figma..."
              className="mt-1.5 w-full rounded-xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-bridge-gold"
            />
          </div>

          <div className="pt-4 border-t border-steel/15 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto rounded-full border border-steel/25 px-5 py-2.5 font-mono text-xs text-steel hover:bg-steel/10 transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => handleSave("Draft")}
              className="w-full sm:w-auto rounded-full border border-ink/40 bg-white px-5 py-2.5 font-mono text-xs font-semibold text-ink hover:bg-steel/10 transition"
            >
              💾 Simpan Draft (Fitur #15)
            </button>
            <button
              type="button"
              onClick={() => handleSave("Terbit")}
              className="w-full sm:w-auto rounded-full bg-ink px-7 py-2.5 font-mono text-xs font-semibold text-paper hover:bg-steel transition shadow-md"
            >
              🚀 Publikasikan Peluang
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}