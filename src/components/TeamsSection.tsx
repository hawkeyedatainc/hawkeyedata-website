import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const OFFERS = [
  {
    id: "training",
    name: "Corporate training",
    lead: "Upskill a whole team on the tools it already pays for.",
    points: [
      "Live, instructor-led workshops, online or on site",
      "Certification bootcamps for AWS, Azure, Oracle Cloud, Power BI and Tableau",
      "Microsoft Copilot sessions that get everyday teams productive with AI",
      "Curriculum shaped around your data, your stack and your goals",
    ],
  },
  {
    id: "consulting",
    name: "Consulting",
    lead: "Hands-on help from someone who teaches this for a living.",
    points: [
      "SQL, data warehousing and ETL pipelines, including IBM DataStage",
      "Power BI and Tableau reporting your leadership will actually open",
      "Practical AI adoption with Microsoft Copilot: where it pays off, and where it doesn't",
      "Reviews of the pipelines, models and dashboards you already have",
    ],
  },
];

export function TeamsSection() {
  return (
    <section className="relative py-24 md:py-36" aria-labelledby="teams-title">
      <div className="container">
        <h2 id="teams-title" className="reveal max-w-[17ch] text-[clamp(2rem,4.6vw,3.9rem)] font-semibold leading-[1.02] text-paper">
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
