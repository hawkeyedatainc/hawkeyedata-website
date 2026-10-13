import { Link } from "react-router-dom";
import { Hawk } from "@/components/Hawk";

export default function NotFound() {
  return (
    <section className="grid min-h-[80svh] place-items-center pb-20 pt-36">
      <div className="container text-center">
        <Hawk draw className="mx-auto w-40 text-gold" />
        <h1 className="mt-10 text-[clamp(2rem,5vw,3.6rem)] font-semibold text-paper">
          Even a hawk can't spot this page.
        </h1>
        <p className="mx-auto mt-5 max-w-[44ch] text-lg text-lilac">
          The link may be old or mistyped. These will get you back on course.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn btn-gold">
            Home
          </Link>
          <Link to="/courses" className="btn btn-ghost">
            All courses
          </Link>
        </div>
      </div>
    </section>
  );
}
