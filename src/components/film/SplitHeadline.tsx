type Part = { text: string; className?: string };

/** A headline whose letters rise into place one by one. Screen readers get the plain sentence. */
export function SplitHeadline({ parts, className = "" }: { parts: Part[]; className?: string }) {
  let n = 0;
  return (
    <h1 className={className} aria-label={parts.map((p) => p.text).join("")}>
      <span aria-hidden>
        {parts.flatMap((part, pi) =>
          part.text.split(/(\s+)/).map((word, wi) =>
            word.trim() === "" ? (
              word && " "
            ) : (
              <span key={`${pi}-${wi}`} className={`split-word ${part.className ?? ""}`}>
                {[...word].map((ch, ci) => (
                  <span key={ci} className="split-char" style={{ ["--c" as string]: n++ }}>
                    {ch}
                  </span>
                ))}
              </span>
            ),
          ),
        )}
      </span>
    </h1>
  );
}
