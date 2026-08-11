"use client";

import Link from "next/link";
import { useAdminPengguna } from "./hooks/useAdminPengguna";

export default function AdminManajemenPenggunaPage() {
  const {
    userList,
    filteredUsers,
    isLoading,
    filterRole,
    setFilterRole,
    search,
    setSearch,
    handleToggleStatus,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
  } = useAdminPengguna();

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/dashboard"
            className="font-mono text-xs text-steel hover:text-ink transition inline-flex items-center gap-1.5"
          >
            ← Kembali ke Dashboard Admin
          </Link>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink">
            Manajemen Akun Pengguna
          </h1>
          <p className="mt-0.5 text-sm text-steel">
            Kelola hak akses dan status keaktifan seluruh akun mahasiswa dan perusahaan terdaftar.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          {(["Semua", "Mahasiswa", "Perusahaan"] as const).map((r) => {
            const count =
              r === "Semua" ? userList.length : userList.filter((u) => u.role === r).length;

            return (
              <button
                key={r}
                onClick={() => setFilterRole(r)}
                className={`rounded-full px-4 py-2 font-medium transition ${
                  filterRole === r
                    ? "bg-ink text-paper border border-ink shadow-sm"
                    : "bg-white/60 text-steel border border-steel/20 hover:border-ink hover:text-ink"
                }`}
              >
                {r} ({count})
              </button>
            );
          })}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama, email, atau perguruan tinggi..."
          className="rounded-full border border-steel/25 bg-white px-4 py-2 text-xs outline-none transition focus:border-emerald-500 w-full sm:w-72"
        />
      </div>

      {/* Tabel Pengguna */}
      <div className="mt-8 overflow-hidden rounded-3xl border border-steel/15 bg-white/70 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-steel/15 bg-steel/5 font-mono uppercase text-steel text-[11px]">
                <th className="px-6 py-4">Pengguna</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Detail Institusi / Industri</th>
                <th className="px-6 py-4">Tanggal Bergabung</th>
                <th className="px-6 py-4">Status Akun</th>
                <th className="px-6 py-4 text-right">Aksi Moderasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel/10">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 w-28 bg-steel/20 rounded mb-1.5"></div>
                      <div className="h-3 w-36 bg-steel/20 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 w-16 bg-steel/20 rounded-full"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-40 bg-steel/20 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3 w-16 bg-steel/20 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 w-14 bg-steel/20 rounded-full"></div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-8 w-24 bg-steel/20 rounded-full ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-steel font-mono">
                    Tidak ada pengguna ditemukan.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/60 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-ink text-sm">{user.nama}</div>
                      <div className="font-mono text-steel text-xs">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 font-mono">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          user.role === "Mahasiswa"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-steel max-w-xs">{user.detail}</td>
                    <td className="px-6 py-4 font-mono text-steel">{user.tanggalGabung}</td>
                    <td className="px-6 py-4 font-mono">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          user.status === "Aktif"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status === "Aktif" ? "Aktif" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        className={`rounded-full px-3.5 py-1.5 font-mono text-xs font-medium transition ${
                          user.status === "Aktif"
                            ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                        }`}
                      >
                        {user.status === "Aktif" ? "Tangguhkan (Suspend)" : "Aktifkan Akun"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between border-t border-steel/10 pt-6">
          <p className="text-xs text-steel font-mono">
            Menampilkan {filteredUsers.length} dari {totalCount} pengguna
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-full border border-steel/20 bg-white px-3.5 py-1.5 font-mono text-xs font-medium text-steel transition hover:border-ink hover:text-ink disabled:opacity-40 disabled:hover:border-steel/20 disabled:hover:text-steel"
            >
              ← Prev
            </button>
            <span className="font-mono text-xs text-ink font-semibold">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full border border-steel/20 bg-white px-3.5 py-1.5 font-mono text-xs font-medium text-steel transition hover:border-ink hover:text-ink disabled:opacity-40 disabled:hover:border-steel/20 disabled:hover:text-steel"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
