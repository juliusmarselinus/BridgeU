// lib/avatar-frames.ts

export type AvatarFrameId =
  | "none"
  | "cyber-neon"
  | "sunset-gradient"
  | "emerald-nature"
  | "sakura-bloom"
  | "academic-scholar"
  | "gold-royal"
  | "fire-flame"
  | "cosmic-galaxy"
  | "cyber-matrix"
  | "diamond-legend"
  | "phoenix-reborn"
  | "celestial-god";

export type FloatingOverlayType =
  | "none"
  | "scholarly-hat"
  | "golden-crown"
  | "orbiting-stars"
  | "floating-sparks"
  | "cyber-orbs"
  | "diamond-glimmer"
  | "phoenix-wings"
  | "celestial-halo";

export type AvatarFrameDef = {
  id: AvatarFrameId;
  name: string;
  description: string;
  rarity: "Basic" | "Rare" | "Epic" | "Legendary" | "Mythic";
  requiredLevel: number;
  tierName: "Novice" | "Rising" | "Pro" | "Master" | "Legend";
  containerClass: string;
  glowClass?: string;
  badgeBg: string;
  floatingOverlay: FloatingOverlayType;
  motifBorder?: string;
  animatedGradient?: boolean;
};

export const AVATAR_FRAMES: AvatarFrameDef[] = [
  {
    id: "none",
    name: "Standar (Tanpa Frame)",
    description: "Tampilan avatar bersih tanpa hiasan bingkai.",
    rarity: "Basic",
    requiredLevel: 1,
    tierName: "Novice",
    containerClass: "ring-4 ring-clouds border-4 border-clouds",
    glowClass: "",
    badgeBg: "bg-slate-100 text-slate-700 border-slate-300",
    floatingOverlay: "none",
  },
  {
    id: "cyber-neon",
    name: "Cyber Neon Glow",
    description: "Bingkai futuristik dengan pendaran neon cyan modern.",
    rarity: "Basic",
    requiredLevel: 2,
    tierName: "Novice",
    containerClass: "ring-4 ring-cyan-400 border-2 border-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.7)] animate-pulse",
    glowClass: "bg-cyan-400/30 blur-md",
    badgeBg: "bg-cyan-100 text-cyan-800 border-cyan-300",
    floatingOverlay: "none",
  },
  {
    id: "sunset-gradient",
    name: "Sunset Gradient",
    description: "Perpaduan warna hangat senja yang anggun dan halus.",
    rarity: "Basic",
    requiredLevel: 3,
    tierName: "Novice",
    containerClass: "p-1.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 rounded-full shadow-[0_0_22px_rgba(244,63,94,0.5)]",
    glowClass: "bg-gradient-to-tr from-amber-500 to-rose-500 blur-md opacity-60",
    badgeBg: "bg-rose-100 text-rose-800 border-rose-300",
    floatingOverlay: "none",
  },
  {
    id: "emerald-nature",
    name: "Emerald Vanguard",
    description: "Cahaya hijau zamrud simbol energi keaktifan dan potensi.",
    rarity: "Rare",
    requiredLevel: 5,
    tierName: "Rising",
    containerClass: "ring-4 ring-emerald-400 border-2 border-emerald-200 shadow-[0_0_22px_rgba(52,211,153,0.6)]",
    glowClass: "bg-emerald-400/30 blur-md",
    badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-300",
    floatingOverlay: "none",
  },
  {
    id: "academic-scholar",
    name: "Academic Scholar",
    description: "Motif kelulusan dengan Ornamen Topi Toga melayang di atas avatar.",
    rarity: "Rare",
    requiredLevel: 6,
    tierName: "Rising",
    containerClass: "ring-4 ring-blue-500 border-2 border-sky-300 shadow-[0_0_22px_rgba(59,130,246,0.6)]",
    glowClass: "bg-blue-400/30 blur-md",
    badgeBg: "bg-blue-100 text-blue-800 border-blue-300",
    floatingOverlay: "scholarly-hat",
    motifBorder: "border-dashed border-sky-400",
  },
  {
    id: "sakura-bloom",
    name: "Sakura Blossom Floating",
    description: "Ornamen kelopak sakura halus dengan pendaran cahaya pastel.",
    rarity: "Rare",
    requiredLevel: 7,
    tierName: "Rising",
    containerClass: "p-1.5 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-500 rounded-full shadow-[0_0_20px_rgba(244,114,182,0.6)]",
    glowClass: "bg-pink-400/30 blur-md",
    badgeBg: "bg-pink-100 text-pink-800 border-pink-300",
    floatingOverlay: "floating-sparks",
  },
  {
    id: "gold-royal",
    name: "Gold Royal Prestige",
    description: "Mahkota Emas Kerajaan SVG melayang presisi untuk talenta Pro berprestasi.",
    rarity: "Epic",
    requiredLevel: 9,
    tierName: "Pro",
    containerClass: "p-1.5 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-600 rounded-full shadow-[0_0_28px_rgba(251,191,36,0.85)] animate-pulse",
    glowClass: "bg-amber-400/40 blur-lg",
    badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
    floatingOverlay: "golden-crown",
  },
  {
    id: "fire-flame",
    name: "Inferno Flame Orbit",
    description: "Cincin api bernapas dengan multi-orbit partikel kosmik berevolusi.",
    rarity: "Epic",
    requiredLevel: 11,
    tierName: "Pro",
    containerClass: "p-2 bg-gradient-to-b from-red-600 via-orange-500 to-amber-400 rounded-full shadow-[0_0_35px_rgba(249,115,22,0.9)] animate-pulse border-2 border-amber-300/80",
    glowClass: "bg-gradient-to-t from-red-600 to-amber-400 blur-xl opacity-80",
    badgeBg: "bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold border-red-300 shadow-sm",
    floatingOverlay: "orbiting-stars",
    motifBorder: "ring-4 ring-orange-500/40 border-dashed border-yellow-200",
    animatedGradient: true,
  },
  {
    id: "cosmic-galaxy",
    name: "Cosmic Nebula Void",
    description: "Aura galaksi void deep space dengan dual-ring orbit & orbs kuantum berpendar.",
    rarity: "Legendary",
    requiredLevel: 13,
    tierName: "Master",
    containerClass: "p-2.5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-full shadow-[0_0_40px_rgba(147,51,234,0.95)] animate-pulse border-2 border-purple-300/80",
    glowClass: "bg-purple-600/60 blur-2xl",
    badgeBg: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold border-purple-300 shadow-sm",
    floatingOverlay: "cyber-orbs",
    motifBorder: "ring-4 ring-purple-500/50 border-double border-indigo-200",
    animatedGradient: true,
  },
  {
    id: "cyber-matrix",
    name: "Cyber Matrix Overdrive",
    description: "Aura sirkuit cyber neon ramping dengan partikel energi berputar 360 derajat presisi.",
    rarity: "Legendary",
    requiredLevel: 15,
    tierName: "Master",
    containerClass: "p-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-400 rounded-full shadow-[0_0_24px_rgba(45,212,191,0.8)] border border-cyan-200/80",
    glowClass: "bg-cyan-400/40 blur-xl",
    badgeBg: "bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold border-cyan-300 shadow-sm",
    floatingOverlay: "floating-sparks",
    motifBorder: "border border-dashed border-cyan-100",
    animatedGradient: true,
  },
  {
    id: "diamond-legend",
    name: "Diamond Mythic Hyperdrive",
    description: "Mahkota kristal berlian murni ramping dengan prisma pendaran berkilauan melayang.",
    rarity: "Mythic",
    requiredLevel: 17,
    tierName: "Legend",
    containerClass: "p-1.5 bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-400 rounded-full shadow-[0_0_28px_rgba(56,189,248,0.9)] border border-white/90",
    glowClass: "bg-sky-300/50 blur-xl",
    badgeBg: "bg-gradient-to-r from-sky-400 to-indigo-500 text-white font-extrabold border-sky-200 shadow-md",
    floatingOverlay: "diamond-glimmer",
    motifBorder: "border border-sky-100",
    animatedGradient: true,
  },
  {
    id: "phoenix-reborn",
    name: "Phoenix Sovereign Reborn",
    description: "Aura Kebangkitan Burung Phoenix Emas Abadi dengan kepakan Sayap Phoenix Berputar.",
    rarity: "Mythic",
    requiredLevel: 19,
    tierName: "Legend",
    containerClass: "p-1.5 bg-gradient-to-r from-amber-400 via-rose-600 to-red-600 rounded-full shadow-[0_0_32px_rgba(244,63,94,0.9)] border border-amber-200/80",
    glowClass: "bg-gradient-to-r from-amber-500 to-rose-600 blur-2xl opacity-80",
    badgeBg: "bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 text-white font-black border-amber-300 shadow-md",
    floatingOverlay: "phoenix-wings",
    motifBorder: "border border-dashed border-amber-300",
    animatedGradient: true,
  },
  {
    id: "celestial-god",
    name: "Celestial Eternity Godlike",
    description: "Takhta Cahaya Keemasan para Dewa melayang dengan Sayap Malaikat Emas berputar 360°.",
    rarity: "Mythic",
    requiredLevel: 20,
    tierName: "Legend",
    containerClass: "p-1.5 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 rounded-full shadow-[0_0_38px_rgba(250,204,21,0.95)] border-2 border-white/90",
    glowClass: "bg-yellow-400/60 blur-2xl",
    badgeBg: "bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-slate-950 font-black border-yellow-200 shadow-lg tracking-wider",
    floatingOverlay: "celestial-halo",
    motifBorder: "border border-yellow-100",
    animatedGradient: true,
  },
];

export const STORAGE_KEY_AVATAR_FRAME = "bridgeu_avatar_frame";

export function getStoredAvatarFrame(): AvatarFrameId {
  if (typeof window === "undefined") return "none";
  const saved = localStorage.getItem(STORAGE_KEY_AVATAR_FRAME) as AvatarFrameId;
  return saved || "none";
}

export function saveStoredAvatarFrame(frameId: AvatarFrameId): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_AVATAR_FRAME, frameId);
}

export function getFrameDefinition(frameId?: string): AvatarFrameDef {
  const found = AVATAR_FRAMES.find((f) => f.id === frameId);
  return found || AVATAR_FRAMES[0];
}
