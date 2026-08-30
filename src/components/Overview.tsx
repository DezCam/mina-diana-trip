import { Compass, Heart, MapPinned } from "lucide-react";
import { trip } from "../data/trip";

export function Overview() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10" aria-labelledby="overview-title">
      <div id="overview" className="grid scroll-mt-20 gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <article className="rounded-lg border border-highland/10 bg-cream p-6 shadow-soft sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-tulip">Welcome</p>
          <h2 id="overview-title" className="mt-3 font-serif text-3xl leading-tight text-highland sm:text-4xl">
            A personal travel companion for Mina and Auntie Diana.
          </h2>
          <p className="mt-5 text-lg leading-8 text-ink/78">{trip.welcome}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {trip.destinations.map((destination) => (
              <span
                key={destination.label}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-highland/10 bg-parchment px-4 text-sm font-bold text-highland"
              >
                <MapPinned aria-hidden="true" size={17} />
                <span aria-hidden="true">{destination.flag}</span>
                {destination.label}
              </span>
            ))}
          </div>
        </article>
        <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-lg bg-highland p-6 text-cream">
            <Compass aria-hidden="true" size={28} />
            <h3 className="mt-5 font-serif text-2xl">Easy while traveling</h3>
            <p className="mt-3 leading-7 text-cream/78">
              Chronological days, quick map actions, and details sized for checking on an iPhone between stops.
            </p>
          </div>
          <div className="rounded-lg bg-moss p-6 text-cream">
            <Heart aria-hidden="true" size={28} />
            <h3 className="mt-5 font-serif text-2xl">Placeholder-safe</h3>
            <p className="mt-3 leading-7 text-cream/82">
              No invented bookings, confirmations, passport details, or private contact information are included.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
