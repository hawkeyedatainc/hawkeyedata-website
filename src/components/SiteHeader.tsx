import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Hawk } from "./Hawk";

const NAV = [
  { to: "/courses", label: "Courses" },
  { to: "/training", label: "Training & consulting" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  // Solid once the page moves; tucks away while reading down, returns on any upward scroll.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      setHidden(y > 320 && y > last + 2);
      if (y < last - 2) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-500 ease-out ${
        hidden && !open ? "-translate-y-full" : ""
      } ${scrolled || open ? "bg-night/95 shadow-[0_1px_0_rgb(var(--lilac)/0.08)]" : ""}`}
    >
      <div className="container flex h-[72px] items-center justify-between gap-6">
        <Link to="/" className="group flex items-center gap-3 text-gold" aria-label="HawkEye Data home">
          <Hawk className="h-7 w-auto transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:rotate-[-4deg]" />
          <span className="font-display text-[0.95rem] font-semibold tracking-[-0.01em] text-paper">
            HawkEye<span className="text-gold"> Data</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className="link-sweep py-1 text-[0.95rem] text-lilac transition-colors hover:text-paper aria-[current=page]:text-paper">
              {item.label}
            </NavLink>
          ))}
          <Link to="/courses" className="btn btn-gold !py-2.5 !px-5 text-sm">
            Find your course
          </Link>
        </nav>

        <button
          type="button"
          className="relative -mr-2 grid h-11 w-11 place-items-center rounded-full text-paper lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`absolute h-[2px] w-6 rounded bg-current transition-transform duration-500 ease-out ${open ? "rotate-45" : "-translate-y-[5px]"}`} />
          <span className={`absolute h-[2px] w-6 rounded bg-current transition-transform duration-500 ease-out ${open ? "-rotate-45" : "translate-y-[5px]"}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Main"
            className="fixed inset-x-0 bottom-0 top-[72px] flex flex-col bg-night px-5 pb-10 pt-6 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {[{ to: "/", label: "Home" }, ...NAV].map((item, i) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <NavLink
                  to={item.to}
                  end
                  className="block border-b border-lilac/10 py-4 font-display text-[1.7rem] font-medium tracking-[-0.03em] text-paper aria-[current=page]:text-gold"
                >
                  {item.label}
                </NavLink>
              </motion.div>
            ))}
            <a href="mailto:learn@hawkeyedata.ca" className="mt-auto text-lg text-gold">
              learn@hawkeyedata.ca
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
