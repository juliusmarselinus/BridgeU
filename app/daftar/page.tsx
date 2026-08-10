"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AuthModal } from "@/components/AuthModal";
import { GradientWave } from "@/components/ui/gradient-wave";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

import { useRegistration } from "./hooks/useRegistration";
import { StepIndicator } from "./components/StepIndicator";
import { Step0RoleSelection } from "./components/Step0RoleSelection";
import { Step1DataAkun } from "./components/Step1DataAkun";
import { Step2ProfilAkademik } from "./components/Step2ProfilAkademik";
import { Step2ProfilPerusahaan } from "./components/Step2ProfilPerusahaan";
import { Step3Skills } from "./components/Step3Skills";
import { Step3DeskripsiPerusahaan } from "./components/Step3DeskripsiPerusahaan";
import { Step4Minat } from "./components/Step4Minat";
import { Step5Review } from "./components/Step5Review";
import { ModalPicker } from "./components/ModalPicker";
import { StepItem } from "./types";
import { SEMESTER_OPTIONS } from "./services/registrationService";

function IconX({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function IconChevronRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function IconChevronLeft({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconUser({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconAcademic({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function IconBuilding({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
    </svg>
  );
}

function IconSparkles({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z" />
    </svg>
  );
}

function IconTarget({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function IconShieldCheck({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

const navItems = [
  { name: "Fitur", link: "/#fitur" },
  { name: "Cara Kerja", link: "/#cara-kerja" },
];

const stepsListMahasiswa: StepItem[] = [
  { num: 1, title: "Data Akun", icon: IconUser },
  { num: 2, title: "Profil Akademik", icon: IconAcademic },
  { num: 3, title: "Keahlian (Skills)", icon: IconSparkles },
  { num: 4, title: "Bidang Minat", icon: IconTarget },
  { num: 5, title: "Review & Selesai", icon: IconShieldCheck },
];

const stepsListPerusahaan: StepItem[] = [
  { num: 1, title: "Data Akun", icon: IconUser },
  { num: 2, title: "Profil Perusahaan", icon: IconBuilding },
  { num: 3, title: "Fokus Kolaborasi", icon: IconTarget },
  { num: 5, title: "Review & Selesai", icon: IconShieldCheck },
];

export default function RegistrationPage() {
  const {
    currentStep,
    formData,
    errorMsg,
    setErrorMsg,
    submitting,
    dbProdiOptions,
    dbUnivOptions,
    dbSektorOptions,
    dbKotaOptions,
    dynamicSkills,
    dynamicMinat,
    updateField,
    selectRole,
    handleNext,
    handleBack,
    handleSkipSkills,
    handleSkipMinat,
    toggleSkill,
    addCustomSkill,
    toggleMinat,
    addCustomMinat,
    handleSubmit,
  } = useRegistration();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"masuk" | "daftar">("masuk");

  // Modal Picker States
  const [activePicker, setActivePicker] = useState<"univ" | "prodi" | "semester" | "sektor" | "kota" | null>(null);

  const isPerusahaan = formData.role === "perusahaan";
  const activeStepsList = isPerusahaan ? stepsListPerusahaan : stepsListMahasiswa;

  const openAuthModal = (tab: "masuk" | "daftar") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#DCE9F5] text-[#17356F] flex flex-col justify-between relative overflow-hidden">
      {/* HERO GRADIENT WAVE BACKGROUND — IDENTICAL TO APP/PAGE.TSX */}
      <GradientWave
        colors={[
          "#DCE9F5",
          "#A9CBEA",
          "#4F91D5",
          "#2475C5",
          "#6FA7D9",
          "#D6E4EF",
        ]}
        className="opacity-95"
        shadowPower={3}
        noiseSpeed={0.000008}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#EAF0F3]/20 via-transparent to-[#C7D9E8]/25" />

      {/* NAVBAR — IDENTICAL TO APP/PAGE.TSX */}
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton as="button" variant="secondary" onClick={() => openAuthModal("masuk")}>
              Masuk
            </NavbarButton>
            <NavbarButton as={Link} href="/daftar" variant="primary">
              Daftar
            </NavbarButton>
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((p) => !p)}
            />
          </MobileNavHeader>

          <MobileNavMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.link}
                onClick={() => setMobileMenuOpen(false)}
                className="relative text-text-secondary"
              >
                {item.name}
              </a>
            ))}
            <div className="flex w-full flex-col gap-3">
              <NavbarButton
                as="button"
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal("masuk");
                }}
              >
                Masuk
              </NavbarButton>
              <NavbarButton
                as={Link}
                href="/daftar"
                variant="primary"
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                Daftar
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Main Registration Hero Section Container */}
      <main className="relative z-10 flex-1 mx-auto w-full max-w-4xl px-6 py-12 pt-28">
        {/* Step Indicator Bar (Shows when step > 0) */}
        {currentStep > 0 && <StepIndicator currentStep={currentStep} stepsList={activeStepsList} />}

        {/* Step Form Box — HERO GLASSMORPHIC CARD THEME */}
        <div className="rounded-3xl border border-white/20 bg-white/10 p-8 md:p-10 shadow-2xl backdrop-blur-xl text-[#17356F]">
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs font-mono text-red-900 flex items-center justify-between"
            >
              <span>{errorMsg}</span>
              <button onClick={() => setErrorMsg("")} className="text-red-900 hover:text-black">
                <IconX className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <Step0RoleSelection
                formData={formData}
                onSelectRole={(r) => selectRole(r)}
              />
            )}

            {currentStep === 1 && (
              <Step1DataAkun formData={formData} updateField={updateField} />
            )}

            {currentStep === 2 && (
              isPerusahaan ? (
                <Step2ProfilPerusahaan
                  formData={formData}
                  updateField={updateField}
                  openPicker={(picker) => setActivePicker(picker)}
                />
              ) : (
                <Step2ProfilAkademik
                  formData={formData}
                  updateField={updateField}
                  openPicker={(picker) => setActivePicker(picker)}
                />
              )
            )}

            {currentStep === 3 && (
              isPerusahaan ? (
                <Step3DeskripsiPerusahaan formData={formData} updateField={updateField} />
              ) : (
                <Step3Skills
                  formData={formData}
                  skillOptions={dynamicSkills}
                  toggleSkill={toggleSkill}
                  addCustomSkill={addCustomSkill}
                />
              )
            )}

            {currentStep === 4 && !isPerusahaan && (
              <Step4Minat
                formData={formData}
                minatOptions={dynamicMinat}
                toggleMinat={toggleMinat}
                addCustomMinat={addCustomMinat}
              />
            )}

            {currentStep === 5 && <Step5Review formData={formData} />}
          </AnimatePresence>

          {/* Navigation Controls (Shows when step > 0) */}
          {currentStep > 0 && (
            <div className="mt-10 flex items-center justify-between border-t border-[#173B6C]/15 pt-6">
              <button
                type="button"
                onClick={handleBack}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl border border-[#173B6C]/20 bg-white/60 px-5 py-2.5 text-xs font-bold text-[#173B6C] hover:bg-white transition shadow-sm"
              >
                <IconChevronLeft className="w-4 h-4" />
                {currentStep === 1 ? "Ganti Peran" : "Kembali"}
              </button>

              <div className="flex items-center gap-3">
                {/* Skip option for Skills Step (Mahasiswa only) */}
                {currentStep === 3 && !isPerusahaan && (
                  <button
                    type="button"
                    onClick={handleSkipSkills}
                    className="rounded-xl border border-[#173B6C]/20 px-4 py-2.5 text-xs font-mono font-bold text-[#173B6C]/70 hover:text-[#173B6C] transition"
                  >
                    Skip Dulu →
                  </button>
                )}

                {/* Skip option for Minat Step (Mahasiswa only) */}
                {currentStep === 4 && !isPerusahaan && (
                  <button
                    type="button"
                    onClick={handleSkipMinat}
                    className="rounded-xl border border-[#173B6C]/20 px-4 py-2.5 text-xs font-mono font-bold text-[#173B6C]/70 hover:text-[#173B6C] transition"
                  >
                    Skip Dulu →
                  </button>
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#173B6C] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#2475C5] transition shadow-lg"
                  >
                    Lanjut
                    <IconChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#173B6C] px-8 py-3 text-xs font-bold text-white hover:bg-[#2475C5] transition shadow-xl disabled:opacity-50"
                  >
                    {submitting ? "Memproses..." : "Selesaikan Pendaftaran"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Reusable Modal Pickers (Mahasiswa Only) */}
      <ModalPicker
        isOpen={activePicker === "univ"}
        onClose={() => setActivePicker(null)}
        title="Pilih Universitas"
        options={dbUnivOptions}
        selectedValue={formData.isCustomUniv ? "Lainnya" : formData.universitas}
        onSelect={(val) => {
          if (val === "Lainnya") {
            updateField("isCustomUniv", true);
            updateField("universitas", formData.customUnivInput || "Lainnya");
          } else {
            updateField("isCustomUniv", false);
            updateField("universitas", val);
          }
        }}
      />

      <ModalPicker
        isOpen={activePicker === "prodi"}
        onClose={() => setActivePicker(null)}
        title="Pilih Program Studi"
        options={dbProdiOptions}
        selectedValue={formData.isCustomProdi ? "Lainnya" : formData.prodi}
        onSelect={(val) => {
          if (val === "Lainnya") {
            updateField("isCustomProdi", true);
            updateField("prodi", formData.customProdiInput || "Lainnya");
          } else {
            updateField("isCustomProdi", false);
            updateField("prodi", val);
          }
        }}
      />

      <ModalPicker
        isOpen={activePicker === "semester"}
        onClose={() => setActivePicker(null)}
        title="Pilih Semester"
        options={SEMESTER_OPTIONS}
        selectedValue={formData.semester}
        allowLainnya={false}
        onSelect={(val) => updateField("semester", val)}
      />

      {/* Modal Pickers for Perusahaan */}
      <ModalPicker
        isOpen={activePicker === "sektor"}
        onClose={() => setActivePicker(null)}
        title="Pilih Sektor Industri"
        options={dbSektorOptions.map((s) => s.nama_sektor)}
        selectedValue={formData.industri}
        allowLainnya={false}
        onSelect={(val) => {
          const found = dbSektorOptions.find((s) => s.nama_sektor === val);
          updateField("industri", val);
          updateField("sektorId", found ? found.id : 0);
        }}
      />

      <ModalPicker
        isOpen={activePicker === "kota"}
        onClose={() => setActivePicker(null)}
        title="Pilih Kota / Lokasi"
        options={dbKotaOptions.map((k) => k.nama_kota)}
        selectedValue={formData.lokasiPerusahaan}
        allowLainnya={false}
        onSelect={(val) => {
          const found = dbKotaOptions.find((k) => k.nama_kota === val);
          updateField("lokasiPerusahaan", val);
          updateField("kotaId", found ? found.id : 0);
        }}
      />

      {/* Auth Modal for Login */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </div>
  );
}
