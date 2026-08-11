"use client";

import Image from "next/image";
import { useCompanyProfile } from "./hooks/useCompanyProfile";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

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

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Toast Notifikasi Sukses -> Diganti dengan Modal Popup Sukses */}
      <SuccessModal
        isOpen={showSuccessToast}
        title="Profil Diperbarui"
        message="Profil perusahaan Anda telah berhasil diperbarui."
        onClose={() => setShowSuccessToast(false)}
      />

      {/* Header Profile */}
      <div className="bg-white rounded-2xl border border-steel/15 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-steel/15 bg-steel/5 shrink-0">
            {profile.logo_url ? (
              <Image
                src={profile.logo_url}
                alt={profile.nama_perusahaan}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-ink text-paper text-2xl font-bold font-display">
                {profile.nama_perusahaan.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-display text-ink">{profile.nama_perusahaan}</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
                {profile.status_verifikasi}
              </span>
            </div>
            <p className="text-xs font-mono text-steel mt-1">
              {profile.nama_sektor} • {profile.nama_kota}
            </p>
            <p className="text-xs font-mono text-steel/70 mt-0.5">NIB: {profile.nib}</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-5 py-2.5 text-xs font-mono font-medium text-ink border border-steel/20 rounded-full hover:bg-steel/5 transition shadow-sm"
        >
          {isEditing ? "Batal Edit" : "Edit Profil"}
        </button>
      </div>

      {/* Main Content */}
      {isEditing ? (
        /* Form Edit Profil */
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-steel/15 p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold font-display text-ink border-b border-steel/10 pb-3">
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
                className="w-full px-4 py-2.5 border border-steel/20 rounded-xl outline-none focus:border-bridge-gold"
              />
            </div>

            <div>
              <label className="block font-medium text-ink mb-1">NIB (Nomor Induk Berusaha) *</label>
              <input
                type="text"
                required
                value={formData.nib}
                onChange={(e) => setFormData({ ...formData, nib: e.target.value })}
                className="w-full px-4 py-2.5 border border-steel/20 rounded-xl outline-none focus:border-bridge-gold"
              />
            </div>

            <div>
              <label className="block font-medium text-ink mb-1">Sektor Perusahaan *</label>
              <select
                value={formData.sektor_id}
                onChange={(e) => setFormData({ ...formData, sektor_id: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-steel/20 rounded-xl bg-white outline-none focus:border-bridge-gold"
              >
                {sektorOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-ink mb-1">Kota *</label>
              <select
                value={formData.kota_id}
                onChange={(e) => setFormData({ ...formData, kota_id: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-steel/20 rounded-xl bg-white outline-none focus:border-bridge-gold"
              >
                {kotaOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-ink mb-1">Ukuran Perusahaan</label>
              <select
                value={formData.ukuran_perusahaan}
                onChange={(e) => setFormData({ ...formData, ukuran_perusahaan: e.target.value })}
                className="w-full px-4 py-2.5 border border-steel/20 rounded-xl bg-white outline-none focus:border-bridge-gold"
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
                className="w-full px-4 py-2.5 border border-steel/20 rounded-xl outline-none focus:border-bridge-gold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium text-ink mb-1">Website Resmi</label>
              <input
                type="url"
                value={formData.situs_web}
                onChange={(e) => setFormData({ ...formData, situs_web: e.target.value })}
                placeholder="https://contohperusahaan.com"
                className="w-full px-4 py-2.5 border border-steel/20 rounded-xl outline-none focus:border-bridge-gold"
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
              className="w-full px-4 py-2.5 border border-steel/20 rounded-xl outline-none focus:border-bridge-gold"
            />
          </div>

          <div className="font-mono text-xs">
            <label className="block font-medium text-ink mb-1">Deskripsi Perusahaan</label>
            <textarea
              rows={4}
              value={formData.deskripsi_perusahaan}
              onChange={(e) => setFormData({ ...formData, deskripsi_perusahaan: e.target.value })}
              placeholder="Jelaskan secara ringkas visi, misi, dan fokus bisnis perusahaan Anda..."
              className="w-full px-4 py-2.5 border border-steel/20 rounded-xl outline-none focus:border-bridge-gold"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-steel/10 font-mono text-xs">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 font-medium text-steel bg-steel/10 rounded-full hover:bg-steel/20 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 font-semibold text-ink bg-bridge-gold rounded-full hover:bg-bridge-gold/90 transition shadow-md disabled:opacity-50"
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
            <div className="bg-white rounded-2xl border border-steel/15 p-6 shadow-sm space-y-3">
              <h2 className="text-lg font-bold font-display text-ink border-b border-steel/10 pb-2">
                Tentang Perusahaan
              </h2>
              <p className="text-xs font-sans text-ink leading-relaxed">
                {profile.deskripsi_perusahaan || "Belum ada deskripsi yang ditambahkan."}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-steel/15 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold font-display text-ink border-b border-steel/10 pb-2">
                Detail Operasional
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <p className="text-steel">Alamat Lengkap</p>
                  <p className="font-medium text-ink mt-0.5">
                    {profile.alamat_lengkap || "Belum diisi"}
                  </p>
                </div>
                <div>
                  <p className="text-steel">Ukuran Perusahaan</p>
                  <p className="font-medium text-ink mt-0.5">
                    {profile.ukuran_perusahaan} Karyawan
                  </p>
                </div>
                <div>
                  <p className="text-steel">Tahun Berdiri</p>
                  <p className="font-medium text-ink mt-0.5">{profile.tahun_berdiri || "-"}</p>
                </div>
                <div>
                  <p className="text-steel">Kota Operasional</p>
                  <p className="font-medium text-ink mt-0.5">{profile.nama_kota}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan - Informasi Akun */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-steel/15 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold font-display text-ink border-b border-steel/10 pb-2">
                Informasi Akun
              </h2>
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <p className="text-steel">Email Terdaftar</p>
                  <p className="font-medium text-ink mt-0.5">{profile.email}</p>
                </div>
                <div>
                  <p className="text-steel">NIB</p>
                  <p className="font-medium text-ink mt-0.5">{profile.nib}</p>
                </div>
                <div>
                  <p className="text-steel">Situs Web</p>
                  {profile.situs_web ? (
                    <a
                      href={profile.situs_web}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-blue-600 hover:underline break-all mt-0.5 block"
                    >
                      {profile.situs_web}
                    </a>
                  ) : (
                    <p className="font-medium text-ink mt-0.5">-</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-ink text-paper rounded-2xl p-6 shadow-md border border-white/10 space-y-2">
              <span className="text-[10px] font-mono font-semibold text-bridge-gold uppercase tracking-wider">
                Status Verifikasi
              </span>
              <h3 className="text-xl font-bold font-display">{profile.status_verifikasi}</h3>
              <p className="text-xs text-paper/70 leading-relaxed pt-1 font-sans">
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