import { useState, type FormEvent } from "react";
import { ArrowUpRight, Send } from "lucide-react";
import { CopyEmail } from "@/components/CopyEmail";
import { EMAIL, PROFILE } from "@/lib/catalog";

const TOPICS = ["Corporate training", "Consulting", "A course question", "Something else"];

export default function Contact() {
  const [topic, setTopic] = useState(TOPICS[0]);

  // No backend on GitHub Pages: compose the email in the visitor's own mail app.
  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = `${data.get("message")}\n\n${data.get("name")}${data.get("company") ? `, ${data.get("company")}` : ""}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(topic)}&body=${encodeURIComponent(body)}`;
  };

  const field =
    "mt-2 w-full rounded-2xl bg-plum/60 px-4 py-3.5 text-paper placeholder:text-lilac/50 shadow-[inset_0_0_0_1px_rgb(var(--lilac)/0.15)] transition-shadow focus:shadow-[inset_0_0_0_2px_rgb(var(--gold))] focus:outline-none";

  return (
    <section className="pb-28 pt-36 md:pt-44">
      <div className="container grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h1 className="hero-in max-w-[12ch] text-[clamp(2.5rem,6.4vw,5.4rem)] font-semibold leading-[0.98] text-paper">
            Let's <span className="text-gold">talk</span>.
          </h1>
          <p className="hero-in mt-7 max-w-[44ch] text-lg leading-relaxed text-lilac" style={{ ["--i" as string]: 1 }}>
            Training for your team, a consulting project, or a question about a course: write to us directly.
          </p>
          <div className="hero-in mt-10 text-paper" style={{ ["--i" as string]: 2 }}>
            <CopyEmail />
          </div>
          <p className="hero-in mt-12 max-w-[44ch] text-sm leading-relaxed text-lilac" style={{ ["--i" as string]: 3 }}>
            Already enrolled? The quickest way to get help with a lecture is the Q&A tab inside the course on{" "}
            <a
              href={PROFILE.udemyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-gold underline"
            >
              Udemy
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </a>
            .
          </p>
        </div>

        <form onSubmit={send} className="hero-in lg:col-span-6 lg:col-start-7" style={{ ["--i" as string]: 2 }}>
          <fieldset>
            <legend className="text-sm font-semibold text-paper">What's it about?</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <label key={t} className="cursor-pointer">
                  <input
                    type="radio"
                    name="topic"
                    value={t}
                    checked={topic === t}
                    onChange={() => setTopic(t)}
                    className="peer sr-only"
                  />
                  <span className="block rounded-full px-4 py-2 text-sm text-lilac shadow-[inset_0_0_0_1px_rgb(var(--lilac)/0.25)] transition-colors peer-checked:bg-gold peer-checked:font-semibold peer-checked:text-ink peer-checked:shadow-none peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold">
                    {t}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-paper">
              Your name
              <input name="name" required autoComplete="name" className={field} />
            </label>
            <label className="block text-sm font-semibold text-paper">
              Company <span className="font-normal text-lilac">(optional)</span>
              <input name="company" autoComplete="organization" className={field} />
            </label>
          </div>
          <label className="mt-5 block text-sm font-semibold text-paper">
            Message
            <textarea
              name="message"
              required
              rows={6}
              className={`${field} resize-y`}
              placeholder="Team size, tools, goals, timing…"
            />
          </label>
          <button type="submit" className="btn btn-gold group mt-8">
            Open in my email app
            <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
          <p className="mt-3 text-sm text-lilac/80">
            This opens a pre-filled email to {EMAIL}. Nothing is stored on this site.
          </p>
        </form>
      </div>
    </section>
  );
}
