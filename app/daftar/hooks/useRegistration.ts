"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormDataState } from "../types";
import {
  fetchDbLookups,
  fetchSkillsAndMinatByProdi,
  fetchSektorOptions,
  fetchKotaOptions,
  processRegistration,
  PRODI_FALLBACK,
  UNIVERSITAS_FALLBACK,
  SKILL_OPTIONS,
  MINAT_OPTIONS,
  SektorItem,
  KotaItem,
} from "../services/registrationService";

export const FORM_CACHE_KEY = "bridgeu_registration_draft";

const INITIAL_FORM_DATA: FormDataState = {
  role: "",
  email: "",
  password: "",
  confirmPassword: "",
  nama: "",
  universitas: "",
  prodi: "",
  semester: "",
  preferensiTipe: "Semua",
  preferensiLokasi: "Remote",
  ringkasanSelf: "",
  selectedSkills: [],
  selectedMinat: [],
  customUnivInput: "",
  customProdiInput: "",
  isCustomUniv: false,
  isCustomProdi: false,
  namaPerusahaan: "",
  industri: "",
  nib: "",
  lokasiPerusahaan: "",
  deskripsiPerusahaan: "",
  fokusKolaborasi: [],
  sektorId: 0,
  kotaId: 0,
  ukuranPerusahaan: "",
  tahunBerdiri: "",
  logoUrl: "",
  situsWeb: "",
  alamatLengkap: "",

};

