import { Copy, ExternalLink, Home } from "lucide-react";
import type { HomeBase } from "../data/trip";

type HomeBasesProps = {
  homeBases: HomeBase[];
};

export function HomeBases({ homeBases }: HomeBasesProps) {
  return (
    <section className="bg-cream/70 py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-tulip">Home Base</p>
        <h2 className="mt-2 font-serif text-3xl text-highland sm:text-4xl">Accommodation</h2>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {homeBases.map((homeBase) => (
            <article key={homeBase.destination} className="rounded-lg border border-highland/10 bg-parchment p-5 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.15em] text-heather">{homeBase.destination}</p>
                  <h3 className="mt-2 font-serif text-2xl text-highland">{homeBase.propertyName}</h3>
                </div>
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-highland text-cream">
                  <Home aria-hidden="true" size={19} />
                </span>
              </div>
              <dl className="mt-5 grid gap-3 text-sm text-ink/75">
                <Info label="Address" value={homeBase.address ?? "Coming soon"} />
                <Info label="Neighborhood" value={homeBase.neighborhood ?? "Coming soon"} />
                <Info label="Check-in" value={homeBase.checkIn ?? "Coming soon"} />
                <Info label="Check-out" value={homeBase.checkOut ?? "Coming soon"} />
              </dl>
              <div className="mt-5 flex flex-wrap gap-3">
                {homeBase.mapsUrl ? (
                  <a className="action-button" href={homeBase.mapsUrl} target="_blank" rel="noreferrer">
                    <ExternalLink aria-hidden="true" size={16} />
                    Open in Maps
                  </a>
                ) : null}
                {homeBase.address ? (
                  <button className="action-button" type="button" onClick={() => void navigator.clipboard.writeText(homeBase.address!)}>
                    <Copy aria-hidden="true" size={16} />
                    Copy Address
                  </button>
                ) : null}
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-heather">
                {homeBase.status === "placeholder" ? "Placeholder information" : "Confirmed information"}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] gap-3">
      <dt className="font-bold text-highland">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
