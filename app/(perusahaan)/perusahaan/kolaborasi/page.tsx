"use client";

import { useCompanyDashboard } from "../../dashboard/hooks/useCompanyDashboard";
import { KolaborasiHeader } from "@/components/kolaborasi/KolaborasiHeader";
import { KolaborasiItemCard } from "@/components/kolaborasi/KolaborasiItemCard";
import { KolaborasiEmptyState } from "@/components/kolaborasi/KolaborasiEmptyState";
import { KolaborasiModal } from "@/components/company/KolaborasiModal";

export default function KolaborasiPage() {
  const {
    kolaborasiList,
    filteredKolaborasi,
    kategoriOptions,
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
  } = useCompanyDashboard();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-xs text-steel">
        Memuat data kolaborasi...
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 pb-16">
      {/* Header, CTA, & Filter Tab Status Moderasi */}
      <KolaborasiHeader
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
        onOpenModal={() => setIsModalOpen(true)}
        onExportCSV={handleExportCSV}
        totalCount={kolaborasiList.length}
      />

      {/* Grid Proyek Kolaborasi */}
      {filteredKolaborasi.length === 0 ? (
        <KolaborasiEmptyState
          selectedTab={selectedTab}
          onOpenModal={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredKolaborasi.map((item) => (
            <KolaborasiItemCard
              key={item.id}
              item={item}
              onDelete={handleDeleteKolaborasi}
            />
          ))}
        </div>
      )}

      {/* Modal Form Tambah/Pengajuan Proyek Baru */}
      <KolaborasiModal
        isOpen={isModalOpen}
        formData={formData}
        kategoriOptions={kategoriOptions}
        onClose={() => setIsModalOpen(false)}
        onChange={setFormData}
        onSubmit={handleSubmitForm}
      />
    </main>
  );
}