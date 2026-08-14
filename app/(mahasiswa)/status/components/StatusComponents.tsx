import Link from "next/link";
import { STAGES } from "../types/status";

export function StageTracker({ stage, rejected }: { stage: number; rejected: boolean }) {
  return (
    <div className="w-full">
      <div className="flex items-center">
        {STAGES.map((_, i) => {
          const isLast = i === STAGES.length - 1;
          const isRejectedHere = rejected && i === stage;
          const isFinished = !rejected && stage === STAGES.length - 1 && i === STAGES.length - 1;
          const passed = rejected ? i < stage : i < stage;
          const current = !rejected && i === stage && !isFinished;

          let dot: React.ReactNode;
          if (isRejectedHere) {
            dot = (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-white text-[8px] font-bold shrink-0">
                ✕
              </span>
            );
          } else if (isFinished) {
            dot = (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white text-[8px] font-bold shrink-0">
                ✓
              </span>
            );
          } else if (passed) {
            dot = (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ink text-white text-[8px] font-bold shrink-0">
                ✓
              </span>
            );
          } else if (current) {
            dot = (
              <span className="h-4 w-4 rounded-full border-2 border-ink bg-white shrink-0 flex items-center justify-center">
                <span className="h-1.5 w-1.5 rounded-full bg-ink animate-pulse" />
              </span>
            );
          } else {
            dot = <span className="h-3 w-3 rounded-full border border-steel/30 bg-steel/10 shrink-0" />;
          }

          let barClass = "bg-steel/20";
          if (passed || (isFinished && !isLast)) {
            barClass = "bg-ink";
          } else if (rejected && i < stage) {
            barClass = "bg-ink";
          }

          return (
            <div key={i} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
              {dot}
              {!isLast && <div className={`h-0.5 flex-1 mx-1 rounded-full ${barClass}`} />}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-1.5 font-mono text-[9px] text-steel/70">
        {STAGES.map((s, i) => (
          <span key={s} className={i === stage ? "font-bold text-ink" : ""}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export function StatusCardSkeleton() {
  return (
    <div className="rounded-[28px_28px_28px_4px] border border-steel/10 bg-white p-5 animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-steel/10 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-2.5 w-24 bg-steel/10 rounded" />
          <div className="h-4 w-40 bg-steel/10 rounded" />
        </div>
      </div>
      <div className="h-3 w-full bg-steel/10 rounded" />
      <div className="h-8 w-full bg-steel/10 rounded-full" />
    </div>
  );
}

export function AddOpportunityCard() {
  return (
    <Link
      href="/kolaborasi"
      className="group flex flex-col items-center justify-center rounded-[28px_28px_28px_4px] border-2 border-dashed border-steel/30 bg-white p-5 min-h-[280px] text-center shadow-sm hover:shadow-md hover:border-[#375898] transition"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper group-hover:bg-[#375898] transition text-xl font-bold mb-3">
        +
      </span>
      <p className="font-display text-sm font-bold text-ink">Cari Peluang Baru</p>
      <p className="text-[11px] text-steel mt-1 max-w-[180px]">
        Jelajahi kolaborasi Akademik &amp; Magang lain yang cocok buat kamu.
      </p>
    </Link>
  );
}
