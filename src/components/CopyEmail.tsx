import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { EMAIL } from "@/lib/catalog";

export function CopyEmail({ large = false, subject }: { large?: boolean; subject?: string }) {
  const [copied, setCopied] = useState(false);
  const href = `mailto:${EMAIL}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = href;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <a
        href={href}
        className={`link-sweep font-display font-medium tracking-[-0.03em] text-gold ${
          large ? "text-[clamp(1.35rem,4.2vw,3rem)]" : "text-xl"
        }`}
      >
        {EMAIL}
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-current shadow-[inset_0_0_0_1px_currentColor] transition-colors hover:text-gold"
        aria-live="polite"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copied" : "Copy email"}
      </button>
    </div>
  );
}
