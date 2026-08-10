// app/(perusahaan)/perusahaan/profile/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { dummyPerusahaan, RegisteredCompany } from "@/lib/dummy-data";

export default function ProfilePerusahaanPage() {
  const [profile, setProfile] = useState<RegisteredCompany>(dummyPerusahaan);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<RegisteredCompany>(dummyPerusahaan);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Tangani input untuk nested object kontakPIC
    if (name.startsWith("pic_")) {
      const field = name.replace("pic_", "");
      setFormData((prev) => ({
        ...prev,
        kontakPIC: {
          ...prev.kontakPIC,
          [field]: value,
        } as RegisteredCompany["kontakPIC"],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    setIsEditing(false);
    
    // Tampilkan notifikasi sukses
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Toast Notifikasi Sukses */}
      {showSuccessToast && (
        <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 border border-green-200">
          <span className="font-medium">Berhasil!</span> Profil perusahaan berhasil diperbarui.
        </div>
      )}

      {/* Header Profile */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
            {profile.logo ? (
              <Image
                src={profile.logo}
                alt={profile.nama}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-2xl font-bold">
                {profile.nama.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{profile.nama}</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                {profile.statusVerifikasi}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{profile.industri} • {profile.lokasi}</p>
            <p className="text-xs text-gray-400 mt-0.5">NIB: {profile.nib}</p>
          </div>
        </div>

        <button
          onClick={() => {
            setFormData(profile);
            setIsEditing(!isEditing);
          }}
          className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
        >
          {isEditing ? "Batal Edit" : "Edit Profil"}
        </button>
      </div>

      {/* Main Content */}
      {isEditing ? (
        /* Form Edit Profil */
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-3">Edit Informasi Perusahaan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industri</label>
              <input
                type="text"
                name="industri"
                value={formData.industri}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
              <input
                type="text"
                name="lokasi"
                value={formData.lokasi}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Perusahaan</label>
            <textarea
              name="deskripsi"
              rows={4}
              value={formData.deskripsi || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <h3 className="text-md font-semibold text-gray-900 border-b pb-2 pt-2">Kontak Person (PIC)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama PIC</label>
              <input
                type="text"
                name="pic_nama"
                value={formData.kontakPIC?.nama || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email PIC</label>
              <input
                type="email"
                name="pic_email"
                value={formData.kontakPIC?.email || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telepon PIC</label>
              <input
                type="text"
                name="pic_telepon"
                value={formData.kontakPIC?.telepon || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      ) : (
        /* Tampilan Detail Profil */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kolom Kiri - Deskripsi Utama */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Tentang Perusahaan</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {profile.deskripsi || "Belum ada deskripsi yang ditambahkan."}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Kontak Person (PIC)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Nama PIC</p>
                  <p className="font-medium text-gray-800">{profile.kontakPIC?.nama || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Email PIC</p>
                  <p className="font-medium text-gray-800">{profile.kontakPIC?.email || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Nomor Telepon</p>
                  <p className="font-medium text-gray-800">{profile.kontakPIC?.telepon || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan - Informasi Detail & Tier */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Informasi Resmi</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Email Akun</p>
                  <p className="font-medium text-gray-800">{profile.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Nomor Induk Berusaha (NIB)</p>
                  <p className="font-medium text-gray-800">{profile.nib}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Website</p>
                  {profile.website ? (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-blue-600 hover:underline break-all"
                    >
                      {profile.website}
                    </a>
                  ) : (
                    <p className="font-medium text-gray-800">-</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Status Akun</span>
              <h3 className="text-xl font-bold text-gray-900 mt-1">Paket {profile.tierAkun || "Free"}</h3>
              <p className="text-xs text-gray-600 mt-2">
                Anda menggunakan akun versi gratis. Upgrade ke Premium untuk mendapatkan fitur publikasi proyek tanpa batas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}