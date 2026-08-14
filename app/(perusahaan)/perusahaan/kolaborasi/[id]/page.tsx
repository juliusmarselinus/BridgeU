"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useKolaborasiDetail } from "./hooks/useKolaborasiDetail";

export default function DetailKolaborasiPage() {
  const params = useParams();

  const {
    router,
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

  // Categorize pelamar
  const pelamarMenunggu = pelamarList.filter((p) => p.status === "Menunggu");
  const pelamarAktif = pelamarList.filter(
    (p) => p.status === "Diterima" || p.status === "Minta Revisi" || p.status === "Selesai"
  );
  const pelamarDitolak = pelamarList.filter((p) => p.status === "Ditolak");

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-xs text-steel">
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-bridge-gold" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Memuat data proyek...
        </div>
      </div>
    );
  }

  if (statusVerifikasi !== "Terverifikasi") {
    return (
      <main className="mx-auto max-w-2xl px-4 pt-28 pb-16 text-center font-sans">
        <div className="rounded-2xl border border-dashed border-red-200 bg-red-50/40 p-10 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="mt-5 font-display text-xl font-bold text-ink">Akses Terkunci</h2>
          <p className="mt-2 font-mono text-xs text-steel max-w-md mx-auto leading-relaxed">
            Akun perusahaan belum terverifikasi oleh administrator. Status saat ini:{" "}
            <strong className="text-red-700">{statusVerifikasi}</strong>.
          </p>
          <Link
            href="/perusahaan/dashboard"
            className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-ink px-6 py-2.5 font-mono text-xs font-bold text-paper hover:bg-steel transition shadow-sm"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (!kolaborasi) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-28 text-center">
        <h2 className="font-display text-2xl font-bold text-ink">Proyek tidak ditemukan</h2>
        <p className="mt-2 text-xs text-steel">Proyek mungkin sudah dihapus atau tautan tidak valid.</p>
        <Link
          href="/perusahaan/kolaborasi"
          className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-ink px-6 py-2.5 font-mono text-xs font-bold text-paper hover:bg-steel transition"
        >
          Kembali ke Daftar
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-16 font-sans">
      {/* Header */}
      <div className="border-b border-steel/15 pb-5">
        <div className="flex items-center gap-2 font-mono text-xs text-steel mb-2">
          <Link href="/perusahaan/kolaborasi" className="hover:text-ink transition">
            Kelola Kolaborasi
          </Link>
          <svg className="h-3 w-3 text-steel/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="text-ink truncate max-w-xs">{kolaborasi.judul}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink leading-tight">
            {kolaborasi.judul}
          </h1>
          <Link
            href="/perusahaan/kolaborasi"
            className="inline-flex items-center gap-1.5 rounded-full border border-steel/20 bg-white px-4 py-2 font-mono text-xs font-medium text-ink hover:bg-steel/5 transition shadow-sm shrink-0"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Kembali ke Daftar
          </Link>
        </div>
      </div>

      {/* Tab Navigation — Pelamar First, then Workspace, then Settings */}
      <div className="mt-5">
        <div className="inline-flex p-1 bg-steel/8 rounded-2xl border border-steel/10 font-mono text-xs">
          <button
            onClick={() => setActiveTab("pelamar")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === "pelamar"
                ? "bg-white text-ink shadow-sm"
                : "text-steel hover:text-ink"
            }`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            Daftar Pelamar
            {pelamarMenunggu.length > 0 && (
              <span className="inline-flex items-center justify-center h-4 min-w-4 rounded-full bg-amber-500 text-white text-[9px] font-bold px-1">
                {pelamarMenunggu.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("workspace" as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === ("workspace" as any)
                ? "bg-white text-ink shadow-sm"
                : "text-steel hover:text-ink"
            }`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            Workspace Aktif
            <span className="inline-flex items-center justify-center h-4 min-w-4 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1">
              {pelamarAktif.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === "settings"
                ? "bg-white text-ink shadow-sm"
                : "text-steel hover:text-ink"
            }`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Pengaturan Proyek
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="mt-6">

        {/* ==================== TAB 1: DAFTAR PELAMAR (REVIEW) ==================== */}
        {activeTab === "pelamar" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-base font-bold text-ink">Pendaftaran Masuk</h2>
                <p className="font-mono text-[11px] text-steel mt-0.5">
                  Tinjau profil dan portofolio pelamar, lalu putuskan penerimaan.
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                  Menunggu: {pelamarMenunggu.length}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                  Diterima: {pelamarAktif.length}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-steel/10 text-steel border border-steel/15 font-bold">
                  Ditolak: {pelamarDitolak.length}
                </span>
              </div>
            </div>

            {pelamarList.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-steel/20 bg-white p-10 text-center font-mono text-xs text-steel">
                Belum ada mahasiswa yang mendaftar pada proyek ini.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {pelamarList.map((pelamar) => (
                  <div
                    key={pelamar.id}
                    className="rounded-2xl border border-steel/15 bg-white p-5 shadow-sm space-y-4 flex flex-col"
                  >
                    {/* Header Kartu Pelamar */}
                    <div className="flex items-start justify-between gap-3 pb-4 border-b border-steel/10">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 rounded-full bg-bridge-gold/15 border border-bridge-gold/30 flex items-center justify-center font-display text-base font-bold text-ink overflow-hidden">
                          {pelamar.foto_url ? (
                            <img src={pelamar.foto_url} alt={pelamar.nama_lengkap} className="h-full w-full object-cover" />
                          ) : (
                            pelamar.nama_lengkap.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-sm font-bold text-ink">{pelamar.nama_lengkap}</h3>
                            <span className="font-mono text-[9px] text-steel border border-steel/20 rounded-full px-2 py-0.5">
                              {pelamar.reputation_score} Pts
                            </span>
                          </div>
                          <p className="font-mono text-[11px] text-steel mt-0.5">
                            {pelamar.universitas} &bull; {pelamar.program_studi}
                          </p>
                        </div>
                      </div>

                      <StatusBadge status={pelamar.status} />
                    </div>

                    {/* Self Description */}
                    {pelamar.ringkasan_self && (
                      <p className="font-sans text-xs text-steel bg-steel/5 rounded-xl p-3.5 leading-relaxed border border-steel/10 flex-1">
                        {pelamar.ringkasan_self}
                      </p>
                    )}

                    {/* Portofolio */}
                    {pelamar.url_portofolio_dokumen && (
                      <a
                        href={pelamar.url_portofolio_dokumen}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between font-mono text-xs text-bridge-gold font-bold hover:underline bg-amber-50/40 p-3 rounded-xl border border-amber-100"
                      >
                        <span>Lihat Dokumen Portofolio</span>
                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}

                    {/* Action Footer */}
                    <div className="pt-3 border-t border-steel/10 flex items-center justify-between gap-3">
                      <span className="font-mono text-[10px] text-steel">
                        Daftar {new Date(pelamar.tanggal_daftar).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                      </span>

                      {pelamar.status === "Menunggu" ? (
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <button
                            onClick={() => handleUpdateStatus(pelamar.id, "Ditolak")}
                            className="rounded-full border border-red-200 bg-red-50 text-red-700 px-4 py-1.5 font-semibold hover:bg-red-100 transition"
                          >
                            Tolak
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(pelamar.id, "Diterima")}
                            className="rounded-full bg-emerald-600 text-white px-5 py-1.5 font-semibold hover:bg-emerald-700 transition shadow-sm"
                          >
                            Terima
                          </button>
                        </div>
                      ) : pelamar.status === "Diterima" || pelamar.status === "Minta Revisi" || pelamar.status === "Selesai" ? (
                        <button
                          onClick={() => {
                            setSelectedPelamar(pelamar);
                            setActiveTab("workspace" as any);
                          }}
                          className="rounded-full bg-ink text-white px-4 py-1.5 font-mono text-xs font-semibold hover:bg-steel transition"
                        >
                          Buka Workspace
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 2: WORKSPACE MAHASISWA AKTIF ==================== */}
        {activeTab === ("workspace" as any) && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-base font-bold text-ink">Workspace Proyek</h2>
                <p className="font-mono text-[11px] text-steel mt-0.5">
                  Mahasiswa yang sudah diterima. Chat 1-on-1, pantau progres, dan berikan evaluasi.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("pelamar")}
                className="inline-flex items-center gap-1.5 font-mono text-xs text-steel hover:text-ink transition border border-steel/20 rounded-full px-4 py-2 bg-white hover:bg-steel/5 shrink-0"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
                Review Pendaftaran
                {pelamarMenunggu.length > 0 && (
                  <span className="inline-flex items-center justify-center h-4 min-w-4 rounded-full bg-amber-500 text-white text-[9px] font-bold px-1">
                    {pelamarMenunggu.length}
                  </span>
                )}
              </button>
            </div>

            {/* Pilihan Pelamar Aktif */}
            {pelamarAktif.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-steel/20 bg-white p-10 text-center font-mono text-xs text-steel space-y-3">
                <p className="font-bold text-ink text-sm">Belum ada mahasiswa aktif di workspace ini.</p>
                <p>Terima pendaftaran mahasiswa terlebih dahulu melalui tab Daftar Pelamar.</p>
                <button
                  onClick={() => setActiveTab("pelamar")}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-ink text-paper px-5 py-2 font-bold text-xs hover:bg-steel transition"
                >
                  Ke Daftar Pelamar
                </button>
              </div>
            ) : (
              <>
                {/* Kartu Pilih Mahasiswa */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {pelamarAktif.map((pelamar) => {
                    const isSelected = selectedPelamar?.id === pelamar.id;
                    return (
                      <div
                        key={pelamar.id}
                        onClick={() => setSelectedPelamar(pelamar)}
                        className={`rounded-2xl border p-3.5 cursor-pointer transition-all duration-150 ${
                          isSelected
                            ? "border-bridge-gold bg-amber-50/30 ring-2 ring-bridge-gold/40 shadow-md"
                            : "border-steel/15 bg-white hover:border-steel/30 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex flex-col items-center text-center gap-2">
                          <div className="h-10 w-10 rounded-full bg-steel/10 border border-steel/20 flex items-center justify-center font-display font-bold text-ink overflow-hidden text-sm">
                            {pelamar.foto_url ? (
                              <img src={pelamar.foto_url} alt={pelamar.nama_lengkap} className="h-full w-full object-cover" />
                            ) : (
                              pelamar.nama_lengkap.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-display text-[11px] font-bold text-ink leading-tight">{pelamar.nama_lengkap}</p>
                            <p className="font-mono text-[9px] text-steel mt-0.5">{pelamar.program_studi}</p>
                          </div>
                          <StatusBadge status={pelamar.status} small />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Split View: Chat (kiri) + Progres & Evaluasi (kanan) */}
                {selectedPelamar ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start pt-1">
                    {/* LEFT: Chat 1-on-1 */}
                    <div className="lg:col-span-5 rounded-2xl border border-steel/15 bg-white shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-4 border-b border-steel/10">
                        <div>
                          <h4 className="font-display text-xs font-bold text-ink">
                            Chat — {selectedPelamar.nama_lengkap}
                          </h4>
                          <span className="font-mono text-[9px] text-emerald-600 flex items-center gap-1 mt-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                            Realtime
                          </span>
                        </div>
                      </div>

                      <div className="h-[440px] overflow-y-auto p-4 space-y-3 bg-steel/3">
                        {chatMessages.length === 0 ? (
                          <div className="flex h-full items-center justify-center font-mono text-[11px] text-steel text-center">
                            Belum ada pesan. Kirim pesan pertama ke {selectedPelamar.nama_lengkap}.
                          </div>
                        ) : (
                          chatMessages.map((msg) => {
                            const isMe = msg.tipe_pengirim === "perusahaan";
                            return (
                              <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                <div
                                  className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                                    isMe
                                      ? "bg-ink text-paper rounded-br-none"
                                      : "bg-white text-ink border border-steel/15 rounded-bl-none"
                                  }`}
                                >
                                  {msg.pesan}
                                </div>
                                <span className="font-mono text-[9px] text-steel/50 mt-1 px-1">
                                  {new Date(msg.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>

                      <form onSubmit={handleKirimChat} className="flex gap-2 p-4 border-t border-steel/10">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder={`Pesan ke ${selectedPelamar.nama_lengkap}...`}
                          className="flex-1 rounded-xl border border-steel/20 px-3.5 py-2.5 text-xs outline-none focus:border-bridge-gold bg-steel/3"
                        />
                        <button
                          type="submit"
                          disabled={isSendingChat || !chatInput.trim()}
                          className="rounded-xl bg-ink px-4 py-2.5 font-mono text-xs font-bold text-white hover:bg-steel transition disabled:opacity-40 shrink-0"
                        >
                          {isSendingChat ? "..." : "Kirim"}
                        </button>
                      </form>
                    </div>

                    {/* RIGHT: Info + Progres + Evaluasi */}
                    <div className="lg:col-span-7 space-y-5">
                      {/* Info Mahasiswa + Aksi */}
                      <div className="rounded-2xl border border-steel/15 bg-white p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 shrink-0 rounded-full bg-bridge-gold/15 border border-bridge-gold/30 flex items-center justify-center font-display font-bold text-ink overflow-hidden">
                            {selectedPelamar.foto_url ? (
                              <img src={selectedPelamar.foto_url} alt={selectedPelamar.nama_lengkap} className="h-full w-full object-cover" />
                            ) : (
                              selectedPelamar.nama_lengkap.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-display text-sm font-bold text-ink">{selectedPelamar.nama_lengkap}</h3>
                              <StatusBadge status={selectedPelamar.status} />
                            </div>
                            <p className="font-mono text-[11px] text-steel">
                              {selectedPelamar.universitas} &bull; {selectedPelamar.program_studi} &bull; Semester {selectedPelamar.semester}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUpdateStatus(selectedPelamar.id, "Selesai")}
                          className="rounded-full border border-blue-200 bg-blue-50 text-blue-700 px-4 py-1.5 font-mono text-xs font-semibold hover:bg-blue-100 transition shrink-0"
                        >
                          Tandai Selesai
                        </button>
                      </div>

                      {/* Progres & Hasil */}
                      <div className="rounded-2xl border border-steel/15 bg-white p-5 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-steel/10 pb-3">
                          <h4 className="font-display text-sm font-bold text-ink flex items-center gap-2">
                            <svg className="h-4 w-4 text-bridge-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Progres &amp; Hasil Pengerjaan
                          </h4>
                          <span className="font-mono text-[10px] text-steel border border-steel/15 rounded-full px-2.5 py-1">
                            {selectedPelamar.riwayat_pengumpulan?.length || 0} Versi
                          </span>
                        </div>

                        {(!selectedPelamar.riwayat_pengumpulan || selectedPelamar.riwayat_pengumpulan.length === 0) ? (
                          <div className="rounded-xl border border-dashed border-steel/20 bg-steel/5 p-6 text-center font-mono text-xs text-steel">
                            Mahasiswa belum mengumpulkan hasil pengerjaan proyek.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {selectedPelamar.riwayat_pengumpulan.map((item: any) => (
                              <div key={item.id} className="rounded-xl border border-steel/15 p-4 space-y-2">
                                <div className="flex items-center justify-between font-mono text-xs">
                                  <span className="font-bold text-ink">Versi #{item.versi}</span>
                                  <span className="text-[10px] text-steel">
                                    {new Date(item.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                                  </span>
                                </div>
                                <a
                                  href={item.url_hasil}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-bridge-gold underline hover:text-ink font-mono text-xs font-bold break-all block"
                                >
                                  {item.url_hasil}
                                </a>
                                {item.catatan_mahasiswa && (
                                  <p className="text-xs text-steel bg-steel/5 p-3 rounded-lg border border-steel/10 leading-relaxed">
                                    &ldquo;{item.catatan_mahasiswa}&rdquo;
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Form Evaluasi */}
                        <form onSubmit={handleKirimEvaluasi} className="pt-4 border-t border-steel/10 space-y-3">
                          <label className="block font-mono text-xs font-bold text-ink">
                            Evaluasi &amp; Catatan Masukan Perusahaan:
                          </label>
                          <textarea
                            rows={3}
                            value={evaluasiInput}
                            onChange={(e) => setEvaluasiInput(e.target.value)}
                            placeholder="Tulis masukan, apresiasi, atau instruksi revisi untuk mahasiswa..."
                            className="w-full rounded-xl border border-steel/20 p-3.5 text-xs outline-none focus:border-bridge-gold font-sans leading-relaxed bg-white"
                          />
                          <div className="flex items-center justify-end gap-2.5">
                            <button
                              type="button"
                              onClick={() => handleMintaRevisi(evaluasiInput)}
                              disabled={isSubmittingRevisi || !evaluasiInput.trim()}
                              className="rounded-full border border-purple-200 bg-purple-50 text-purple-700 px-5 py-2 font-mono text-xs font-semibold hover:bg-purple-100 transition disabled:opacity-40"
                            >
                              {isSubmittingRevisi ? "Memproses..." : "Minta Revisi"}
                            </button>
                            <button
                              type="submit"
                              disabled={isSubmittingEvaluasi || !evaluasiInput.trim()}
                              className="rounded-full bg-bridge-gold text-ink px-6 py-2 font-mono text-xs font-semibold hover:bg-bridge-gold/90 transition disabled:opacity-40 shadow-sm"
                            >
                              {isSubmittingEvaluasi ? "Menyimpan..." : "Kirim Evaluasi"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-steel/20 bg-white p-10 text-center font-mono text-xs text-steel">
                    Pilih mahasiswa di atas untuk membuka chat 1-on-1 dan melihat progres pengerjaan proyek.
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ==================== TAB 3: PENGATURAN PROYEK ==================== */}
        {activeTab === "settings" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <form onSubmit={handleSaveSettings} className="space-y-5">
              {/* Detail Proyek */}
              <div className="rounded-2xl border border-steel/15 bg-white p-6 shadow-sm space-y-4">
                <h3 className="font-display text-sm font-bold text-ink border-b border-steel/10 pb-3">
                  Informasi Proyek
                </h3>

                <div>
                  <label className="block font-mono text-xs font-medium text-ink mb-1.5">Judul Proyek *</label>
                  <input
                    type="text"
                    required
                    value={formData.judul}
                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                    className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs font-medium text-ink mb-1.5">Tipe Kolaborasi *</label>
                    <select
                      value={formData.tipe}
                      onChange={(e) => setFormData({ ...formData, tipe: e.target.value as "Akademik" | "Magang" })}
                      className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm bg-white outline-none focus:border-bridge-gold"
                    >
                      <option value="Akademik">Akademik</option>
                      <option value="Magang">Magang</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-xs font-medium text-ink mb-1.5">Kota Lokasi *</label>
                    <button
                      type="button"
                      onClick={() => setIsKotaModalOpen(true)}
                      className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm bg-white text-left flex items-center justify-between hover:bg-steel/5 transition"
                    >
                      <span className="truncate text-sm">{selectedKotaObj?.nama_kota || "Pilih Kota"}</span>
                      <svg className="h-4 w-4 text-steel/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs font-medium text-ink mb-2">
                    Kategori Minat *
                  </label>
                  <div className="p-3 border border-steel/15 rounded-xl bg-steel/5 font-mono text-xs">
                    <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                      {visibleKategoris.map((kat: any) => {
                        const isSelected = formData.selectedKategoriIds.includes(kat.id);
                        const isRec = recKategoriIds.includes(kat.id);
                        return (
                          <button
                            type="button"
                            key={kat.id}
                            onClick={() => toggleKategori(kat.id)}
                            className={`px-3 py-1.5 rounded-full transition border text-xs ${
                              isSelected ? "bg-ink text-paper border-ink" : isRec ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-white text-steel border-steel/20 hover:bg-steel/5"
                            }`}
                          >
                            {kat.nama_kategori}
                          </button>
                        );
                      })}
                    </div>
                    {sortedKategoris.length > kategoriLimit && (
                      <button type="button" onClick={() => setKategoriLimit((p) => p + 10)} className="mt-2 text-[10px] text-steel hover:text-ink font-bold">
                        Tampilkan lebih banyak
                      </button>
                    )}
                  </div>
                  <button type="button" onClick={() => setIsKategoriModalOpen(true)} className="mt-1.5 font-mono text-[10px] text-bridge-gold font-bold hover:underline float-right">
                    Cari Kategori Lain
                  </button>
                </div>

                <div>
                  <label className="block font-mono text-xs font-medium text-ink mb-1.5">Deskripsi Proyek *</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold leading-relaxed bg-white"
                  />
                </div>
              </div>

              {/* Ketentuan */}
              <div className="rounded-2xl border border-steel/15 bg-white p-6 shadow-sm space-y-4">
                <h3 className="font-display text-sm font-bold text-ink border-b border-steel/10 pb-3">Ketentuan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-mono text-xs font-medium text-ink mb-1.5">Tingkat Kesulitan</label>
                    <select
                      value={formData.tingkat_kesulitan}
                      onChange={(e) => setFormData({ ...formData, tingkat_kesulitan: e.target.value as "Pemula" | "Menengah" | "Lanjut" })}
                      className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm bg-white outline-none focus:border-bridge-gold"
                    >
                      <option value="Pemula">Pemula</option>
                      <option value="Menengah">Menengah</option>
                      <option value="Lanjut">Lanjut</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-xs font-medium text-ink mb-1.5">Kuota Slot *</label>
                    <input type="number" min={1} required value={formData.slot} onChange={(e) => setFormData({ ...formData, slot: Number(e.target.value) })} className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold bg-white" />
                  </div>
                  <div>
                    <label className="block font-mono text-xs font-medium text-ink mb-1.5">Batas Daftar *</label>
                    <input type="date" required value={formData.batas_waktu} onChange={(e) => setFormData({ ...formData, batas_waktu: e.target.value })} className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold bg-white" />
                  </div>
                  <div>
                    <label className="block font-mono text-xs font-medium text-ink mb-1.5">Tgl Selesai</label>
                    <input type="date" value={formData.tanggal_selesai} onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })} className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold bg-white" />
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-xs font-medium text-ink mb-1.5">Gaji / Stipend</label>
                  <input type="text" value={formData.gaji_stipend} onChange={(e) => setFormData({ ...formData, gaji_stipend: e.target.value })} placeholder="Contoh: Rp 2.000.000 / bulan" className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold bg-white" />
                </div>
              </div>

              {/* Kualifikasi */}
              <div className="rounded-2xl border border-steel/15 bg-white p-6 shadow-sm space-y-5">
                <h3 className="font-display text-sm font-bold text-ink border-b border-steel/10 pb-3">Kualifikasi Mahasiswa</h3>

                {/* Program Studi */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-mono text-xs font-medium text-ink">Target Program Studi</label>
                    {top10RecProdiIds.length > 0 && (
                      <button type="button" onClick={() => setFormData((prev) => ({ ...prev, selectedProdiIds: Array.from(new Set([...prev.selectedProdiIds, ...top10RecProdiIds])) }))} className="font-mono text-[10px] font-bold text-emerald-700">
                        + Pilih Semua Rekomendasi
                      </button>
                    )}
                  </div>
                  <div className="p-3 border border-steel/15 rounded-xl bg-steel/5 font-mono text-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                      {visibleProdis.map((prodi: any) => {
                        const isSelected = formData.selectedProdiIds.includes(prodi.id);
                        const isRec = top10RecProdiIds.includes(prodi.id);
                        return (
                          <button type="button" key={prodi.id} onClick={() => toggleProdi(prodi.id)}
                            className={`flex items-center gap-2 p-2 rounded-lg text-left transition ${isSelected ? "bg-ink text-paper" : isRec ? "bg-emerald-50 border border-emerald-200" : "bg-white border border-steel/10 hover:bg-steel/5"}`}
                          >
                            <span className={`h-3 w-3 rounded border flex items-center justify-center text-[9px] shrink-0 ${isSelected ? "bg-bridge-gold border-bridge-gold" : "border-steel/30"}`}>
                              {isSelected ? "✓" : ""}
                            </span>
                            <span className="truncate text-[11px]">{prodi.nama_prodi}</span>
                          </button>
                        );
                      })}
                    </div>
                    {sortedProdis.length > prodiLimit && (
                      <button type="button" onClick={() => setProdiLimit((p) => p + 10)} className="mt-2 text-[10px] text-steel hover:text-ink font-bold">
                        Tampilkan lebih banyak
                      </button>
                    )}
                  </div>
                  <button type="button" onClick={() => setIsProdiModalOpen(true)} className="mt-1.5 font-mono text-[10px] text-bridge-gold font-bold hover:underline float-right">
                    Cari Program Studi Lain
                  </button>
                </div>

                {/* Skills */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-mono text-xs font-medium text-ink">Keahlian yang Dibutuhkan</label>
                    {top10RecSkillIds.length > 0 && (
                      <button type="button" onClick={() => setFormData((prev) => ({ ...prev, selectedSkillIds: Array.from(new Set([...prev.selectedSkillIds, ...top10RecSkillIds])) }))} className="font-mono text-[10px] font-bold text-emerald-700">
                        + Pilih Semua Rekomendasi
                      </button>
                    )}
                  </div>
                  <div className="p-3 border border-steel/15 rounded-xl bg-steel/5 font-mono text-xs">
                    <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                      {visibleSkills.map((skill: any) => {
                        const isSelected = formData.selectedSkillIds.includes(skill.id);
                        const isRec = top10RecSkillIds.includes(skill.id);
                        return (
                          <button type="button" key={skill.id} onClick={() => toggleSkill(skill.id)}
                            className={`px-3 py-1.5 rounded-full border text-xs transition ${isSelected ? "bg-bridge-gold text-ink border-bridge-gold" : isRec ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-white text-steel border-steel/20 hover:bg-steel/5"}`}
                          >
                            {skill.nama_skill}
                          </button>
                        );
                      })}
                    </div>
                    {sortedSkills.length > skillLimit && (
                      <button type="button" onClick={() => setSkillLimit((p) => p + 10)} className="mt-2 text-[10px] text-steel hover:text-ink font-bold">
                        Tampilkan lebih banyak
                      </button>
                    )}
                  </div>
                  <button type="button" onClick={() => setIsSkillModalOpen(true)} className="mt-1.5 font-mono text-[10px] text-bridge-gold font-bold hover:underline float-right">
                    Cari Keahlian Lain
                  </button>
                </div>

                <div className="flex justify-end pt-2">
                  {!isVerified ? (
                    <button type="button" disabled className="rounded-full bg-steel/15 px-7 py-2.5 font-mono text-xs font-bold text-steel/40 cursor-not-allowed border border-dashed border-steel/25">
                      Simpan (Menunggu Verifikasi)
                    </button>
                  ) : (
                    <button type="submit" disabled={isSaving} className="rounded-full bg-bridge-gold px-8 py-2.5 font-mono text-xs font-bold text-ink hover:bg-bridge-gold/90 transition shadow-md disabled:opacity-50">
                      {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Danger Zone */}
            <div className="rounded-2xl border border-red-200 bg-red-50/60 p-5 space-y-3">
              <h4 className="font-display text-sm font-bold text-red-800">Zona Bahaya</h4>
              <p className="text-xs text-red-600 font-sans">
                {hasPelamarAktif
                  ? "Sudah ada pelamar aktif. Menghapus akan mengirim permintaan konfirmasi ke semua pelamar terlebih dahulu."
                  : "Tindakan ini bersifat permanen dan tidak bisa dibatalkan."}
              </p>
              {!isVerified ? (
                <button type="button" disabled className="rounded-full bg-steel/15 px-5 py-2 font-mono text-xs font-bold text-steel/40 cursor-not-allowed border border-dashed border-steel/25">
                  Hapus Kolaborasi (Menunggu Verifikasi)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={isDeleting}
                  className="rounded-full bg-red-600 px-5 py-2 font-mono text-xs font-bold text-white hover:bg-red-700 transition disabled:opacity-50"
                >
                  {isDeleting ? "Memproses..." : hasPelamarAktif ? "Ajukan Hapus Kolaborasi" : "Hapus Kolaborasi"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ==================== MODAL: KONFIRMASI HAPUS ==================== */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-steel/20 space-y-4 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-steel/10 pb-3">
              <h3 className="font-display text-base font-bold text-red-800">
                {hasPelamarAktif ? "Ajukan Penghapusan Proyek" : "Hapus Kolaborasi"}
              </h3>
              <button onClick={() => setIsDeleteModalOpen(false)} className="text-steel hover:text-ink">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {hasPelamarAktif ? (
              <div className="space-y-3 font-mono">
                <p className="text-[11px] text-ink leading-relaxed">
                  Ada <strong>{stats.total}</strong> pelamar terdaftar. Proyek tidak bisa langsung dihapus.
                </p>
                <div>
                  <label className="block text-[10px] font-bold text-ink mb-1">Catatan / Penawaran Kompensasi:</label>
                  <textarea rows={3} value={deleteCatatanPerusahaan} onChange={(e) => setDeleteCatatanPerusahaan(e.target.value)} placeholder="Alasan pembatalan & kompensasi untuk pelamar..." className="w-full rounded-xl border border-steel/20 p-2.5 text-xs outline-none focus:border-bridge-gold" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setIsDeleteModalOpen(false)} className="rounded-full border border-steel/20 px-4 py-2 text-[11px] text-steel">Batal</button>
                  <button onClick={handleRequestDeleteProyek} disabled={isDeleting} className="rounded-full bg-red-600 px-4 py-2 text-[11px] font-bold text-white hover:bg-red-700 disabled:opacity-50">
                    {isDeleting ? "Mengirim..." : "Kirim Permintaan Hapus"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 font-mono">
                <p className="text-[11px] text-ink leading-relaxed">
                  Apakah Anda yakin ingin menghapus proyek <strong>&ldquo;{kolaborasi.judul}&rdquo;</strong>? Tidak bisa dibatalkan.
                </p>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setIsDeleteModalOpen(false)} className="rounded-full border border-steel/20 px-4 py-2 text-[11px] text-steel">Batal</button>
                  <button onClick={handleDeleteProyek} disabled={isDeleting} className="rounded-full bg-red-600 px-4 py-2 text-[11px] font-bold text-white hover:bg-red-700 disabled:opacity-50">
                    {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals: Kota, Kategori, Prodi, Skill — compact versions */}
      {[
        { open: isKotaModalOpen, close: () => { setIsKotaModalOpen(false); setKotaSearch(""); }, title: "Cari Kota Lokasi", search: kotaSearch, setSearch: setKotaSearch, options: searchedKotaOptions, onSelect: (k: any) => { setFormData((p) => ({ ...p, lokasi_id: k.id })); setIsKotaModalOpen(false); setKotaSearch(""); }, getLabel: (k: any) => k.nama_kota, isSelected: (k: any) => formData.lokasi_id === k.id },
      ].map((modal, i) => modal.open && (
        <div key={i} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-xl border border-steel/20 flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between pb-3 border-b border-steel/10">
              <h3 className="font-display text-sm font-bold text-ink">{modal.title}</h3>
              <button onClick={modal.close} className="text-steel hover:text-ink">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <input type="text" value={modal.search} onChange={(e) => modal.setSearch(e.target.value)} placeholder="Cari..." className="my-3 w-full rounded-xl border border-steel/20 px-3.5 py-2.5 text-xs outline-none focus:border-bridge-gold" />
            <div className="flex-1 overflow-y-auto space-y-1 font-mono text-xs">
              {modal.options.map((item: any) => (
                <button key={item.id} type="button" onClick={() => modal.onSelect(item)} className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition ${modal.isSelected(item) ? "bg-ink text-paper font-semibold" : "hover:bg-steel/10"}`}>
                  <span>{modal.getLabel(item)}</span>
                  {modal.isSelected(item) && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}

      {isKategoriModalOpen && (
        <PickerModal
          title="Cari Kategori Minat"
          search={kategoriSearch}
          setSearch={setKategoriSearch}
          options={searchedKategoriOptions}
          isSelected={(k: any) => formData.selectedKategoriIds.includes(k.id)}
          onSelect={(k: any) => toggleKategori(k.id)}
          getLabel={(k: any) => k.nama_kategori}
          onClose={() => { setIsKategoriModalOpen(false); setKategoriSearch(""); }}
          isSearchEmpty={isKategoriSearchEmpty}
          onAddCustom={() => handleAddCustomKategori(kategoriSearch)}
          isCreatingCustom={isCreatingCustom}
          customLabel={`Tambahkan "${kategoriSearch}"`}
        />
      )}

      {isProdiModalOpen && (
        <PickerModal
          title="Cari Program Studi"
          search={prodiSearch}
          setSearch={setProdiSearch}
          options={searchedProdiOptions}
          isSelected={(p: any) => formData.selectedProdiIds.includes(p.id)}
          onSelect={(p: any) => p.id !== -999 && toggleProdi(p.id)}
          getLabel={(p: any) => `${p.nama_prodi}${p.jenjang && p.jenjang !== "Umum" ? ` (${p.jenjang})` : ""}`}
          onClose={() => { setIsProdiModalOpen(false); setProdiSearch(""); }}
          isSearchEmpty={isProdiSearchEmpty}
          onAddCustom={() => handleAddCustomProdi(prodiSearch)}
          isCreatingCustom={isCreatingCustom}
          customLabel={`Tambahkan "${prodiSearch}"`}
        />
      )}

      {isSkillModalOpen && (
        <PickerModal
          title="Cari Keahlian / Skill"
          search={skillSearch}
          setSearch={setSkillSearch}
          options={searchedSkillOptions}
          isSelected={(s: any) => formData.selectedSkillIds.includes(s.id)}
          onSelect={(s: any) => toggleSkill(s.id)}
          getLabel={(s: any) => s.nama_skill}
          onClose={() => { setIsSkillModalOpen(false); setSkillSearch(""); }}
          isSearchEmpty={isSkillSearchEmpty}
          onAddCustom={() => handleAddCustomSkill(skillSearch)}
          isCreatingCustom={isCreatingCustom}
          customLabel={`Tambahkan "${skillSearch}"`}
        />
      )}

      {/* Success Modal */}
      {successModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-steel/20 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-ink">{successModal.title}</h3>
              <p className="font-mono text-[11px] text-steel mt-1 leading-relaxed">{successModal.message}</p>
            </div>
            <button
              onClick={() => {
                setSuccessModal((p) => ({ ...p, isOpen: false }));
                if (successModal.redirectOnClose) router.push("/perusahaan/kolaborasi");
              }}
              className="w-full rounded-full bg-ink py-2.5 font-mono text-xs font-bold text-white hover:bg-steel transition"
            >
              Selesai
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// ==================== HELPER COMPONENTS ====================

function StatusBadge({ status, small = false }: { status: string; small?: boolean }) {
  const map: Record<string, string> = {
    Diterima: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Ditolak: "bg-red-50 text-red-800 border-red-200",
    Selesai: "bg-blue-50 text-blue-800 border-blue-200",
    "Minta Revisi": "bg-purple-50 text-purple-800 border-purple-200",
    Menunggu: "bg-amber-50 text-amber-800 border-amber-200",
    default: "bg-steel/10 text-steel border-steel/15",
  };
  const cls = map[status] ?? map.default;
  return (
    <span className={`rounded-full border font-mono font-semibold ${small ? "text-[9px] px-2 py-0.5" : "text-[10px] px-2.5 py-0.5"} ${cls}`}>
      {status}
    </span>
  );
}

interface PickerModalProps {
  title: string;
  search: string;
  setSearch: (v: string) => void;
  options: any[];
  isSelected: (item: any) => boolean;
  onSelect: (item: any) => void;
  getLabel: (item: any) => string;
  onClose: () => void;
  isSearchEmpty?: boolean;
  onAddCustom?: () => void;
  isCreatingCustom?: boolean;
  customLabel?: string;
}

function PickerModal({ title, search, setSearch, options, isSelected, onSelect, getLabel, onClose, isSearchEmpty, onAddCustom, isCreatingCustom, customLabel }: PickerModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-xl border border-steel/20 flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between pb-3 border-b border-steel/10">
          <h3 className="font-display text-sm font-bold text-ink">{title}</h3>
          <button onClick={onClose} className="text-steel hover:text-ink">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari..." className="my-3 w-full rounded-xl border border-steel/20 px-3.5 py-2.5 text-xs outline-none focus:border-bridge-gold" />
        <div className="flex-1 overflow-y-auto space-y-1 font-mono text-xs max-h-52">
          {isSearchEmpty && onAddCustom && (
            <button type="button" disabled={isCreatingCustom} onClick={onAddCustom} className="w-full text-left p-2.5 rounded-xl border border-dashed border-emerald-400 bg-emerald-50/30 text-emerald-800 font-bold hover:bg-emerald-50 transition text-[11px]">
              {isCreatingCustom ? "Menambahkan..." : `+ ${customLabel}`}
            </button>
          )}
          {options.map((item: any) => (
            <button key={item.id} type="button" onClick={() => onSelect(item)} className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition ${isSelected(item) ? "bg-ink text-paper font-semibold" : "hover:bg-steel/10"}`}>
              <span>{getLabel(item)}</span>
              {isSelected(item) && <span>✓</span>}
            </button>
          ))}
        </div>
        <div className="pt-3 border-t border-steel/10 text-right mt-3">
          <button type="button" onClick={onClose} className="rounded-full bg-ink px-5 py-2 font-mono text-[10px] font-bold text-white hover:bg-steel">Selesai</button>
        </div>
      </div>
    </div>
  );
}