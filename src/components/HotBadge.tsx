import { Flame } from "lucide-react";

export function HotBadge({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span
      className={`hot-badge relative inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-ink ${className}`}
    >
      <Flame className="h-3.5 w-3.5" aria-hidden />
      {label}
    </span>
  );
}
