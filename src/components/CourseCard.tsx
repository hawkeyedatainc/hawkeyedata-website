import { ArrowUpRight, Star } from "lucide-react";
import { type Course, compact, examCodes, trackOf } from "@/lib/catalog";
import { HotBadge } from "./HotBadge";

export function CourseCard({ course, tone = "paper" }: { course: Course; tone?: "paper" | "night" }) {
  const codes = examCodes(course);
  const night = tone === "night";
  const badge = trackOf(course).badge;

  return (
    <a
      href={course.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex h-full flex-col rounded-[22px] p-2.5 transition-[transform,box-shadow,background-color] duration-500 ease-out hover:-translate-y-1.5 ${
        night
          ? "bg-plum/70 hover:bg-plum hover:shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)]"
          : "bg-white shadow-[0_1px_2px_rgb(var(--ink)/0.06),0_8px_24px_-16px_rgb(var(--ink)/0.25)] hover:shadow-[0_2px_4px_rgb(var(--ink)/0.06),0_30px_50px_-28px_rgb(var(--violet)/0.55)]"
      }`}
    >
      <div className="relative aspect-video overflow-hidden rounded-[14px] bg-violet">
        {course.thumbnail && (
          <img
            src={course.thumbnail}
            alt=""
            loading="lazy"
            decoding="async"
            width={750}
            height={422}
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.045]"
          />
        )}
        {course.practiceTests && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-ink/85 px-2.5 py-1 text-[0.7rem] font-semibold text-paper">
            Practice tests
          </span>
        )}
        {badge && (
          <span className="absolute bottom-2.5 left-2.5">
            <HotBadge label={badge} />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-4">
        <h3
          className={`font-sans text-[1.02rem] font-semibold leading-snug tracking-[-0.01em] ${night ? "text-paper" : "text-ink"}`}
        >
          {course.title}
        </h3>
        {codes.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {codes.map((c) => (
              <span
                key={c}
                className={`rounded-md px-1.5 py-0.5 text-[0.7rem] font-semibold tabular ${
                  night ? "bg-gold/15 text-gold" : "bg-violet/10 text-violet"
                }`}
              >
                {c}
              </span>
            ))}
          </div>
        )}
        <div
          className={`mt-auto flex items-center gap-3 pt-4 text-[0.82rem] tabular ${night ? "text-lilac" : "text-mist"}`}
        >
          {course.rating > 0 && (
            <span className={`inline-flex items-center gap-1 font-semibold ${night ? "text-gold" : "text-ink"}`}>
              <Star className="h-3.5 w-3.5 fill-gold text-gold" aria-hidden />
              {course.rating.toFixed(1)}
            </span>
          )}
          {course.students > 0 && <span>{compact(course.students)} {course.students === 1 ? "learner" : "learners"}</span>}
          {course.duration && <span className="hidden sm:inline">{course.duration}</span>}
          <ArrowUpRight
            className="ml-auto h-4 w-4 opacity-0 transition-[opacity,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
            aria-hidden
          />
        </div>
      </div>
      <span className="sr-only">(opens on Udemy)</span>
    </a>
  );
}
