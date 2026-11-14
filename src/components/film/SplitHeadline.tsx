type Part = { text: string; className?: string };

/** A headline whose letters rise into place one by one. Screen readers get the plain sentence. */
export function SplitHeadline({ parts, className = "" }: { parts: Part[]; className?: string }) {
  // Words are split on spaces across the whole sentence, so a coloured word keeps its punctuation on the same line.
  const words: { ch: string; className?: string }[][] = [[]];
  for (const part of parts) {
    for (const ch of part.text) {
      if (ch === " ") words.push([]);
      else words.at(-1)!.push({ ch, className: part.className });
    }
  }
  let n = 0;
  return (
    <h1 className={className} aria-label={parts.map((p) => p.text).join("")}>
      <span aria-hidden>
        {words
          .filter((w) => w.length > 0)
          .map((word, wi) => (
            <span key={wi}>
              <span className="split-word">
                {word.map((c, ci) => (
                  <span key={ci} className={`split-char ${c.className ?? ""}`} style={{ ["--c" as string]: n++ }}>
                    {c.ch}
                  </span>
                ))}
              </span>{" "}
            </span>
          ))}
      </span>
    </h1>
  );
}
