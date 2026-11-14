import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { HeroFilm } from "@/components/film/HeroFilm";
import { TrackRoute } from "@/components/TrackRoute";
import { Reviews } from "@/components/Reviews";
import { TeamsSection } from "@/components/TeamsSection";
import { courses } from "@/lib/catalog";

const rated = courses.filter((c) => c.rating > 0 && c.reviews > 0);
const avgRating = rated.length
  ? rated.reduce((s, c) => s + c.rating * c.reviews, 0) / rated.reduce((s, c) => s + c.reviews, 0)
  : 0;

export default function Home() {
  return (
    <>
      <HeroFilm avgRating={avgRating} />

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
          <div
            className="reveal flex flex-col justify-end lg:col-span-4 lg:col-start-9"
            style={{ ["--i" as string]: 1 }}
          >
            <p className="text-lg leading-relaxed text-ink/80">
              Amandeep Sawhney is a data scientist and the CEO of HawkEye Data. He has cleared many of the
              certifications he teaches and now helps others do the same. Away from the classroom you'll find him at a
              chessboard or planning the next trip.
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
