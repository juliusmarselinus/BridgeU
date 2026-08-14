import { useState, useEffect, FormEvent } from "react";
import { profileService } from "../services/profileServices";
import { PerusahaanProfileDB, ProfileFormData, OptionItem } from "../types/profile";

export function useCompanyProfile() {
  const [profile, setProfile] = useState<PerusahaanProfileDB | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const [sektorOptions, setSektorOptions] = useState<OptionItem[]>([]);
  const [kotaOptions, setKotaOptions] = useState<OptionItem[]>([]);

  const [formData, setFormData] = useState<ProfileFormData>({
    nama_perusahaan: "",
    nib: "",
    deskripsi_perusahaan: "",
    sektor_id: 1,
    kota_id: 1,
    situs_web: "",
    alamat_lengkap: "",
    ukuran_perusahaan: "1-10",
    tahun_berdiri: 2020,
  });

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const [profData, sektors, kotas] = await Promise.all([
        profileService.fetchCompanyProfile(),
        profileService.fetchSektorOptions(),
        profileService.fetchKotaOptions(),
      ]);

      setSektorOptions(sektors);
      setKotaOptions(kotas);

      if (profData) {
        setProfile(profData);
        setFormData({
          nama_perusahaan: profData.nama_perusahaan,
          nib: profData.nib,
          deskripsi_perusahaan: profData.deskripsi_perusahaan || "",
          sektor_id: profData.sektor_id,
          kota_id: profData.kota_id,
          situs_web: profData.situs_web || "",
          alamat_lengkap: profData.alamat_lengkap || "",
          ukuran_perusahaan: profData.ukuran_perusahaan || "1-10",
          tahun_berdiri: profData.tahun_berdiri || 2020,
        });
      }
    } catch (err) {
      console.error("Error loading profile data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const [actionModal, setActionModal] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSubmitting(true);
    const success = await profileService.updateCompanyProfile(profile.user_id, formData);
    setIsSubmitting(false);

    if (success) {
      await loadProfile();
      setIsEditing(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } else {
      setActionModal({
        isOpen: true,
        title: "Gagal Menyimpan",
        message: "Gagal menyimpan perubahan profil.",
      });
    }
  };

  return {
    profile,
    formData,
    setFormData,
    isLoading,
    isEditing,
    setIsEditing,
    isSubmitting,
    showSuccessToast,
    setShowSuccessToast,
    sektorOptions,
    kotaOptions,
    handleSubmit,
    actionModal,
    setActionModal,
  };
}