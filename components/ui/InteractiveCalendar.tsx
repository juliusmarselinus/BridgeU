"use client";

import React, { useState, useMemo } from "react";

export interface CalendarEvent {
  id: string;
  date: string; // ISO YYYY-MM-DD
  title: string;
  type: "deadline" | "completion" | "interview";
  typeLabel: string;
  subtitle?: string;
  link?: string;
}

interface InteractiveCalendarProps {
  events: CalendarEvent[];
  title?: string;
}

export function InteractiveCalendar({ events, title = "Kalender Agenda & Kolaborasi" }: InteractiveCalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const daysOfWeek = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  // Calendar Math
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonthDays = useMemo(() => {
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const result = [];
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      result.push(daysInPrevMonth - i);
    }
    return result;
  }, [year, month, firstDayOfMonth]);

  const monthEventsMap = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((ev) => {
      if (!ev.date) return;
      const dStr = ev.date.slice(0, 10);
      if (!map[dStr]) map[dStr] = [];
      map[dStr].push(ev);
    });
    return map;
  }, [events]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const todayStr = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, []);

  const activeDateStr = selectedDate || todayStr;
  const activeEvents = monthEventsMap[activeDateStr] || [];

  return (
    <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-[6px_6px_18px_rgba(151,184,216,0.25),-6px_-6px_18px_rgba(255,255,255,0.9)] border border-steel/15 font-sans text-ink space-y-4 w-full">
      {/* Header Navigation */}
      <div className="flex items-center justify-between gap-2 border-b border-steel/10 pb-3">
        <div>
          <h2 className="font-display text-sm sm:text-base font-bold text-ink flex items-center gap-1.5">
            <svg className="w-4 h-4 text-ocean" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="font-bold text-ink bg-steel/8 px-2.5 py-1 rounded-lg border border-steel/15">
            {monthNames[month]} {year}
          </span>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="px-2 py-1 rounded-lg border border-steel/20 bg-white hover:bg-steel/5 text-ink transition font-bold"
            >
              &larr;
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="px-2 py-1 rounded-lg border border-steel/20 bg-white hover:bg-steel/5 text-ink transition font-bold"
            >
              &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Grid Legend */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-[9px]">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <span>Start Kolaborasi</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Batas Pelaksanaan</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-sky-500" />
          <span>Wawancara</span>
        </span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px]">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-0.5 font-bold text-steel/70 text-[9.5px]">
            {day}
          </div>
        ))}

        {/* Previous Month Days */}
        {prevMonthDays.map((day, idx) => (
          <div key={`prev-${idx}`} className="h-6 sm:h-7 rounded-lg p-0.5 text-steel/25 bg-steel/5 flex items-center justify-center text-[9px]">
            {day}
          </div>
        ))}

        {/* Current Month Days */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dayNum = idx + 1;
          const dayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
          const dayEvents = monthEventsMap[dayStr] || [];
          const isToday = dayStr === todayStr;
          const isSelected = dayStr === selectedDate;

          const hasDeadline = dayEvents.some((e) => e.type === "deadline");
          const hasInterview = dayEvents.some((e) => e.type === "interview");
          const hasCompletion = dayEvents.some((e) => e.type === "completion");

          return (
            <button
              type="button"
              key={dayStr}
              onClick={() => setSelectedDate(dayStr)}
              className={`h-6 sm:h-7 rounded-lg p-0.5 transition flex flex-col items-center justify-between border ${
                isSelected
                  ? "border-ocean bg-sky/15 ring-1 ring-sky/30 font-bold"
                  : isToday
                  ? "border-bridge-gold bg-amber-50/70 font-bold"
                  : "border-steel/10 bg-white hover:bg-steel/5"
              }`}
            >
              <span className={`text-[9.5px] ${isToday ? "text-amber-900" : isSelected ? "text-ocean" : "text-ink"}`}>
                {dayNum}
              </span>

              <div className="flex items-center gap-0.5 mb-0.5">
                {hasDeadline && <span className="h-1 w-1 rounded-full bg-amber-500" />}
                {hasInterview && <span className="h-1 w-1 rounded-full bg-sky-500" />}
                {hasCompletion && <span className="h-1 w-1 rounded-full bg-emerald-500" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Agenda Detail */}
      <div className="border-t border-steel/10 pt-3 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-ink">
            {new Date(activeDateStr).toLocaleDateString("id-ID", { dateStyle: "medium" })}
          </span>
          <span className="text-[9.5px] text-steel">({activeEvents.length} Agenda)</span>
        </div>

        {activeEvents.length === 0 ? (
          <div className="py-2.5 text-center text-steel text-[10.5px] bg-steel/5 rounded-xl border border-steel/10">
            Tidak ada agenda pada tanggal ini.
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-0.5">
            {activeEvents.map((ev) => {
              const bgClass =
                ev.type === "deadline"
                  ? "bg-amber-50/90 border-amber-200 text-amber-950"
                  : ev.type === "interview"
                  ? "bg-sky/15 border-sky/30 text-ocean"
                  : "bg-emerald-50/90 border-emerald-200 text-emerald-950";

              return (
                <div
                  key={ev.id}
                  className={`p-2.5 rounded-xl border space-y-1.5 transition text-[10.5px] ${bgClass}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-[8.5px] uppercase px-1.5 py-0.5 rounded bg-white/90 shrink-0 border border-black/5">
                      {ev.typeLabel}
                    </span>
                    {ev.link && (
                      <a
                        href={ev.link}
                        target={ev.link.startsWith("http") ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-[9.5px] font-bold text-ocean underline hover:opacity-80 shrink-0"
                      >
                        <span>Buka Detail</span>
                        <span>&rarr;</span>
                      </a>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-[11px] leading-snug text-ink">{ev.title}</h4>
                    {ev.subtitle && (
                      <p className="text-[10px] mt-0.5 opacity-85 leading-tight">{ev.subtitle}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
