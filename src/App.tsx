import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { RecommendationsList } from "./components/Recommendations";
import { recommendations } from "./data/recommendations";
import { scotlandConsiderations } from "./data/scotland";

const recommendationsPath = "/desmonds-amsterdam-recommendations";
const amsterdamPhoto = "/images/amsterdam/amsterdam-canal.jpg";
const scotlandPhoto = "/images/scotland/edinburgh.jpg";
const headerMark = "/images/branding/castle-windmill.png";
const siteTitle = "Diana & Mina's European Adventure";
const hotelMapsUrl = "https://maps.app.goo.gl/XGjTeYouGkLRFCEk7";

export default function App() {
  if (window.location.pathname === recommendationsPath) {
    document.title = "Desmond's Amsterdam Recommendations";
    return <RecommendationsPage />;
  }

  document.title = siteTitle;
  return <TripGuide />;
}

function TripGuide() {
  return (
    <div className="min-h-screen bg-parchment text-highland">
      <SiteHeader />
      <main>
        <Hero />
        <Overview />
        <DestinationSection id="amsterdam" title="Amsterdam" tone="amsterdam" showImage />
        <DestinationSection id="scotland" title="Scotland" tone="scotland" showImage />
        <TripDetails />
      </main>
      <footer className="border-t border-brass/35 px-6 py-8 text-center font-serif text-lg">
        {siteTitle}
      </footer>
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-brass/70 bg-cream/94 backdrop-blur-md">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <a href="/" className="group flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tulip">
          <img
            src={headerMark}
            alt=""
            className="h-14 w-24 shrink-0 object-contain sm:h-20 sm:w-36"
            aria-hidden="true"
          />
          <span>
            <span className="block font-serif text-3xl leading-none text-highland sm:text-4xl">Diana & Mina's</span>
            <span className="mt-2 block text-[0.72rem] font-semibold uppercase tracking-[0.42em] text-brass sm:text-sm">
              European Adventure
            </span>
          </span>
        </a>

        <nav aria-label="Main navigation" className="grid grid-cols-4 items-center gap-2 pb-1 lg:flex lg:gap-8">
          <a className="nav-link" href="#overview">Overview</a>
          <a className="nav-link" href="#amsterdam">Amsterdam</a>
          <a className="nav-link" href="#scotland">Scotland</a>
          <a className="nav-link" href="#trip-details">Trip Details</a>
          <a className="recommendations-link col-span-4 justify-center lg:col-span-1 lg:justify-start" href={recommendationsPath}>
            Desmond's Amsterdam Recommendations
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-shell relative isolate overflow-hidden border-b border-brass/20">
      <div className="hero-art pointer-events-none absolute inset-0 z-10" aria-hidden="true">
        <Thistle className="absolute bottom-12 left-5 h-40 w-28 opacity-55 sm:left-12 sm:h-56 sm:w-40" />
        <CanalLineArt className="absolute bottom-8 left-20 hidden h-28 w-[34rem] opacity-35 md:block" />
      </div>
      <div className="grid min-h-[42rem] lg:grid-cols-[45%_55%]">
        <div className="relative z-20 flex items-center bg-cream/90 px-6 py-16 sm:px-12 lg:px-20">
          <div className="max-w-3xl">
            <h1 className="font-serif text-[clamp(3.4rem,8vw,7rem)] leading-[0.98] tracking-normal text-highland">
              Diana & Mina's
              <span className="block">European Adventure</span>
            </h1>
            <p className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-base font-bold uppercase tracking-[0.42em] sm:text-xl">
              <span className="text-tulip">Amsterdam</span>
              <span className="text-brass">×</span>
              <span className="text-moss">Scotland</span>
            </p>
            <DecorativeRule />
            <p className="mt-8 font-serif text-xl italic leading-8 text-ink sm:text-2xl">
              Castles, cobblestones, canals & a little adventure.
            </p>
          </div>
        </div>
        <div className="hero-photo relative min-h-[20rem] lg:min-h-[42rem]">
          <img
            src={amsterdamPhoto}
            alt="Amsterdam canal with bicycles on a bridge."
            className="h-full w-full object-cover object-[58%_50%] lg:object-[55%_50%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(246,240,229,0.08),rgba(246,240,229,0.12))]" />
        </div>
      </div>
    </section>
  );
}

