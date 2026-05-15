export function GoldRings({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 32"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <circle cx="22" cy="16" r="11" />
      <circle cx="42" cy="16" r="11" />
    </svg>
  );
}

export function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <span className="divider-gold" />
      <svg width="28" height="28" viewBox="0 0 10 10" className="text-gold">
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

export function Glass({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path d="M6 3h12l-1 8a5 5 0 0 1-10 0L6 3Z" />
      <path d="M12 16v5" />
      <path d="M9 21h6" />
    </svg>
  );
}
