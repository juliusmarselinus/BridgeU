import { ScrollReveal } from "@/components/ScrollReveal";

const programs = [
  {
    title: "Studi Kasus & Riset",
    desc:
      "Lebih dari 30 peluang kolaborasi tersedia lintas bidang: Teknologi, Bisnis, Desain, hingga Riset Sosial. Beberapa studi kasus datang langsung dari tantangan nyata yang dihadapi perusahaan mitra.",
  },
  {
    title: "Program Magang",
    desc:
      "Salah satu prioritas kami adalah membuka akses magang yang adil bagi seluruh mahasiswa/i, tanpa bergantung pada koneksi pribadi. Rekam jejak kolaborasi akademikmu menjadi bekal utama untuk direkomendasikan perusahaan.",
  },
  {
    title: "Program Lanjutan",
    desc:
      "Pertumbuhan literasi teknologi dan fleksibilitas akademik menjadi kebutuhan mahasiswa masa kini. BridgeU terus membuka jenis kolaborasi baru mengikuti kebutuhan industri yang terus berkembang.",
  },
];

export function ProgramsSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <ScrollReveal>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          Peluang Kolaborasi
        </p>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-text-primary sm:text-4xl">
          Kolaborasi Akademik Gaya Baru di BridgeU
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <p className="mt-5 max-w-xl text-base text-text-secondary">
          BridgeU menghubungkan mahasiswa/i dengan perusahaan terverifikasi
          lintas bidang studi dan industri — menciptakan ruang yang tepat
          untuk belajar sekaligus berkontribusi nyata.
        </p>
      </ScrollReveal>

      <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
        {programs.map((p, i) => (
          <ScrollReveal key={p.title} delay={i * 150}>
            <div className="rounded-2xl border border-border bg-card p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <h3 className="font-display text-lg font-semibold text-text-primary">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {p.desc}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}