import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Hawk } from "@/components/Hawk";
import { PROFILE, fmt, totals } from "@/lib/catalog";

export default function About() {
  const facts = [
    { value: fmt(PROFILE.learners), label: "learners on Udemy" },
    { value: fmt(PROFILE.reviews), label: "student reviews" },
    ...(totals.courses ? [{ value: String(totals.courses), label: "published courses" }] : []),
  ];

  return (
    <>
      <section className="relative overflow-hidden pb-24 pt-36 md:pb-32 md:pt-44">
        <Hawk
          draw
          className="pointer-events-none absolute -right-[18%] top-24 w-[80vw] max-w-[860px] text-violet/60 md:-right-[6%]"
        />
        <div className="container relative">
          <h1 className="hero-in max-w-[14ch] text-[clamp(2.5rem,6.4vw,5.4rem)] font-semibold leading-[0.98] text-paper">
            A hawk's eye for <span className="text-gold">data</span>.
          </h1>
          <p className="hero-in mt-7 max-w-[56ch] text-lg leading-relaxed text-lilac" style={{ ["--i" as string]: 1 }}>
            HawkEye Data Solutions closes the gap between ambitious professionals and what the data, cloud and AI
            industry expects of them, through courses, corporate training and consulting.
          </p>
        </div>
      </section>

      <section className="on-paper py-24 md:py-32">
        <div className="container grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="reveal text-[clamp(1.8rem,3.8vw,3.2rem)] font-semibold leading-[1.05]">Meet Amandeep</h2>
            <p className="reveal mt-2 text-mist" style={{ ["--i" as string]: 1 }}>
              Founder and CEO, HawkEye Data
            </p>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-ink/80 lg:col-span-7">
            <p className="reveal">
              Amandeep Sawhney is a data scientist who enjoys sharing what he knows. Among students he's known for
              making complex topics simple to understand, and that is the standard every HawkEye Data course is held to.
            </p>
            <p className="reveal">
              He has cleared many certifications himself and teaches so that others can do the same, across AWS,
              Microsoft Azure, Oracle Cloud, Power BI, Tableau, SQL, IBM DataStage and Microsoft Copilot. Outside
              teaching he plays chess and travels.
            </p>
            <a
              href={PROFILE.udemyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal group inline-flex items-center gap-2 font-semibold text-violet"
            >
              Amandeep's Udemy profile
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <div className="container mt-24">
          <dl className="grid gap-px overflow-hidden rounded-[28px] bg-ink/10 sm:grid-cols-3">
            {facts.map((f, i) => (
              <div key={f.label} className="reveal bg-paper p-8 md:p-10" style={{ ["--i" as string]: i }}>
                <dt className="text-mist">{f.label}</dt>
                <dd className="mt-2 font-display text-[clamp(2rem,4vw,3.2rem)] font-semibold tracking-[-0.04em] text-ink tabular">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container grid items-center gap-14 lg:grid-cols-12">
          <div className="reveal mx-auto w-full max-w-[420px] lg:col-span-5">
            <img
              src="/brand/logo.jpg"
              alt="HawkEye Data Solutions logo: a gold circuit-board hawk on violet"
              width={900}
              height={900}
              loading="lazy"
              className="rounded-[28px]"
            />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="reveal text-[clamp(1.8rem,3.8vw,3.2rem)] font-semibold leading-[1.05] text-paper">
              The circuit hawk
            </h2>
            <p className="reveal mt-6 text-lg leading-relaxed text-lilac">
              A hawk sees the whole field and the smallest detail in it at once. Ours is drawn from circuit traces and
              nodes, because that is the job: take a complicated system and make its structure obvious.
            </p>
            <div className="reveal mt-10 flex flex-wrap gap-3">
              <Link to="/courses" className="btn btn-gold group">
                Browse courses
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link to="/contact" className="btn btn-ghost">
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
