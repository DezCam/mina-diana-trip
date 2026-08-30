import { Banknote, CloudSun, ExternalLink, Luggage, Plane, Shield, Train, TramFront } from "lucide-react";
import type { DetailGroup } from "../data/trip";
import { SectionHeading } from "./SectionHeading";

const icons = [Plane, Train, Luggage, Shield, Banknote, CloudSun, TramFront, Luggage];

export function TripDetails({ details }: { details: DetailGroup[] }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10" aria-labelledby="details-title">
      <SectionHeading
        id="trip-details"
        eyebrow="Trip Details"
        title="Useful notes for the road"
        description="This area is ready for confirmed travel logistics, emergency references, weather links, transport notes, and packing reminders."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {details.map((detail, index) => {
          const Icon = icons[index] ?? Luggage;
          return (
            <article key={detail.title} className="rounded-lg border border-highland/10 bg-cream p-5">
              <Icon aria-hidden="true" className="text-canal" size={23} />
              <h3 className="mt-4 text-base font-bold text-highland">{detail.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/72">{detail.description}</p>
              {detail.action ? (
                <a className="action-button mt-4" href={detail.action.href} target="_blank" rel="noreferrer">
                  <ExternalLink aria-hidden="true" size={15} />
                  {detail.action.label}
                </a>
              ) : null}
              <p className="mt-4 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-heather">
                {detail.status === "placeholder" ? "Placeholder" : "Confirmed"}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
