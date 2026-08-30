import { CalendarDays, Printer, Sparkles } from "lucide-react";
import { trip } from "../data/trip";

export function Hero() {
  return (
    <header id="top" className="hero relative isolate min-h-[82svh] overflow-hidden bg-highland text-cream">
      <img
        src="/images/scotland-amsterdam-hero.png"
        alt="Scottish Highlands meeting Amsterdam canal houses at golden hour."
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,50,77,0.86)_0%,rgba(23,50,77,0.58)_45%,rgba(23,50,77,0.18)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-parchment to-transparent" />
      <div className="relative mx-auto flex min-h-[82svh] max-w-6xl flex-col justify-end px-5 pb-20 pt-24 sm:px-8 lg:px-10">
        <div className="max-w-2xl animate-rise">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cream/35 bg-cream/12 px-3 py-2 text-sm font-semibold uppercase tracking-[0.16em] backdrop-blur">
            <Sparkles aria-hidden="true" size={15} />
            {trip.subtitle}
          </p>
          <h1 className="font-serif text-[clamp(2.6rem,11vw,6.5rem)] leading-[1.02]">
            {trip.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-cream/90 sm:text-xl">
            {trip.tagline}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="inline-flex min-h-12 items-center gap-2 rounded-full bg-cream px-4 py-3 font-semibold text-highland shadow-soft">
              <CalendarDays aria-hidden="true" size={19} />
              <span>{trip.dates}</span>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-cream/40 bg-cream/12 px-4 py-3 font-semibold text-cream backdrop-blur transition hover:bg-cream/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
            >
              <Printer aria-hidden="true" size={19} />
              <span>Print / Save Guide</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
