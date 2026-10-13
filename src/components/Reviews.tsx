import { Star } from "lucide-react";
import { PROFILE, courses, fmt, reviews } from "@/lib/catalog";

const titleOf = new Map(courses.map((c) => [c.id, c.title]));

/** Real Udemy student reviews only. The section disappears rather than fall back to invented quotes. */
export function Reviews() {
  if (reviews.length < 3) return null;
  const rows =
    reviews.length >= 8 ? [reviews.filter((_, i) => i % 2 === 0), reviews.filter((_, i) => i % 2 === 1)] : [reviews];

  return (
    <section className="relative overflow-hidden bg-violet py-24 md:py-36" aria-labelledby="reviews-title">
      <div className="container">
        <h2
          id="reviews-title"
          className="reveal max-w-[18ch] text-[clamp(2rem,4.6vw,3.9rem)] font-semibold leading-[1.02] text-paper"
        >
          {fmt(PROFILE.learners)} learners. A few of them, in their words.
        </h2>
        <p className="reveal mt-6 text-lilac" style={{ ["--i" as string]: 1 }}>
          Unedited 5-star reviews from Udemy students. {fmt(PROFILE.reviews)} reviews and counting.
        </p>
      </div>

      <div className="mt-16 space-y-5">
        {rows.map((row, r) => (
          <div
            key={r}
            className="marquee overflow-hidden"
            style={{ ["--marquee-duration" as string]: `${row.length * 9}s` }}
          >
            <ul className={`marquee-track flex w-max gap-5 ${r % 2 ? "[animation-direction:reverse]" : ""}`}>
              {[...row, ...row].map((review, i) => (
                <li
                  key={i}
                  aria-hidden={i >= row.length || undefined}
                  className="flex w-[min(82vw,400px)] shrink-0 flex-col rounded-[22px] bg-night/55 p-7"
                >
                  <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }, (_, s) => (
                      <Star key={s} className="h-4 w-4 fill-gold text-gold" aria-hidden />
                    ))}
                  </div>
                  <p className="mt-4 text-[1.02rem] leading-relaxed text-paper">“{review.text}”</p>
                  <p className="mt-auto pt-6 text-sm text-lilac">
                    <span className="font-semibold text-paper">{review.name}</span>
                    {titleOf.has(review.course) && <> on {titleOf.get(review.course)}</>}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
