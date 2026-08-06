const steps = [
  { title: "Cari", desc: "Temukan perusahaan & peluang sesuai minat" },
  { title: "Ajukan", desc: "Kirim permintaan kolaborasi langsung" },
  { title: "Kolaborasi", desc: "Kerjakan studi kasus bersama perusahaan" },
  { title: "Portofolio", desc: "Rekam jejak otomatis tersimpan" },
];

export function ProcessStrip() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
      {steps.map((s, i) => (
        <div key={s.title} className="relative">
          {i < steps.length - 1 && (
            <div className="absolute right-[-14px] top-2 hidden h-px w-6 bg-steel/25 sm:block" />
          )}
          <span className="font-mono text-xs text-bridge-gold">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-2 font-display text-base font-semibold text-ink">
            {s.title}
          </h3>
          <p className="mt-1 text-sm text-steel">{s.desc}</p>
        </div>
      ))}
    </div>
  );
}