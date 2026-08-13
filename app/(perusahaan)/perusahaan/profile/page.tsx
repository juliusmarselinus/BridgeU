"use client";

import Image from "next/image";
import { useCompanyProfile } from "./hooks/useCompanyProfile";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

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
    <div className="max-w-6xl mx-auto px-6 pt-10 space-y-6">
      <SuccessModal
        isOpen={showSuccessToast}
        title="Profil Diperbarui"
        message="Profil perusahaan Anda telah berhasil diperbarui."
        onClose={() => setShowSuccessToast(false)}
      />

      {/* Header Profile */}
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-[8px_8px_22px_rgba(151,184,216,0.35),-8px_-8px_22px_rgba(255,255,255,0.9)] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#97B8D8] to-transparent" />

        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-sm ring-1 ring-[#D6E7F3] bg-gradient-to-br from-[#97B8D8] to-[#C3DAEC]">
            {profile.logo_url ? (
              <Image src={profile.logo_url} alt={profile.nama_perusahaan} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#12284B] text-2xl font-bold font-display">
                {profile.nama_perusahaan.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display text-ink">{profile.nama_perusahaan}</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
                {profile.status_verifikasi}
              </span>
            </div>
            <p className="text-xs font-mono text-steel mt-1 flex items-center gap-1.5">
              <IconBuilding className="w-3 h-3 text-[#5C8CB5]" />
              {profile.nama_sektor} • {profile.nama_kota}
            </p>
            <p className="text-xs font-mono text-steel/70 mt-0.5">NIB: {profile.nib}</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-5 py-2.5 text-xs font-mono font-semibold text-[#12284B] bg-[#D6E7F3] rounded-full hover:bg-[#C3DAEC] transition shadow-sm shrink-0"
        >
          {isEditing ? "Batal Edit" : "Edit Profil"}
        </button>
      </div>

      {/* Main Content */}
      {isEditing ? (
        /* Form Edit Profil */
        <form onSubmit={handleSubmit} className="rounded-3xl bg-white shadow-[8px_8px_22px_rgba(151,184,216,0.35),-8px_-8px_22px_rgba(255,255,255,0.9)] p-6 space-y-6">
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
        /* Tampilan Detail Profil */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kolom Kiri - Deskripsi & Alamat */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-2xl bg-white shadow-[8px_8px_20px_rgba(151,184,216,0.32),-8px_-8px_20px_rgba(255,255,255,0.9)] p-6 space-y-3 transition-all duration-300 hover:shadow-[10px_10px_26px_rgba(151,184,216,0.42),-10px_-10px_26px_rgba(255,255,255,0.95)] hover:-translate-y-1">
              <h2 className="text-lg font-bold font-display text-ink border-b border-[#E6F0F8] pb-2.5 flex items-center gap-2">
                <IconBuilding className="w-4 h-4 text-[#5C8CB5]" />
                Tentang Perusahaan
              </h2>
              <p className="text-xs font-sans text-ink leading-relaxed">
                {profile.deskripsi_perusahaan || "Belum ada deskripsi yang ditambahkan."}
              </p>
            </div>

            <div className="rounded-2xl bg-white shadow-[8px_8px_20px_rgba(151,184,216,0.32),-8px_-8px_20px_rgba(255,255,255,0.9)] p-6 space-y-4 transition-all duration-300 hover:shadow-[10px_10px_26px_rgba(151,184,216,0.42),-10px_-10px_26px_rgba(255,255,255,0.95)] hover:-translate-y-1">
              <h2 className="text-lg font-bold font-display text-ink border-b border-[#E6F0F8] pb-2.5 flex items-center gap-2">
                <IconMapPin className="w-4 h-4 text-[#5C8CB5]" />
                Detail Operasional
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div className="rounded-xl bg-[#F2F7FB] p-3 shadow-[inset_3px_3px_8px_rgba(151,184,216,0.25),inset_-3px_-3px_8px_rgba(255,255,255,0.85)]">
                  <p className="text-steel text-[10px] uppercase tracking-wide">Alamat Lengkap</p>
                  <p className="font-semibold text-ink mt-1">{profile.alamat_lengkap || "Belum diisi"}</p>
                </div>
                <div className="rounded-xl bg-[#F2F7FB] p-3 shadow-[inset_3px_3px_8px_rgba(151,184,216,0.25),inset_-3px_-3px_8px_rgba(255,255,255,0.85)]">
                  <p className="text-steel text-[10px] uppercase tracking-wide">Ukuran Perusahaan</p>
                  <p className="font-semibold text-ink mt-1">{profile.ukuran_perusahaan} Karyawan</p>
                </div>
                <div className="rounded-xl bg-[#F2F7FB] p-3 shadow-[inset_3px_3px_8px_rgba(151,184,216,0.25),inset_-3px_-3px_8px_rgba(255,255,255,0.85)]">
                  <p className="text-steel text-[10px] uppercase tracking-wide">Tahun Berdiri</p>
                  <p className="font-semibold text-ink mt-1">{profile.tahun_berdiri || "-"}</p>
                </div>
                <div className="rounded-xl bg-[#F2F7FB] p-3 shadow-[inset_3px_3px_8px_rgba(151,184,216,0.25),inset_-3px_-3px_8px_rgba(255,255,255,0.85)]">
                  <p className="text-steel text-[10px] uppercase tracking-wide">Kota Operasional</p>
                  <p className="font-semibold text-ink mt-1">{profile.nama_kota}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan - Informasi Akun */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-white shadow-[8px_8px_20px_rgba(151,184,216,0.32),-8px_-8px_20px_rgba(255,255,255,0.9)] p-6 space-y-4 transition-all duration-300 hover:shadow-[10px_10px_26px_rgba(151,184,216,0.42),-10px_-10px_26px_rgba(255,255,255,0.95)] hover:-translate-y-1">
              <h2 className="text-lg font-bold font-display text-ink border-b border-[#E6F0F8] pb-2.5 flex items-center gap-2">
                <IconUserCircle className="w-4 h-4 text-[#5C8CB5]" />
                Informasi Akun
              </h2>
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <p className="text-steel text-[10px] uppercase tracking-wide">Email Terdaftar</p>
                  <p className="font-semibold text-ink mt-1">{profile.email}</p>
                </div>
                <div>
                  <p className="text-steel text-[10px] uppercase tracking-wide">NIB</p>
                  <p className="font-semibold text-ink mt-1">{profile.nib}</p>
                </div>
                <div>
                  <p className="text-steel text-[10px] uppercase tracking-wide">Situs Web</p>
                  {profile.situs_web ? (
                    <a
                      href={profile.situs_web}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[#4A7DA6] hover:underline break-all mt-1 block"
                    >
                      {profile.situs_web}
                    </a>
                  ) : (
                    <p className="font-semibold text-ink mt-1">-</p>
                  )}
                </div>
              </div>
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

            <button
              onClick={handleLogout}
              className="w-full py-3 px-5 text-xs font-mono font-bold text-red-600 border border-red-200 rounded-full bg-red-50 hover:bg-red-100 transition shadow-sm flex items-center justify-center gap-2"
            >
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Keluar dari Akun
            </button>
          </div>
        </div>
      )}
    </div>
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
