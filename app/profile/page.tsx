"use client";

import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { allCategoriesList, allSkillsList } from "@/lib/dummy-data";

type StoredUser = {
  nama: string;
  email: string;
  universitas?: string;
  prodi?: string;
  semester?: string;
  minatKategori?: string[];
  skills?: string[];
  preferensiTipe?: string;
  preferensiLokasi?: string;
  ringkasan?: string;
  foto?: string; // base64 data URL, hasil crop bulat
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/* ------------------------------------------------------------------ */
/* Modal: Edit Photo (zoom + rotate, output = square canvas data URL) */
/* ------------------------------------------------------------------ */

function EditPhotoModal({
  imageSrc,
  onClose,
  onSave,
}: {
  imageSrc: string;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
}) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragState = useRef<{ dragging: boolean; startX: number; startY: number; origX: number; origY: number }>({
    dragging: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
  });

  const imgRef = useRef<HTMLImageElement>(null);
  const PREVIEW_SIZE = 260;

  const handlePointerDown = (e: React.PointerEvent) => {
    dragState.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: offset.x,
      origY: offset.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setOffset({ x: dragState.current.origX + dx, y: dragState.current.origY + dy });
  };

  const handlePointerUp = () => {
    dragState.current.dragging = false;
  };

  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  const handleSave = () => {
    const img = imgRef.current;
    if (!img) return;

    const OUTPUT = 400;
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.beginPath();
    ctx.arc(OUTPUT / 2, OUTPUT / 2, OUTPUT / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const scaleRatio = OUTPUT / PREVIEW_SIZE;
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;

    const baseScale = Math.max(PREVIEW_SIZE / naturalW, PREVIEW_SIZE / naturalH);
    const appliedScale = baseScale * (zoom / 100);

    const drawW = naturalW * appliedScale * scaleRatio;
    const drawH = naturalH * appliedScale * scaleRatio;

    ctx.translate(OUTPUT / 2 + offset.x * scaleRatio, OUTPUT / 2 + offset.y * scaleRatio);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    onSave(canvas.toDataURL("image/png"));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-[0_12px_40px_-8px_rgba(27,39,64,0.35)]">
        <div className="flex items-center justify-between border-b border-steel/10 px-5 py-4">
          <h3 className="font-display text-base font-semibold text-ink">
            Edit Photo
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-7 w-7 items-center justify-center rounded-full text-steel transition hover:bg-steel/10"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col items-center gap-6 px-5 py-7">
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="relative overflow-hidden rounded-full border border-steel/15 bg-ink/5 shadow-inner"
            style={{
              width: PREVIEW_SIZE,
              height: PREVIEW_SIZE,
              cursor: dragState.current.dragging ? "grabbing" : "grab",
              touchAction: "none",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Preview foto"
              draggable={false}
              className="absolute left-1/2 top-1/2 max-w-none select-none"
              style={{
                transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom / 100})`,
                width: "auto",
                height: PREVIEW_SIZE,
                objectFit: "cover",
              }}
              onLoad={(e) => {
                const el = e.currentTarget;
                const ratio = el.naturalWidth / el.naturalHeight;
                if (ratio >= 1) {
                  el.style.height = `${PREVIEW_SIZE}px`;
                  el.style.width = "auto";
                } else {
                  el.style.width = `${PREVIEW_SIZE}px`;
                  el.style.height = "auto";
                }
              }}
            />
          </div>

          <div className="flex w-full items-center gap-3">
            <span className="font-mono text-xs text-steel">−</span>
            <input
              type="range"
              min={50}
              max={200}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-steel/20 accent-ink"
            />
            <span className="font-mono text-xs text-steel">+</span>
            <span className="w-10 shrink-0 text-right font-mono text-xs text-steel">
              {zoom}%
            </span>
          </div>

          <div className="flex w-full items-center justify-between">
            <button
              type="button"
              onClick={handleRotate}
              aria-label="Putar gambar"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-steel/25 text-steel transition hover:bg-steel/10"
            >
              ↻
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-steel/25 px-5 py-2.5 font-mono text-xs font-medium text-steel transition hover:bg-steel/10"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-full bg-ink px-5 py-2.5 font-mono text-xs font-medium text-paper transition hover:bg-steel"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Profile Page                                                  */
/* ------------------------------------------------------------------ */

export default function ProfilePage() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [saved, setSaved] = useState(false);
  const [fileError, setFileError] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const fotoInputRef = useRef<HTMLInputElement>(null);

  // form state
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [universitas, setUniversitas] = useState("");
  const [prodi, setProdi] = useState("");
  const [semester, setSemester] = useState("");
  const [preferensiTipe, setPreferensiTipe] = useState("Semua");
  const [preferensiLokasi, setPreferensiLokasi] = useState("Remote");
  const [ringkasan, setRingkasan] = useState("");
  const [foto, setFoto] = useState("");
  const [minatKategori, setMinatKategori] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("bridgeu_user");
    if (stored) {
      const parsed: StoredUser = JSON.parse(stored);
      setUser(parsed);
      setNama(parsed.nama || "");
      setEmail(parsed.email || "");
      setUniversitas(parsed.universitas || "");
      setProdi(parsed.prodi || "");
      setSemester(parsed.semester || "");
      setPreferensiTipe(parsed.preferensiTipe || "Semua");
      setPreferensiLokasi(parsed.preferensiLokasi || "Remote");
      setRingkasan(parsed.ringkasan || "");
      setFoto(parsed.foto || "");
      setMinatKategori(parsed.minatKategori || []);
      setSkills(parsed.skills || []);
    }
  }, []);

  const toggleMinat = (m: string) => {
    setMinatKategori((prev) =>
      prev.includes(m) ? prev.filter((item) => item !== m) : [...prev, m]
    );
  };

  const toggleSkill = (s: string) => {
    setSkills((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const readFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFileError("File harus berupa gambar (JPG, PNG, dll).");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError("Ukuran gambar maksimal 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPendingImage(reader.result as string);
    reader.onerror = () => setFileError("Gagal membaca file gambar.");
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleModalSave = (dataUrl: string) => {
    setFoto(dataUrl);
    setPendingImage(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StoredUser = {
      ...user,
      nama,
      email,
      universitas,
      prodi,
      semester,
      preferensiTipe,
      preferensiLokasi,
      ringkasan,
      foto,
      minatKategori,
      skills,
    } as StoredUser;
    localStorage.setItem("bridgeu_user", JSON.stringify(updated));
    window.dispatchEvent(new Event("bridgeu_user_updated"));
    setUser(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!user) {
    return (
      <main>
        <Navbar />
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="text-sm text-steel">
            Kamu belum masuk. Silakan masuk terlebih dahulu untuk melihat
            profil.
          </p>
        </div>
      </main>
    );
  }

  const inisial = nama ? nama.trim().charAt(0).toUpperCase() : "?";

  return (
    <main>
      <Navbar />

      {pendingImage && (
        <EditPhotoModal
          imageSrc={pendingImage}
          onClose={() => setPendingImage(null)}
          onSave={handleModalSave}
        />
      )}

      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Profil Saya
        </h1>
        <p className="mt-2 text-sm text-steel">
          Kelola data pribadi dan preferensi kolaborasi kamu.
        </p>

        {saved && (
          <div className="mt-6 rounded-xl border border-verified/30 bg-verified/10 px-5 py-3 text-sm text-verified">
            Perubahan berhasil disimpan.
          </div>
        )}
        {fileError && (
          <div className="mt-6 rounded-xl border border-red-300 bg-red-50 px-5 py-3 text-sm text-red-600">
            {fileError}
          </div>
        )}

        <form
          onSubmit={handleSave}
          className="mt-8 overflow-hidden rounded-2xl bg-[#FAF7EE] shadow-[0_4px_6px_-1px_rgba(27,39,64,0.1),0_12px_28px_-6px_rgba(27,39,64,0.15)]"
        >
          {/* Header: foto kiri, info tengah */}
          <div className="flex flex-col items-center gap-6 border-b border-steel/10 px-7 py-8 sm:flex-row sm:items-center">
            <div className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-32">
              <div className="h-full w-full overflow-hidden rounded-full border-4 border-white bg-ink/5 shadow-md">
                {foto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={foto}
                    alt="Foto profil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-display text-3xl font-semibold text-steel">
                    {inisial}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fotoInputRef.current?.click()}
                aria-label="Edit foto profil"
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-ink text-paper shadow transition hover:bg-steel"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                </svg>
              </button>
              <input
                ref={fotoInputRef}
                type="file"
                accept="image/*"
                onChange={readFile}
                className="hidden"
              />
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h2 className="font-display text-xl font-semibold text-ink">
                {nama || "Nama Kamu"}
              </h2>
              <p className="mt-0.5 text-sm text-steel">
                {email || "email@kamu.com"}
              </p>
              {(prodi || universitas) && (
                <p className="mt-1 font-mono text-xs text-steel/80">
                  {[prodi, universitas].filter(Boolean).join(" · ")}
                </p>
              )}

              <div className="mt-3 flex flex-wrap justify-center gap-1.5 sm:justify-start">
                {minatKategori.slice(0, 3).map((m) => (
                  <span
                    key={m}
                    className="rounded-full bg-ink/5 px-2.5 py-1 font-mono text-[11px] text-ink"
                  >
                    {m}
                  </span>
                ))}
                {minatKategori.length > 3 && (
                  <span className="rounded-full bg-ink/5 px-2.5 py-1 font-mono text-[11px] text-steel">
                    +{minatKategori.length - 3} lainnya
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="px-7 py-7">
            <h3 className="font-display text-base font-semibold text-ink">
              Informasi Akun
            </h3>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="font-mono text-xs uppercase tracking-wide text-steel">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-steel/25 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink"
                />
              </div>
              <div>
                <label className="font-mono text-xs uppercase tracking-wide text-steel">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-steel/25 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink"
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <label className="font-mono text-xs uppercase tracking-wide text-steel">
                  Universitas
                </label>
                <input
                  type="text"
                  value={universitas}
                  onChange={(e) => setUniversitas(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-steel/25 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink"
                />
              </div>
              <div>
                <label className="font-mono text-xs uppercase tracking-wide text-steel">
                  Program Studi
                </label>
                <input
                  type="text"
                  value={prodi}
                  onChange={(e) => setProdi(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-steel/25 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink"
                />
              </div>
              <div>
                <label className="font-mono text-xs uppercase tracking-wide text-steel">
                  Semester
                </label>
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-steel/25 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink"
                />
              </div>
            </div>

            {/* Kategori Minat — sekarang bisa diedit */}
            <div className="mt-6 border-t border-steel/10 pt-6">
              <label className="block font-mono text-xs uppercase tracking-wide text-steel">
                Kategori Proyek Minat
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {allCategoriesList.map((m) => {
                  const selected = minatKategori.includes(m);
                  return (
                    <button
                      type="button"
                      key={m}
                      onClick={() => toggleMinat(m)}
                      className={`rounded-full px-3.5 py-1.5 font-mono text-xs font-medium transition ${
                        selected
                          ? "bg-ink text-paper shadow-sm"
                          : "border border-steel/25 bg-white text-steel hover:border-ink"
                      }`}
                    >
                      {selected ? "✓ " : "+ "}
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Skill & Tools — sekarang bisa diedit */}
            <div className="mt-6">
              <label className="block font-mono text-xs uppercase tracking-wide text-steel">
                Skill &amp; Tools
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {allSkillsList.map((s) => {
                  const selected = skills.includes(s);
                  return (
                    <button
                      type="button"
                      key={s}
                      onClick={() => toggleSkill(s)}
                      className={`rounded-full px-3 py-1.5 font-mono text-xs transition ${
                        selected
                          ? "bg-bridge-gold font-bold text-ink shadow-sm"
                          : "border border-steel/20 bg-white/60 text-steel hover:border-ink"
                      }`}
                    >
                      {selected ? "✓ " : "# "}
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="font-mono text-xs uppercase tracking-wide text-steel">
                  Preferensi Tipe Kolaborasi
                </label>
                <select
                  value={preferensiTipe}
                  onChange={(e) => setPreferensiTipe(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-steel/25 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink"
                >
                  <option value="Semua">Semua</option>
                  <option value="Akademik">Hanya Studi Kasus / Riset</option>
                  <option value="Magang">Hanya Magang</option>
                </select>
              </div>
              <div>
                <label className="font-mono text-xs uppercase tracking-wide text-steel">
                  Preferensi Sistem Kerja
                </label>
                <select
                  value={preferensiLokasi}
                  onChange={(e) => setPreferensiLokasi(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-steel/25 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label className="font-mono text-xs uppercase tracking-wide text-steel">
                Ringkasan Pengalaman &amp; Motivasi
              </label>
              <textarea
                rows={3}
                value={ringkasan}
                onChange={(e) => setRingkasan(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-steel/25 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink"
              />
            </div>

            <button
              type="submit"
              className="mt-7 rounded-full bg-ink px-6 py-3 font-mono text-sm font-medium text-paper transition hover:bg-steel"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}