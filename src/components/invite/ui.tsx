// src/components/invite/ui.tsx

export function BirthdaySparkle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 32"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M32 5v22" />
      <path d="M21 16h22" />
      <path d="M24 8 40 24" />
      <path d="M40 8 24 24" />
      <circle cx="12" cy="16" r="4" />
      <circle cx="52" cy="16" r="4" />
    </svg>
  );
}

export function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <span className="divider-gold" />
      <svg width="10" height="10" viewBox="0 0 10 10" className="text-gold">
        <circle cx="5" cy="5" r="2" fill="currentColor" />
      </svg>
      <span className="divider-gold" />
    </div>
  );
}

export function PaperPlane({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
    </svg>
  );
}

export function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4 bg-white backdrop-blur-sm border border-white/30 rounded-2xl p-5 md:p-10">
      <div className="w-10 h-10 rounded-full gradient-gold text-white flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="label-caps text-muted-foreground">{label}</p>
        <p className="font-serif text-lg mt-1">{value}</p>
      </div>
    </div>
  );
}
