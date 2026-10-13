import { HAWK_PATHS, HAWK_VIEWBOX } from "./hawk-paths";

type Props = {
  className?: string;
  /** Trace the outline in, then fill. Pure CSS so it also runs on the pre-rendered page. */
  draw?: boolean;
  title?: string;
};

export function Hawk({ className = "", draw = false, title }: Props) {
  return (
    <svg
      viewBox={HAWK_VIEWBOX}
      className={`${className} ${draw ? "hawk-draw" : ""}`}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path className="hawk-fill" d={HAWK_PATHS.join(" ")} fill="currentColor" fillRule="evenodd" />
      {draw &&
        HAWK_PATHS.map((d, i) => (
          <path
            key={i}
            className="hawk-line"
            d={d}
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
        ))}
    </svg>
  );
}
