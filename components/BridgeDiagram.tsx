export function BridgeDiagram() {
  return (
    <svg
      viewBox="0 0 440 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-md"
    >
      {/* garis dasar / deck jembatan */}
      <path
        d="M40 220 Q220 160 400 220"
        stroke="var(--color-steel)"
        strokeOpacity="0.35"
        strokeWidth="1"
      />

      {/* kabel-kabel penyangga */}
      {[80, 140, 200, 260, 320, 360].map((x, i) => (
        <line
          key={x}
          x1={x}
          y1={220 - Math.sin(((x - 40) / 360) * Math.PI) * 62}
          x2={x}
          y2={220 - Math.sin(((x - 40) / 360) * Math.PI) * 40}
          stroke="var(--color-steel)"
          strokeOpacity="0.25"
          strokeWidth="1"
        />
      ))}

      {/* menara kiri */}
      <line
        x1="40"
        y1="60"
        x2="40"
        y2="220"
        stroke="var(--color-ink)"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      {/* menara kanan */}
      <line
        x1="400"
        y1="60"
        x2="400"
        y2="220"
        stroke="var(--color-ink)"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />

      {/* node mahasiswa */}
      <circle cx="40" cy="60" r="7" fill="var(--color-ink)" />
      <circle
        cx="40"
        cy="60"
        r="14"
        stroke="var(--color-ink)"
        strokeOpacity="0.25"
        strokeWidth="1"
      />
      <text
        x="40"
        y="36"
        textAnchor="middle"
        className="fill-ink font-mono text-[11px] uppercase tracking-wide"
      >
        Mahasiswa
      </text>

      {/* node perusahaan */}
      <circle cx="400" cy="60" r="7" fill="var(--color-bridge-gold)" />
      <circle
        cx="400"
        cy="60"
        r="14"
        stroke="var(--color-bridge-gold)"
        strokeOpacity="0.3"
        strokeWidth="1"
      />
      <text
        x="400"
        y="36"
        textAnchor="middle"
        className="fill-ink font-mono text-[11px] uppercase tracking-wide"
      >
        Perusahaan
      </text>

      {/* titik-titik "koneksi aktif" mengalir di sepanjang deck */}
      {[100, 175, 220, 265, 340].map((x, i) => (
        <circle
          key={x}
          cx={x}
          cy={220 - Math.sin(((x - 40) / 360) * Math.PI) * 62 + 12}
          r={i === 2 ? 3 : 2}
          fill="var(--color-bridge-gold)"
          fillOpacity={i === 2 ? 0.9 : 0.4}
        />
      ))}
    </svg>
  );
}