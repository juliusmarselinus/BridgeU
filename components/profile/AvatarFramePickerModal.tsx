"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  AVATAR_FRAMES,
  AvatarFrameDef,
  AvatarFrameId,
  getFrameDefinition,
} from "@/lib/avatar-frames";
import { FloatingAvatarOverlay } from "./FloatingAvatarOverlay";

function IconSparkles({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z" />
    </svg>
  );
}

function IconLock({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconCheck({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconX({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

interface AvatarFramePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFrameId: AvatarFrameId;
  userLevel: number;
  userPhoto?: string;
  userInisial: string;
  onSelectFrame: (frameId: AvatarFrameId) => void;
}

export function AvatarFramePickerModal({
  isOpen,
  onClose,
  currentFrameId,
  userLevel,
  userPhoto,
  userInisial,
  onSelectFrame,
}: AvatarFramePickerModalProps) {
  if (!isOpen) return null;

  const currentFrameDef = getFrameDefinition(currentFrameId);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-ink/75 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl border border-sky/30 bg-card p-6 sm:p-8 shadow-2xl my-auto max-h-[90vh] flex flex-col"
        >
          {/* Header Modal */}
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky/15 border border-sky/30 text-ocean">
                <IconSparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-ink tracking-tight">Kustomisasi Avatar Frame & Motif Floating</h3>
                <p className="text-xs font-medium text-steel">Buka bingkai eksklusif seiring meningkatnya Level & Tier kamu!</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-clouds text-steel hover:bg-border transition active:scale-95"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>

          {/* Body Section */}
          <div className="mt-5 overflow-y-auto pr-1 space-y-6 flex-1">
            {/* Live Preview Display */}
            <div className="rounded-2xl border border-sky/30 bg-gradient-to-br from-clouds via-card to-sky/5 p-6 flex flex-col sm:flex-row items-center gap-6 justify-between shadow-inner">
              <div className="flex items-center gap-6">
                <div className="relative flex-shrink-0 pt-3">
                  {/* Floating Overlay Component */}
                  <FloatingAvatarOverlay type={currentFrameDef.floatingOverlay} />

                  {/* Glow layer */}
                  {currentFrameDef.glowClass && (
                    <div className={`absolute inset-0 rounded-full ${currentFrameDef.glowClass}`} />
                  )}

                  {/* Frame Container */}
                  <div className={`relative h-28 w-28 overflow-hidden rounded-full transition-all duration-300 ${currentFrameDef.containerClass} ${currentFrameDef.motifBorder || ""}`}>
                    <div className="h-full w-full overflow-hidden rounded-full bg-card">
                      {userPhoto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={userPhoto} alt="Preview Foto" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-display text-3xl font-bold text-steel">
                          {userInisial}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${currentFrameDef.badgeBg}`}>
                      {currentFrameDef.rarity}
                    </span>
                    <span className="rounded-full bg-sky/15 text-ocean border border-sky/30 px-2 py-0.5 text-[10px] font-extrabold">
                      Tier {currentFrameDef.tierName}
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-ink mt-1.5">{currentFrameDef.name}</h4>
                  <p className="text-xs text-steel mt-0.5 max-w-sm leading-relaxed">{currentFrameDef.description}</p>
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-end justify-center shrink-0 border-t sm:border-t-0 sm:border-l border-border/60 pt-4 sm:pt-0 sm:pl-6">
                <span className="text-[11px] font-bold text-steel uppercase tracking-wider">Level Anda</span>
                <span className="text-2xl font-black text-ocean">Lvl {userLevel}</span>
              </div>
            </div>

            {/* Frame Options Grid */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-steel mb-3">Pilihan Bingkai Berjenjang Level</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {AVATAR_FRAMES.map((frame: AvatarFrameDef) => {
                  const isLocked = userLevel < frame.requiredLevel;
                  const isSelected = currentFrameId === frame.id;

                  return (
                    <button
                      key={frame.id}
                      type="button"
                      disabled={isLocked}
                      onClick={() => !isLocked && onSelectFrame(frame.id)}
                      className={`relative flex flex-col items-center p-4 rounded-2xl border text-left transition-all duration-200 ${
                        isSelected
                          ? "border-sky-500 bg-sky/10 ring-2 ring-sky/40 shadow-md"
                          : isLocked
                          ? "border-border/60 bg-clouds/40 opacity-60 cursor-not-allowed"
                          : "border-border/80 bg-card hover:border-sky/40 hover:bg-clouds/50 active:scale-[0.98]"
                      }`}
                    >
                      {/* Badge terpasang */}
                      {isSelected && (
                        <span className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-sky text-ink shadow-sm z-40">
                          <IconCheck className="h-3.5 w-3.5 text-white" />
                        </span>
                      )}

                      {/* Small Avatar Preview with Frame */}
                      <div className="relative my-3 pt-2">
                        <FloatingAvatarOverlay type={frame.floatingOverlay} />
                        {frame.glowClass && <div className={`absolute inset-0 rounded-full ${frame.glowClass}`} />}
                        <div className={`relative h-16 w-16 overflow-hidden rounded-full transition-transform ${frame.containerClass} ${frame.motifBorder || ""}`}>
                          <div className="h-full w-full overflow-hidden rounded-full bg-card">
                            {userPhoto ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={userPhoto} alt="Mini preview" className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center font-display text-xl font-bold text-steel">
                                {userInisial}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 text-center w-full">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <span className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${frame.badgeBg}`}>
                            {frame.rarity}
                          </span>
                          <span className="text-[9px] font-bold text-steel bg-clouds border border-border px-1.5 py-0.5 rounded-md">
                            Lvl {frame.requiredLevel}+
                          </span>
                        </div>

                        <h5 className="text-xs font-bold text-ink truncate w-full">{frame.name}</h5>

                        <p className="mt-1 text-[10px] text-steel line-clamp-2 leading-relaxed">{frame.description}</p>

                        <div className="mt-2 text-left rounded-xl bg-surface/80 p-2 border border-border/50">
                          <p className="font-mono text-[9px] font-bold text-ocean uppercase tracking-wider">Cara Mencapai:</p>
                          <p className="font-mono text-[10px] text-steel/90 leading-snug mt-0.5">{frame.howToAchieve}</p>
                        </div>

                        {isLocked && (
                          <div className="mt-2 flex items-center justify-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-200 rounded-lg py-1">
                            <IconLock className="w-3 h-3" /> Butuh Level {frame.requiredLevel} ({frame.tierName})
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="mt-6 border-t border-border/60 pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-ink px-6 py-2.5 text-xs font-bold text-paper shadow-md transition hover:bg-ink/90 active:scale-95"
            >
              Selesai & Simpan
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
