import { Hawk } from "./Hawk";

// Circuit traces leaving the hawk's wings and tail, drawn in the logo's own 1920px
// coordinates so they meet the artwork exactly. They overflow the hawk's box on purpose.
const TRACES = [
  "M250,826 H-180 L-420,1066 H-1500",
  "M548,1088 H-60 L-280,1308 H-1500",
  "M1672,826 H2080 L2300,606 H3400",
  "M1372,1088 H1980 L2200,1308 H3400",
  "M980,1462 V2600",
];

const NODES: [number, number][] = [
  [-420, 1066],
  [-280, 1308],
  [2300, 606],
  [2200, 1308],
];

export function HeroCircuit({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="228 576 1464 900" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <g fill="none" stroke="rgb(var(--lilac) / 0.22)" strokeWidth={1.5} vectorEffect="non-scaling-stroke">
          {TRACES.map((d, i) => (
            <path key={d} d={d} pathLength={1} className="trace" style={{ animationDelay: `${1.6 + i * 0.12}s` }} />
          ))}
        </g>
        {NODES.map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={22}
            fill="rgb(var(--night))"
            stroke="rgb(var(--lilac) / 0.4)"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
            className="trace-node"
            style={{ animationDelay: `${2.3 + i * 0.1}s` }}
          />
        ))}
        {/* Data pulses travel inward along the traces toward the hawk. */}
        {TRACES.slice(0, 4).map((d, i) => (
          <circle key={d} r={9} fill="rgb(var(--gold))" className="pulse">
            <animateMotion
              dur={`${5.5 + i * 0.9}s`}
              begin={`${2.6 + i * 1.3}s`}
              repeatCount="indefinite"
              keyPoints="1;0"
              keyTimes="0;1"
              calcMode="linear"
              path={d}
            />
          </circle>
        ))}
      </svg>
      <Hawk draw className="relative h-full w-full text-gold" title="HawkEye Data circuit hawk" />
    </div>
  );
}
