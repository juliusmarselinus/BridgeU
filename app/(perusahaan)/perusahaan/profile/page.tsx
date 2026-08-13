"use client";

import { useEffect, useState } from "react";
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
function IconMapPin({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function IconUserCircle({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="10" r="3" /><path d="M6.5 20a5.5 5.5 0 0 1 11 0" />
    </svg>
  );
}
function IconShieldCheck({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" />
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
function IconGlobe({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
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
  pendaftaran_kolaborasi?: {
    status_pengerjaan?: string | null;
    mahasiswa_profiles?: { nama_lengkap?: string | null } | null;
  }[];
}

/* ------------------------------------------------------------------ */
/* Success Modal (unchanged visual language)                          */
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
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl shadow-[8px_8px_20px_rgba(151,184,216,0.3),-8px_-8px_20px_rgba(255,255,255,0.9)] text-center space-y-4 animate-fade-in animate-duration-200">
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
/* Small helper card, same neumorphic style used in original file     */
/* ------------------------------------------------------------------ */
function InfoField({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="rounded-xl bg-[#F2F7FB] p-3 shadow-[inset_3px_3px_8px_rgba(151,184,216,0.25),inset_-3px_-3px_8px_rgba(255,255,255,0.85)]">
      <p className="text-steel text-[10px] uppercase tracking-wide font-mono">{label}</p>
      <p className="font-semibold text-ink mt-1 text-xs font-mono">{value || "-"}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Helper: ambil nama mahasiswa yang menyelesaikan kolaborasi          */
/* ------------------------------------------------------------------ */
function getPenyelesai(item: RiwayatKolaborasiItem): string | null {
  const selesai = item.pendaftaran_kolaborasi?.find(
    (p) => (p.status_pengerjaan || "").toLowerCase().includes("selesai")
  );
  return selesai?.mahasiswa_profiles?.nama_lengkap || null;
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

  useEffect(() => {
    if (activeTab !== "riwayat" || !profile) return;

    let isCancelled = false;

    const fetchRiwayat = async () => {
      setIsLoadingRiwayat(true);
      setRiwayatError(null);
      try {
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
    <div className="min-h-screen pb-20">
      <SuccessModal
        isOpen={showSuccessToast}
        title="Profil Diperbarui"
        message="Profil perusahaan Anda telah berhasil diperbarui."
        onClose={() => setShowSuccessToast(false)}
      />

      {/* ---------------------------------------------------------- */}
      {/* Hero Banner Area — sama strukturnya dengan profil mahasiswa */}
      {/* tapi warnanya tetap gradient biru perusahaan yang sudah ada */}
      {/* ---------------------------------------------------------- */}
      <div className="w-full">
        <div
          className="w-full relative pt-24 pb-20 sm:pb-24 rounded-b-[2.5rem] shadow-[0_20px_50px_-20px_rgba(18,40,75,0.35)] overflow-hidden"
          style={{ background: "linear-gradient(160deg, #12284B 0%, #2C4A70 45%, #97B8D8 100%)" }}
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 top-1/2 h-72 w-72 rounded-full bg-[#D6E7F3]/20 blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between relative -mt-10 sm:-mt-12 gap-6 pb-4">
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

          {/* Navigation Tabs — disembunyikan saat mode edit */}
          {!isEditing && (
            <div className="flex justify-start overflow-x-auto pt-3 pb-3">
              <div className="flex gap-2 sm:gap-3">
                {TABS.map((tab) => {
                  const IconComp = tab.icon;
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`relative flex items-center gap-2.5 rounded-full px-5 py-3 sm:px-6 text-xs sm:text-sm font-bold font-mono transition-all duration-150 active:scale-95 ${
                        isActive
                          ? "bg-[#12284B] text-white shadow-md"
                          : "bg-white text-steel shadow-sm hover:text-ink hover:shadow-md"
                      }`}
                    >
                      <IconComp className={`w-4 h-4 ${isActive ? "text-[#97B8D8]" : "text-steel"}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Main Content                                                */}
      {/* ---------------------------------------------------------- */}
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
        {isEditing ? (
          /* -------------------- Form Edit Profil -------------------- */
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
          /* -------------------- Tab Content Layout -------------------- */
          <div className="space-y-6">
            {/* Tentang Perusahaan — selalu tampil di atas, tidak lagi jadi tab */}
            <div className="rounded-2xl bg-white shadow-[8px_8px_20px_rgba(151,184,216,0.32),-8px_-8px_20px_rgba(255,255,255,0.9)] p-6 sm:p-8 space-y-3">
              <h2 className="text-lg font-bold font-display text-ink border-b border-[#E6F0F8] pb-2.5 flex items-center gap-2">
                <IconBuilding className="w-4 h-4 text-[#5C8CB5]" />
                Tentang Perusahaan
              </h2>
              <p className="text-xs font-sans text-ink leading-relaxed">
                {profile.deskripsi_perusahaan || "Belum ada deskripsi yang ditambahkan."}
              </p>
            </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar kiri — ringkasan singkat, selalu tampil */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl bg-white shadow-[8px_8px_20px_rgba(151,184,216,0.32),-8px_-8px_20px_rgba(255,255,255,0.9)] p-5">
                <h3 className="text-sm font-bold font-display text-ink mb-3 flex items-center gap-2">
                  <IconGlobe className="w-4 h-4 text-[#5C8CB5]" />
                  Situs Web
                </h3>
                {profile.situs_web ? (
                  <a
                    href={profile.situs_web}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs font-semibold text-[#4A7DA6] hover:underline break-all"
                  >
                    {profile.situs_web}
                  </a>
                ) : (
                  <p className="font-mono text-xs text-steel/70">Belum diisi</p>
                )}
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#D6E7F3] to-[#97B8D8] text-[#12284B] p-6 shadow-[6px_6px_16px_rgba(151,184,216,0.35),-6px_-6px_16px_rgba(255,255,255,0.85)] space-y-2">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/40 blur-3xl" />
                <span className="relative z-10 flex items-center gap-1.5 text-[10px] font-mono font-semibold text-[#12284B]/70 uppercase tracking-wider">
                  <IconShieldCheck className="w-3.5 h-3.5" />
                  Status Verifikasi
                </span>
                <h3 className="relative z-10 text-xl font-bold font-display">{profile.status_verifikasi}</h3>
                <p className="relative z-10 text-xs text-[#12284B]/70 leading-relaxed pt-1 font-sans">
                  Akun terverifikasi resmi oleh administrator dapat mempublikasikan peluang proyek kolaborasi ke mahasiswa secara langsung.
                </p>
              </div>

              <div className="rounded-2xl bg-white shadow-[8px_8px_20px_rgba(151,184,216,0.32),-8px_-8px_20px_rgba(255,255,255,0.9)] p-5">
                <h3 className="text-sm font-bold font-display text-ink mb-3 flex items-center gap-2">
                  <IconUserCircle className="w-4 h-4 text-[#5C8CB5]" />
                  Email Terdaftar
                </h3>
                <p className="font-mono text-xs font-semibold text-ink">{profile.email}</p>
              </div>
            </div>

            {/* Konten kanan — berganti sesuai tab aktif */}
            <div className="lg:col-span-8">
              {activeTab === "informasi" && (
                <div className="rounded-2xl bg-white shadow-[8px_8px_20px_rgba(151,184,216,0.32),-8px_-8px_20px_rgba(255,255,255,0.9)] p-6 sm:p-8 space-y-4">
                  <h2 className="text-lg font-bold font-display text-ink border-b border-[#E6F0F8] pb-2.5 flex items-center gap-2">
                    <IconBuilding className="w-4 h-4 text-[#5C8CB5]" />
                    Informasi Perusahaan
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoField label="Alamat Lengkap" value={profile.alamat_lengkap} />
                    <InfoField
                      label="Ukuran Perusahaan"
                      value={
                        profile.ukuran_perusahaan?.toLowerCase().includes("karyawan")
                          ? profile.ukuran_perusahaan
                          : `${profile.ukuran_perusahaan} Karyawan`
                      }
                    />
                    <InfoField label="Tahun Berdiri" value={profile.tahun_berdiri ? String(profile.tahun_berdiri) : "-"} />
                    <InfoField label="Kota Operasional" value={profile.nama_kota} />
                    <InfoField label="Sektor" value={profile.nama_sektor} />
                    <InfoField label="NIB" value={profile.nib} />
                    <InfoField label="Email Terdaftar" value={profile.email} />
                    <InfoField label="Status Verifikasi" value={profile.status_verifikasi} />
                    <InfoField label="Situs Web" value={profile.situs_web || "-"} />
                  </div>
                </div>
              )}

              {activeTab === "riwayat" && (
                <div className="rounded-2xl bg-white shadow-[8px_8px_20px_rgba(151,184,216,0.32),-8px_-8px_20px_rgba(255,255,255,0.9)] p-6 sm:p-8 space-y-4">
                  <h2 className="text-lg font-bold font-display text-ink border-b border-[#E6F0F8] pb-2.5 flex items-center gap-2">
                    <IconHistory className="w-4 h-4 text-[#5C8CB5]" />
                    Riwayat Kolaborasi
                  </h2>

                  {isLoadingRiwayat && (
                    <p className="font-mono text-xs text-steel">Memuat riwayat kolaborasi...</p>
                  )}

                  {!isLoadingRiwayat && riwayatError && (
                    <p className="font-mono text-xs text-red-600">{riwayatError}</p>
                  )}

                  {!isLoadingRiwayat && !riwayatError && riwayatKolaborasi.length === 0 && (
                    <p className="font-mono text-xs text-steel/70">
                      Perusahaan Anda belum pernah membuat kolaborasi.
                    </p>
                  )}

                  {!isLoadingRiwayat && !riwayatError && riwayatKolaborasi.length > 0 && (
                    <div className="space-y-3">
                      {riwayatKolaborasi.map((item) => {
                        const penyelesai = getPenyelesai(item);
                        return (
                          <div
                            key={item.id}
                            className="rounded-xl bg-[#F2F7FB] p-4 shadow-[inset_3px_3px_8px_rgba(151,184,216,0.25),inset_-3px_-3px_8px_rgba(255,255,255,0.85)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                          >
                            <p className="font-semibold text-ink text-xs font-mono">{item.judul}</p>
                            <span className="font-mono text-[10px] text-steel">
                              {penyelesai ? (
                                <>
                                  Diselesaikan oleh{" "}
                                  <span className="font-bold text-ink">{penyelesai}</span>
                                </>
                              ) : (
                                "Belum ada yang menyelesaikan"
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}