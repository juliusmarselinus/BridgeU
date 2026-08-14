import { motion } from "framer-motion";
import { AutoAchievement, TrackerSummary, MahasiswaProfileInfo } from "../types/tracker";

export function TrackerHeader({
  profile,
  summary,
  onGeneratePDF,
}: {
  profile: MahasiswaProfileInfo | null;
  summary: TrackerSummary | null;
  onGeneratePDF?: () => void;
}) {
  return (
    <div
      className="relative overflow-hidden pt-24 pb-20 rounded-b-[40px] text-white shadow-xl"
      style={{
        background: "linear-gradient(135deg, #0b1830 0%, #173b6c 50%, #2e599b 100%)",
      }}
    >
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-bridge-gold/15 blur-2xl pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-sky-200 bg-sky-950/60 px-3.5 py-1 rounded-full border border-sky-400/30">
              <span className="h-1.5 w-1.5 rounded-full bg-bridge-gold animate-pulse" />
              Auto-Generated Student Portfolio Tracker
            </span>

            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Rekam Jejak &amp; Pencapaian Kolaborasi
            </h1>
            <p className="text-xs sm:text-sm text-sky-100/85 max-w-xl leading-relaxed">
              Koleksi otomatis luaran proyek, rating evaluasi mitra perusahaan, serta keahlian yang
              terverifikasi langsung dari riwayat kolaborasi kamu.
            </p>
          </div>

          {/* Quick Metrics Badge & PDF Export */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {summary && (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20">
                <div className="text-center px-3 py-1">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-sky-200">Proyek Selesai</p>
                  <p className="font-display text-2xl sm:text-3xl font-black text-amber-300">
                    {summary.totalCompleted}
                  </p>
                </div>
                <div className="text-center px-3 py-1 border-l border-white/15">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-sky-200">Rata-Rata Rating</p>
                  <p className="font-display text-2xl sm:text-3xl font-black text-emerald-300">
                    {summary.averageRating} <span className="text-sm text-white/80 font-normal">/ 5</span>
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={onGeneratePDF}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-bridge-gold px-5 py-3 font-mono text-xs font-bold text-ink shadow-lg hover:brightness-110 active:scale-95 transition cursor-pointer"
            >
              <svg className="w-4 h-4 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Unduh Portofolio PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AchievementCard({ achievement }: { achievement: AutoAchievement }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-3xl border border-steel/15 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-steel/10 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                achievement.tipe === "Magang"
                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}
            >
              {achievement.tipe}
            </span>
            <span className="font-mono text-[10px] text-steel/70">{achievement.kategori}</span>
            {achievement.verifiedByPerusahaan && (
              <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Terverifikasi Mitra
              </span>
            )}
          </div>

          <h3 className="font-display text-lg font-bold text-ink group-hover:text-primary transition-colors leading-snug">
            {achievement.judulKolaborasi}
          </h3>
          <p className="font-mono text-xs font-semibold text-steel/80 mt-0.5">
            {achievement.perusahaan}
          </p>
        </div>

        {/* Rating Score Badge */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-amber-50 border border-amber-200 px-3 py-1.5 shrink-0 self-start">
          <span className="text-amber-500 text-sm">★</span>
          <span className="font-display text-sm font-bold text-amber-900">
            {achievement.ratingScore}
          </span>
          <span className="font-mono text-[10px] text-amber-700/70">/ 5.0</span>
        </div>
      </div>

      {/* Outcome Summary */}
      <div className="space-y-2 mb-5">
        <p className="font-mono text-[10px] uppercase tracking-wider text-steel/70 font-bold">
          Hasil &amp; Dampak Luaran Proyek (Outcome)
        </p>
        <p className="text-xs text-ink leading-relaxed bg-surface/70 p-3.5 rounded-2xl border border-steel/10">
          {achievement.outcomeSummary}
        </p>
      </div>

      {/* Skills & Date Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-steel/10">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-steel/70 font-bold mb-1.5">
            Keahlian Terasah (Skills Acquired)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {achievement.skillsAcquired.map((skill) => (
              <span
                key={skill}
                className="font-mono text-[11px] font-semibold text-ink bg-paper px-2.5 py-1 rounded-xl border border-steel/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="font-mono text-[10px] text-steel/60">Selesai pada</p>
          <p className="font-mono text-xs font-bold text-ink">{achievement.tanggalSelesai}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function SkillsOverviewCard({ summary }: { summary: TrackerSummary }) {
  return (
    <div className="rounded-3xl border border-steel/15 bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-steel/10 pb-3">
        <h4 className="font-display text-base font-bold text-ink">Ringkasan Keahlian Terverifikasi</h4>
        <span className="font-mono text-xs font-bold text-steel bg-surface px-2.5 py-1 rounded-full">
          {summary.totalSkillsVerified} Total Skill
        </span>
      </div>

      <div className="space-y-3">
        {summary.topSkills.map((sk) => (
          <div key={sk.name} className="space-y-1">
            <div className="flex justify-between font-mono text-xs font-bold text-ink">
              <span>{sk.name}</span>
              <span className="text-steel">{sk.count} Proyek</span>
            </div>
            <div className="h-2 w-full rounded-full bg-steel/10 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${Math.min(sk.count * 33, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
