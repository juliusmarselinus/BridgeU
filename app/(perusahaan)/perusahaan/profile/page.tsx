"use client";

import Image from "next/image";
import { useCompanyProfile } from "./hooks/useCompanyProfile";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

/* ------------------------------------------------------------------ */
/* Icons Component                                                    */
/* ------------------------------------------------------------------ */
function IconBuilding({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" /><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01" />
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
/* Modal Sukses Update                                                */
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
          <h3 className="font-display text-base font-bold text-slate-900">{title}</h3>
          <p className="font-mono text-[11px] text-slate-500 leading-relaxed">{message}</p>
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
/* Helper Component Info Field                                        */
/* ------------------------------------------------------------------ */
function InfoField({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="space-y-1">
      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider font-mono">{label}</p>
      <p className="font-semibold text-slate-800 text-xs font-mono">{value || "-"}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Page                                                          */
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
      <div className="flex h-96 items-center justify-center font-mono text-xs text-slate-500">
        Memuat profil perusahaan...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center font-mono text-xs text-slate-500">
        Profil perusahaan tidak ditemukan.
      </div>
    );
  }

  const inputStyle =
    "w-full px-4 py-2.5 rounded-xl outline-none transition border border-slate-200 bg-white focus:border-[#97B8D8] focus:ring-2 focus:ring-[#97B8D8]/20";

  return (
    <div className="min-h-screen bg-[#EAEFEF]/60 pb-20 font-sans -mt-6 pt-0">
      <SuccessModal
        isOpen={showSuccessToast}
        title="Profil Diperbarui"
        message="Profil perusahaan Anda telah berhasil diperbarui."
        onClose={() => setShowSuccessToast(false)}
      />

      {/* 1. HERO BANNER FULL WIDTH MENTOK KE ATAS (Hanya Melengkung Bawah) */}
      <div
        className="w-full relative h-35 sm:h-48 rounded-b-[36px] shadow-sm overflow-hidden"
        style={{
          background: "linear-gradient(100deg, #0D2B4A 0%, #1A4B7C 50%, #6891B8 100%)",
        }}
      >
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white/5 blur-2xl" />
      </div>

      {/* 2. HEADER INFO PROFIL (Avatar Off-Center + Teks Nama Di Luar Banner) */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative -mt-20">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 pb-6 border-b border-slate-200/60">
          
          {/* Sisi Kiri: Avatar Circle + Teks Nama & Badges */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
            
            {/* Circle Avatar */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden shrink-0 border-[6px] border-white shadow-md bg-[#CBE0F1] flex items-center justify-center">
              {profile.logo_url ? (
                <Image src={profile.logo_url} alt={profile.nama_perusahaan} fill className="object-cover" />
              ) : (
                <span className="text-4xl sm:text-5xl font-bold text-[#0D2B4A] font-display">
                  {profile.nama_perusahaan?.charAt(0)}
                </span>
              )}
            </div>

            {/* Teks Informasi Perusahaan */}
            <div className="space-y-2 mb-1">
              <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D2B4A] tracking-tight">
                  {profile.nama_perusahaan}
                </h1>
              </div>

              <p className="text-xs sm:text-sm font-medium text-slate-600 flex items-center justify-center sm:justify-start gap-2">
                <span>{profile.nama_sektor || "Keuangan & Perbankan"}</span>
                <span className="text-slate-300">•</span>
                <span>{profile.nama_kota || "Kota Bandung"}</span>
              </p>

              {/* Badges / Pill Tags */}
              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 font-mono text-xs">
                <span className="px-3 py-1 rounded-full bg-[#DCE8F5] text-[#0D2B4A] font-bold">
                  NIB {profile.nib}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 font-bold">
                  {profile.ukuran_perusahaan?.toLowerCase().includes("karyawan")
                    ? profile.ukuran_perusahaan
                    : `${profile.ukuran_perusahaan} karyawan`}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  {profile.status_verifikasi || "Terverifikasi"}
                </span>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Tombol Action */}
          <div className="flex items-center gap-3 mb-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-xl bg-[#1D446C] px-5 py-2.5 text-xs font-semibold text-white transition flex items-center gap-2 hover:bg-[#153454] shadow-sm active:scale-95"
            >
              <IconPencil className="w-4 h-4" />
              {isEditing ? "Batal Edit" : "Edit Profil"}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 transition flex items-center gap-2 hover:bg-slate-50 shadow-sm active:scale-95"
            >
              <IconLogout className="w-4 h-4 text-slate-500" />
              Keluar
            </button>
          </div>

        </div>
      </div>

      {/* 3. ISI KONTEN UTAMA (KARD TENTANG PERUSAHAAN / FORM EDIT) */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-6">
        {isEditing ? (
          /* Mode Form Edit Profil */
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6"
          >
            <h2 className="text-lg font-bold font-display text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <IconBuilding className="w-4 h-4 text-[#5C8CB5]" />
              Edit Informasi Perusahaan
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama Perusahaan *</label>
                <input
                  type="text"
                  required
                  value={formData.nama_perusahaan}
                  onChange={(e) => setFormData({ ...formData, nama_perusahaan: e.target.value })}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">NIB (Nomor Induk Berusaha) *</label>
                <input
                  type="text"
                  required
                  value={formData.nib}
                  onChange={(e) => setFormData({ ...formData, nib: e.target.value })}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Sektor Perusahaan *</label>
                <select
                  value={formData.sektor_id}
                  onChange={(e) => setFormData({ ...formData, sektor_id: Number(e.target.value) })}
                  className={inputStyle}
                >
                  {sektorOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Kota *</label>
                <select
                  value={formData.kota_id}
                  onChange={(e) => setFormData({ ...formData, kota_id: Number(e.target.value) })}
                  className={inputStyle}
                >
                  {kotaOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Ukuran Perusahaan</label>
                <select
                  value={formData.ukuran_perusahaan}
                  onChange={(e) => setFormData({ ...formData, ukuran_perusahaan: e.target.value })}
                  className={inputStyle}
                >
                  <option value="1-10">1-10 Karyawan</option>
                  <option value="11-50">11-50 Karyawan</option>
                  <option value="51-200">51-200 Karyawan</option>
                  <option value="201-500">201-500 Karyawan</option>
                  <option value="500+">500+ Karyawan</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Tahun Berdiri</label>
                <input
                  type="number"
                  value={formData.tahun_berdiri}
                  onChange={(e) => setFormData({ ...formData, tahun_berdiri: Number(e.target.value) })}
                  className={inputStyle}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Website Resmi</label>
                <input
                  type="url"
                  value={formData.situs_web}
                  onChange={(e) => setFormData({ ...formData, situs_web: e.target.value })}
                  placeholder="https://contohperusahaan.com"
                  className={inputStyle}
                />
              </div>
            </div>

            <div className="font-mono text-xs">
              <label className="block font-medium text-slate-700 mb-1">Alamat Lengkap Perusahaan</label>
              <input
                type="text"
                value={formData.alamat_lengkap}
                onChange={(e) => setFormData({ ...formData, alamat_lengkap: e.target.value })}
                placeholder="Jl. Jendral Sudirman No. 123, Jakarta"
                className={inputStyle}
              />
            </div>

            <div className="font-mono text-xs">
              <label className="block font-medium text-slate-700 mb-1">Deskripsi Perusahaan</label>
              <textarea
                rows={4}
                value={formData.deskripsi_perusahaan}
                onChange={(e) => setFormData({ ...formData, deskripsi_perusahaan: e.target.value })}
                placeholder="Jelaskan secara ringkas mengenai bisnis perusahaan Anda..."
                className={inputStyle}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 font-mono text-xs">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 font-medium text-slate-600 bg-slate-100 rounded-full hover:bg-slate-200 transition"
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
          /* Mode Tampilan "Tentang Perusahaan" */
          <div className="rounded-3xl bg-white border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
                  <IconInfo className="w-5 h-5 text-slate-400" />
                  Tentang Perusahaan
                </h2>
                <p className="text-xs font-sans text-slate-600 mt-2 max-w-2xl leading-relaxed">
                  {profile.deskripsi_perusahaan || "Belum ada deskripsi yang ditambahkan."}
                </p>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider block">KONTAK</span>
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
      </div>

    </div>
  );
}