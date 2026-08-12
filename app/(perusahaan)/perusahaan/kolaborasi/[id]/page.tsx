"use client";

import Link from "next/link";
import { useKolaborasiDetail } from "./hooks/useKolaborasiDetail";

export default function DetailKolaborasiPage() {
  const {
    router,
    currentUserId,
    activeTab,
    setActiveTab,
    isLoading,
    isSaving,
    isDeleting,
    kolaborasi,
    pelamarList,
    selectedPelamar,
    setSelectedPelamar,
    chatMessages,
    chatInput,
    setChatInput,
    isSendingChat,
    handleKirimChat,
    evaluasiInput,
    setEvaluasiInput,
    isSubmittingEvaluasi,
    handleKirimEvaluasi,
    isSubmittingRevisi,
    handleMintaRevisi,
    deleteCatatanPerusahaan,
    setDeleteCatatanPerusahaan,
    statusVerifikasi,
    isVerified,
    successModal,
    setSuccessModal,
    recKategoriIds,
    top10RecProdiIds,
    top10RecSkillIds,
    kategoriLimit,
    setKategoriLimit,
    prodiLimit,
    setProdiLimit,
    skillLimit,
    setSkillLimit,
    isKotaModalOpen,
    setIsKotaModalOpen,
    isProdiModalOpen,
    setIsProdiModalOpen,
    isSkillModalOpen,
    setIsSkillModalOpen,
    isKategoriModalOpen,
    setIsKategoriModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
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
    handleUpdateStatus,
    handleSaveSettings,
    handleDeleteProyek,
    handleRequestDeleteProyek,
    toggleProdi,
    toggleSkill,
    toggleKategori,
    handleAddCustomKategori,
    handleAddCustomProdi,
    handleAddCustomSkill,
    visibleKategoris,
    visibleProdis,
    visibleSkills,
    sortedKategoris,
    sortedProdis,
    sortedSkills,
    searchedKotaOptions,
    searchedKategoriOptions,
    isKategoriSearchEmpty,
    searchedProdiOptions,
    isProdiSearchEmpty,
    searchedSkillOptions,
    isSkillSearchEmpty,
    selectedKotaObj,
    stats,
    hasPelamarAktif,
    getKategoriDisplay,
  } = useKolaborasiDetail();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-xs text-steel">
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-bridge-gold" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Memuat detail proyek kolaborasi...
        </div>
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

  if (!kolaborasi) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-16 text-center">
        <h2 className="font-display text-2xl font-bold text-ink">Proyek tidak ditemukan</h2>
        <p className="mt-2 text-xs text-steel">Proyek mungkin sudah dihapus atau tautan tidak valid.</p>
        <Link
          href="/perusahaan/kolaborasi"
          className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-ink px-6 py-2.5 font-mono text-xs font-bold text-paper hover:bg-steel transition"
        >
          Kembali ke Daftar Kolaborasi
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-16 font-sans">
      {/* Header Utama (Tanpa Badge Gambar 1) */}
      <div className="border-b border-steel/15 pb-4">
        <div className="flex items-center gap-2 font-mono text-xs text-steel mb-2">
          <Link href="/perusahaan/kolaborasi" className="hover:text-ink transition">
            Kelola Kolaborasi
          </Link>
          <svg className="h-3 w-3 shrink-0 text-steel/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="text-ink font-medium truncate max-w-[250px] sm:max-w-md">{kolaborasi.judul}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink leading-tight">
            {kolaborasi.judul}
          </h1>

          <Link
            href="/perusahaan/kolaborasi"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-steel/20 bg-white px-5 py-2 font-mono text-xs font-semibold text-ink hover:bg-steel/5 transition shadow-sm shrink-0"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Kembali ke Daftar
          </Link>
        </div>
      </div>

      {/* Tabs Selector Modern Segmented Control (Gambar 2 Perbagus Web Style) */}
      <div className="mt-5">
        <div className="inline-flex p-1 bg-steel/10 rounded-2xl font-mono text-xs shadow-inner border border-steel/10">
          <button
            onClick={() => setActiveTab("pelamar")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-200 ${
              activeTab === "pelamar"
                ? "bg-white text-ink shadow-md transform scale-[1.02]"
                : "text-steel hover:text-ink hover:bg-white/40"
            }`}
          >
            <svg className="h-4 w-4 text-bridge-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            Pelamar &amp; Evaluasi ({stats.total})
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-200 ${
              activeTab === "settings"
                ? "bg-white text-ink shadow-md transform scale-[1.02]"
                : "text-steel hover:text-ink hover:bg-white/40"
            }`}
          >
            <svg className="h-4 w-4 text-steel" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Settings &amp; Proyek
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="mt-6">
        {/* ==================== TAB 1: PELAMAR & EVALUASI ==================== */}
        {activeTab === "pelamar" && (
          <div className="space-y-6">
            
            {/* BARIS ATAS: Kartu Opsi Pemilihan Pelamar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-xs text-steel px-1">
                <span className="font-bold text-ink">Daftar Pelamar Proyek ({pelamarList.length})</span>
                <span>Pilih mahasiswa untuk membuka chat &amp; evaluasi</span>
              </div>

              {pelamarList.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-steel/20 bg-white p-8 text-center font-mono text-xs text-steel">
                  Belum ada mahasiswa yang melamar pada proyek ini.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {pelamarList.map((pelamar) => {
                    const isSelected = selectedPelamar?.id === pelamar.id;
                    return (
                      <div
                        key={pelamar.id}
                        onClick={() => setSelectedPelamar(pelamar)}
                        className={`rounded-2xl border p-4 cursor-pointer transition-all duration-200 shadow-sm relative ${
                          isSelected
                            ? "border-bridge-gold bg-amber-50/40 ring-2 ring-bridge-gold/50 shadow-md transform -translate-y-0.5"
                            : "border-steel/15 bg-white hover:border-steel/30 hover:bg-steel/5"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 rounded-full bg-steel/10 border border-steel/20 flex items-center justify-center font-display font-bold text-ink overflow-hidden text-xs">
                              {pelamar.foto_url ? (
                                <img src={pelamar.foto_url} alt={pelamar.nama_lengkap} className="h-full w-full object-cover" />
                              ) : (
                                pelamar.nama_lengkap.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <h4 className="font-display text-xs font-bold text-ink leading-tight truncate max-w-[120px]">
                                {pelamar.nama_lengkap}
                              </h4>
                              <p className="font-mono text-[10px] text-steel truncate max-w-[120px]">
                                {pelamar.program_studi}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] font-semibold border ${
                              pelamar.status === "Diterima"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : pelamar.status === "Ditolak"
                                ? "bg-red-50 text-red-800 border-red-200"
                                : pelamar.status === "Selesai"
                                ? "bg-blue-50 text-blue-800 border-blue-200"
                                : pelamar.status === "Revisi"
                                ? "bg-purple-50 text-purple-800 border-purple-200"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                            }`}
                          >
                            {pelamar.status}
                          </span>
                        </div>

                        <div className="mt-3 pt-2 border-t border-steel/10 flex items-center justify-between font-mono text-[10px] text-steel">
                          <span>⭐ {pelamar.reputation_score} Pts</span>
                          <span>{pelamar.riwayat_pengumpulan?.length || 0} Versi Hasil</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* MAIN BOTTOM SPLIT VIEW: Left Chat 1-on-1, Right Progres & Evaluasi Gede */}
            {selectedPelamar ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in pt-2">
                
                {/* LEFT COLUMN: Live Chat 1-on-1 Sidebar (5 cols) */}
                <div className="lg:col-span-5 rounded-2xl border border-steel/15 bg-white p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-steel/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        💬
                      </div>
                      <div>
                        <h4 className="font-display text-xs font-bold text-ink">
                          Chat 1-on-1 ({selectedPelamar.nama_lengkap})
                        </h4>
                        <span className="font-mono text-[9px] text-steel">Realtime Supabase Channel</span>
                      </div>
                    </div>
                    <span className="font-mono text-[9px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      ● Active
                    </span>
                  </div>

                  {/* Chat Stream */}
                  <div className="h-[460px] overflow-y-auto space-y-3 p-3 bg-steel/5 rounded-xl border border-steel/10 font-sans text-xs">
                    {chatMessages.length === 0 ? (
                      <div className="flex h-full items-center justify-center font-mono text-[11px] text-steel text-center p-4">
                        Belum ada percakapan. Mulai kirim pesan 1-on-1 ke pelamar ini.
                      </div>
                    ) : (
                      chatMessages.map((msg) => {
                        const isMe = msg.tipe_pengirim === "perusahaan";
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm leading-relaxed ${
                                isMe
                                  ? "bg-ink text-paper rounded-br-none"
                                  : "bg-white text-ink border border-steel/15 rounded-bl-none"
                              }`}
                            >
                              {msg.pesan}
                            </div>
                            <span className="font-mono text-[9px] text-steel/60 mt-1 px-1">
                              {new Date(msg.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Input Chat */}
                  <form onSubmit={handleKirimChat} className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={`Ketik pesan ke ${selectedPelamar.nama_lengkap}...`}
                      className="flex-1 rounded-xl border border-steel/20 px-3.5 py-2.5 text-xs outline-none focus:border-bridge-gold bg-white"
                    />
                    <button
                      type="submit"
                      disabled={isSendingChat || !chatInput.trim()}
                      className="rounded-xl bg-ink px-4 py-2.5 font-mono text-xs font-bold text-white hover:bg-steel transition disabled:opacity-50 shrink-0"
                    >
                      {isSendingChat ? "..." : "Kirim"}
                    </button>
                  </form>
                </div>

                {/* RIGHT COLUMN: Minimal Student Info + Progres & Evaluasi Gede (Gambar 3 Diperbagus) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Minimal Header Info Pelamar Terpilih */}
                  <div className="rounded-2xl border border-steel/15 bg-white p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-bridge-gold/20 border border-bridge-gold/40 flex items-center justify-center font-display text-sm font-bold text-ink overflow-hidden">
                        {selectedPelamar.foto_url ? (
                          <img src={selectedPelamar.foto_url} alt={selectedPelamar.nama_lengkap} className="h-full w-full object-cover" />
                        ) : (
                          selectedPelamar.nama_lengkap.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-sm font-bold text-ink">
                            {selectedPelamar.nama_lengkap}
                          </h3>
                          <span className="rounded-full bg-bridge-gold/20 px-2 py-0.5 font-mono text-[9px] font-bold text-ink">
                            ⭐ {selectedPelamar.reputation_score} Pts
                          </span>
                        </div>
                        <p className="font-mono text-[11px] text-steel">
                          {selectedPelamar.universitas} &bull; {selectedPelamar.program_studi} (Semester {selectedPelamar.semester})
                        </p>
                      </div>
                    </div>

                    {selectedPelamar.url_portofolio_dokumen && (
                      <a
                        href={selectedPelamar.url_portofolio_dokumen}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-bridge-gold font-bold hover:underline shrink-0"
                      >
                        Dokumen Portofolio ↗
                      </a>
                    )}
                  </div>

                  {/* PROGRES & HASIL KOLABORASI + FORM EVALUASI GEDE (Gambar 3 Diperbagus & Ditingkatkan) */}
                  <div className="rounded-2xl border border-steel/15 bg-white p-6 shadow-sm space-y-5">
                    <div className="flex items-center justify-between border-b border-steel/10 pb-4">
                      <h4 className="font-display text-base font-bold text-ink flex items-center gap-2">
                        <svg className="h-5 w-5 text-bridge-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Progres &amp; Hasil Kolaborasi
                      </h4>
                      <span className="font-mono text-xs text-steel font-bold bg-steel/5 px-3 py-1 rounded-full border border-steel/10">
                        {selectedPelamar.riwayat_pengumpulan?.length || 0} Versi Dikirim
                      </span>
                    </div>

                    {/* List Riwayat Versi Hasil */}
                    {(!selectedPelamar.riwayat_pengumpulan || selectedPelamar.riwayat_pengumpulan.length === 0) ? (
                      <div className="rounded-xl border border-dashed border-steel/20 bg-steel/5 p-6 text-center font-mono text-xs text-steel">
                        Mahasiswa belum melakukan pengumpulan hasil pengerjaan proyek.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedPelamar.riwayat_pengumpulan.map((item: any) => (
                          <div key={item.id} className="rounded-xl border border-steel/15 bg-steel/5 p-4 space-y-2 font-mono text-xs shadow-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-ink text-sm">Versi #{item.versi}</span>
                              <span className="text-[10px] text-steel">
                                {new Date(item.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                              </span>
                            </div>
                            <div className="pt-1">
                              <a
                                href={item.url_hasil}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-bridge-gold underline hover:text-ink font-bold break-all text-xs block"
                              >
                                {item.url_hasil} ↗
                              </a>
                            </div>
                            {item.catatan_mahasiswa && (
                              <p className="text-xs text-steel bg-white p-3 rounded-xl border border-steel/10 leading-relaxed">
                                &ldquo;{item.catatan_mahasiswa}&rdquo;
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* FORM EVALUASI & INSTRUKSI REVISI (Gambar 3 Ditingkatkan & Diberi Tombol Aksi Gede) */}
                    <form onSubmit={handleKirimEvaluasi} className="pt-4 border-t border-steel/10 space-y-4">
                      <div>
                        <label className="block font-mono text-xs font-bold text-ink mb-1.5">
                          Evaluasi &amp; Catatan Masukan Perusahaan:
                        </label>
                        <textarea
                          rows={4}
                          value={evaluasiInput}
                          onChange={(e) => setEvaluasiInput(e.target.value)}
                          placeholder="Tulis masukan, apresiasi, atau instruksi bagian yang perlu direvisi oleh mahasiswa..."
                          className="w-full rounded-2xl border border-steel/20 p-4 text-xs outline-none focus:border-bridge-gold font-sans leading-relaxed bg-white shadow-inner"
                        />
                      </div>

                      {/* Tombol Aksi Evaluasi Gede & Tegas */}
                      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => handleMintaRevisi(evaluasiInput)}
                          disabled={isSubmittingRevisi || !evaluasiInput.trim()}
                          className="w-full sm:w-auto rounded-full bg-purple-600 hover:bg-purple-700 text-white px-7 py-3 font-mono text-xs font-bold transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          {isSubmittingRevisi ? "Memproses..." : "Minta Revisi Mahasiswa"}
                        </button>

                        <button
                          type="submit"
                          disabled={isSubmittingEvaluasi || !evaluasiInput.trim()}
                          className="w-full sm:w-auto rounded-full bg-bridge-gold hover:bg-bridge-gold/90 text-ink px-7 py-3 font-mono text-xs font-bold transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {isSubmittingEvaluasi ? "Menyimpan..." : "Kirim Evaluasi & Masukan"}
                        </button>
                      </div>
                    </form>
                  </div>

                </div>

              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-steel/20 bg-white p-12 text-center font-mono text-xs text-steel space-y-2">
                <p className="font-bold text-ink text-sm">Pilih Pelamar dari Baris di Atas</p>
                <p>Pilih salah satu pelamar di bagian atas untuk membuka obrolan 1-on-1 dan melihat progres hasil proyek.</p>
              </div>
            )}

          </div>
        )}

        {/* ==================== TAB 2: SETTINGS PROYEK ==================== */}
        {activeTab === "settings" && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Section 1: Detail Proyek */}
              <div className="rounded-2xl border border-steel/15 bg-white p-6 shadow-sm space-y-4">
                <h3 className="font-display text-base font-bold text-ink border-b border-steel/10 pb-3">
                  Informasi Proyek Kolaborasi
                </h3>

                <div>
                  <label className="block font-mono text-xs font-medium text-ink mb-1">
                    Judul Proyek / Lowongan Magang *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.judul}
                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
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

                {/* Kategori Minat */}
                <div>
                  <label className="block font-mono text-xs font-medium text-ink mb-2">
                    Kategori Minat (Pilih minimal satu) *
                  </label>
                  <div className="p-3 border border-steel/15 rounded-xl bg-steel/5 space-y-3 font-mono text-xs">
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                      {visibleKategoris.map((kat: any) => {
                        const isSelected = formData.selectedKategoriIds.includes(kat.id);
                        const isRec = recKategoriIds.includes(kat.id);
                        return (
                          <button
                            type="button"
                            key={kat.id}
                            onClick={() => toggleKategori(kat.id)}
                            className={`px-3.5 py-1.5 rounded-full transition border ${
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
                          onClick={() => setKategoriLimit((prev) => prev + 10)}
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
                    Deskripsi Detail Proyek &amp; Ekspektasi Luaran *
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold font-sans leading-relaxed bg-white"
                  />
                </div>
              </div>

              {/* Section 2: Ketentuan */}
              <div className="rounded-2xl border border-steel/15 bg-white p-6 shadow-sm space-y-4">
                <h3 className="font-display text-base font-bold text-ink border-b border-steel/10 pb-3">
                  Ketentuan Proyek
                </h3>
                {hasPelamarAktif && (
                  <p className="text-[10px] font-mono text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    ⚠ Perubahan pada batas waktu, tanggal selesai, atau gaji/stipend akan mengirim notifikasi ke pelamar terkait proyek ini.
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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

                  <div>
                    <label className="block font-mono text-xs font-medium text-ink mb-1">
                      Tanggal Selesai Kolaborasi
                    </label>
                    <input
                      type="date"
                      value={formData.tanggal_selesai}
                      onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
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
                <h3 className="font-display text-base font-bold text-ink border-b border-steel/10 pb-3">
                  Kualifikasi Mahasiswa
                </h3>

                {/* Target Prodi */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-mono text-xs font-medium text-ink">
                      Target Program Studi (Top 10 Relevan)
                    </label>
                    {top10RecProdiIds.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            selectedProdiIds: Array.from(new Set([...prev.selectedProdiIds, ...top10RecProdiIds])),
                          }));
                        }}
                        className="font-mono text-[10px] font-bold text-emerald-700 hover:text-emerald-800 transition"
                      >
                        + Pilih Semua Rekomendasi ({top10RecProdiIds.length})
                      </button>
                    )}
                  </div>

                  <div className="p-2.5 border border-steel/15 rounded-xl bg-steel/5 space-y-3 font-mono text-xs animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                      {visibleProdis.length === 0 ? (
                        <div className="col-span-full py-4 text-center font-mono text-[11px] text-steel">
                          Tidak ada rekomendasi program studi otomatis untuk judul ini.
                        </div>
                      ) : (
                        visibleProdis.map((prodi: any) => {
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
                          onClick={() => setProdiLimit((prev) => prev + 10)}
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
                      Keahlian / Skills yang Dibutuhkan (Top 10 Relevan)
                    </label>
                    {top10RecSkillIds.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            selectedSkillIds: Array.from(new Set([...prev.selectedSkillIds, ...top10RecSkillIds])),
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
                        visibleSkills.map((skill: any) => {
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
                          onClick={() => setSkillLimit((prev) => prev + 10)}
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

                {/* Submit Buttons */}
                <div className="flex items-center justify-end gap-3">
                  {!isVerified ? (
                    <button
                      type="button"
                      disabled
                      title="Fitur terkunci. Harap tunggu verifikasi akun perusahaan oleh administrator."
                      className="rounded-full bg-steel/20 px-8 py-3 font-mono text-xs font-bold text-steel/40 cursor-not-allowed border border-dashed border-steel/30 flex items-center gap-1.5"
                    >
                      <svg className="h-4 w-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Simpan Perubahan (Menunggu Verifikasi)
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="rounded-full bg-bridge-gold px-8 py-3 font-mono text-xs font-bold text-ink hover:bg-bridge-gold/90 transition shadow-md disabled:opacity-50"
                    >
                      {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Danger Zone */}
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 space-y-4">
              <div>
                <h4 className="font-display text-base font-bold text-red-800">Zona Bahaya</h4>
                <p className="text-xs text-red-600 font-medium mt-1 font-sans">
                  {hasPelamarAktif
                    ? "Sudah ada pelamar pada proyek ini. Menghapus proyek akan mengirim permintaan persetujuan & kompensasi ke pelamar terkait terlebih dahulu."
                    : "Tindakan ini tidak dapat dibatalkan. Menghapus kolaborasi akan menghapus permanen data proyek."}
                </p>
              </div>
              {!isVerified ? (
                <button
                  type="button"
                  disabled
                  title="Fitur terkunci. Harap tunggu verifikasi akun perusahaan oleh administrator."
                  className="rounded-full bg-steel/15 px-6 py-2.5 font-mono text-xs font-bold text-steel/40 cursor-not-allowed border border-dashed border-steel/25 flex items-center gap-1.5"
                >
                  <svg className="h-3.5 w-3.5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Hapus Kolaborasi (Menunggu Verifikasi)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={isDeleting}
                  className="rounded-full bg-red-600 px-6 py-2.5 font-mono text-xs font-bold text-white hover:bg-red-700 transition shadow-sm disabled:opacity-50"
                >
                  {isDeleting ? "Memproses..." : hasPelamarAktif ? "Ajukan Hapus Kolaborasi" : "Hapus Kolaborasi"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ==================== MODAL: KONFIRMASI HAPUS PROYEK ==================== */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans text-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-steel/20 space-y-4">
            <div className="flex items-center justify-between border-b border-steel/10 pb-3">
              <h3 className="font-display text-base font-bold text-red-800">
                {hasPelamarAktif ? "Ajukan Penghapusan Proyek" : "Hapus Kolaborasi"}
              </h3>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-steel hover:text-ink transition"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {hasPelamarAktif ? (
              <div className="space-y-3 font-mono">
                <p className="text-[11px] text-ink leading-relaxed">
                  Proyek ini sudah punya <strong>{stats.total}</strong> pelamar ({stats.diterima} diterima, {stats.menunggu} menunggu). Proyek tidak bisa langsung dihapus.
                </p>
                <div>
                  <label className="block text-[10px] font-bold text-ink mb-1">
                    Catatan Perusahaan / Penawaran Kompensasi:
                  </label>
                  <textarea
                    rows={3}
                    value={deleteCatatanPerusahaan}
                    onChange={(e) => setDeleteCatatanPerusahaan(e.target.value)}
                    placeholder="Tulis alasan pembatalan & penawaran kompensasi (misal: Insentif Rp 500rb / Sertifikat khusus)..."
                    className="w-full rounded-xl border border-steel/20 p-2.5 text-xs outline-none focus:border-bridge-gold bg-white"
                  />
                </div>
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-[10px] text-amber-800 leading-relaxed">
                  Sistem akan membuat record persetujuan hapus &amp; notifikasi otomatis ke semua pelamar aktif. Proyek terhapus setelah semua pelamar menyetujui.
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="rounded-full border border-steel/20 bg-white px-4 py-2 text-[11px] text-steel"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleRequestDeleteProyek}
                    disabled={isDeleting}
                    className="rounded-full bg-red-600 px-4 py-2 text-[11px] font-bold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {isDeleting ? "Mengirim..." : "Kirim Permintaan Hapus"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 font-mono">
                <p className="text-[11px] text-ink leading-relaxed">
                  Apakah Anda yakin ingin menghapus kolaborasi <strong>&ldquo;{kolaborasi.judul}&rdquo;</strong>? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="rounded-full border border-steel/20 bg-white px-4 py-2 text-[11px] text-steel"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteProyek}
                    disabled={isDeleting}
                    className="rounded-full bg-red-600 px-4 py-2 text-[11px] font-bold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
                searchedKotaOptions.map((k: any) => {
                  const isSelected = formData.lokasi_id === k.id;
                  return (
                    <button
                      type="button"
                      key={k.id}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, lokasi_id: k.id }));
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
                searchedKategoriOptions.map((k: any) => {
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
                searchedProdiOptions.map((p: any) => {
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
                searchedSkillOptions.map((s: any) => {
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
          setSuccessModal((prev) => ({ ...prev, isOpen: false }));
          if (successModal.redirectOnClose) {
            router.push("/perusahaan/kolaborasi");
          }
        }}
      />
    </main>
  );
}

interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

function SuccessModal({ isOpen, title, message, onClose }: SuccessModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans text-xs">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-steel/20 text-center space-y-4 animate-fade-in animate-duration-200">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="font-display text-base font-bold text-ink">{title}</h3>
          <p className="font-mono text-[11px] text-steel leading-relaxed">{message}</p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full bg-ink py-2.5 font-mono text-[10px] font-bold text-white hover:bg-steel transition"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}