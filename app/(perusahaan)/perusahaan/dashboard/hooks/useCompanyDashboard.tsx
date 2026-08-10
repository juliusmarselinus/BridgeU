import { useState, useEffect, FormEvent } from "react";
import { companyService } from "../services/companyServices";
import {
  StoredCompany,
  KolaborasiWithMeta,
  KolaborasiFormData,
  ModerasiStatus,
  KategoriMinatOption,
  KotaOption,
} from "../types/company";

export function useCompanyDashboard() {
  const [company, setCompany] = useState<StoredCompany | null>(null);
  const [kolaborasiList, setKolaborasiList] = useState<KolaborasiWithMeta[]>([]);
  const [kategoriOptions, setKategoriOptions] = useState<KategoriMinatOption[]>([]);
  const [kotaOptions, setKotaOptions] = useState<KotaOption[]>([]);
  const [selectedTab, setSelectedTab] = useState<"Semua" | ModerasiStatus>("Semua");
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<KolaborasiFormData>({
    judul: "",
    tipe: "Akademik",
    kategori_id: 1,
    deskripsi: "",
    lokasi_id: 1,
    batas_waktu: "",
    tingkat_kesulitan: "Menengah",
    gaji_stipend: "",
    slot: 5,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      setIsLoading(true);
      try {
        const [compData, categories, kotas] = await Promise.all([
          companyService.fetchCompanyProfile(),
          companyService.fetchKategoriMinat(),
          companyService.fetchKotaList(),
        ]);

        if (!isMounted) return;

        setKategoriOptions(categories);
        setKotaOptions(kotas);

        if (categories.length > 0) {
          setFormData((prev) => ({ ...prev, kategori_id: categories[0].id }));
        }
        if (kotas.length > 0) {
          setFormData((prev) => ({ ...prev, lokasi_id: kotas[0].id }));
        }

        if (compData) {
          setCompany(compData);
          const kolaborasiData = await companyService.fetchKolaborasiList(compData.user_id);
          if (!isMounted) return;
          setKolaborasiList(kolaborasiData);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const companyName = company?.nama_perusahaan || "Perusahaan Mitra";

  // Filter Data
  const filteredKolaborasi = kolaborasiList.filter((item) => {
    if (selectedTab === "Semua") return true;
    return item.status_moderasi === selectedTab;
  });

  // Handler Hapus Proyek
  const handleDeleteKolaborasi = async (id: string, judul: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus proyek "${judul}"?`)) {
      const isSuccess = await companyService.deleteKolaborasi(id);
      if (isSuccess) {
        setKolaborasiList((prev) => prev.filter((k) => k.id !== id));
      } else {
        alert("Gagal menghapus proyek. Periksa hak akses Anda.");
      }
    }
  };

  // Handler Submit Form
  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault();
    if (!company) {
      alert("Sesi perusahaan tidak valid.");
      return;
    }

    const createdItem = await companyService.createKolaborasi(formData, company.user_id);
    if (createdItem) {
      setKolaborasiList((prev) => [createdItem, ...prev]);
      setIsModalOpen(false);
      setFormData({
        judul: "",
        tipe: "Akademik",
        kategori_id: kategoriOptions[0]?.id || 1,
        deskripsi: "",
        lokasi_id: kotaOptions[0]?.id || 1,
        batas_waktu: "",
        tingkat_kesulitan: "Menengah",
        gaji_stipend: "",
        slot: 5,
      });
    } else {
      alert("Gagal membuat kolaborasi. Pastikan seluruh input valid.");
    }
  };

  // Handler Export CSV
  const handleExportCSV = () => {
    const headers = ["Judul Proyek", "Tipe", "Lokasi", "Batas Waktu", "Status Moderasi"];
    const rows = kolaborasiList.map((k) => [
      `"${k.judul}"`,
      k.tipe,
      `"${k.nama_kota || ""}"`,
      k.batas_waktu,
      k.status_moderasi,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Kolaborasi_${companyName.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    company,
    companyName,
    kolaborasiList,
    filteredKolaborasi,
    kategoriOptions,
    kotaOptions,
    selectedTab,
    setSelectedTab,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    formData,
    setFormData,
    handleDeleteKolaborasi,
    handleSubmitForm,
    handleExportCSV,
  };
}