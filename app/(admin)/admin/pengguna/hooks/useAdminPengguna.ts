import { useEffect, useState, useCallback } from "react";
import { ManagedUser, UserStatus } from "../types";
import { penggunaService } from "../services/penggunaService";

export function useAdminPengguna() {
  const [userList, setUserList] = useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<"Semua" | "Mahasiswa" | "Perusahaan">("Semua");
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const data = await penggunaService.fetchUserList();
    setUserList(data);
    setIsLoading(false);
    setCurrentPage(1);
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: UserStatus) => {
    const success = await penggunaService.toggleUserStatus(id, currentStatus);
    if (success) {
      setUserList((prev) =>
        prev.map((user) =>
          user.id === id
            ? { ...user, status: user.status === "Aktif" ? "Suspended" : "Aktif" }
            : user
        )
      );
    } else {
      alert("Gagal mengubah status pengguna.");
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset page on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterRole]);

  const filteredUsers = userList.filter((user) => {
    const matchesSearch =
      user.nama.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.detail.toLowerCase().includes(search.toLowerCase());

    if (filterRole === "Semua") return matchesSearch;
    return matchesSearch && user.role === filterRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return {
    userList,
    filteredUsers: paginatedUsers,
    totalCount: filteredUsers.length,
    isLoading,
    filterRole,
    setFilterRole,
    search,
    setSearch,
    handleToggleStatus,
    refresh: loadData,
    currentPage,
    setCurrentPage,
    totalPages,
  };
}
