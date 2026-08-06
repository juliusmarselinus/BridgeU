export function BridgeDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-px w-full bg-steel/20 ${className}`}>
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-bridge-gold"
            style={{ opacity: 1 - i * 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}