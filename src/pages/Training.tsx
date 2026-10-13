import { CopyEmail } from "@/components/CopyEmail";
import { OFFERS } from "@/components/TeamsSection";
import { TRACKS, fmt, PROFILE } from "@/lib/catalog";

const STEPS = [
  { name: "Talk", text: "A short call about your team, your stack and what success looks like." },
  { name: "Shape", text: "A proposal with the format, outline, schedule and cost, built around your goals." },
  { name: "Deliver", text: "Live sessions or hands-on project work, with materials your team keeps." },
  { name: "Follow through", text: "Course access, practice tests and Q&A so the learning sticks after the last session." },
];

export default function Training() {
  return (
    <>
      <section className="pb-20 pt-36 md:pb-28 md:pt-44">
        <div className="container">
          <h1 className="hero-in max-w-[15ch] text-[clamp(2.5rem,6.4vw,5.4rem)] font-semibold leading-[0.98] text-paper">
            Training and consulting for <span className="text-gold">teams</span>.
          </h1>
          <p className="hero-in mt-7 max-w-[56ch] text-lg leading-relaxed text-lilac" style={{ ["--i" as string]: 1 }}>
            HawkEye Data brings the teaching behind {fmt(PROFILE.learners)} Udemy enrolments to your organization, whether
            that's a certification push, an AI rollout, or a data platform that needs a second pair of eyes.
          </p>
          <a href="#talk" className="hero-in btn btn-gold mt-10" style={{ ["--i" as string]: 2 }}>
            Start a conversation
          </a>
        </div>
      </section>

      <section className="on-paper py-24 md:py-32">
        <div className="container grid gap-5 lg:grid-cols-2">
          {OFFERS.map((offer, i) => (
            <article key={offer.id} id={offer.id} className="reveal rounded-[28px] bg-white p-8 md:p-12" style={{ ["--i" as string]: i }}>
              <h2 className="text-[clamp(1.6rem,3vw,2.5rem)] font-semibold">{offer.name}</h2>
              <p className="mt-3 text-lg text-ink/75">{offer.lead}</p>
              <ul className="mt-8 space-y-4">
                {offer.points.map((p) => (
                  <li key={p} className="flex gap-4">
                    <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-violet" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="container mt-24 md:mt-32">
          <h2 className="reveal text-[clamp(1.8rem,3.8vw,3.2rem)] font-semibold leading-[1.05]">Topics we train on</h2>
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {TRACKS.map((t, i) => (
              <div key={t.slug} className="reveal border-t-2 border-violet pt-5" style={{ ["--i" as string]: i }}>
                <h3 className="font-display text-xl font-semibold">{t.name}</h3>
                <p className="mt-2 leading-relaxed text-ink/75">{t.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container">
          <h2 className="reveal text-[clamp(1.8rem,3.8vw,3.2rem)] font-semibold leading-[1.05] text-paper">How an engagement works</h2>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-[28px] bg-lilac/10 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.name} className="reveal bg-night p-8" style={{ ["--i" as string]: i }}>
                <span className="font-display text-sm font-semibold text-gold tabular">Step {i + 1}</span>
                <h3 className="mt-6 text-2xl font-semibold text-paper">{s.name}</h3>
                <p className="mt-3 leading-relaxed text-lilac">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="talk" className="bg-violet py-24 md:py-32">
        <div className="container">
          <h2 className="reveal max-w-[20ch] text-[clamp(1.8rem,3.8vw,3.2rem)] font-semibold leading-[1.05] text-paper">
            Tell us about your team.
          </h2>
          <p className="reveal mt-5 max-w-[56ch] text-lilac" style={{ ["--i" as string]: 1 }}>
            Include your team size, the tools you use and what you'd like people to be able to do afterwards.
          </p>
          <div className="reveal mt-10 text-paper" style={{ ["--i" as string]: 2 }}>
            <CopyEmail large subject="Corporate training / consulting enquiry" />
          </div>
        </div>
      </section>
    </>
  );
}
