"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCompanyDashboard } from "../dashboard/hooks/useCompanyDashboard";
import { chatService, InboxThread } from "../kolaborasi/baru/services/chatService";

export default function PesanMasukPage() {
  const { company, isLoading: isLoadingCompany } = useCompanyDashboard();
  const [threads, setThreads] = useState<InboxThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!company?.user_id) return;

    let isMounted = true;

    async function loadInbox() {
      setIsLoading(true);
      const data = await chatService.fetchInboxList(company!.user_id);
      if (isMounted) {
        setThreads(data);
        setIsLoading(false);
      }
    }

    loadInbox();
    const interval = setInterval(loadInbox, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [company?.user_id]);

  if (isLoadingCompany || isLoading) {
    return (
      <main className="mx-auto max-w-4xl px-4 sm:px-6 pt-28 pb-16">
        <div className="flex h-64 items-center justify-center font-mono text-xs text-steel">
          Memuat pesan masuk...
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 pt-28 pb-16">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-ink">Pesan Masuk</h1>
        <p className="font-mono text-xs text-steel mt-1">
          Semua percakapan dari mahasiswa di seluruh proyek kolaborasi Anda
        </p>
      </div>

      {threads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-steel/20 bg-white p-10 text-center font-mono text-xs text-steel">
          Belum ada percakapan masuk.
        </div>
      ) : (
        <div className="space-y-2.5">
          {threads.map((thread, index) => (
            <Link
              key={`${thread.kolaborasi_id}-${thread.mahasiswa_id}`}
              href={`/perusahaan/kolaborasi/${thread.kolaborasi_id}?tab=workspace&mahasiswa=${thread.mahasiswa_id}`}
              className="animate-card-in flex items-center gap-4 rounded-2xl bg-white border border-steel/10 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              style={{ animationDelay: `${Math.min(index * 50, 350)}ms` }}
            >
              <div className="relative h-11 w-11 shrink-0 rounded-full bg-bridge-gold/15 border border-bridge-gold/30 flex items-center justify-center font-display font-bold text-ink overflow-hidden text-sm">
                {thread.foto_mahasiswa ? (
                  <img src={thread.foto_mahasiswa} alt={thread.nama_mahasiswa} className="h-full w-full object-cover" />
                ) : (
                  thread.nama_mahasiswa.charAt(0).toUpperCase()
                )}
                {thread.unread_count > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 ring-2 ring-white">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`font-display text-sm truncate ${thread.unread_count > 0 ? "font-bold text-ink" : "font-semibold text-ink/80"}`}>
                    {thread.nama_mahasiswa}
                  </p>
                  <span className="font-mono text-[10px] text-steel/60 shrink-0">
                    {new Date(thread.last_message_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                  </span>
                </div>
                <p className="font-mono text-[10px] text-bridge-gold font-semibold truncate mt-0.5">
                  {thread.kolaborasi_judul}
                </p>
                <p className={`text-xs truncate mt-1 ${thread.unread_count > 0 ? "text-ink font-medium" : "text-steel"}`}>
                  {thread.last_sender === "perusahaan" ? "Anda: " : ""}
                  {thread.last_message}
                </p>
              </div>

              {thread.unread_count > 0 && (
                <span className="shrink-0 inline-flex items-center justify-center h-5 min-w-5 rounded-full bg-red-500 text-white text-[10px] font-bold px-1.5">
                  {thread.unread_count > 9 ? "9+" : thread.unread_count}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}