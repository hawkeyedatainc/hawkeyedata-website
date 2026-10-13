import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { routes } from "@/routes";

let lenis: Lenis | null = null;

export function Layout() {
  const { pathname, hash } = useLocation();

  // Smooth, weighted scrolling on pointer devices; native scrolling for touch and reduced motion.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(pointer: coarse)").matches) return;
    lenis = new Lenis({ lerp: 0.11 });
    let frame = requestAnimationFrame(function raf(t) {
      lenis?.raf(t);
      frame = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // New page: title, scroll position, and scroll reveals.
  useEffect(() => {
    const route = routes.find((r) => r.path === pathname.replace(/\/$/, "") || r.path === pathname) ?? routes.at(-1)!;
    document.title = route.title;

    const target = hash ? document.querySelector(hash) : null;
    if (target) lenis ? lenis.scrollTo(target as HTMLElement, { offset: -80 }) : target.scrollIntoView();
    else lenis ? lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0);

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll(".reveal:not(.is-in)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname, hash]);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-gold px-5 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
