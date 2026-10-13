import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "motion/react";
import { ArrowRight } from "lucide-react";
import { CourseCard } from "./CourseCard";
import { HotBadge } from "./HotBadge";
import { examCodes, tracks } from "@/lib/catalog";

/** The hawk's tail trace continues down the page as a bus line; each track branches off it. */
export function TrackRoute() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  if (tracks.length === 0) return null;

  return (
    <section className="on-paper relative py-24 md:py-36" aria-labelledby="tracks-title">
      <div className="container">
        <div className="max-w-3xl">
          <h2 id="tracks-title" className="reveal text-[clamp(2rem,4.6vw,3.9rem)] font-semibold leading-[1.02]">
            Where are you headed?
          </h2>
          <p className="reveal mt-6 max-w-[58ch] text-lg leading-relaxed text-ink/75" style={{ ["--i" as string]: 1 }}>
            Every course is grouped by the goal it gets you to. Pick a track, start with its most popular course, and
            keep going.
          </p>
        </div>

        <div ref={ref} className="relative mt-20 md:mt-28">
          <div className="absolute bottom-0 left-[11px] top-0 w-px bg-ink/10 md:left-[15px]" aria-hidden />
          <motion.div
            className="absolute bottom-0 left-[11px] top-0 w-[2px] origin-top -translate-x-[0.5px] bg-violet md:left-[15px]"
            style={{ scaleY: progress }}
            aria-hidden
          />

          <ol className="space-y-24 md:space-y-32">
            {tracks.map((track) => {
              const codes = [...new Set(track.courses.flatMap((c) => examCodes(c.title)))].slice(0, 8);
              return (
                <li key={track.slug} className="track-row reveal relative pl-12 md:pl-20">
                  <span
                    className="track-node absolute left-0 top-2 grid h-6 w-6 place-items-center rounded-full bg-paper shadow-[inset_0_0_0_2px_rgb(var(--violet))] md:h-8 md:w-8"
                    aria-hidden
                  >
                    <span className="h-2 w-2 rounded-full bg-violet md:h-2.5 md:w-2.5" />
                  </span>

                  <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                      {track.badge && <HotBadge label={track.badge} className="mb-3" />}
                      <h3 className="text-[clamp(1.6rem,3vw,2.5rem)] font-semibold leading-[1.05]">{track.name}</h3>
                      <p className="mt-2 text-sm font-semibold text-violet tabular">
                        {track.courses.length} {track.courses.length === 1 ? "course" : "courses"}
                      </p>
                    </div>
                    <div className="lg:col-span-7">
                      <p className="max-w-[56ch] text-lg leading-relaxed text-ink/75">{track.blurb}</p>
                      {codes.length > 0 && (
                        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Certification exams covered">
                          {codes.map((c) => (
                            <li
                              key={c}
                              className="rounded-md bg-violet/10 px-2 py-1 text-xs font-semibold text-violet tabular"
                            >
                              {c}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Phones swipe through the cards instead of scrolling past a tall stack. */}
                  <div className="-mr-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pr-5 sm:mr-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:pb-0 sm:pr-0 lg:grid-cols-3">
                    {track.courses.slice(0, 3).map((course) => (
                      <div key={course.id} className="w-[78%] shrink-0 snap-start sm:w-auto">
                        <CourseCard course={course} />
                      </div>
                    ))}
                  </div>

                  {track.courses.length > 3 && (
                    <Link
                      to={`/courses?track=${track.slug}`}
                      className="group mt-8 inline-flex items-center gap-2 font-semibold text-violet"
                    >
                      All {track.courses.length} {track.name} courses
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
