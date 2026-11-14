import type { ElementType } from "react";

type Props = {
  as?: ElementType;
  children: string;
  className?: string;
  id?: string;
  /** False when an ancestor already carries `reveal` and will trigger the words. */
  observe?: boolean;
};

/** Text whose words rise out of their baseline as it scrolls into view. Screen readers get the plain sentence. */
export function Rise({ as: Tag = "h2", children, className = "", id, observe = true }: Props) {
  return (
    <Tag id={id} className={`${observe ? "reveal rise" : ""} ${className}`} aria-label={children}>
      <span aria-hidden>
        {children.split(" ").map((word, i) => (
          <span key={i}>
            <span className="rise-word">
              <span style={{ ["--w" as string]: i }}>{word}</span>
            </span>{" "}
          </span>
        ))}
      </span>
    </Tag>
  );
}
