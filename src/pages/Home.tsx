import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { HeroCircuit } from "@/components/HeroCircuit";
import { TrackRoute } from "@/components/TrackRoute";
import { Reviews } from "@/components/Reviews";
import { TeamsSection } from "@/components/TeamsSection";
import { PROFILE, courses, fmt, totals } from "@/lib/catalog";

const rated = courses.filter((c) => c.rating > 0 && c.reviews > 0);
const avgRating = rated.length
  ? rated.reduce((s, c) => s + c.rating * c.reviews, 0) / rated.reduce((s, c) => s + c.reviews, 0)
  : 0;

export default function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden pb-20 pt-28 md:pb-28 md:pt-32 lg:min-h-[100svh] lg:pt-0">
        <div className="container grid items-center gap-y-12 lg:min-h-[100svh] lg:grid-cols-12">
          <HeroCircuit className="order-first mx-auto aspect-[1464/900] w-[min(78vw,420px)] lg:order-last lg:col-span-5 lg:col-start-8 lg:w-full" />

          <div className="relative lg:col-span-7 lg:row-start-1">
            <h1 className="hero-in max-w-[13ch] text-[clamp(2.5rem,6.6vw,5.6rem)] font-semibold leading-[0.98] text-paper">
              Data, cloud and AI, made <span className="text-gold">simple</span> to understand.
            </h1>
            <p className="hero-in mt-7 max-w-[52ch] text-[1.12rem] leading-relaxed text-lilac" style={{ ["--i" as string]: 1 }}>
              Courses, corporate training and consulting from Amandeep Sawhney. {fmt(PROFILE.learners)} people have
              already learned with HawkEye Data on Udemy.
            </p>
            <div className="hero-in mt-10 flex flex-wrap gap-3" style={{ ["--i" as string]: 2 }}>
              <Link to="/courses" className="btn btn-gold group">
                Find your course
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link to="/training" className="btn btn-ghost">
                Train your team
              </Link>
            </div>
            <dl className="hero-in mt-14 flex flex-wrap gap-x-10 gap-y-4 text-sm text-lilac" style={{ ["--i" as string]: 3 }}>
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
        </div>
      </section>

      <TrackRoute />
      <Reviews />
      <TeamsSection />

      <section className="on-paper py-24 md:py-36">
        <div className="container grid gap-12 lg:grid-cols-12">
          <blockquote className="reveal lg:col-span-7">
            <p className="font-display text-[clamp(1.7rem,3.6vw,3rem)] font-medium leading-[1.12] tracking-[-0.03em]">
              “Known among students for making complex topics{" "}
              <span className="bg-[linear-gradient(transparent_62%,rgb(var(--gold))_62%)]">simple to understand.</span>”
            </p>
            <footer className="mt-6 text-mist">From Amandeep's Udemy instructor profile</footer>
          </blockquote>
          <div className="reveal flex flex-col justify-end lg:col-span-4 lg:col-start-9" style={{ ["--i" as string]: 1 }}>
            <p className="text-lg leading-relaxed text-ink/80">
              Amandeep Sawhney is a data scientist and the CEO of HawkEye Data. He has cleared many of the certifications
              he teaches and now helps others do the same. Away from the classroom you'll find him at a chessboard or
              planning the next trip.
            </p>
            <Link to="/about" className="group mt-8 inline-flex items-center gap-2 font-semibold text-violet">
              More about HawkEye Data
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
