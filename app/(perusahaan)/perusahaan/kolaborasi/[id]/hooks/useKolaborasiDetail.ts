import { useEffect, useState, FormEvent, useMemo, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { companyService, companyServiceExtended } from "../../../dashboard/services/companyServices";
import { pelamarService } from "../../../pelamar/services/pelamarService";
import { StatusLamaran, PelamarDetail } from "../../../pelamar/types/pelamar";
import { recommendKategori, recommendItems } from "../utils/recommendations";
import { chatService, ChatMessage } from "../../baru/services/chatService";
import { deleteRequestService } from "../../baru/services/deleteRequestService";
import { notifikasiService } from "../../baru/services/notifikasiService";

export interface ProdiOption {
  id: number;
  nama_prodi: string;
  jenjang: string;
}

export interface SkillOption {
  id: number;
  nama_skill: string;
}

export function useKolaborasiDetail() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as "pelamar" | "settings") || "pelamar";

  // Tab & Loading State
  const [activeTab, setActiveTab] = useState<"pelamar" | "settings">(initialTab);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // User auth state
  const [currentUserId, setCurrentUserId] = useState<string>("");

  // Data State
  const [kolaborasi, setKolaborasi] = useState<any>(null);
  const [pelamarList, setPelamarList] = useState<PelamarDetail[]>([]);
  const [selectedPelamar, setSelectedPelamar] = useState<PelamarDetail | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);
  const chatChannelRef = useRef<any>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const globalChatChannelRef = useRef<any>(null);

  // Evaluasi & Revisi State
  const [evaluasiInput, setEvaluasiInput] = useState<string>("");
  const [isSubmittingEvaluasi, setIsSubmittingEvaluasi] = useState<boolean>(false);
  const [isSubmittingRevisi, setIsSubmittingRevisi] = useState<boolean>(false);

  // Delete Request Catatan
  const [deleteAlasan, setDeleteAlasan] = useState<string>("");
  const [deleteKompensasi, setDeleteKompensasi] = useState<string>("");
  

  const [statusVerifikasi, setStatusVerifikasi] = useState<string>("Menunggu Verifikasi");
  const [actionModal, setActionModal] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: "",
    message: "",
  });
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    redirectOnClose?: boolean;
  }>({
    isOpen: false,
    title: "",
    message: "",
    redirectOnClose: false,
  });

  const isVerified = statusVerifikasi === "Terverifikasi";

  // Master Options
  const [kategoriList, setKategoriList] = useState<any[]>([]);
  const [kotaList, setKotaList] = useState<any[]>([]);
  const [prodiList, setProdiList] = useState<ProdiOption[]>([]);
  const [skillList, setSkillList] = useState<SkillOption[]>([]);

  // Recommendation State
  const [recKategoriIds, setRecKategoriIds] = useState<number[]>([]);
  const [recProdiIds, setRecProdiIds] = useState<number[]>([]);
  const [recSkillIds, setRecSkillIds] = useState<number[]>([]);

  // Display limits
  const [kategoriLimit, setKategoriLimit] = useState(10);
  const [prodiLimit, setProdiLimit] = useState(10);
  const [skillLimit, setSkillLimit] = useState(10);

  // Modal Pickers State
  const [isKotaModalOpen, setIsKotaModalOpen] = useState(false);
  const [isProdiModalOpen, setIsProdiModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isKategoriModalOpen, setIsKategoriModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Search queries inside modals
  const [kotaSearch, setKotaSearch] = useState("");
  const [prodiSearch, setProdiSearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [kategoriSearch, setKategoriSearch] = useState("");

  const [isCreatingCustom, setIsCreatingCustom] = useState(false);

  // Settings Form State
  const [formData, setFormData] = useState({
    judul: "",
    tipe: "Akademik" as "Akademik" | "Magang",
    selectedKategoriIds: [] as number[],
    lokasi_id: 1,
    tingkat_kesulitan: "Menengah" as "Pemula" | "Menengah" | "Lanjut",
    slot: 5,
    batas_waktu: "",
    tanggal_selesai: "",
    gaji_stipend: "",
    deskripsi: "",
    selectedProdiIds: [] as number[],
    selectedSkillIds: [] as number[],
  });

  // Get current user auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setCurrentUserId(data.user.id);
      }
    });
  }, []);

  // Sync evaluasiInput when selectedPelamar changes
  useEffect(() => {
    if (selectedPelamar) {
      setEvaluasiInput(selectedPelamar.catatan_perusahaan || "");
    }
  }, [selectedPelamar?.id]);

  // Realtime Chat Subscription for selectedPelamar
  useEffect(() => {
    if (!id || !selectedPelamar) {
      setChatMessages([]);
      return;
    }

    let isMounted = true;

    async function loadChat() {
      const msgs = await chatService.fetchPesan(id as string, selectedPelamar!.mahasiswa_id);
      if (isMounted) {
        setChatMessages(msgs);
      }
      // Tandai pesan mahasiswa ini sudah dibaca karena workspace-nya sedang dibuka
      await chatService.markAsRead(id as string, selectedPelamar!.mahasiswa_id, "perusahaan");
      if (isMounted) {
        setUnreadCounts((prev) => ({ ...prev, [selectedPelamar!.mahasiswa_id]: 0 }));
      }
    }

    loadChat();

    // Subscribe to realtime updates
    const channel = chatService.subscribe(
      id as string,
      selectedPelamar.mahasiswa_id,
      (pesanBaru) => {
        setChatMessages((prev) => {
          if (prev.some((m) => m.id === pesanBaru.id)) return prev;
          return [...prev, pesanBaru];
        });
        // Karena workspace mahasiswa ini sedang terbuka, langsung mark as read juga
        if (pesanBaru.tipe_pengirim === "mahasiswa") {
          chatService.markAsRead(id as string, selectedPelamar.mahasiswa_id, "perusahaan");
        }
      }
    );
    chatChannelRef.current = channel;

    return () => {
      isMounted = false;
      if (chatChannelRef.current) {
        chatService.unsubscribe(chatChannelRef.current);
      }
    };
  }, [id, selectedPelamar?.mahasiswa_id]);

  // Realtime subscription GLOBAL untuk semua mahasiswa di kolaborasi ini
  // (update badge unread di semua kartu, bukan cuma yang lagi dibuka)
  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    async function loadUnreadCounts() {
      const counts = await chatService.fetchUnreadCounts(id as string, "perusahaan");
      if (isMounted) setUnreadCounts(counts);
    }

    loadUnreadCounts();

    const channel = chatService.subscribeAllForKolaborasi
      ? chatService.subscribeAllForKolaborasi(id as string, (pesanBaru: ChatMessage) => {
          if (pesanBaru.tipe_pengirim !== "mahasiswa") return;

          setSelectedPelamar((currentSelected) => {
            const isCurrentlyOpen = currentSelected?.mahasiswa_id === pesanBaru.mahasiswa_id;
            if (!isCurrentlyOpen) {
              setUnreadCounts((prev) => ({
                ...prev,
                [pesanBaru.mahasiswa_id]: (prev[pesanBaru.mahasiswa_id] || 0) + 1,
              }));
            }
            return currentSelected;
          });
        })
      : null;

    globalChatChannelRef.current = channel;

    return () => {
      isMounted = false;
      if (globalChatChannelRef.current) {
        chatService.unsubscribe(globalChatChannelRef.current);
      }
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      try {
        const [categories, kotas, prodis, skills, profile] = await Promise.all([
          companyService.fetchKategoriMinat(),
          companyService.fetchKotaList(),
          companyServiceExtended.fetchProdiList(),
          companyServiceExtended.fetchSkillsList(),
          companyService.fetchCompanyProfile(),
        ]);

        if (isMounted) {
          setKategoriList(categories);
          setKotaList(kotas);
          setProdiList(prodis);
          setSkillList(skills);
          if (profile) {
            setStatusVerifikasi(profile.status_verifikasi);
          }
        }

        const { data: row, error } = await supabase
          .from("kolaborasi")
          .select(`
            id, judul, tipe, deskripsi, lokasi_id, batas_waktu, tanggal_selesai, status_moderasi,
            tingkat_kesulitan, gaji_stipend, slot, kategori_id,
            kategori_minat:kategori_id ( nama_kategori ),
            kota ( nama_kota ),
            kolaborasi_target_prodi ( prodi_id ),
            kolaborasi_skills ( skill_id ),
            pendaftaran_kolaborasi (
              id,
              kolaborasi_id,
              mahasiswa_id,
              tanggal_daftar,
              status,
              ratings,
              catatan_perusahaan,
              url_portofolio_dokumen,
              mahasiswa_profiles (
                nama_lengkap,
                semester,
                ringkasan_self,
                foto_url,
                reputation_score,
                universitas ( nama_universitas ),
                program_studi ( nama_prodi )
              ),
              riwayat_pengumpulan_kolaborasi (
                id,
                versi,
                url_hasil,
                catatan_mahasiswa,
                evaluasi_perusahaan,
                status_evaluasi,
                created_at
              )
            )
          `)
          .eq("id", id as string)
          .single();

        if (error) {
          console.error("Gagal memuat detail kolaborasi:", error.message);
          return;
        }

        if (row && isMounted) {
          let selectedKategoriIds: number[] = [];
          try {
            const { data: pivotData, error: pivotError } = await supabase
              .from("kolaborasi_kategori_minat")
              .select("kategori_id")
              .eq("kolaborasi_id", id as string);

            if (!pivotError && pivotData && pivotData.length > 0) {
              selectedKategoriIds = pivotData.map((d: any) => d.kategori_id);
            } else {
              if (row.kategori_id) {
                selectedKategoriIds = [row.kategori_id];
              }
            }
          } catch (err) {
            console.error("Gagal kueri kolaborasi_kategori_minat, fallback ke kategori_id:", err);
            if (row.kategori_id) {
              selectedKategoriIds = [row.kategori_id];
            }
          }

          setKolaborasi(row);

          const mappedPelamar: PelamarDetail[] = (row.pendaftaran_kolaborasi || []).map((p: any) => {
            const mProfile = p.mahasiswa_profiles;
            const riwayat = (p.riwayat_pengumpulan_kolaborasi || []).sort(
              (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            const latestSubmission = riwayat[0] || null;

            return {
              id: p.id,
              kolaborasi_id: p.kolaborasi_id,
              mahasiswa_id: p.mahasiswa_id,
              nama_lengkap: mProfile?.nama_lengkap || "Mahasiswa",
              universitas: mProfile?.universitas?.nama_universitas || "Universitas Tidak Diketahui",
              program_studi: mProfile?.program_studi?.nama_prodi || "Program Studi Tidak Diketahui",
              semester: mProfile?.semester || "-",
              ringkasan_self: mProfile?.ringkasan_self || "Tidak ada deskripsi profil.",
              foto_url: mProfile?.foto_url,
              reputation_score: mProfile?.reputation_score || 0,
              tanggal_daftar: p.tanggal_daftar,
              status: p.status,
              ratings: p.ratings != null ? Number(p.ratings) : null,
              catatan_perusahaan: latestSubmission?.evaluasi_perusahaan || p.catatan_perusahaan,
              url_portofolio_dokumen: p.url_portofolio_dokumen,
              url_hasil_kolaborasi: latestSubmission?.url_hasil,
              catatan_hasil_kolaborasi: latestSubmission?.catatan_mahasiswa,
              riwayat_pengumpulan: riwayat,
            };
          });
          setPelamarList(mappedPelamar);

          // Select first pelamar by default if available
          if (mappedPelamar.length > 0 && !selectedPelamar) {
            setSelectedPelamar(mappedPelamar[0]);
          }

          const activeProdis = (row.kolaborasi_target_prodi || []).map((p: any) => p.prodi_id);
          const activeSkills = (row.kolaborasi_skills || []).map((s: any) => s.skill_id);

          setFormData({
            judul: row.judul || "",
            tipe: row.tipe === "Magang" ? "Magang" : "Akademik",
            selectedKategoriIds: selectedKategoriIds,
            lokasi_id: row.lokasi_id || (kotas[0]?.id || 1),
            tingkat_kesulitan: row.tingkat_kesulitan || "Menengah",
            slot: row.slot || 5,
            batas_waktu: row.batas_waktu || "",
            tanggal_selesai: row.tanggal_selesai || "",
            gaji_stipend: row.gaji_stipend || "",
            deskripsi: row.deskripsi || "",
            selectedProdiIds: activeProdis,
            selectedSkillIds: activeSkills,
          });
        }
      } catch (err) {
        console.error("Gagal memuat detail kolaborasi:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    const recommendedKats = recommendKategori(formData.judul, kategoriList);
    setRecKategoriIds(recommendedKats);
  }, [formData.judul, kategoriList]);

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

  const handleUpdateStatus = async (
    pendaftaranId: string,
    newStatus: StatusLamaran,
    catatan?: string
  ) => {
    const isSuccess = await pelamarService.updateStatusPelamar(pendaftaranId, newStatus, catatan);
    if (!isSuccess) {
      setDeleteErrorMsg("Gagal memperbarui status pendaftaran.");
      return;
    }

    // Update local state dulu
    let updatedList = pelamarList.map((p) =>
      p.id === pendaftaranId
        ? { ...p, status: newStatus, catatan_perusahaan: catatan || p.catatan_perusahaan }
        : p
    );
    setPelamarList(updatedList);

    if (selectedPelamar && selectedPelamar.id === pendaftaranId) {
      setSelectedPelamar((prev) =>
        prev ? { ...prev, status: newStatus, catatan_perusahaan: catatan || prev.catatan_perusahaan } : null
      );
    }

    // ===== AUTO-TOLAK SISA PELAMAR KALAU SLOT SUDAH PENUH =====
    if (newStatus === "Diterima" && kolaborasi?.slot) {
      const jumlahDiterima = updatedList.filter((p) => p.status === "Diterima").length;

      if (jumlahDiterima >= kolaborasi.slot) {
        const sisaMenunggu = updatedList.filter((p) => p.status === "Menunggu");

        if (sisaMenunggu.length > 0) {
          const idsToReject = sisaMenunggu.map((p) => p.id);

          const { error: bulkError } = await supabase
            .from("pendaftaran_kolaborasi")
            .update({ status: "Ditolak", updated_at: new Date().toISOString() })
            .in("id", idsToReject);

          if (!bulkError) {
            // Kirim notifikasi ke masing-masing pelamar yang otomatis ditolak
            await Promise.all(
              sisaMenunggu.map((p) =>
                supabase.from("notifikasi").insert({
                  recipient_user_id: p.mahasiswa_id,
                  judul: "Pendaftaran Ditutup",
                  pesan: `Slot untuk proyek "${kolaborasi.judul}" sudah penuh. Pendaftaran ditutup dan pengajuan kamu tidak dapat dilanjutkan.`,
                  is_read: false,
                })
              )
            );

            updatedList = updatedList.map((p) =>
              idsToReject.includes(p.id) ? { ...p, status: "Ditolak" as StatusLamaran } : p
            );
            setPelamarList(updatedList);
          } else {
            console.error("Gagal auto-tolak sisa pelamar:", bulkError.message);
          }
        }
      }
    }

    setSuccessModal({
      isOpen: true,
      title: "Status Diperbarui",
      message: `Status pelamar telah berhasil diubah menjadi: ${newStatus}.`,
    });
  };

  const handleMintaRevisi = async (catatanRevisi?: string) => {
    if (!selectedPelamar) return;
    const catatan = catatanRevisi || evaluasiInput.trim() || "Mohon perbaiki dan lakukan revisi pada hasil karya proyek sesuai catatan perusahaan.";

    setIsSubmittingRevisi(true);

    // 1. Update status to 'Minta Revisi'
    const isSuccess = await pelamarService.updateStatusPelamar(
      selectedPelamar.id,
      "Minta Revisi" as StatusLamaran,
      catatan
    );

    if (isSuccess) {
      // 2. Send notification to student
      await notifikasiService.kirim(
        selectedPelamar.mahasiswa_id,
        "Permintaan Revisi Hasil Kolaborasi",
        `Perusahaan meminta revisi pada pengerjaan proyek "${kolaborasi?.judul || 'Kolaborasi'}". Catatan: ${catatan}`
      );

      // 3. Post a revision message into chat
      if (id && currentUserId) {
        await chatService.kirim(
          id as string,
          selectedPelamar.mahasiswa_id,
          currentUserId,
          "perusahaan",
          `⚠️ [PERMINTAAN REVISI PROYEK]\nCatatan Perusahaan: ${catatan}`
        );
      }

      // 4. Update local state
      setSelectedPelamar((prev) => (prev ? { ...prev, status: "Minta Revisi" as StatusLamaran, catatan_perusahaan: catatan } : null));
      setPelamarList((prev) =>
        prev.map((p) => (p.id === selectedPelamar.id ? { ...p, status: "Minta Revisi" as StatusLamaran, catatan_perusahaan: catatan } : p))
      );

      setSuccessModal({
        isOpen: true,
        title: "Permintaan Revisi Terkirim",
        message: "Status pelamar telah diubah menjadi 'Minta Revisi', dan notifikasi beserta instruksi revisi telah terkirim ke mahasiswa.",
      });
    } else {
      setActionModal({
        isOpen: true,
        title: "Gagal Mengirim Revisi",
        message: "Gagal mengirim permintaan revisi.",
      });
    }

    setIsSubmittingRevisi(false);
  };

  const handleKirimEvaluasi = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedPelamar || !evaluasiInput.trim()) return;

    setIsSubmittingEvaluasi(true);
    const isSuccess = await pelamarService.updateStatusPelamar(
      selectedPelamar.id,
      selectedPelamar.status,
      evaluasiInput
    );
    setIsSubmittingEvaluasi(false);

    if (isSuccess) {
      setSelectedPelamar((prev) => (prev ? { ...prev, catatan_perusahaan: evaluasiInput } : null));
      setPelamarList((prev) =>
        prev.map((p) => (p.id === selectedPelamar.id ? { ...p, catatan_perusahaan: evaluasiInput } : p))
      );
      setSuccessModal({
        isOpen: true,
        title: "Evaluasi Terkirim",
        message: "Evaluasi dan masukan berhasil disimpan untuk mahasiswa ini.",
      });
    } else {
      setActionModal({
        isOpen: true,
        title: "Gagal Menyimpan Evaluasi",
        message: "Gagal menyimpan evaluasi.",
      });
    }
  };

  const handleGiveRating = async (ratingVal: number) => {
    if (!selectedPelamar) return;
    if (selectedPelamar.ratings != null) return; // tidak bisa ubah jika sudah ada rating

    const { error } = await supabase
      .from("pendaftaran_kolaborasi")
      .update({ ratings: ratingVal })
      .eq("id", selectedPelamar.id);

    if (error) {
      setActionModal({
        isOpen: true,
        title: "Gagal Memberikan Rating",
        message: "Terjadi kesalahan saat menyimpan rating: " + error.message,
      });
    } else {
      setSelectedPelamar((prev) => (prev ? { ...prev, ratings: ratingVal } : null));
      setPelamarList((prev) =>
        prev.map((p) => (p.id === selectedPelamar.id ? { ...p, ratings: ratingVal } : p))
      );
      setSuccessModal({
        isOpen: true,
        title: "Rating Berhasil Disimpan",
        message: `Terima kasih! Anda memberikan rating ${ratingVal} bintang untuk hasil pengerjaan mahasiswa ini.`,
      });
    }
  };

  const handleKirimChat = async (e: FormEvent) => {
    e.preventDefault();
    if (!id || !selectedPelamar || !chatInput.trim()) return;

    const pesan = chatInput.trim();
    setChatInput("");
    setIsSendingChat(true);

    // Get current auth user ID if not ready
    let senderId = currentUserId;
    if (!senderId) {
      const { data } = await supabase.auth.getUser();
      senderId = data.user?.id || "";
    }

    if (!senderId) {
      setActionModal({
        isOpen: true,
        title: "Sesi Login Tidak Ditemukan",
        message: "Sesi login pengguna tidak ditemukan. Silakan refresh halaman.",
      });
      setIsSendingChat(false);
      return;
    }

    const newMsg = await chatService.kirim(
      id as string,
      selectedPelamar.mahasiswa_id,
      senderId,
      "perusahaan",
      pesan
    );
    setIsSendingChat(false);

    if (newMsg) {
      setChatMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    }
  };

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (formData.selectedKategoriIds.length === 0) {
      setActionModal({
        isOpen: true,
        title: "Kategori Belum Dipilih",
        message: "Pilih minimal satu Kategori Minat.",
      });
      return;
    }

    const jadwalGajiBerubah =
      kolaborasi &&
      (kolaborasi.batas_waktu !== formData.batas_waktu ||
        kolaborasi.tanggal_selesai !== formData.tanggal_selesai ||
        kolaborasi.gaji_stipend !== formData.gaji_stipend);

    setIsSaving(true);
    const success = await companyServiceExtended.updateFullKolaborasi(id as string, {
      judul: formData.judul,
      tipe: formData.tipe,
      kategori_id: formData.selectedKategoriIds[0] || 1,
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
    });
    setIsSaving(false);

    if (success) {
      if (jadwalGajiBerubah && pelamarList.length > 0) {
        await notifikasiService.kirimKePelamarAktif(
          id as string,
          `Pembaruan Jadwal/Gaji: ${formData.judul}`,
          `Perusahaan telah memperbarui ketentuan kolaborasi. Batas Waktu: ${formData.batas_waktu}, Gaji/Stipend: ${formData.gaji_stipend || 'Sesuai kesepakatan'}.`
        );
      }

      setSuccessModal({
        isOpen: true,
        title: "Perubahan Disimpan",
        message: "Detail kolaborasi telah berhasil diperbarui.",
      });
      const matchedKategoriNames = formData.selectedKategoriIds
        .map(katId => kategoriList.find(k => k.id === katId)?.nama_kategori || "")
        .filter(Boolean)
        .join(", ");

      const matchedKota = kotaList.find((k) => k.id === formData.lokasi_id);

      setKolaborasi((prev: any) => ({
        ...prev,
        judul: formData.judul,
        tipe: formData.tipe,
        deskripsi: formData.deskripsi,
        batas_waktu: formData.batas_waktu,
        tanggal_selesai: formData.tanggal_selesai,
        tingkat_kesulitan: formData.tingkat_kesulitan,
        gaji_stipend: formData.gaji_stipend,
        slot: formData.slot,
        kategori_minat: { nama_kategori: matchedKategoriNames || "Umum" },
        kota: matchedKota ? { nama_kota: matchedKota.nama_kota } : prev.kota,
      }));
    } else {
      setActionModal({
        isOpen: true,
        title: "Gagal Memperbarui",
        message: "Gagal memperbarui kolaborasi. Periksa kembali input Anda.",
      });
    }
  };

  const handleDeleteProyek = async () => {
    if (!id || !kolaborasi) return;

    setIsDeleting(true);
    const isSuccess = await companyService.deleteKolaborasi(id as string);
    setIsDeleting(false);
    setIsDeleteModalOpen(false);

    if (isSuccess) {
      setSuccessModal({
        isOpen: true,
        title: "Proyek Dihapus",
        message: "Proyek kolaborasi berhasil dihapus dari database.",
        redirectOnClose: true,
      });
    } else {
      setActionModal({
        isOpen: true,
        title: "Gagal Menghapus Proyek",
        message: "Gagal menghapus proyek. Periksa kembali hak akses Anda.",
      });
    }
  };

  const [deleteErrorMsg, setDeleteErrorMsg] = useState<string>("");

  const handleRequestDeleteProyek = async () => {
    if (!id) return;
    setIsDeleting(true);
    setDeleteErrorMsg("");

    const result = await deleteRequestService.ajukan(id as string, deleteAlasan, deleteKompensasi, currentUserId);
    setIsDeleting(false);

    if (result.success) {
      setIsDeleteModalOpen(false);
      setSuccessModal({
        isOpen: true,
        title: result.langsungTerhapus ? "Proyek Dihapus" : "Permintaan Terkirim",
        message: result.langsungTerhapus
          ? "Belum ada mahasiswa yang diterima, proyek langsung dihapus."
          : "Permintaan penghapusan dan penawaran kompensasi telah dikirim via chat ke mahasiswa yang diterima. Proyek terhapus otomatis setelah semua menyetujui.",
        redirectOnClose: true,
      });
    } else {
      setDeleteErrorMsg("Gagal mengirim permintaan hapus proyek. Coba lagi.");
    }
  };

  const toggleProdi = (prodiId: number) => {
    setFormData((prev) => {
      const exists = prev.selectedProdiIds.includes(prodiId);
      return {
        ...prev,
        selectedProdiIds: exists
          ? prev.selectedProdiIds.filter((pId) => pId !== prodiId)
          : [...prev.selectedProdiIds, prodiId],
      };
    });
  };

  const toggleSkill = (skillId: number) => {
    setFormData((prev) => {
      const exists = prev.selectedSkillIds.includes(skillId);
      return {
        ...prev,
        selectedSkillIds: exists
          ? prev.selectedSkillIds.filter((sId) => sId !== skillId)
          : [...prev.selectedSkillIds, skillId],
      };
    });
  };

  const toggleKategori = (katId: number) => {
    setFormData((prev) => {
      const exists = prev.selectedKategoriIds.includes(katId);
      return {
        ...prev,
        selectedKategoriIds: exists
          ? prev.selectedKategoriIds.filter((kId) => kId !== katId)
          : [...prev.selectedKategoriIds, katId],
      };
    });
  };

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

  const selectedKotaObj = kotaList.find(k => k.id === formData.lokasi_id);

  const stats = {
    total: pelamarList.length,
    menunggu: pelamarList.filter((p) => p.status === "Menunggu").length,
    diterima: pelamarList.filter((p) => p.status === "Diterima").length,
    ditolak: pelamarList.filter((p) => p.status === "Ditolak").length,
    selesai: pelamarList.filter((p) => p.status === "Selesai").length,
  };

  const hasPelamarAktif = pelamarList.some(
    (p) => p.status === "Diterima" || p.status === "Minta Revisi" || p.status === "Selesai"
  );

  const getKategoriDisplay = () => {
    return kolaborasi?.kategori_minat?.nama_kategori || "Umum";
  };

  const statusSortPriority: Record<string, number> = {
    Diterima: 0,
    "Minta Revisi": 0,
    Selesai: 0,
    Menunggu: 1,
    Ditolak: 2,
  };

  const sortedPelamarList = useMemo(() => {
    return [...pelamarList].sort(
      (a, b) => (statusSortPriority[a.status] ?? 3) - (statusSortPriority[b.status] ?? 3)
    );
  }, [pelamarList]);

  const isSlotPenuh = kolaborasi?.slot
    ? pelamarList.filter((p) => p.status === "Diterima").length >= kolaborasi.slot
    : false;

  return {
    router,
    currentUserId,
    activeTab, setActiveTab,
    isLoading, isSaving, isDeleting,
    kolaborasi, setKolaborasi,
    pelamarList, setPelamarList,
    selectedPelamar, setSelectedPelamar,
    chatMessages, chatInput, setChatInput, isSendingChat, handleKirimChat, unreadCounts,
    evaluasiInput, setEvaluasiInput, isSubmittingEvaluasi, handleKirimEvaluasi, handleGiveRating,
    isSubmittingRevisi, handleMintaRevisi,
    deleteAlasan, setDeleteAlasan,
    deleteKompensasi, setDeleteKompensasi,
    deleteErrorMsg,
    statusVerifikasi, isVerified,
    actionModal, setActionModal,
    successModal, setSuccessModal,
    kategoriList, kotaList, prodiList, skillList,
    recKategoriIds, recProdiIds, recSkillIds,
    top10RecProdiIds, top10RecSkillIds,
    kategoriLimit, setKategoriLimit,
    prodiLimit, setProdiLimit,
    skillLimit, setSkillLimit,
    isKotaModalOpen, setIsKotaModalOpen,
    isProdiModalOpen, setIsProdiModalOpen,
    isSkillModalOpen, setIsSkillModalOpen,
    isKategoriModalOpen, setIsKategoriModalOpen,
    isDeleteModalOpen, setIsDeleteModalOpen,
    kotaSearch, setKotaSearch,
    prodiSearch, setProdiSearch,
    skillSearch, setSkillSearch,
    kategoriSearch, setKategoriSearch,
    isCreatingCustom,
    formData, setFormData,
    handleUpdateStatus,
    handleSaveSettings,
    handleDeleteProyek,
    handleRequestDeleteProyek,
    toggleProdi, toggleSkill, toggleKategori,
    handleAddCustomKategori, handleAddCustomProdi, handleAddCustomSkill,
    visibleKategoris, visibleProdis, visibleSkills,
    sortedKategoris, sortedProdis, sortedSkills,
    searchedKotaOptions, searchedKategoriOptions, isKategoriSearchEmpty,
    searchedProdiOptions, isProdiSearchEmpty,
    searchedSkillOptions, isSkillSearchEmpty,
    selectedKotaObj, stats, hasPelamarAktif, getKategoriDisplay,
    sortedPelamarList, isSlotPenuh
  };
}