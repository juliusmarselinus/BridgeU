"use client";

import { useCompanyDashboard } from "../dashboard/hooks/useCompanyDashboard";
import { KolaborasiHeader } from "./components/KolaborasiHeader";
import { KolaborasiItemCard } from "./components/KolaborasiItemCard";
import { KolaborasiEmptyState } from "./components/KolaborasiEmptyState";
import { KolaborasiModal } from "./components/KolaborasiModal";

export default function KolaborasiPage() {
  const {
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
      <KolaborasiHeader
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
        onOpenModal={() => setIsModalOpen(true)}
        onExportCSV={handleExportCSV}
        totalCount={kolaborasiList.length}
      />

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

      <KolaborasiModal
        isOpen={isModalOpen}
        formData={formData}
        kategoriOptions={kategoriOptions}
        kotaOptions={kotaOptions}
        onClose={() => setIsModalOpen(false)}
        onChange={setFormData}
        onSubmit={handleSubmitForm}
      />
    </main>
  );
}