import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowRight, Star } from "lucide-react";
import { HeroCircuit } from "@/components/HeroCircuit";
import { HAWK_PATHS, HAWK_VIEWBOX } from "@/components/hawk-paths";
import { PROFILE, fmt, totals, tracks } from "@/lib/catalog";
import { SplitHeadline } from "./SplitHeadline";
import { createHawkField, type HawkField } from "./hawkField";

const FILM_QUERY = "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/** One line of the scroll sequence: fades in, drifts toward the viewer, fades out. */
function Beat({
  progress,
  from,
  to,
  children,
}: {
  progress: MotionValue<number>;
  from: number;
  to: number;
  children: React.ReactNode;
}) {
  const opacity = useTransform(progress, [from, from + 0.05, to - 0.05, to], [0, 1, 1, 0]);
  const scale = useTransform(progress, [from, to], [0.88, 1.1]);
  return (
    <motion.div style={{ opacity, scale }} className="absolute inset-0 grid place-items-center px-6 text-center">
      <div>{children}</div>
    </motion.div>
  );
}

/** A number that counts up as its beat scrolls into view. */
function Count({ progress, from, to, value }: { progress: MotionValue<number>; from: number; to: number; value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useMotionValueEvent(progress, "change", (p) => {
    const t = Math.max(0, Math.min(1, (p - from) / (to - from)));
    if (ref.current) ref.current.textContent = fmt(Math.round(value * (1 - Math.pow(1 - t, 3))));
  });
  return (
    <span ref={ref} className="tabular">
      {fmt(value)}
    </span>
  );
}

/**
 * The home page hero. On a desktop with motion allowed it is a pinned scene: the hawk assembles
 * from points of light, then scrolling flies the camera through it past the headline numbers
 * and wipes to the paper-coloured section that follows, which slides in underneath (see index.css).
 * Everywhere else it is the plain hero with the drawn SVG hawk.
 */
export function HeroFilm({ avgRating }: { avgRating: number }) {
  const scene = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [film, setFilm] = useState(false);
  const { scrollYProgress: progress } = useScroll({ target: scene, offset: ["start start", "end end"] });

  useEffect(() => {
    const mq = matchMedia(FILM_QUERY);
    const update = () => setFilm(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!film || !canvas.current || !scene.current) return;
    let field: HawkField | null = null;
    try {
      field = createHawkField(canvas.current, HAWK_PATHS, HAWK_VIEWBOX);
    } catch {
      field = null;
    }
    if (!field) {
      setFilm(false);
      return;
    }
    const f = field;
    f.setScroll(progress.get());
    const stopScroll = progress.on("change", (p) => f.setScroll(p));
    const onPointer = (e: PointerEvent) =>
      f.setPointer((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
    addEventListener("pointermove", onPointer, { passive: true });
    let onScreen = true;
    const sync = () => f.setRunning(onScreen && !document.hidden);
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      sync();
    });
    io.observe(scene.current);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      stopScroll();
      removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", sync);
      io.disconnect();
      f.destroy();
    };
  }, [film, progress]);

  const copyOpacity = useTransform(progress, [0, 0.1], [1, 0]);
  const copyY = useTransform(progress, [0, 0.1], [0, -60]);
  const hintOpacity = useTransform(progress, [0, 0.03], [1, 0]);
  const wipe = useTransform(progress, [0.78, 0.88], ["circle(0% at 50% 50%)", "circle(75% at 50% 50%)"]);
  // Past the opening, the hero copy is invisible and must not catch clicks or focus.
  const [copyLive, setCopyLive] = useState(true);
  useMotionValueEvent(progress, "change", (p) => setCopyLive(p < 0.1));

  return (
    <section
      ref={scene}
      data-film={film || undefined}
      className={
        film
          ? "relative isolate h-[440vh]"
          : "relative isolate overflow-hidden pb-20 pt-28 md:pb-28 md:pt-32 lg:min-h-[100svh] lg:pt-0"
      }
    >
      <div className={film ? "sticky top-0 h-screen overflow-hidden" : undefined}>
        {film && <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />}

        <motion.div
          style={film ? { opacity: copyOpacity, y: copyY } : undefined}
          className={`container relative grid items-center gap-y-12 lg:grid-cols-12 ${
            film ? "h-full" : "lg:min-h-[100svh]"
          } ${film && !copyLive ? "invisible" : ""}`}
        >
          <HeroCircuit
            className={`order-first mx-auto aspect-[1464/900] w-[min(78vw,420px)] lg:order-last lg:col-span-5 lg:col-start-8 lg:w-full ${
              film ? "invisible" : ""
            }`}
          />

          <div className="relative lg:col-span-7 lg:row-start-1">
            <SplitHeadline
              className="max-w-[13ch] text-[clamp(2.5rem,6.6vw,5.6rem)] font-semibold leading-[0.98] text-paper"
              parts={[
                { text: "Data, cloud and AI, made " },
                { text: "simple", className: "text-gold" },
                { text: " to understand." },
              ]}
            />
            <p
              className="hero-in mt-7 max-w-[52ch] text-[1.12rem] leading-relaxed text-lilac"
              style={{ ["--i" as string]: 5 }}
            >
              Courses, corporate training and consulting from Amandeep Sawhney. {fmt(PROFILE.learners)} people have
              already learned with HawkEye Data on Udemy.
            </p>
            <div className="hero-in mt-10 flex flex-wrap gap-3" style={{ ["--i" as string]: 6 }}>
              <Link to="/courses" className="btn btn-gold group">
                Find your course
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link to="/training" className="btn btn-ghost">
                Train your team
              </Link>
            </div>
            <dl
              className="hero-in mt-14 flex flex-wrap gap-x-10 gap-y-4 text-sm text-lilac"
              style={{ ["--i" as string]: 7 }}
            >
              {avgRating > 0 && (
                <div className="flex items-center gap-2">
                  <dt className="sr-only">Average rating</dt>
                  <dd className="flex items-center gap-1.5 font-semibold text-paper tabular">
                    <Star className="h-4 w-4 fill-gold text-gold" aria-hidden />
                    {avgRating.toFixed(1)} average rating
                  </dd>
                </div>
              )}
              <div>
                <dt className="sr-only">Reviews</dt>
                <dd className="tabular">
                  <span className="font-semibold text-paper">{fmt(PROFILE.reviews)}</span> reviews
                </dd>
              </div>
              {totals.courses > 0 && (
                <div>
                  <dt className="sr-only">Courses</dt>
                  <dd className="tabular">
                    <span className="font-semibold text-paper">{totals.courses}</span> courses
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </motion.div>

        {film && (
          // The same figures are in the hero's own list above, so this sequence is decorative.
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <Beat progress={progress} from={0.14} to={0.36}>
              <p className="font-display text-[clamp(4rem,13vw,13rem)] font-semibold leading-none tracking-[-0.04em] text-gold">
                <Count progress={progress} from={0.14} to={0.26} value={PROFILE.learners} />
              </p>
              <p className="mt-6 text-[clamp(1.1rem,2vw,1.6rem)] text-paper">learners on Udemy</p>
            </Beat>
            <Beat progress={progress} from={0.36} to={0.58}>
              <p className="font-display text-[clamp(4rem,13vw,13rem)] font-semibold leading-none tracking-[-0.04em] text-gold">
                <Count progress={progress} from={0.36} to={0.48} value={PROFILE.reviews} />
              </p>
              <p className="mt-6 text-[clamp(1.1rem,2vw,1.6rem)] text-paper">
                reviews{avgRating > 0 && `, averaging ${avgRating.toFixed(1)} out of 5`}
              </p>
            </Beat>
            <Beat progress={progress} from={0.58} to={0.8}>
              <p className="font-display text-[clamp(3rem,8.5vw,8.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-paper">
                <span className="text-gold">{totals.courses}</span> courses.
                <br />
                <span className="text-gold">{tracks.length}</span> tracks.
              </p>
              <p className="mt-6 text-[clamp(1.1rem,2vw,1.6rem)] text-lilac">One clear route to where you're headed.</p>
            </Beat>

            <motion.div style={{ clipPath: wipe }} className="absolute inset-0 bg-paper" />
            <motion.div style={{ opacity: hintOpacity }} className="absolute inset-x-0 bottom-8">
              <div
                className="hero-in flex flex-col items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-lilac"
                style={{ ["--i" as string]: 14 }}
              >
                Scroll
                <span className="scroll-hint h-10 w-px bg-lilac/60" />
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
