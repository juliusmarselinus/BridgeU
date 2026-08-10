import { useState, useEffect } from "react";
import { companyService } from "../../dashboard/services/companyServices";
import { pelamarService } from "../services/pelamarService";
import { ProyekPelamarSummary, PelamarDetail, StatusLamaran } from "../types/pelamar";

export function usePelamar(initialKolaborasiId?: string | null) {
  const [proyekList, setProyekList] = useState<ProyekPelamarSummary[]>([]);
  const [activeProyek, setActiveProyek] = useState<ProyekPelamarSummary | null>(null);
  const [selectedPelamar, setSelectedPelamar] = useState<PelamarDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      try {
        const company = await companyService.fetchCompanyProfile();
        if (!company || !isMounted) return;

        const data = await pelamarService.fetchProyekDanPelamar(company.user_id);
        if (!isMounted) return;

        setProyekList(data);

        // Jika ada filter kolaborasiId dari URL
        if (initialKolaborasiId) {
          const target = data.find((p) => p.id === initialKolaborasiId);
          if (target) setActiveProyek(target);
        }
      } catch (err) {
        console.error("Error loading pelamar data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [initialKolaborasiId]);

  // Handler Update Status
  const handleUpdateStatus = async (
    pendaftaranId: string,
    newStatus: StatusLamaran,
    catatan?: string
  ) => {
    const isSuccess = await pelamarService.updateStatusPelamar(pendaftaranId, newStatus, catatan);

    if (isSuccess) {
      setProyekList((prevProyek) =>
        prevProyek.map((proyek) => ({
          ...proyek,
          pelamar_list: proyek.pelamar_list.map((p) =>
            p.id === pendaftaranId ? { ...p, status: newStatus, catatan_perusahaan: catatan } : p
          ),
        }))
      );

      // Refresh activeProyek jika modal sedang terbuka
      if (activeProyek) {
        setActiveProyek((prev) =>
          prev
            ? {
                ...prev,
                pelamar_list: prev.pelamar_list.map((p) =>
                  p.id === pendaftaranId ? { ...p, status: newStatus, catatan_perusahaan: catatan } : p
                ),
              }
            : null
        );
      }

      // Refresh selectedPelamar
      if (selectedPelamar && selectedPelamar.id === pendaftaranId) {
        setSelectedPelamar((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } else {
      alert("Gagal memperbarui status pendaftaran.");
    }
  };

  // Statistik Keseluruhan
  const totalProyek = proyekList.length;
  const totalPelamar = proyekList.reduce((acc, curr) => acc + curr.pelamar_list.length, 0);
  const perluReview = proyekList.reduce(
    (acc, curr) => acc + curr.pelamar_list.filter((p) => p.status === "Menunggu").length,
    0
  );

  return {
    proyekList,
    activeProyek,
    setActiveProyek,
    selectedPelamar,
    setSelectedPelamar,
    isLoading,
    totalProyek,
    totalPelamar,
    perluReview,
    handleUpdateStatus,
  };
}