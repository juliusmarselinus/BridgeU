import { useEffect, useState, useCallback } from "react";
import { AdminKolaborasiItem, ModerasiStatus } from "../types";
import { kolaborasiService } from "../services/kolaborasiService";

export function useAdminKolaborasi() {
  const [kolaborasiList, setKolaborasiList] = useState<AdminKolaborasiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"Semua" | ModerasiStatus>("Semua");
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const data = await kolaborasiService.fetchKolaborasiList();
    setKolaborasiList(data);
    setIsLoading(false);
    setCurrentPage(1);
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: ModerasiStatus) => {
    const success = await kolaborasiService.updateModerasiStatus(id, newStatus);
    if (success) {
      setKolaborasiList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status_moderasi: newStatus } : item
        )
      );
    } else {
      alert("Gagal memperbarui status moderasi.");
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset page on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus]);

  const filteredList = kolaborasiList.filter((item) => {
    const matchesSearch =
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      item.perusahaan_nama.toLowerCase().includes(search.toLowerCase()) ||
      item.nama_kategori.toLowerCase().includes(search.toLowerCase());

    if (filterStatus === "Semua") return matchesSearch;
    return matchesSearch && item.status_moderasi === filterStatus;
  });

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE) || 1;
  const paginatedList = filteredList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return {
    kolaborasiList,
    filteredList: paginatedList,
    totalCount: filteredList.length,
    isLoading,
    filterStatus,
    setFilterStatus,
    search,
    setSearch,
    handleUpdateStatus,
    refresh: loadData,
    currentPage,
    setCurrentPage,
    totalPages,
  };
}
