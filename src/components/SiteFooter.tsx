import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Hawk } from "./Hawk";
import { CopyEmail } from "./CopyEmail";
import { PROFILE } from "@/lib/catalog";

export function SiteFooter() {
  // The contact page already leads with the email.
  const showCta = useLocation().pathname.replace(/\/$/, "") !== "/contact";
  return (
    <footer className="relative overflow-hidden bg-night pt-24 text-lilac md:pt-32">
      <Hawk className="pointer-events-none absolute -bottom-[12%] -right-[8%] w-[70vw] max-w-[900px] text-violet/40" />
      <div className="container relative">
        {showCta && (
          <>
            <h2 className="reveal max-w-[16ch] text-[clamp(2.1rem,5.4vw,4.6rem)] font-semibold leading-[1.02] text-paper">
              Let's make your data make sense.
            </h2>
            <div className="reveal mt-10" style={{ ["--i" as string]: 1 }}>
              <CopyEmail large />
            </div>
          </>
        )}

        <div className={`${showCta ? "mt-24" : ""} grid gap-10 border-t border-lilac/10 py-10 text-sm sm:grid-cols-3`}>
          <div className="flex items-center gap-3 text-gold">
            <Hawk className="h-8 w-auto" />
            <span className="font-display font-semibold text-paper">HawkEye Data Solutions</span>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3">
            <Link className="link-sweep hover:text-paper" to="/courses">
              Courses
            </Link>
            <Link className="link-sweep hover:text-paper" to="/training">
              Training & consulting
            </Link>
            <Link className="link-sweep hover:text-paper" to="/about">
              About
            </Link>
            <Link className="link-sweep hover:text-paper" to="/contact">
              Contact
            </Link>
          </nav>
          <a
            className="group inline-flex items-center gap-1.5 hover:text-paper sm:justify-self-end"
            href={PROFILE.udemyUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Amandeep on Udemy
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
        <p className="pb-10 text-xs text-lilac/60">© {new Date().getFullYear()} HawkEye Data Solutions.</p>
      </div>
    </footer>
  );
}
