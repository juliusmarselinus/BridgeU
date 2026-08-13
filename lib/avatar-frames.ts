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
    description: "Gelombang api berkobar dengan partikel orbit melayang mengelilingi avatar.",
    rarity: "Epic",
    requiredLevel: 11,
    tierName: "Pro",
    containerClass: "p-1.5 bg-gradient-to-b from-red-500 via-orange-500 to-yellow-400 rounded-full shadow-[0_0_25px_rgba(239,68,68,0.8)]",
    glowClass: "bg-orange-500/40 blur-lg",
    badgeBg: "bg-orange-100 text-orange-900 border-orange-300",
    floatingOverlay: "orbiting-stars",
  },
  {
    id: "cosmic-galaxy",
    name: "Cosmic Nebula Orbs",
    description: "Aura kosmik luar angkasa dengan floating cyber-orbs misterius berpendar.",
    rarity: "Legendary",
    requiredLevel: 13,
    tierName: "Master",
    containerClass: "p-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.85)] animate-pulse",
    glowClass: "bg-purple-500/40 blur-xl",
    badgeBg: "bg-purple-100 text-purple-900 border-purple-300",
    floatingOverlay: "cyber-orbs",
  },
  {
    id: "cyber-matrix",
    name: "Cyber Matrix Floating",
    description: "Motif garis sirkuit digital dengan partikel neon cyan yang bergerak.",
    rarity: "Legendary",
    requiredLevel: 15,
    tierName: "Master",
    containerClass: "p-1.5 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-500 rounded-full shadow-[0_0_32px_rgba(20,184,166,0.9)] animate-pulse",
    glowClass: "bg-teal-400/40 blur-xl",
    badgeBg: "bg-teal-100 text-teal-900 border-teal-300",
    floatingOverlay: "floating-sparks",
    motifBorder: "border-2 border-dashed border-teal-200",
  },
  {
    id: "diamond-legend",
    name: "Diamond Mythic",
    description: "Kristal berlian murni berkilauan dengan pendaran berlian SVG melayang.",
    rarity: "Mythic",
    requiredLevel: 17,
    tierName: "Legend",
    containerClass: "p-1.5 bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-400 rounded-full shadow-[0_0_35px_rgba(56,189,248,0.9)] animate-pulse",
    glowClass: "bg-sky-300/50 blur-xl",
    badgeBg: "bg-sky-100 text-sky-900 border-sky-300",
    floatingOverlay: "diamond-glimmer",
  },
  {
    id: "phoenix-reborn",
    name: "Phoenix Wings Mythic",
    description: "Ornamen Sayap Burung Phoenix berkibar melayang membungkus avatar.",
    rarity: "Mythic",
    requiredLevel: 19,
    tierName: "Legend",
    containerClass: "p-2 bg-gradient-to-r from-amber-500 via-rose-600 to-orange-500 rounded-full shadow-[0_0_40px_rgba(244,63,94,0.95)] animate-pulse",
    glowClass: "bg-rose-500/50 blur-2xl",
    badgeBg: "bg-rose-100 text-rose-900 border-rose-300",
    floatingOverlay: "phoenix-wings",
  },
  {
    id: "celestial-god",
    name: "Celestial Halo Godlike",
    description: "Halo Cahaya Keemasan melayang di atas avatar. Tingkat pencapaian tertinggi di BridgeU!",
    rarity: "Mythic",
    requiredLevel: 20,
    tierName: "Legend",
    containerClass: "p-2 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 rounded-full shadow-[0_0_45px_rgba(234,179,8,1)] animate-pulse",
    glowClass: "bg-yellow-400/60 blur-2xl",
    badgeBg: "bg-yellow-100 text-yellow-950 border-yellow-400 font-black",
    floatingOverlay: "celestial-halo",
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
