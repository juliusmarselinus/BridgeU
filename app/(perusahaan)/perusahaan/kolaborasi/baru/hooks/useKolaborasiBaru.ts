import { useEffect, useState, FormEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { companyService, companyServiceExtended } from "../../../dashboard/services/companyServices";
import { KategoriMinatOption, KotaOption } from "../../../dashboard/types/company";
import { ProdiOption, SkillOption, BaruFormData } from "../types/baru";
import { recommendKategori, recommendItems } from "../services/baruRecommendation";

export function useKolaborasiBaru() {
  const router = useRouter();
  const [perusahaanId, setPerusahaanId] = useState<string | null>(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Master Options
  const [kategoriList, setKategoriList] = useState<KategoriMinatOption[]>([]);
  const [kotaList, setKotaList] = useState<KotaOption[]>([]);
  const [prodiList, setProdiList] = useState<ProdiOption[]>([]);
  const [skillList, setSkillList] = useState<SkillOption[]>([]);

  // Recommendation State (IDs only)
  const [recKategoriIds, setRecKategoriIds] = useState<number[]>([]);
  const [recProdiIds, setRecProdiIds] = useState<number[]>([]);
  const [recSkillIds, setRecSkillIds] = useState<number[]>([]);

  // Display limits for pagination (expand each 10)
  const [kategoriLimit, setKategoriLimit] = useState(10);
  const [prodiLimit, setProdiLimit] = useState(10);
  const [skillLimit, setSkillLimit] = useState(10);

  const [statusVerifikasi, setStatusVerifikasi] = useState<string>("Menunggu Verifikasi");
  const [actionModal, setActionModal] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: "",
    message: "",
  });
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: "",
    message: "",
  });

  // Modal Pickers State
  const [isKotaModalOpen, setIsKotaModalOpen] = useState(false);
  const [isProdiModalOpen, setIsProdiModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isKategoriModalOpen, setIsKategoriModalOpen] = useState(false);

  // Search queries inside modals
  const [kotaSearch, setKotaSearch] = useState("");
  const [prodiSearch, setProdiSearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [kategoriSearch, setKategoriSearch] = useState("");

  const [isCreatingCustom, setIsCreatingCustom] = useState(false);

  // Form State
  const [formData, setFormData] = useState<BaruFormData>({
    judul: "",
    tipe: "Akademik",
    selectedKategoriIds: [], // Empty by default!
    lokasi_id: 1,
    tingkat_kesulitan: "Menengah",
    slot: 5,
    batas_waktu: "",
    tanggal_selesai: "",
    gaji_stipend: "",
    deskripsi: "",
    selectedProdiIds: [],
    selectedSkillIds: [],
  });

  useEffect(() => {
    async function loadOptions() {
      setIsLoadingOptions(true);
      try {
        const [profile, categories, kotas, prodis, skills] = await Promise.all([
          companyService.fetchCompanyProfile(),
          companyService.fetchKategoriMinat(),
          companyService.fetchKotaList(),
          companyServiceExtended.fetchProdiList(),
          companyServiceExtended.fetchSkillsList(),
        ]);

        if (profile) {
          setPerusahaanId(profile.user_id);
          setStatusVerifikasi(profile.status_verifikasi);
        }

        setKategoriList(categories);
        setKotaList(kotas);
        setProdiList(prodis);
        setSkillList(skills);

        if (kotas.length > 0) {
          setFormData((prev) => ({ ...prev, lokasi_id: kotas[0].id }));
        }
      } catch (err) {
        console.error("Gagal memuat opsi form:", err);
      } finally {
        setIsLoadingOptions(false);
      }
    }

    loadOptions();
  }, []);

  // Update Kategori Recommendations
  useEffect(() => {
    const recommendedKats = recommendKategori(formData.judul, kategoriList);
    setRecKategoriIds(recommendedKats);
  }, [formData.judul, kategoriList]);

  // Update Prodi & Skill Recommendations dynamically
  useEffect(() => {
    const recommendedProdis = recommendItems(
      formData.judul,
      formData.selectedKategoriIds,
      kategoriList,
      prodiList,
      "nama_prodi"
    );
    const recommendedSkills = recommendItems(
      formData.judul,
      formData.selectedKategoriIds,
      kategoriList,
      skillList,
      "nama_skill"
    );
    setRecProdiIds(recommendedProdis);
    setRecSkillIds(recommendedSkills);
  }, [formData.judul, formData.selectedKategoriIds, kategoriList, prodiList, skillList]);

  // Checkbox Target Prodi Toggle
  const toggleProdi = (id: number) => {
    setFormData((prev) => {
      const exists = prev.selectedProdiIds.includes(id);
      return {
        ...prev,
        selectedProdiIds: exists
          ? prev.selectedProdiIds.filter((pId) => pId !== id)
          : [...prev.selectedProdiIds, id],
      };
    });
  };

  // Checkbox Skill Toggle
  const toggleSkill = (id: number) => {
    setFormData((prev) => {
      const exists = prev.selectedSkillIds.includes(id);
      return {
        ...prev,
        selectedSkillIds: exists
          ? prev.selectedSkillIds.filter((sId) => sId !== id)
          : [...prev.selectedSkillIds, id],
      };
    });
  };

  // Checkbox Kategori Minat Toggle
  const toggleKategori = (id: number) => {
    setFormData((prev) => {
      const exists = prev.selectedKategoriIds.includes(id);
      return {
        ...prev,
        selectedKategoriIds: exists
          ? prev.selectedKategoriIds.filter((kId) => kId !== id)
          : [...prev.selectedKategoriIds, id],
      };
    });
  };

  // Database Custom Adders
  const handleAddCustomKategori = async (namaKategori: string) => {
    if (!namaKategori.trim()) return;
    setIsCreatingCustom(true);
    try {
      const { data, error } = await supabase
        .from("kategori_minat")
        .insert([{ nama_kategori: namaKategori }])
        .select("id, nama_kategori")
        .single();

      if (!error && data) {
        setKategoriList(prev => [...prev, data]);
        toggleKategori(data.id);
        setKategoriSearch("");
      } else {
        const { data: existing } = await supabase
          .from("kategori_minat")
          .select("id, nama_kategori")
          .eq("nama_kategori", namaKategori)
          .maybeSingle();

        if (existing) {
          if (!kategoriList.some(k => k.id === existing.id)) {
            setKategoriList(prev => [...prev, existing]);
          }
          toggleKategori(existing.id);
          setKategoriSearch("");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingCustom(false);
    }
  };

  const handleAddCustomProdi = async (namaProdi: string) => {
    if (!namaProdi.trim()) return;
    setIsCreatingCustom(true);
    try {
      const { data, error } = await supabase
        .from("program_studi")
        .insert([{ nama_prodi: namaProdi, jenjang: "Umum" }])
        .select("id, nama_prodi, jenjang")
        .single();

      if (!error && data) {
        setProdiList(prev => [...prev, data]);
        toggleProdi(data.id);
        setProdiSearch("");
      } else {
        const { data: existing } = await supabase
          .from("program_studi")
          .select("id, nama_prodi, jenjang")
          .eq("nama_prodi", namaProdi)
          .maybeSingle();

        if (existing) {
          if (!prodiList.some(p => p.id === existing.id)) {
            setProdiList(prev => [...prev, existing]);
          }
          toggleProdi(existing.id);
          setProdiSearch("");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingCustom(false);
    }
  };

  const handleAddCustomSkill = async (namaSkill: string) => {
    if (!namaSkill.trim()) return;
    setIsCreatingCustom(true);
    try {
      const { data, error } = await supabase
        .from("skills")
        .insert([{ nama_skill: namaSkill }])
        .select("id, nama_skill")
        .single();

      if (!error && data) {
        setSkillList(prev => [...prev, data]);
        toggleSkill(data.id);
        setSkillSearch("");
      } else {
        const { data: existing } = await supabase
          .from("skills")
          .select("id, nama_skill")
          .eq("nama_skill", namaSkill)
          .maybeSingle();

        if (existing) {
          if (!skillList.some(s => s.id === existing.id)) {
            setSkillList(prev => [...prev, existing]);
          }
          toggleSkill(existing.id);
          setSkillSearch("");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingCustom(false);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!perusahaanId) {
      setActionModal({
        isOpen: true,
        title: "Sesi Tidak Ditemukan",
        message: "Sesi profil perusahaan tidak ditemukan. Silakan login kembali.",
      });
      return;
    }

    if (formData.selectedKategoriIds.length === 0) {
      setActionModal({
        isOpen: true,
        title: "Kategori Belum Dipilih",
        message: "Pilih minimal satu Kategori Minat.",
      });
      return;
    }

    setIsSubmitting(true);

    const success = await companyServiceExtended.createFullKolaborasi(
      {
        judul: formData.judul,
        tipe: formData.tipe,
        kategori_id: formData.selectedKategoriIds[0] || 1, // primary fallback
        deskripsi: formData.deskripsi,
        lokasi_id: formData.lokasi_id,
        batas_waktu: formData.batas_waktu,
        tanggal_selesai: formData.tanggal_selesai || undefined,
        tingkat_kesulitan: formData.tingkat_kesulitan,
        gaji_stipend: formData.gaji_stipend,
        slot: formData.slot,
        target_prodi_ids: formData.selectedProdiIds,
        skill_ids: formData.selectedSkillIds,
        target_kategori_ids: formData.selectedKategoriIds,
      },
      perusahaanId
    );

    setIsSubmitting(false);

    if (success) {
      setSuccessModal({
        isOpen: true,
        title: "Pengajuan Berhasil",
        message: "Proyek kolaborasi berhasil diajukan dan sedang dalam proses moderasi.",
      });
    } else {
      setActionModal({
        isOpen: true,
        title: "Gagal Mempublikasikan",
        message: "Gagal mempublikasikan proyek. Periksa kembali kelengkapan data.",
      });
    }
  };

  // Prepend "Lainnya" option to prodiList for Universitas & Program Studi selections rule
  const cleanProdiList = prodiList.filter(p => p && p.nama_prodi);
  const prodisWithLainnya = cleanProdiList.some(p => p.nama_prodi === "Lainnya")
    ? cleanProdiList
    : [{ id: -999, nama_prodi: "Lainnya", jenjang: "Umum" }, ...cleanProdiList];

  const top10RecProdiIds = useMemo(() => recProdiIds.slice(0, 10), [recProdiIds]);
  const top10RecSkillIds = useMemo(() => recSkillIds.slice(0, 10), [recSkillIds]);

  const sortedKategoris = useMemo(() => {
    return [...kategoriList].sort((a, b) => {
      const aSel = formData.selectedKategoriIds.includes(a.id);
      const bSel = formData.selectedKategoriIds.includes(b.id);
      if (aSel && !bSel) return -1;
      if (!aSel && bSel) return 1;

      const aRecIdx = recKategoriIds.indexOf(a.id);
      const bRecIdx = recKategoriIds.indexOf(b.id);
      const aRec = aRecIdx !== -1;
      const bRec = bRecIdx !== -1;
      if (aRec && !bRec) return -1;
      if (!aRec && bRec) return 1;
      if (aRec && bRec) return aRecIdx - bRecIdx;

      return 0;
    });
  }, [kategoriList, formData.selectedKategoriIds, recKategoriIds]);

  const sortedProdis = useMemo(() => {
    return [...prodisWithLainnya].sort((a, b) => {
      const aSel = formData.selectedProdiIds.includes(a.id);
      const bSel = formData.selectedProdiIds.includes(b.id);
      if (aSel && !bSel) return -1;
      if (!aSel && bSel) return 1;

      const aRecIdx = recProdiIds.indexOf(a.id);
      const bRecIdx = recProdiIds.indexOf(b.id);
      const aRec = aRecIdx !== -1;
      const bRec = bRecIdx !== -1;
      if (aRec && !bRec) return -1;
      if (!aRec && bRec) return 1;
      if (aRec && bRec) return aRecIdx - bRecIdx;

      return 0;
    });
  }, [prodisWithLainnya, formData.selectedProdiIds, recProdiIds]);

  const sortedSkills = useMemo(() => {
    return [...skillList].sort((a, b) => {
      const aSel = formData.selectedSkillIds.includes(a.id);
      const bSel = formData.selectedSkillIds.includes(b.id);
      if (aSel && !bSel) return -1;
      if (!aSel && bSel) return 1;

      const aRecIdx = recSkillIds.indexOf(a.id);
      const bRecIdx = recSkillIds.indexOf(b.id);
      const aRec = aRecIdx !== -1;
      const bRec = bRecIdx !== -1;
      if (aRec && !bRec) return -1;
      if (!aRec && bRec) return 1;
      if (aRec && bRec) return aRecIdx - bRecIdx;

      return 0;
    });
  }, [skillList, formData.selectedSkillIds, recSkillIds]);

  const visibleKategoris = sortedKategoris.slice(0, kategoriLimit);
  const visibleProdis = sortedProdis.slice(0, prodiLimit);
  const visibleSkills = sortedSkills.slice(0, skillLimit);

  const searchedKotaOptions = kotaList.filter(k => 
    k.nama_kota.toLowerCase().includes(kotaSearch.toLowerCase())
  );
  const searchedKategoriOptions = kategoriList.filter(k => 
    k.nama_kategori.toLowerCase().includes(kategoriSearch.toLowerCase())
  );
  const isKategoriSearchEmpty = searchedKategoriOptions.length === 0 && kategoriSearch.trim() !== "";

  const searchedProdiOptions = prodisWithLainnya.filter(p => 
    p.nama_prodi.toLowerCase().includes(prodiSearch.toLowerCase())
  );
  const isProdiSearchEmpty = searchedProdiOptions.length === 0 && prodiSearch.trim() !== "";

  const searchedSkillOptions = skillList.filter(s => 
    s.nama_skill.toLowerCase().includes(skillSearch.toLowerCase())
  );
  const isSkillSearchEmpty = searchedSkillOptions.length === 0 && skillSearch.trim() !== "";

  return {
    perusahaanId,
    isLoadingOptions,
    isSubmitting,
    statusVerifikasi,
    actionModal,
    setActionModal,
    successModal,
    setSuccessModal,
    kategoriList,
    kotaList,
    prodiList,
    skillList,
    isKotaModalOpen,
    setIsKotaModalOpen,
    isProdiModalOpen,
    setIsProdiModalOpen,
    isSkillModalOpen,
    setIsSkillModalOpen,
    isKategoriModalOpen,
    setIsKategoriModalOpen,
    kotaSearch,
    setKotaSearch,
    prodiSearch,
    setProdiSearch,
    skillSearch,
    setSkillSearch,
    kategoriSearch,
    setKategoriSearch,
    isCreatingCustom,
    setIsCreatingCustom,
    formData,
    setFormData,
    kategoriLimit,
    setKategoriLimit,
    prodiLimit,
    setProdiLimit,
    skillLimit,
    setSkillLimit,
    handleSubmit,
    toggleProdi,
    toggleSkill,
    toggleKategori,
    handleAddCustomKategori,
    handleAddCustomProdi,
    handleAddCustomSkill,
    top10RecProdiIds,
    top10RecSkillIds,
    visibleKategoris,
    visibleProdis,
    visibleSkills,
    searchedKotaOptions,
    searchedKategoriOptions,
    isKategoriSearchEmpty,
    searchedProdiOptions,
    isProdiSearchEmpty,
    searchedSkillOptions,
    isSkillSearchEmpty,
    sortedKategoris,
    sortedProdis,
    sortedSkills,
    recKategoriIds,
    recProdiIds,
    recSkillIds,
    router,
    selectedKotaObj: kotaList.find(k => k.id === formData.lokasi_id),
  };
}
