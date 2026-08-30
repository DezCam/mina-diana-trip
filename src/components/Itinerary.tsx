import { Calendar, ExternalLink, MapPin, Route, Ticket } from "lucide-react";
import type { ItineraryItem, TripDay } from "../data/itinerary";
import { SectionHeading } from "./SectionHeading";

type ItineraryProps = {
  days: TripDay[];
};

export function Itinerary({ days }: ItineraryProps) {
  const scotlandDays = days.filter((day) => day.country === "Scotland");
  const amsterdamDays = days.filter((day) => day.country === "Netherlands");

  return (
    <main>
      <DestinationBlock
        id="scotland"
        eyebrow="Scotland"
        title="Old stone, heather, and Highland air"
        description="Sample Scotland days are shown as placeholders until Desmond supplies the real itinerary."
        days={scotlandDays}
        tone="scotland"
      />
      <RouteTransition />
      <DestinationBlock
        id="amsterdam"
        eyebrow="Amsterdam"
        title="Canals, gables, flowers, and wandering"
        description="Sample Amsterdam days are shown as placeholders until confirmed travel plans are added."
        days={amsterdamDays}
        tone="amsterdam"
      />
    </main>
  );
}

function DestinationBlock({
  id,
  eyebrow,
  title,
  description,
  days,
  tone,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  days: TripDay[];
  tone: "scotland" | "amsterdam";
}) {
  return (
    <section className={tone === "scotland" ? "destination-scotland" : "destination-amsterdam"}>
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
        <SectionHeading id={id} eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-8 grid gap-7">
          {days.map((day) => (
            <DayPage key={day.id} day={day} tone={tone} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DayPage({ day, tone }: { day: TripDay; tone: "scotland" | "amsterdam" }) {
  return (
    <article className="journal-page overflow-hidden rounded-lg border border-highland/10 bg-cream shadow-soft">
      <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
        <div className="relative min-h-56">
          {day.heroImage ? (
            <img
              src={day.heroImage.src}
              alt={day.heroImage.alt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-highland/25" />
          <div className="absolute bottom-4 left-4 rounded-lg bg-parchment/92 px-4 py-3 text-highland backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[0.15em]">Day {day.dayNumber}</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
              <Calendar aria-hidden="true" size={15} />
              {day.date}
            </p>
          </div>
        </div>
        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-3">
            <span className={tone === "scotland" ? "pill pill-scotland" : "pill pill-amsterdam"}>
              {day.city}
            </span>
            {day.placeholder ? <span className="pill border-tulip/25 bg-tulip/10 text-tulip">Sample placeholder</span> : null}
          </div>
          <h3 className="mt-4 font-serif text-3xl leading-tight text-highland">{day.title}</h3>
          {day.subtitle ? <p className="mt-2 text-sm font-semibold text-ink/65">{day.subtitle}</p> : null}
          <div className="timeline mt-7 grid gap-6">
            {day.sections.map((section) => (
              <section key={section.period} className="relative pl-7">
                <span className="timeline-dot" aria-hidden="true" />
                <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-heather">{section.period}</h4>
                <div className="mt-3 grid gap-3">
                  {section.items.map((item) => (
                    <ItineraryEntry key={`${section.period}-${item.title}`} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function ItineraryEntry({ item }: { item: ItineraryItem }) {
  return (
    <div className="rounded-md border border-highland/10 bg-parchment p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          {item.time ? <p className="text-xs font-bold uppercase tracking-[0.14em] text-canal">{item.time}</p> : null}
          <h5 className="text-base font-bold text-highland">{item.title}</h5>
        </div>
        {item.placeholder ? <span className="rounded-full bg-brass/20 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-highland">Placeholder</span> : null}
      </div>
      <p className="mt-2 text-sm leading-6 text-ink/78">{item.description}</p>
      {item.transportation ? (
        <p className="mt-3 inline-flex items-start gap-2 rounded-md bg-canal/10 px-3 py-2 text-sm font-semibold text-highland">
          <Route aria-hidden="true" className="mt-0.5 shrink-0" size={16} />
          {item.transportation}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {item.reservationRequired ? (
          <span className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-tulip/12 px-3 text-xs font-bold uppercase tracking-[0.1em] text-tulip">
            <Ticket aria-hidden="true" size={14} />
            Reservation TBD
          </span>
        ) : null}
        {item.mapUrl ? (
          <a className="action-button" href={item.mapUrl} target="_blank" rel="noreferrer">
            <MapPin aria-hidden="true" size={15} />
            Map
          </a>
        ) : null}
        {item.websiteUrl ? (
          <a className="action-button" href={item.websiteUrl} target="_blank" rel="noreferrer">
            <ExternalLink aria-hidden="true" size={15} />
            Website
          </a>
        ) : null}
      </div>
      {item.notes ? <p className="mt-3 text-sm italic text-ink/65">{item.notes}</p> : null}
    </div>
  );
}

function RouteTransition() {
  return (
    <section className="route-transition bg-parchment px-5 py-10 text-center">
      <div className="mx-auto flex max-w-3xl items-center justify-center gap-4 text-highland">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-moss to-canal" />
        <Route aria-hidden="true" size={24} className="text-tulip" />
        <p className="font-serif text-lg">Highlands to canal houses</p>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent via-canal to-moss" />
      </div>
    </section>
  );
}
