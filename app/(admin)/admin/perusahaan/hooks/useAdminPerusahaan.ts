import { useEffect, useState, useCallback } from "react";
import { RegisteredCompany, VerifikasiStatus } from "../types";
import { perusahaanService } from "../services/perusahaanService";

export function useAdminPerusahaan() {
  const [companyList, setCompanyList] = useState<RegisteredCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"Semua" | VerifikasiStatus>("Semua");

  const [currentPage, setCurrentPage] = useState(1);
  const [errorModal, setErrorModal] = useState<{ title: string; message: string } | null>(null);
  const ITEMS_PER_PAGE = 8;

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const data = await perusahaanService.fetchCompanyList();
    setCompanyList(data);
    setIsLoading(false);
    setCurrentPage(1);
  }, []);

  const handleUpdateVerifikasi = async (id: string, newStatus: "Terverifikasi" | "Ditolak") => {
    const success = await perusahaanService.updateVerificationStatus(id, newStatus);
    if (success) {
      setCompanyList((prev) =>
        prev.map((comp) =>
          comp.id === id ? { ...comp, statusVerifikasi: newStatus } : comp
        )
      );
    } else {
      setErrorModal({ title: "Gagal", message: "Gagal memperbarui status verifikasi." });
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  const filteredList = companyList.filter((comp) => {
    if (filterStatus === "Semua") return true;
    return comp.statusVerifikasi === filterStatus;
  });

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE) || 1;
  const paginatedList = filteredList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return {
    companyList,
    filteredList: paginatedList,
    totalCount: filteredList.length,
    isLoading,
    filterStatus,
    setFilterStatus,
    handleUpdateVerifikasi,
    refresh: loadData,
    currentPage,
    setCurrentPage,
    totalPages,
    errorModal,
    setErrorModal,
  };
}
