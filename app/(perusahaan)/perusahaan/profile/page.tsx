"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useCompanyProfile } from "./hooks/useCompanyProfile";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */
function IconBuilding({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" /><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
    </svg>
  );
}
function IconPencil({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}
function IconLogout({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}
function IconHistory({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" /><path d="M12 7v5l4 2" />
    </svg>
  );
}
function IconSearch({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function IconInfo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
    </svg>
  );
}
function IconMail({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Tabs config                                                         */
/* ------------------------------------------------------------------ */
const TABS = [
  { key: "informasi", label: "Informasi Perusahaan", icon: IconBuilding },
  { key: "riwayat", label: "Riwayat Kolaborasi", icon: IconHistory },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/* ------------------------------------------------------------------ */
/* Types for riwayat kolaborasi                                       */
/* ------------------------------------------------------------------ */
interface RiwayatKolaborasiItem {
  id: string | number;
  judul: string;
  status?: string;
  pendaftaran_kolaborasi?: {
    status_pengerjaan?: string | null;
    mahasiswa_profiles?: { nama_lengkap?: string | null } | null;
  }[];
}

/* ------------------------------------------------------------------ */
/* Success Modal                                                      */
/* ------------------------------------------------------------------ */
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
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center space-y-4">
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
            className="w-full rounded-full bg-[#97B8D8] py-2.5 font-mono text-[10px] font-bold text-[#12284B] hover:bg-[#ADC9E2] transition"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Helper Component: Info Field                                        */
/* ------------------------------------------------------------------ */
function InfoField({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="space-y-1">
      <p className="text-steel text-[10px] font-bold uppercase tracking-wider font-mono">{label}</p>
      <p className="font-semibold text-ink text-xs font-mono">{value || "-"}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Page                                                           */
/* ------------------------------------------------------------------ */
export default function ProfilePerusahaanPage() {
  const router = useRouter();
  const {
    profile,
    formData,
    setFormData,
    isEditing,
    setIsEditing,
    isLoading,
    isSubmitting,
    showSuccessToast,
    setShowSuccessToast,
    sektorOptions,
    kotaOptions,
    handleSubmit,
  } = useCompanyProfile();

  const [activeTab, setActiveTab] = useState<TabKey>("informasi");

  const [riwayatKolaborasi, setRiwayatKolaborasi] = useState<RiwayatKolaborasiItem[]>([]);
  const [isLoadingRiwayat, setIsLoadingRiwayat] = useState(false);
  const [riwayatError, setRiwayatError] = useState<string | null>(null);

  /* State Filter & Pagination */
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (activeTab !== "riwayat" || !profile) return;

    let isCancelled = false;

    const fetchRiwayat = async () => {
      setIsLoadingRiwayat(true);
      setRiwayatError(null);
      try {
        // Query yang disederhanakan agar tidak error jika kolom custom tidak ada di DB
        const { data, error } = await supabase
          .from("kolaborasi")
          .select(
            `id, judul,
             pendaftaran_kolaborasi ( status_pengerjaan, mahasiswa_profiles ( nama_lengkap ) )`
          )
          .eq("perusahaan_id", profile.user_id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (!isCancelled) {
          setRiwayatKolaborasi((data as RiwayatKolaborasiItem[]) || []);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const message = err instanceof Error ? err.message : "Gagal memuat riwayat kolaborasi.";
          setRiwayatError(message);
        }
      } finally {
        if (!isCancelled) setIsLoadingRiwayat(false);
      }
    };

    fetchRiwayat();

    return () => {
      isCancelled = true;
    };
  }, [activeTab, profile]);

  /* Helper Status Pengerjaan */
  const getStatusText = (item: RiwayatKolaborasiItem) => {
    const pengerjaan = item.pendaftaran_kolaborasi?.find(p => p.status_pengerjaan);
    return pengerjaan?.status_pengerjaan || item.status || "Selesai";
  };

  /* Filtering Data */
  const filteredRiwayat = useMemo(() => {
    return riwayatKolaborasi.filter((item) => {
      const matchSearch = item.judul.toLowerCase().includes(searchQuery.toLowerCase());
      const statusText = getStatusText(item);
      const matchStatus =
        filterStatus === "Semua" ? true : statusText.toLowerCase().includes(filterStatus.toLowerCase());
      return matchSearch && matchStatus;
    });
  }, [riwayatKolaborasi, searchQuery, filterStatus]);

  /* Pagination */
  const totalPages = Math.ceil(filteredRiwayat.length / itemsPerPage) || 1;
  const paginatedRiwayat = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRiwayat.slice(start, start + itemsPerPage);
  }, [filteredRiwayat, currentPage]);

  const handleLogout = async () => {
    const confirmLogout = confirm("Apakah Anda yakin ingin keluar dari akun?");
    if (!confirmLogout) return;

    localStorage.removeItem("bridgeu_company_profile");
    localStorage.removeItem("bridgeu_company_kolaborasi");

    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/");
    } else {
      alert("Gagal keluar: " + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-xs text-steel">
        Memuat profil perusahaan...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center font-mono text-xs text-steel">
        Profil perusahaan tidak ditemukan. Silakan pastikan Anda telah terautentikasi.
      </div>
    );
  }

  const inputBase =
    "w-full px-4 py-2.5 rounded-xl outline-none transition shadow-[inset_3px_3px_8px_rgba(151,184,216,0.25),inset_-3px_-3px_8px_rgba(255,255,255,0.85)] focus:shadow-[inset_3px_3px_8px_rgba(151,184,216,0.35),inset_-3px_-3px_8px_rgba(255,255,255,0.9)] bg-white";

  return (
    <div className="min-h-screen bg-[#E6F0F8]/30 pb-20 -mt-6 pt-6">
      <SuccessModal
        isOpen={showSuccessToast}
        title="Profil Diperbarui"
        message="Profil perusahaan Anda telah berhasil diperbarui."
        onClose={() => setShowSuccessToast(false)}
      />

      {/* Hero Banner Area (Full Bleed ke Atas) */}
      <div className="w-full -mt-6">
        <div
          className="w-full relative pt-16 pb-20 sm:pb-24 rounded-b-[2.5rem] shadow-[0_20px_50px_-20px_rgba(18,40,75,0.35)] overflow-hidden"
          style={{ background: "linear-gradient(160deg, #12284B 0%, #2C4A70 45%, #97B8D8 100%)" }}
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 top-1/2 h-72 w-72 rounded-full bg-[#D6E7F3]/20 blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between relative -mt-16 sm:-mt-20 gap-6 pb-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left z-20">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 border-4 border-white shadow-lg ring-1 ring-[#D6E7F3] bg-gradient-to-br from-[#97B8D8] to-[#C3DAEC]">
                {profile.logo_url ? (
                  <Image src={profile.logo_url} alt={profile.nama_perusahaan} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#12284B] text-3xl sm:text-4xl font-bold font-display">
                    {profile.nama_perusahaan.charAt(0)}
                  </div>
                )}
              </div>

              <div className="mb-1">
                <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                  <h1 className="text-2xl sm:text-3xl font-black font-display text-ink tracking-tight">
                    {profile.nama_perusahaan}
                  </h1>
                  <span className="px-2.5 py-0.5 text-[10px] font-semibold font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
                    {profile.status_verifikasi}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-mono text-steel mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                  <IconBuilding className="w-3.5 h-3.5 text-[#5C8CB5]" />
                  {profile.nama_sektor} • {profile.nama_kota}
                </p>

                <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="rounded-lg bg-[#D6E7F3] px-2.5 py-1 text-xs font-bold text-[#12284B] font-mono">
                    NIB {profile.nib}
                  </span>
                  <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-ink/80 border border-[#E6F0F8] font-mono">
                    {profile.ukuran_perusahaan?.toLowerCase().includes("karyawan")
                      ? profile.ukuran_perusahaan
                      : `${profile.ukuran_perusahaan} Karyawan`}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-2 z-10 shrink-0 min-h-[42px]">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="rounded-full bg-[#97B8D8] px-5 py-2.5 text-xs font-mono font-bold text-[#12284B] transition-colors flex items-center gap-2 hover:bg-[#ADC9E2] active:scale-95 shadow-sm"
              >
                <IconPencil className="w-4 h-4" />
                {isEditing ? "Batal Edit" : "Edit Profil"}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-red-200 bg-red-50 px-5 py-2.5 text-xs font-mono font-bold text-red-600 transition-colors flex items-center gap-2 hover:bg-red-100 active:scale-95"
              >
                <IconLogout className="w-4 h-4" />
                Keluar
              </button>
            </div>
          </div>

          {/* Navigation Tabs Header */}
          {!isEditing && (
            <div className="border-b border-slate-200 mt-4">
              <div className="flex gap-8">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.key);
                        setCurrentPage(1);
                      }}
                      className={`pb-3 text-sm font-bold font-display transition-all relative ${
                        isActive ? "text-[#12284B]" : "text-steel hover:text-ink"
                      }`}
                    >
                      {tab.label}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#12284B] rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
        {isEditing ? (
          /* Form Edit Profil */
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white shadow-[8px_8px_22px_rgba(151,184,216,0.35),-8px_-8px_22px_rgba(255,255,255,0.9)] p-6 space-y-6"
          >
            <h2 className="text-lg font-bold font-display text-ink border-b border-[#E6F0F8] pb-3 flex items-center gap-2">
              <IconBuilding className="w-4 h-4 text-[#5C8CB5]" />
              Edit Informasi Perusahaan
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <label className="block font-medium text-ink mb-1">Nama Perusahaan *</label>
                <input
                  type="text"
                  required
                  value={formData.nama_perusahaan}
                  onChange={(e) => setFormData({ ...formData, nama_perusahaan: e.target.value })}
                  className={inputBase}
                />
              </div>

              <div>
                <label className="block font-medium text-ink mb-1">NIB (Nomor Induk Berusaha) *</label>
                <input
                  type="text"
                  required
                  value={formData.nib}
                  onChange={(e) => setFormData({ ...formData, nib: e.target.value })}
                  className={inputBase}
                />
              </div>

              <div>
                <label className="block font-medium text-ink mb-1">Sektor Perusahaan *</label>
                <select
                  value={formData.sektor_id}
                  onChange={(e) => setFormData({ ...formData, sektor_id: Number(e.target.value) })}
                  className={inputBase}
                >
                  {sektorOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-ink mb-1">Kota *</label>
                <select
                  value={formData.kota_id}
                  onChange={(e) => setFormData({ ...formData, kota_id: Number(e.target.value) })}
                  className={inputBase}
                >
                  {kotaOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-ink mb-1">Ukuran Perusahaan</label>
                <select
                  value={formData.ukuran_perusahaan}
                  onChange={(e) => setFormData({ ...formData, ukuran_perusahaan: e.target.value })}
                  className={inputBase}
                >
                  <option value="1-10">1-10 Karyawan</option>
                  <option value="11-50">11-50 Karyawan</option>
                  <option value="51-200">51-200 Karyawan</option>
                  <option value="201-500">201-500 Karyawan</option>
                  <option value="500+">500+ Karyawan</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-ink mb-1">Tahun Berdiri</label>
                <input
                  type="number"
                  value={formData.tahun_berdiri}
                  onChange={(e) => setFormData({ ...formData, tahun_berdiri: Number(e.target.value) })}
                  className={inputBase}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium text-ink mb-1">Website Resmi</label>
                <input
                  type="url"
                  value={formData.situs_web}
                  onChange={(e) => setFormData({ ...formData, situs_web: e.target.value })}
                  placeholder="https://contohperusahaan.com"
                  className={inputBase}
                />
              </div>
            </div>

            <div className="font-mono text-xs">
              <label className="block font-medium text-ink mb-1">Alamat Lengkap Perusahaan</label>
              <input
                type="text"
                value={formData.alamat_lengkap}
                onChange={(e) => setFormData({ ...formData, alamat_lengkap: e.target.value })}
                placeholder="Jl. Jendral Sudirman No. 123, Jakarta Selatan"
                className={inputBase}
              />
            </div>

            <div className="font-mono text-xs">
              <label className="block font-medium text-ink mb-1">Deskripsi Perusahaan</label>
              <textarea
                rows={4}
                value={formData.deskripsi_perusahaan}
                onChange={(e) => setFormData({ ...formData, deskripsi_perusahaan: e.target.value })}
                placeholder="Jelaskan secara ringkas visi, misi, dan fokus bisnis perusahaan Anda..."
                className={inputBase}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#E6F0F8] font-mono text-xs">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 font-medium text-steel bg-[#F2F7FB] rounded-full hover:bg-[#E6F0F8] transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 font-semibold text-[#12284B] bg-[#97B8D8] rounded-full hover:bg-[#ADC9E2] transition shadow-md disabled:opacity-50"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        ) : (
          /* TAB CONTENT */
          <div className="space-y-6">
            {/* TAB 1: INFORMASI PERUSAHAAN */}
            {activeTab === "informasi" && (
              <div className="rounded-2xl bg-white shadow-[8px_8px_20px_rgba(151,184,216,0.32),-8px_-8px_20px_rgba(255,255,255,0.9)] p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-[#E6F0F8] pb-4">
                  <div>
                    <h2 className="text-lg font-bold font-display text-ink flex items-center gap-2">
                      <IconInfo className="w-5 h-5 text-steel" />
                      Tentang Perusahaan
                    </h2>
                    <p className="text-xs font-sans text-steel mt-2 max-w-2xl leading-relaxed">
                      {profile.deskripsi_perusahaan || "Belum ada deskripsi yang ditambahkan."}
                    </p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[10px] font-mono uppercase text-steel font-bold tracking-wider block">KONTAK</span>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-xs font-mono font-semibold text-[#4A7DA6] hover:underline flex items-center gap-1.5 justify-start sm:justify-end mt-1"
                    >
                      <IconMail className="w-3.5 h-3.5" />
                      {profile.email}
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-4 pt-2">
                  <InfoField label="ALAMAT LENGKAP" value={profile.alamat_lengkap} />
                  <InfoField
                    label="UKURAN PERUSAHAAN"
                    value={
                      profile.ukuran_perusahaan?.toLowerCase().includes("karyawan")
                        ? profile.ukuran_perusahaan
                        : `${profile.ukuran_perusahaan} karyawan`
                    }
                  />
                  <InfoField label="TAHUN BERDIRI" value={profile.tahun_berdiri ? String(profile.tahun_berdiri) : "-"} />

                  <InfoField label="KOTA OPERASIONAL" value={profile.nama_kota} />
                  <InfoField label="SEKTOR" value={profile.nama_sektor} />
                  <InfoField label="NIB" value={profile.nib} />

                  <InfoField label="EMAIL TERDAFTAR" value={profile.email} />
                  <InfoField label="STATUS VERIFIKASI" value={profile.status_verifikasi} />
                  <InfoField label="SITUS WEB" value={profile.situs_web || "-"} />
                </div>
              </div>
            )}

            {/* TAB 2: RIWAYAT KOLABORASI */}
            {activeTab === "riwayat" && (
              <div className="rounded-2xl bg-white shadow-[8px_8px_20px_rgba(151,184,216,0.32),-8px_-8px_20px_rgba(255,255,255,0.9)] p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold font-display text-ink flex items-center gap-2">
                    <IconHistory className="w-5 h-5 text-[#12284B]" />
                    Riwayat Kolaborasi
                  </h2>
                  <span className="text-xs font-mono text-steel">
                    Menampilkan {paginatedRiwayat.length} dari {filteredRiwayat.length} Kolaborasi
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-72">
                    <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-steel" />
                    <input
                      type="text"
                      placeholder="Cari kolaborasi..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-mono outline-none border border-slate-200 focus:border-[#97B8D8] bg-[#F8FAFC]"
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                    {["Semua", "Selesai", "Sedang Berjalan", "Menunggu"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          setFilterStatus(st);
                          setCurrentPage(1);
                        }}
                        className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition ${
                          filterStatus === st
                            ? "bg-[#12284B] text-white shadow"
                            : "bg-[#F2F7FB] text-steel hover:bg-[#E6F0F8] hover:text-ink"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {isLoadingRiwayat && (
                  <p className="font-mono text-xs text-steel py-4">Memuat riwayat kolaborasi...</p>
                )}

                {!isLoadingRiwayat && riwayatError && (
                  <p className="font-mono text-xs text-red-600 py-4">{riwayatError}</p>
                )}

                {!isLoadingRiwayat && !riwayatError && paginatedRiwayat.length === 0 && (
                  <div className="text-center py-12 font-mono text-xs text-steel/70">
                    Tidak ada riwayat kolaborasi yang ditemukan.
                  </div>
                )}

                {!isLoadingRiwayat && !riwayatError && paginatedRiwayat.length > 0 && (
                  <div className="space-y-3">
                    {paginatedRiwayat.map((item) => {
                      const statusBadge = getStatusText(item);
                      return (
                        <div
                          key={item.id}
                          className="rounded-xl bg-[#F8FAFC] p-4 border border-slate-100 flex items-center justify-between gap-4 transition hover:bg-[#F2F7FB]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#D6E7F3]/50 flex items-center justify-center shrink-0 text-[#12284B]">
                              <IconBuilding className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-bold text-ink text-xs font-mono">{item.judul}</h3>
                            </div>
                          </div>

                          <div className="shrink-0">
                            <span
                              className={`px-3 py-1 rounded-md text-[10px] font-mono font-bold border ${
                                statusBadge.toLowerCase().includes("selesai")
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                  : statusBadge.toLowerCase().includes("berjalan")
                                  ? "bg-blue-50 text-blue-600 border-blue-200"
                                  : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                            >
                              {statusBadge}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {!isLoadingRiwayat && filteredRiwayat.length > itemsPerPage && (
                  <div className="flex items-center justify-center gap-1.5 pt-4">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-xs text-steel disabled:opacity-40 hover:bg-slate-50"
                    >
                      &lt;
                    </button>
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition ${
                            currentPage === pageNum
                              ? "bg-[#12284B] text-white"
                              : "border border-slate-200 text-steel hover:bg-slate-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-xs text-steel disabled:opacity-40 hover:bg-slate-50"
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}