function Overview() {
  return (
    <section id="overview" className="scroll-mt-32 bg-cream px-6 py-16 sm:px-10 lg:px-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
        <div>
          <h2 className="font-serif text-4xl text-highland sm:text-5xl">Welcome</h2>
          <span className="mt-5 block h-px w-8 bg-brass" aria-hidden="true" />
          <p className="mt-6 max-w-md text-lg leading-8 text-ink">
            Everything for the adventure in one place — where you're going, what you're doing, and the little details worth remembering.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <DestinationPanel title="Amsterdam" tone="amsterdam" />
          <DestinationPanel title="Scotland" tone="scotland" />
        </div>
      </div>
    </section>
  );
}

function DestinationPanel({ title, tone }: { title: string; tone: "scotland" | "amsterdam" }) {
  return (
    <a
      href={`#${title.toLowerCase()}`}
      className={`destination-panel destination-panel-${tone} group rounded-lg px-8 py-9 text-cream shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tulip`}
    >
      {tone === "scotland" ? <Thistle className="h-28 w-24" light /> : <CanalHouses className="h-28 w-36" />}
      <h3 className="mt-4 font-serif text-4xl">{title}</h3>
    </a>
  );
}

function DestinationSection({ id, title, tone, showImage = false }: { id: string; title: string; tone: "scotland" | "amsterdam"; showImage?: boolean }) {
  const isAmsterdam = id === "amsterdam";
  const isScotland = id === "scotland";

  return (
    <section id={id} className="scroll-mt-32 px-6 py-20 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-5">
          <h2 className="font-serif text-5xl text-highland sm:text-6xl">{title}</h2>
          <span className="h-px flex-1 bg-brass/55" aria-hidden="true" />
        </div>
        <div className={`rounded-lg border border-brass/25 ${tone === "scotland" ? "bg-moss/10" : "bg-canal/10"} p-8 sm:p-10`}>
          {isAmsterdam ? <AmsterdamHomeBase /> : null}
          {showImage ? (
            <img
              src={isScotland ? scotlandPhoto : amsterdamPhoto}
              alt={isScotland ? "View of Edinburgh, Scotland." : "Amsterdam canal with bicycles on a bridge."}
              loading="lazy"
              className={`${isAmsterdam ? "mt-8" : ""} aspect-[16/9] w-full rounded-md object-cover ${isScotland ? "object-[55%_45%]" : "object-[50%_48%]"}`}
            />
          ) : (
            <Thistle className="h-32 w-28 opacity-55" />
          )}
          <p className="mt-8 font-serif text-3xl text-highland">Coming Soon</p>
          {isScotland ? <ScotlandConsiderations /> : null}
        </div>
      </div>
    </section>
  );
}

function AmsterdamHomeBase() {
  return (
    <div className="rounded-lg border border-brass/25 bg-cream p-6 shadow-soft sm:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-canal">Amsterdam Home Base</p>
      <div className="mt-4 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <h3 className="font-serif text-3xl leading-tight text-highland sm:text-4xl">
            Hotel Espresso City Centre
          </h3>
          <address className="mt-4 not-italic leading-7 text-ink">
            Overtoom 57
            <br />
            1054 HC Amsterdam
          </address>
        </div>
        <a className="action-button min-h-12 px-4" href={hotelMapsUrl} target="_blank" rel="noreferrer">
          <MapPin aria-hidden="true" size={16} />
          Open in Maps
        </a>
      </div>
    </div>
  );
}

