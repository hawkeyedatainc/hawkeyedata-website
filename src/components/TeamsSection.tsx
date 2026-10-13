import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { OFFERS } from "@/lib/offers";

export function TeamsSection() {
  return (
    <section className="relative py-24 md:py-36" aria-labelledby="teams-title">
      <div className="container">
        <h2
          id="teams-title"
          className="reveal max-w-[17ch] text-[clamp(2rem,4.6vw,3.9rem)] font-semibold leading-[1.02] text-paper"
        >
          Bring the classroom to your team.
        </h2>
        <p className="reveal mt-6 max-w-[56ch] text-lg leading-relaxed text-lilac" style={{ ["--i" as string]: 1 }}>
          The same clarity that works for 176,000 learners, applied to your people and your data.
        </p>

        <div className="mt-16 grid gap-5 lg:grid-cols-2">
          {OFFERS.map((offer, i) => (
            <article
              key={offer.id}
              className="reveal group relative overflow-hidden rounded-[28px] bg-plum/60 p-8 transition-colors duration-500 hover:bg-plum md:p-12"
              style={{ ["--i" as string]: i }}
            >
              <h3 className="text-[clamp(1.5rem,2.6vw,2.2rem)] font-semibold text-gold">{offer.name}</h3>
              <p className="mt-3 text-lg text-paper">{offer.lead}</p>
              <ul className="mt-8 space-y-4">
                {offer.points.map((p) => (
                  <li key={p} className="flex gap-4 text-lilac">
                    <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <Link to="/training" className="reveal btn btn-gold group mt-12">
          See how we work with teams
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
