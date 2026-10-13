import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Search } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import { PROFILE, courses, fmt, trackOf, tracks } from "@/lib/catalog";

const SORTS = {
  popular: {
    label: "Most popular",
    fn: (a: (typeof courses)[number], b: (typeof courses)[number]) => b.students - a.students,
  },
  rating: {
    label: "Highest rated",
    fn: (a: (typeof courses)[number], b: (typeof courses)[number]) => b.rating - a.rating || b.reviews - a.reviews,
  },
  title: {
    label: "A to Z",
    fn: (a: (typeof courses)[number], b: (typeof courses)[number]) => a.title.localeCompare(b.title),
  },
};
type SortKey = keyof typeof SORTS;

export default function Courses() {
  const [params, setParams] = useSearchParams();
  // The pre-rendered page shows every course; apply ?track= only after hydration so the first render matches it.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const param = hydrated ? params.get("track") : null;
  const track = param && tracks.some((t) => t.slug === param) ? param : "all";
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");
  const q = useDeferredValue(query.trim().toLowerCase());

  const shown = useMemo(
    () =>
      courses
        .filter((c) => track === "all" || trackOf(c).slug === track)
        .filter((c) => !q || `${c.title} ${c.headline}`.toLowerCase().includes(q))
        .sort(SORTS[sort].fn),
    [track, q, sort],
  );

  const setTrack = (slug: string) => {
    const next = new URLSearchParams(params);
    if (slug === "all") next.delete("track");
    else next.set("track", slug);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  return (
    <>
      <section className="pb-16 pt-36 md:pb-20 md:pt-44">
        <div className="container">
          <h1 className="hero-in max-w-[14ch] text-[clamp(2.5rem,6.4vw,5.4rem)] font-semibold leading-[0.98] text-paper">
            Every course, grouped by <span className="text-gold">goal</span>.
          </h1>
          <p className="hero-in mt-7 max-w-[56ch] text-lg leading-relaxed text-lilac" style={{ ["--i" as string]: 1 }}>
            {courses.length} courses on Udemy, taken by {fmt(PROFILE.learners)} learners. Each one opens on Udemy, where
            you can preview lessons before you enrol.
          </p>
        </div>
      </section>

      <section className="on-paper min-h-[70vh] pb-28">
        <div className="sticky top-0 z-30 border-b border-ink/10 bg-paper/95 py-4">
          <div className="container flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <LayoutGroup id="track-filter">
              <div
                role="group"
                aria-label="Filter by track"
                className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1 lg:mx-0 lg:px-0 lg:pb-0"
              >
                {[
                  { slug: "all", name: "All", count: courses.length },
                  ...tracks.map((t) => ({ ...t, count: t.courses.length })),
                ].map((t) => {
                  const active = track === t.slug;
                  return (
                    <button
                      key={t.slug}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setTrack(t.slug)}
                      className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                        active ? "text-paper" : "text-ink/70 hover:text-ink"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="track-pill"
                          className="absolute inset-0 rounded-full bg-violet"
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        />
                      )}
                      <span className="relative">
                        {t.name} <span className="tabular opacity-60">{t.count}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>

            <div className="flex gap-2">
              <label className="relative flex-1 lg:w-64 lg:flex-none">
                <span className="sr-only">Search courses</span>
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist"
                  aria-hidden
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search, e.g. PL-300"
                  className="h-11 w-full rounded-full bg-white pl-10 pr-4 text-sm text-ink shadow-[inset_0_0_0_1px_rgb(var(--ink)/0.14)] placeholder:text-mist focus:shadow-[inset_0_0_0_2px_rgb(var(--violet))] focus:outline-none"
                />
              </label>
              <label>
                <span className="sr-only">Sort courses</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="h-11 rounded-full bg-white px-4 text-sm font-semibold text-ink shadow-[inset_0_0_0_1px_rgb(var(--ink)/0.14)] focus:shadow-[inset_0_0_0_2px_rgb(var(--violet))] focus:outline-none"
                >
                  {Object.entries(SORTS).map(([key, s]) => (
                    <option key={key} value={key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="container pt-10">
          <h2 className="sr-only">Course list</h2>
          <p className="mb-6 text-sm text-mist tabular" aria-live="polite">
            Showing {shown.length} of {courses.length} courses
          </p>
          {shown.length === 0 ? (
            <div className="rounded-[22px] bg-white p-12 text-center">
              <p className="font-display text-xl font-semibold">No course matches “{query}”.</p>
              <p className="mt-2 text-mist">Try an exam code or a tool name, or clear the search.</p>
              <button
                type="button"
                className="btn btn-ink mt-6"
                onClick={() => {
                  setQuery("");
                  setTrack("all");
                }}
              >
                Show all courses
              </button>
            </div>
          ) : (
            <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout" initial={false}>
                {shown.map((course) => (
                  <motion.li
                    key={course.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <CourseCard course={course} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>
      </section>
    </>
  );
}
