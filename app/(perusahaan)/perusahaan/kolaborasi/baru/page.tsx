"use client";

import Link from "next/link";
import { useKolaborasiBaru } from "./hooks/useKolaborasiBaru";
import { SuccessModal } from "./components/SuccessModal";

export default function TambahKolaborasiPage() {
  const {
    perusahaanId,
    isLoadingOptions,
    isSubmitting,
    statusVerifikasi,
    successModal,
    setSuccessModal,
    kategoriList,
    kotaList,
    prodiList,
    skillList,
    isKotaModalOpen,
    setIsKotaModalOpen,
    isProdiModalOpen,
    setIsProdiModalOpen,
    isSkillModalOpen,
    setIsSkillModalOpen,
    isKategoriModalOpen,
    setIsKategoriModalOpen,
    kotaSearch,
    setKotaSearch,
    prodiSearch,
    setProdiSearch,
    skillSearch,
    setSkillSearch,
    kategoriSearch,
    setKategoriSearch,
    isCreatingCustom,
    formData,
    setFormData,
    kategoriLimit,
    setKategoriLimit,
    prodiLimit,
    setProdiLimit,
    skillLimit,
    setSkillLimit,
    handleSubmit,
    toggleProdi,
    toggleSkill,
    toggleKategori,
    handleAddCustomKategori,
    handleAddCustomProdi,
    handleAddCustomSkill,
    visibleKategoris,
    visibleProdis,
    visibleSkills,
    searchedKotaOptions,
    searchedKategoriOptions,
    isKategoriSearchEmpty,
    searchedProdiOptions,
    isProdiSearchEmpty,
    searchedSkillOptions,
    isSkillSearchEmpty,
    recKategoriIds,
    router,
    selectedKotaObj,
    sortedKategoris,
    sortedProdis,
    sortedSkills,
    top10RecProdiIds,
    top10RecSkillIds,
  } = useKolaborasiBaru();

  if (isLoadingOptions) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-xs text-steel">
        Memuat formulir pengajuan kolaborasi...
      </div>
    );
  }

  if (statusVerifikasi !== "Terverifikasi") {
    return (
      <main className="mx-auto max-w-2xl px-4 pt-16 pb-16 text-center font-sans">
        <div className="rounded-2xl border border-dashed border-red-300 bg-red-50/50 p-8 shadow-sm">
          <svg className="mx-auto h-12 w-12 text-red-500/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <h2 className="mt-4 font-display text-lg font-bold text-ink">
            Akses Terkunci
          </h2>
          <p className="mt-2 font-mono text-xs text-steel max-w-md mx-auto leading-relaxed">
            Akun perusahaan Anda belum diverifikasi oleh administrator. Untuk mengelola kolaborasi, melihat pelamar, atau mengubah pengaturan, akun Anda harus berada dalam status <span className="text-emerald-700 font-bold">Terverifikasi</span> (Status saat ini: <strong className="text-red-700">{statusVerifikasi}</strong>). Harap tunggu proses verifikasi oleh administrator.
          </p>
          <div className="mt-6">
            <Link
              href="/perusahaan/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-6 py-2.5 font-mono text-xs font-bold text-paper hover:bg-steel transition shadow-sm"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 pt-8 pb-16">
      {/* Header & Breadcrumb */}
      <div className="border-b border-steel/15 pb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-steel">
          <Link href="/perusahaan/kolaborasi" className="hover:text-ink transition">
            Kelola Kolaborasi
          </Link>
          <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="text-ink font-medium">Buka Kolaborasi Baru</span>
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">
          Buka Peluang Kolaborasi Baru
        </h1>
        <p className="mt-1 font-mono text-xs text-steel">
          Publikasikan proyek riset akademik atau posisi magang untuk dijangkau oleh mahasiswa
        </p>
      </div>

      {/* Form Utama */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Section 1: Informasi Dasar */}
        <div className="rounded-2xl border border-steel/15 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-display text-lg font-bold text-ink border-b border-steel/10 pb-3">
            1. Informasi Utama Proyek
          </h2>

          <div>
            <label className="block font-mono text-xs font-medium text-ink mb-1">
              Judul Proyek / Lowongan Magang *
            </label>
            <input
              type="text"
              required
              value={formData.judul}
              onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              placeholder="Contoh: Riset Implementasi AI untuk Optimasi Logistik"
              className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold font-sans bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-medium text-ink mb-1">
                Tipe Kolaborasi *
              </label>
              <select
                value={formData.tipe}
                onChange={(e) =>
                  setFormData({ ...formData, tipe: e.target.value as "Akademik" | "Magang" })
                }
                className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm bg-white outline-none focus:border-bridge-gold font-sans"
              >
                <option value="Akademik">Akademik (Riset / Tugas Akhir)</option>
                <option value="Magang">Magang (Proyek / Industri)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs font-medium text-ink mb-1">
                Kota Lokasi *
              </label>
              <button
                type="button"
                onClick={() => setIsKotaModalOpen(true)}
                className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm bg-white outline-none focus:border-bridge-gold font-sans text-left flex items-center justify-between hover:bg-steel/5 transition"
              >
                <span className="truncate">{selectedKotaObj?.nama_kota || "Pilih Kota Lokasi"}</span>
                <svg className="h-4 w-4 text-steel/50 shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Kategori Minat (Multi-select / Top 10 with scrolling) */}
          <div>
            <label className="block font-mono text-xs font-medium text-ink mb-2">
              Kategori Minat (Pilih minimal satu) *
            </label>
            <div className="p-3 border border-steel/15 rounded-xl bg-steel/5 space-y-3">
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                {visibleKategoris.map((kat) => {
                  const isSelected = formData.selectedKategoriIds.includes(kat.id);
                  const isRec = recKategoriIds.includes(kat.id);
                  return (
                    <button
                      type="button"
                      key={kat.id}
                      onClick={() => toggleKategori(kat.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition border ${
                        isSelected
                          ? "bg-ink text-paper font-semibold border-ink"
                          : isRec
                          ? "bg-emerald-50/30 text-emerald-800 border-emerald-500/20 hover:bg-emerald-50/50"
                          : "bg-white text-steel hover:bg-steel/10 border-steel/20"
                      }`}
                    >
                      {kat.nama_kategori} {isSelected ? "✓" : isRec ? "+" : "+"}
                    </button>
                  );
                })}
              </div>

              {sortedKategoris.length > kategoriLimit && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setKategoriLimit(prev => prev + 10)}
                    className="font-mono text-[10px] text-steel hover:text-ink font-bold transition"
                  >
                    Tampilkan lebih banyak (+10)
                  </button>
                </div>
              )}
            </div>

            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => setIsKategoriModalOpen(true)}
                className="font-mono text-[10px] text-bridge-gold font-bold hover:underline"
              >
                Tidak ada di list? Cari Kategori Minat
              </button>
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs font-medium text-ink mb-1">
              Deskripsi Detail Proyek & Ekspektasi Luaran *
            </label>
            <textarea
              rows={5}
              required
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              placeholder="Jelaskan gambaran umum proyek, tanggung jawab mahasiswa, serta luaran yang diharapkan..."
              className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold font-sans leading-relaxed bg-white"
            />
          </div>
        </div>

        {/* Section 2: Ketentuan */}
        <div className="rounded-2xl border border-steel/15 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-display text-lg font-bold text-ink border-b border-steel/10 pb-3">
            2. Ketentuan Proyek
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs font-medium text-ink mb-1">
                Tingkat Kesulitan
              </label>
              <select
                value={formData.tingkat_kesulitan}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tingkat_kesulitan: e.target.value as "Pemula" | "Menengah" | "Lanjut",
                  })
                }
                className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm bg-white outline-none focus:border-bridge-gold font-sans"
              >
                <option value="Pemula">Pemula</option>
                <option value="Menengah">Menengah</option>
                <option value="Lanjut">Lanjut</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs font-medium text-ink mb-1">
                Kuota Slot Diterima *
              </label>
              <input
                type="number"
                min={1}
                required
                value={formData.slot}
                onChange={(e) => setFormData({ ...formData, slot: Number(e.target.value) })}
                className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold font-sans bg-white"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-medium text-ink mb-1">
                Batas Waktu Pendaftaran *
              </label>
              <input
                type="date"
                required
                value={formData.batas_waktu}
                onChange={(e) => setFormData({ ...formData, batas_waktu: e.target.value })}
                className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold font-sans bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs font-medium text-ink mb-1">
              Gaji / Stipend (Opsional)
            </label>
            <input
              type="text"
              value={formData.gaji_stipend}
              onChange={(e) => setFormData({ ...formData, gaji_stipend: e.target.value })}
              placeholder="Contoh: Rp 2.000.000 / bulan"
              className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold font-sans bg-white"
            />
          </div>
        </div>

        {/* Section 3: Target Prodi & Skills */}
        <div className="rounded-2xl border border-steel/15 bg-white p-6 shadow-sm space-y-6">
          <h2 className="font-display text-lg font-bold text-ink border-b border-steel/10 pb-3">
            3. Kualifikasi Mahasiswa
          </h2>

          {/* Target Prodi */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-mono text-xs font-medium text-ink">
                Target Program Studi
              </label>
              {top10RecProdiIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      selectedProdiIds: Array.from(new Set([...prev.selectedProdiIds, ...top10RecProdiIds]))
                    }));
                  }}
                  className="font-mono text-[10px] font-bold text-emerald-700 hover:text-emerald-800 transition"
                >
                  + Pilih Semua Rekomendasi ({top10RecProdiIds.length})
                </button>
              )}
            </div>

            <div className="p-2.5 border border-steel/15 rounded-xl bg-steel/5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {visibleProdis.length === 0 ? (
                  <div className="col-span-full py-4 text-center font-mono text-[11px] text-steel">
                    Tidak ada rekomendasi program studi otomatis untuk judul ini.
                  </div>
                ) : (
                  visibleProdis.map((prodi) => {
                    const isSelected = formData.selectedProdiIds.includes(prodi.id);
                    const isRec = top10RecProdiIds.includes(prodi.id);
                    return (
                      <button
                        type="button"
                        key={prodi.id}
                        onClick={() => toggleProdi(prodi.id)}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs text-left transition font-mono ${
                          isSelected
                            ? "bg-ink text-paper font-medium"
                            : isRec
                            ? "bg-emerald-50/20 text-ink border border-emerald-500/20 hover:bg-emerald-50/40"
                            : "bg-white text-ink hover:bg-steel/10 border border-steel/10"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className={`h-3.5 w-3.5 rounded border flex items-center justify-center text-[10px] ${
                              isSelected ? "bg-bridge-gold border-bridge-gold text-ink" : "border-steel/40 bg-white"
                            }`}
                          >
                            {isSelected ? "✓" : ""}
                          </span>
                          <span className="truncate text-[11px]">
                            {prodi.nama_prodi} {prodi.jenjang !== "Umum" ? `(${prodi.jenjang})` : ""}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {sortedProdis.length > prodiLimit && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setProdiLimit(prev => prev + 10)}
                    className="font-mono text-[10px] text-steel hover:text-ink font-bold transition"
                  >
                    Tampilkan lebih banyak (+10)
                  </button>
                </div>
              )}
            </div>

            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => setIsProdiModalOpen(true)}
                className="font-mono text-[10px] text-bridge-gold font-bold hover:underline"
              >
                Tidak ada di list? Cari Program Studi
              </button>
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-mono text-xs font-medium text-ink">
                Keahlian / Skills yang Dibutuhkan
              </label>
              {top10RecSkillIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      selectedSkillIds: Array.from(new Set([...prev.selectedSkillIds, ...top10RecSkillIds]))
                    }));
                  }}
                  className="font-mono text-[10px] font-bold text-emerald-700 hover:text-emerald-800 transition"
                >
                  + Pilih Semua Rekomendasi ({top10RecSkillIds.length})
                </button>
              )}
            </div>

            <div className="p-3 border border-steel/15 rounded-xl bg-steel/5 space-y-3 font-mono text-xs">
              <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
                {visibleSkills.length === 0 ? (
                  <div className="w-full py-4 text-center font-mono text-[11px] text-steel">
                    Tidak ada rekomendasi keahlian otomatis untuk judul ini.
                  </div>
                ) : (
                  visibleSkills.map((skill) => {
                    const isSelected = formData.selectedSkillIds.includes(skill.id);
                    const isRec = top10RecSkillIds.includes(skill.id);
                    return (
                      <button
                        type="button"
                        key={skill.id}
                        onClick={() => toggleSkill(skill.id)}
                        className={`px-3 py-1.5 rounded-full transition border ${
                          isSelected
                            ? "bg-bridge-gold text-ink font-semibold border-bridge-gold"
                            : isRec
                            ? "bg-emerald-50/20 text-emerald-800 border-emerald-500/20 hover:bg-emerald-50/40"
                            : "bg-white text-steel hover:bg-steel/10 border-steel/20"
                        }`}
                      >
                        {skill.nama_skill} {isSelected ? "✓" : isRec ? "+" : "+"}
                      </button>
                    );
                  })
                )}
              </div>

              {sortedSkills.length > skillLimit && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setSkillLimit(prev => prev + 10)}
                    className="font-mono text-[10px] text-steel hover:text-ink font-bold transition"
                  >
                    Tampilkan lebih banyak (+10)
                  </button>
                </div>
              )}
            </div>

            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => setIsSkillModalOpen(true)}
                className="font-mono text-[10px] text-bridge-gold font-bold hover:underline"
              >
                Tidak ada di list? Cari Keahlian / Skill
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-bridge-gold px-8 py-3.5 font-mono text-xs font-bold text-ink hover:bg-bridge-gold/90 transition shadow-md disabled:opacity-50"
          >
            {isSubmitting ? "Mengajukan..." : "Ajukan Proyek Kolaborasi"}
          </button>
        </div>
      </form>

      {/* ==================== MODAL PICKER: KOTA LOKASI ==================== */}
      {isKotaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto font-sans text-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-steel/20 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-steel/10">
              <h3 className="font-display text-base font-bold text-ink">Cari Kota Lokasi</h3>
              <button
                onClick={() => {
                  setIsKotaModalOpen(false);
                  setKotaSearch("");
                }}
                className="text-steel hover:text-ink transition"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="my-3 relative">
              <input
                type="text"
                value={kotaSearch}
                onChange={(e) => setKotaSearch(e.target.value)}
                placeholder="Ketik nama kota..."
                className="w-full rounded-xl border border-steel/20 pl-10 pr-4 py-2.5 text-xs outline-none focus:border-bridge-gold bg-white"
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-steel/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 max-h-60 pr-1 py-1 font-mono text-xs">
              {searchedKotaOptions.length === 0 ? (
                <div className="py-4 text-center text-[11px] text-steel">
                  Kota tidak ditemukan.
                </div>
              ) : (
                searchedKotaOptions.map((k) => {
                  const isSelected = formData.lokasi_id === k.id;
                  return (
                    <button
                      type="button"
                      key={k.id}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, lokasi_id: k.id }));
                        setIsKotaModalOpen(false);
                        setKotaSearch("");
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition ${
                        isSelected ? "bg-ink text-paper font-semibold" : "bg-steel/5 text-ink hover:bg-steel/15"
                      }`}
                    >
                      <span>{k.nama_kota}</span>
                      {isSelected && <span>✓</span>}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL PICKER: KATEGORI MINAT ==================== */}
      {isKategoriModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto font-sans text-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-steel/20 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-steel/10">
              <h3 className="font-display text-base font-bold text-ink">Cari Kategori Minat</h3>
              <button
                onClick={() => {
                  setIsKategoriModalOpen(false);
                  setKategoriSearch("");
                }}
                className="text-steel hover:text-ink transition"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="my-3 relative">
              <input
                type="text"
                value={kategoriSearch}
                onChange={(e) => setKategoriSearch(e.target.value)}
                placeholder="Cari atau tambahkan kategori..."
                className="w-full rounded-xl border border-steel/20 pl-10 pr-4 py-2.5 text-xs outline-none focus:border-bridge-gold bg-white"
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-steel/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 max-h-60 pr-1 py-1 font-mono text-xs">
              {isKategoriSearchEmpty && (
                <button
                  type="button"
                  disabled={isCreatingCustom}
                  onClick={() => handleAddCustomKategori(kategoriSearch)}
                  className="w-full text-left p-3 rounded-xl border border-dashed border-emerald-500 bg-emerald-50/20 text-emerald-800 font-bold hover:bg-emerald-50/40 transition block text-[11px]"
                >
                  {isCreatingCustom ? "Menambahkan..." : `+ Tambahkan "${kategoriSearch}" sebagai kustom`}
                </button>
              )}

              {searchedKategoriOptions.length === 0 && !isKategoriSearchEmpty ? (
                <div className="py-4 text-center text-[11px] text-steel">
                  Tidak ada kategori minat yang cocok.
                </div>
              ) : (
                searchedKategoriOptions.map((k) => {
                  const isSelected = formData.selectedKategoriIds.includes(k.id);
                  return (
                    <button
                      type="button"
                      key={k.id}
                      onClick={() => toggleKategori(k.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition ${
                        isSelected ? "bg-ink text-paper font-semibold" : "bg-steel/5 text-ink hover:bg-steel/15"
                      }`}
                    >
                      <span>{k.nama_kategori}</span>
                      {isSelected && <span>✓</span>}
                    </button>
                  );
                })
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-steel/10 text-right">
              <button
                type="button"
                onClick={() => {
                  setIsKategoriModalOpen(false);
                  setKategoriSearch("");
                }}
                className="rounded-full bg-ink px-5 py-2 font-mono text-[10px] font-bold text-white hover:bg-steel"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL PICKER: PROGRAM STUDI ==================== */}
      {isProdiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto font-sans text-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-steel/20 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-steel/10">
              <h3 className="font-display text-base font-bold text-ink">Cari Program Studi</h3>
              <button
                onClick={() => {
                  setIsProdiModalOpen(false);
                  setProdiSearch("");
                }}
                className="text-steel hover:text-ink transition"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="my-3 relative">
              <input
                type="text"
                value={prodiSearch}
                onChange={(e) => setProdiSearch(e.target.value)}
                placeholder="Cari atau tambahkan program studi..."
                className="w-full rounded-xl border border-steel/20 pl-10 pr-4 py-2.5 text-xs outline-none focus:border-bridge-gold bg-white"
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-steel/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 max-h-60 pr-1 py-1 font-mono text-xs">
              {isProdiSearchEmpty && (
                <button
                  type="button"
                  disabled={isCreatingCustom}
                  onClick={() => handleAddCustomProdi(prodiSearch)}
                  className="w-full text-left p-3 rounded-xl border border-dashed border-emerald-500 bg-emerald-50/20 text-emerald-800 font-bold hover:bg-emerald-50/40 transition block text-[11px]"
                >
                  {isCreatingCustom ? "Menambahkan..." : `+ Tambahkan "${prodiSearch}" sebagai kustom`}
                </button>
              )}

              {searchedProdiOptions.length === 0 && !isProdiSearchEmpty ? (
                <div className="py-4 text-center text-[11px] text-steel">
                  Tidak ada program studi yang cocok.
                </div>
              ) : (
                searchedProdiOptions.map((p) => {
                  const isSelected = formData.selectedProdiIds.includes(p.id);
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => {
                        if (p.id === -999) {
                          alert("Pilih program studi spesifik atau buat baru dengan mengetik di kolom pencarian.");
                          return;
                        }
                        toggleProdi(p.id);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition ${
                        isSelected ? "bg-ink text-paper font-semibold" : "bg-steel/5 text-ink hover:bg-steel/15"
                      }`}
                    >
                      <span>
                        {p.nama_prodi} {p.jenjang && p.jenjang !== "Umum" ? `(${p.jenjang})` : ""}
                      </span>
                      {isSelected && <span>✓</span>}
                    </button>
                  );
                })
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-steel/10 text-right">
              <button
                type="button"
                onClick={() => {
                  setIsProdiModalOpen(false);
                  setProdiSearch("");
                }}
                className="rounded-full bg-ink px-5 py-2 font-mono text-[10px] font-bold text-white hover:bg-steel"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL PICKER: SKILLS / KEALIAN ==================== */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto font-sans text-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-steel/20 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-steel/10">
              <h3 className="font-display text-base font-bold text-ink">Cari Keahlian / Skill</h3>
              <button
                onClick={() => {
                  setIsSkillModalOpen(false);
                  setSkillSearch("");
                }}
                className="text-steel hover:text-ink transition"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="my-3 relative">
              <input
                type="text"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                placeholder="Cari atau tambahkan skill..."
                className="w-full rounded-xl border border-steel/20 pl-10 pr-4 py-2.5 text-xs outline-none focus:border-bridge-gold bg-white"
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-steel/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 max-h-60 pr-1 py-1 font-mono text-xs">
              {isSkillSearchEmpty && (
                <button
                  type="button"
                  disabled={isCreatingCustom}
                  onClick={() => handleAddCustomSkill(skillSearch)}
                  className="w-full text-left p-3 rounded-xl border border-dashed border-emerald-500 bg-emerald-50/20 text-emerald-800 font-bold hover:bg-emerald-50/40 transition block text-[11px]"
                >
                  {isCreatingCustom ? "Menambahkan..." : `+ Tambahkan "${skillSearch}" sebagai kustom`}
                </button>
              )}

              {searchedSkillOptions.length === 0 && !isSkillSearchEmpty ? (
                <div className="py-4 text-center text-[11px] text-steel">
                  Tidak ada keahlian yang cocok.
                </div>
              ) : (
                searchedSkillOptions.map((s) => {
                  const isSelected = formData.selectedSkillIds.includes(s.id);
                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => toggleSkill(s.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition ${
                        isSelected ? "bg-bridge-gold text-ink font-semibold" : "bg-steel/5 text-ink hover:bg-steel/15"
                      }`}
                    >
                      <span>{s.nama_skill}</span>
                      {isSelected && <span>✓</span>}
                    </button>
                  );
                })
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-steel/10 text-right">
              <button
                type="button"
                onClick={() => {
                  setIsSkillModalOpen(false);
                  setSkillSearch("");
                }}
                className="rounded-full bg-ink px-5 py-2 font-mono text-[10px] font-bold text-white hover:bg-steel"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Success Modal */}
      <SuccessModal
        isOpen={successModal.isOpen}
        title={successModal.title}
        message={successModal.message}
        onClose={() => {
          setSuccessModal(prev => ({ ...prev, isOpen: false }));
          router.push("/perusahaan/kolaborasi");
        }}
      />
    </main>
  );
}