export function useRegistration() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0); // Start at 0 for Role Selection
  const [formData, setFormData] = useState<FormDataState>(INITIAL_FORM_DATA);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Dynamic DB Options state
  const [dbProdiOptions, setDbProdiOptions] = useState<string[]>(PRODI_FALLBACK);
  const [dbUnivOptions, setDbUnivOptions] = useState<string[]>(UNIVERSITAS_FALLBACK);
  const [fullProdiList, setFullProdiList] = useState<{ id: number; nama_prodi: string }[]>([]);

  // Dynamic Skills & Minat state
  const [dynamicSkills, setDynamicSkills] = useState<string[]>(SKILL_OPTIONS);
  const [dynamicMinat, setDynamicMinat] = useState<string[]>(MINAT_OPTIONS);

  // Sektor & Kota options for company registration
  const [dbSektorOptions, setDbSektorOptions] = useState<SektorItem[]>([]);
  const [dbKotaOptions, setDbKotaOptions] = useState<KotaItem[]>([]);

  // Read URL query params on mount for role (e.g. ?role=mahasiswa)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlRole = params.get("role");
      if (urlRole === "mahasiswa" || urlRole === "perusahaan") {
        setFormData((prev) => ({ ...prev, role: urlRole }));
        setCurrentStep((prevStep) => (prevStep === 0 ? 1 : prevStep));
      }
    }
  }, []);

  // Fetch Lookups from Supabase DB on mount
  useEffect(() => {
    let isMounted = true;
    fetchDbLookups().then(({ prodi, univ, prodiList }) => {
      if (isMounted) {
        setDbProdiOptions(prodi);
        setDbUnivOptions(univ);
        setFullProdiList(prodiList);
      }
    });
    // Fetch sektor & kota for company form
    fetchSektorOptions().then((data) => { if (isMounted) setDbSektorOptions(data); });
    fetchKotaOptions().then((data) => { if (isMounted) setDbKotaOptions(data); });
    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamically update skills & minat options based on selected or typed prodi
  useEffect(() => {
    let isMounted = true;
    const activeProdi = formData.isCustomProdi ? formData.customProdiInput : formData.prodi;

    fetchSkillsAndMinatByProdi(activeProdi, fullProdiList).then(({ skills, minat }) => {
      if (isMounted) {
        if (skills && skills.length > 0) setDynamicSkills(skills);
        if (minat && minat.length > 0) setDynamicMinat(minat);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [formData.prodi, formData.customProdiInput, formData.isCustomProdi, fullProdiList]);

  // Restore draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FORM_CACHE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
        if (typeof parsed.currentStep === "number") {
          setCurrentStep(parsed.currentStep);
        } else if (parsed.role) {
          setCurrentStep(1);
        }
      }
    } catch (e) {
      console.error("Gagal membaca draft dari localStorage:", e);
    }
  }, []);

  // Auto-save draft silently to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(
        FORM_CACHE_KEY,
        JSON.stringify({ ...formData, currentStep })
      );
    } catch (e) {
      console.error("Gagal menyimpan draft ke localStorage:", e);
    }
  }, [formData, currentStep]);

  const updateField = (field: keyof FormDataState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMsg("");
  };

  const selectRole = (role: "mahasiswa" | "perusahaan") => {
    setFormData((prev) => ({ ...prev, role }));
    setErrorMsg("");
    setCurrentStep(1);
  };

  const validateStep = (step: number): boolean => {
    setErrorMsg("");
    const isPerusahaan = formData.role === "perusahaan";

    if (step === 0) {
      if (!formData.role) {
        setErrorMsg("Silakan pilih peran pendaftaran kamu.");
        return false;
      }
    } else if (step === 1) {
      if (!formData.nama.trim()) {
        setErrorMsg(isPerusahaan ? "Nama Perusahaan wajib diisi." : "Nama lengkap wajib diisi.");
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes("@")) {
        setErrorMsg("Email valid wajib diisi.");
        return false;
      }
      if (formData.password.length < 6) {
        setErrorMsg("Password minimal 6 karakter.");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMsg("Konfirmasi password tidak cocok.");
        return false;
      }
    } else if (step === 2) {
      if (isPerusahaan) {
        if (!formData.industri || !formData.sektorId) {
          setErrorMsg("Silakan pilih Sektor Industri Perusahaan kamu.");
          return false;
        }
        if (!formData.nib.trim()) {
          setErrorMsg("Nomor Induk Berusaha (NIB) wajib diisi.");
          return false;
        }
        if (!formData.lokasiPerusahaan || !formData.kotaId) {
          setErrorMsg("Silakan pilih Kota / Lokasi Kantor Pusat perusahaan kamu.");
          return false;
        }
      } else {
        const activeUniv = formData.isCustomUniv ? formData.customUnivInput.trim() : formData.universitas;
        const activeProdi = formData.isCustomProdi ? formData.customProdiInput.trim() : formData.prodi;

        if (!activeUniv || activeUniv === "Lainnya") {
          setErrorMsg("Silakan pilih atau ketik nama Universitas/Institusi kamu.");
          return false;
        }
        if (!activeProdi || activeProdi === "Lainnya") {
          setErrorMsg("Silakan pilih atau ketik nama Program Studi/Bidang kamu.");
          return false;
        }
        if (!formData.semester) {
          setErrorMsg("Silakan pilih Semester kamu.");
          return false;
        }
      }
    } else if (step === 3) {
      if (isPerusahaan) {
        if (!formData.deskripsiPerusahaan.trim()) {
          setErrorMsg("Deskripsi Perusahaan wajib diisi.");
          return false;
        }
        if (formData.fokusKolaborasi.length === 0) {
          setErrorMsg("Silakan pilih minimal 1 Fokus Program Kolaborasi.");
          return false;
        }
      } else {
        if (formData.selectedSkills.length < 3) {
          setErrorMsg("Silakan pilih minimal 3 keahlian/skill atau klik Skip untuk melanjutkan.");
          return false;
        }
      }
    } else if (step === 4) {
      if (!isPerusahaan && formData.selectedMinat.length < 3) {
        setErrorMsg("Silakan pilih minimal 3 kategori minat atau klik Skip untuk melanjutkan.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (formData.role === "perusahaan" && currentStep === 3) {
        // Skip step 4 for Perusahaan and jump directly to Step 5 (Review)
        setCurrentStep(5);
      } else {
        setCurrentStep((prev) => Math.min(prev + 1, 5));
      }
    }
  };

  const handleBack = () => {
    setErrorMsg("");
    if (formData.role === "perusahaan" && currentStep === 5) {
      setCurrentStep(3);
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleSkipSkills = () => {
    setErrorMsg("");
    setCurrentStep(4);
  };

  const handleSkipMinat = () => {
    setErrorMsg("");
    setCurrentStep(5);
  };

  const toggleSkill = (skill: string) => {
    const exists = formData.selectedSkills.includes(skill);
    const updated = exists
      ? formData.selectedSkills.filter((s) => s !== skill)
      : [...formData.selectedSkills, skill];
    updateField("selectedSkills", updated);
  };

  const addCustomSkill = (customSkill: string) => {
    if (!customSkill.trim()) return;
    const clean = customSkill.trim();
    if (!formData.selectedSkills.includes(clean)) {
      updateField("selectedSkills", [...formData.selectedSkills, clean]);
    }
  };

  const toggleMinat = (minat: string) => {
    const exists = formData.selectedMinat.includes(minat);
    const updated = exists
      ? formData.selectedMinat.filter((m) => m !== minat)
      : [...formData.selectedMinat, minat];
    updateField("selectedMinat", updated);
  };

  const addCustomMinat = (customMinat: string) => {
    if (!customMinat.trim()) return;
    const clean = customMinat.trim();
    if (!formData.selectedMinat.includes(clean)) {
      updateField("selectedMinat", [...formData.selectedMinat, clean]);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrorMsg("");

    try {
      await processRegistration(formData);
      localStorage.removeItem(FORM_CACHE_KEY);
      router.push(formData.role === "perusahaan" ? "/perusahaan/dashboard" : "/dashboard");
    } catch (err: any) {
      console.error("Gagal melakukan pendaftaran:", err);
      setErrorMsg(err.message || "Terjadi kesalahan saat memproses pendaftaran. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
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
  };
}
