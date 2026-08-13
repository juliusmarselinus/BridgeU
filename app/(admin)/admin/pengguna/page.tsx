"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminPengguna } from "./hooks/useAdminPengguna";
import { ActionModal } from "@/components/ActionModal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { GradientBars } from "@/components/ui/gradient-bars-background";
import { AdminSkeletonPage } from "@/components/ui/MahasiswaLoading";

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
    errorModal,
    setErrorModal,
    confirmModal,
    setConfirmModal,
  } = useAdminPengguna();

  if (isLoading) return <AdminSkeletonPage />;

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-secondary/15 via-clouds to-clouds pb-12 font-sans text-ink">
      {errorModal && (
        <ActionModal
          isOpen={!!errorModal}
          onClose={() => setErrorModal(null)}
          title={errorModal.title}
          message={errorModal.message}
        />
      )}
      {confirmModal && (
        <ConfirmModal
          isOpen={!!confirmModal}
          onClose={() => setConfirmModal(null)}
          onConfirm={() => handleToggleStatus(confirmModal.id, confirmModal.currentStatus)}
          title={confirmModal.title}
          message={confirmModal.message}
        />
      )}
      <GradientBars
        numBars={20}
        gradientFrom="rgb(176, 208, 218)"
        gradientTo="transparent"
        animationDuration={7}
        className="opacity-70"
      />

      {/* Hero Header */}
      <div className="relative z-10 w-full bg-clouds">
        <div
          className="relative w-full pt-28 pb-16 overflow-hidden rounded-b-[2.5rem] shadow-[0_20px_50px_-20px_rgba(18,40,75,0.45)]"
          style={{
            background: "linear-gradient(160deg, #12284B 0%, #1B3A63 45%, #8CC1E9 100%)",
          }}
        >
          <GradientBars
            numBars={16}
            gradientFrom="rgba(140, 193, 233, 0.3)"
            gradientTo="transparent"
            animationDuration={3.5}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(140,193,233,0.15),transparent_60%)]" />

          <div className="relative z-10 mx-auto max-w-6xl px-6">
            <Link
              href="/admin/dashboard"
              className="font-mono text-xs font-semibold text-sky hover:text-white transition inline-flex items-center gap-1.5 mb-3 group"
            >
              <span className="transition-transform group-hover:-translate-x-1">←</span> Kembali ke Dashboard Admin
            </Link>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
              Manajemen Akun Pengguna
            </h1>
            <p className="mt-1.5 text-sm font-medium text-paper/90 max-w-2xl leading-relaxed">
              Kelola hak akses dan status keaktifan seluruh akun mahasiswa dan perusahaan terdaftar pada platform BridgeU.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 mx-auto max-w-6xl px-6 -mt-8 space-y-6">
        {/* Search & Filter Card */}
        <div className="rounded-3xl border border-white/60 bg-white/80 p-4 sm:p-5 shadow-lg backdrop-blur-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            {(["Semua", "Mahasiswa", "Perusahaan"] as const).map((r) => {
              const count =
                r === "Semua" ? userList.length : userList.filter((u) => u.role === r).length;

              return (
                <button
                  key={r}
                  onClick={() => setFilterRole(r)}
                  className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${
                    filterRole === r
                      ? "bg-ink text-paper shadow-md scale-105"
                      : "bg-steel/[0.08] text-steel hover:bg-steel/15 hover:text-ink"
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
            className="rounded-full border border-border bg-white px-4 py-2 text-xs text-ink placeholder:text-steel/50 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 w-full sm:w-72 shadow-inner"
          />
        </div>

        {/* Grid List Pengguna (2x4 mobile, 4x2 desktop) */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="h-48 rounded-3xl border border-white/60 bg-white/80 p-4 shadow-lg backdrop-blur-xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-steel/30 bg-white/60 p-12 text-center shadow-sm">
            <p className="text-xs font-mono text-steel">Tidak ada pengguna ditemukan.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((user) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  key={user.id}
                  className="rounded-3xl border border-white/60 bg-white/80 p-4 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1 border-b border-border/40 pb-2">
                      <span
                        className={`font-mono text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                          user.role === "Mahasiswa"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {user.role}
                      </span>

                      <span
                        className={`font-mono text-[8px] px-1.5 py-0.5 rounded-full font-semibold ${
                          user.status === "Aktif"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-rose-100 text-rose-700 border border-rose-300"
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-xs font-bold text-ink leading-tight truncate">
                        {user.nama}
                      </h3>
                      <p className="font-mono text-[9px] text-steel truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    <div className="bg-steel/[0.06] p-2 rounded-2xl border border-steel/10 space-y-0.5">
                      <span className="block font-mono font-semibold text-steel uppercase text-[8px]">
                        Detail:
                      </span>
                      <p className="font-mono font-medium text-ink text-[10px] line-clamp-2 leading-tight">
                        {user.detail}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-border/40 space-y-1.5">
                    <span className="font-mono text-[8px] text-steel block">
                      Tgl: {user.tanggalGabung}
                    </span>

                    <button
                      onClick={() =>
                        user.status === "Aktif"
                          ? setConfirmModal({
                              id: user.id,
                              currentStatus: user.status,
                              title: "Konfirmasi Suspend",
                              message: `Apakah Anda yakin ingin menangguhkan (suspend) akun "${user.nama}"?`,
                            })
                          : handleToggleStatus(user.id, user.status)
                      }
                      className={`w-full rounded-full py-1 font-mono text-[10px] font-semibold transition active:scale-95 text-center cursor-pointer ${
                        user.status === "Aktif"
                          ? "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                          : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                      }`}
                    >
                      {user.status === "Aktif" ? "Suspend" : "Aktifkan"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border/40 pt-6">
            <p className="text-xs text-steel font-mono">
              Menampilkan {filteredUsers.length} dari {totalCount} pengguna
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-full border border-border bg-white/80 px-4 py-1.5 font-mono text-xs font-semibold text-ink transition hover:bg-white disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="font-mono text-xs text-ink font-semibold">
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-full border border-border bg-white/80 px-4 py-1.5 font-mono text-xs font-semibold text-ink transition hover:bg-white disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