function ScotlandConsiderations() {
  return (
    <div className="mt-10 border-t border-brass/30 pt-8">
      <div className="mb-6">
        <h3 className="font-serif text-4xl leading-tight text-highland sm:text-5xl">
          Places You're Considering
        </h3>
        <p className="mt-3 max-w-xl leading-7 text-ink">
          Some ideas for your time in and around Edinburgh.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {scotlandConsiderations.map((place) => (
          <article
            key={place.name}
            className="rounded-md border border-brass/25 bg-cream/85 p-5 shadow-soft"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="font-serif text-2xl leading-tight text-highland">
                  {place.name}
                </h4>
                <p className="mt-1 text-sm font-bold uppercase tracking-[0.14em] text-moss">
                  {place.location}
                </p>
              </div>
              <a className="action-button min-h-12 px-4" href={place.mapsUrl} target="_blank" rel="noreferrer">
                <MapPin aria-hidden="true" size={16} />
                Open in Maps
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function RecommendationsEntry() {
  return (
    <section className="px-6 py-10 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl rounded-lg border border-heather/20 bg-heather px-7 py-7 text-cream shadow-soft sm:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-serif text-3xl sm:text-4xl">Desmond's Amsterdam Recommendations</h2>
          <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-cream/30 px-5 text-sm font-bold uppercase tracking-[0.16em] transition hover:bg-cream/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream" href={recommendationsPath}>
            Explore Recommendations
            <ArrowRight aria-hidden="true" size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}

function TripDetails() {
  return (
    <section id="trip-details" className="scroll-mt-32 px-6 py-20 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-5">
          <h2 className="font-serif text-5xl text-highland sm:text-6xl">Trip Details</h2>
          <span className="h-px flex-1 bg-brass/55" aria-hidden="true" />
        </div>
        <div className="rounded-lg border border-brass/25 bg-cream p-8 sm:p-10">
          <p className="font-serif text-3xl text-highland">Coming Soon</p>
        </div>
      </div>
    </section>
  );
}

function RecommendationsPage() {
  return (
    <div className="min-h-screen bg-parchment text-highland">
      <main className="px-6 py-7 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <a className="inline-flex min-h-12 items-center gap-2 rounded-md border border-brass/35 bg-cream px-5 text-sm font-bold uppercase tracking-[0.14em] text-highland shadow-soft transition hover:bg-parchment focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tulip" href="/">
            <ArrowLeft aria-hidden="true" size={17} />
            Back to Trip Guide
          </a>
          <header className="relative py-16 sm:py-24">
            <CanalHouses className="mb-8 h-24 w-36 text-canal opacity-65" />
            <h1 className="max-w-4xl font-serif text-5xl leading-tight sm:text-7xl">
              Desmond's Amsterdam Recommendations
            </h1>
          </header>
          <RecommendationsList recommendations={recommendations} />
        </div>
      </main>
    </div>
  );
}

function DecorativeRule() {
  return (
    <div className="mt-8 flex max-w-md items-center gap-4 text-brass" aria-hidden="true">
      <span className="h-px flex-1 bg-current" />
      <span className="font-serif text-3xl leading-none">✣</span>
      <span className="h-px flex-1 bg-current" />
    </div>
  );
}

function Thistle({ className = "", light = false }: { className?: string; light?: boolean }) {
  const stroke = light ? "currentColor" : "#66725f";
  const bloom = light ? "currentColor" : "#765B78";
  return (
    <svg className={className} viewBox="0 0 120 180" fill="none" aria-hidden="true">
      <path d="M58 154C58 116 60 86 70 44" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <path d="M58 118C39 103 25 91 15 70" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M61 104C82 92 96 76 104 52" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M37 103c-14-11-19-25-18-43 15 7 24 18 26 34" stroke={stroke} strokeWidth="2" />
      <path d="M78 90c18-10 25-24 27-42-16 5-27 17-32 33" stroke={stroke} strokeWidth="2" />
      <path d="M49 58c-8 15-7 29 5 43 9-14 10-28 0-43" stroke={stroke} strokeWidth="2" />
      <path d="M73 45c13-11 17-25 13-41-14 8-22 20-22 36" stroke={stroke} strokeWidth="2" />
      <path d="M50 31c-8-5-12-13-10-23 9 4 14 11 15 21" stroke={stroke} strokeWidth="2" />
      <path d="M63 39c-11-3-20-10-27-23 18-2 30 4 36 18" fill={bloom} fillOpacity={light ? 0.35 : 0.75} />
      <path d="M66 40c1-16 10-28 25-36 4 18-2 31-19 41" fill={bloom} fillOpacity={light ? 0.45 : 0.9} />
      <path d="M57 44c13-5 26-4 39 4-13 10-27 12-42 2" fill={bloom} fillOpacity={light ? 0.3 : 0.65} />
    </svg>
  );
}

function CanalHouses({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 150" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M24 98V40l28-24 28 24v58M92 98V30l26-18 26 18v68M156 98V44l20-26 20 26v54" />
      <path d="M36 54h14M36 74h14M62 54h10M62 74h10M104 48h12M126 48h12M104 70h12M126 70h12M168 58h10M188 58h10M168 78h10M188 78h10" />
      <path d="M14 112c18-10 36-10 54 0s36 10 54 0 36-10 54 0 25 8 34 3M14 132c18-10 36-10 54 0s36 10 54 0 36-10 54 0 25 8 34 3" />
    </svg>
  );
}

function CanalLineArt({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 720 170" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 95c40-20 80-20 120 0s80 20 120 0 80-20 120 0 80 20 120 0 80-20 120 0 80 20 110 3" stroke="#3D7F98" strokeWidth="3" />
      <path d="M10 118c40-20 80-20 120 0s80 20 120 0 80-20 120 0 80 20 120 0 80-20 120 0 80 20 110 3" stroke="#3D7F98" strokeWidth="3" />
      <path d="M170 86V46l24-20 24 20v40M230 86V36l24-18 24 18v50M292 86V48l20-24 20 24v38" stroke="#C6A15B" strokeWidth="2" opacity=".65" />
    </svg>
  );
}
