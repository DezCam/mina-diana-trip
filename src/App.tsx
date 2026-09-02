import { ArrowLeft, ArrowRight, Download, MapPin, PhoneCall } from "lucide-react";
import { RecommendationsList } from "./components/Recommendations";
import { getDestinationConsiderations } from "./data/considerations";
import { emergencyCities, quickCallGuide, stateDepartmentFallback } from "./data/emergency";
import { recommendations } from "./data/recommendations";

const recommendationsPath = "/desmonds-amsterdam-recommendations";
const emergencyPath = "/emergency";
const downloads = [
  {
    title: "Trip Guide",
    label: "Download PDF",
    href: "/downloads/trip-guide.pdf",
    fileName: "Diana-Mina-European-Adventure-Trip-Guide.pdf",
  },
  {
    title: "Amsterdam Recommendations",
    label: "Download PDF",
    href: "/downloads/dezrecs.pdf",
    fileName: "Diana-Mina-Amsterdam-Recommendations.pdf",
  },
  {
    title: "Emergency Contacts",
    label: "Download PDF",
    href: "/downloads/emergency.pdf",
    fileName: "Diana-Mina-Emergency-Contacts.pdf",
  },
];
const amsterdamHeroPhoto = "/images/amsterdam/amsterdam-canal.jpg";
const amsterdamSectionPhoto = "/images/amsterdam/amsterdam-section.jpg";
const scotlandPhoto = "/images/scotland/edinburgh.jpg";
const headerMark = "/images/branding/castle-windmill.png";
const siteTitle = "Diana & Mina's European Adventure";
const hotelMapsUrl = "https://maps.app.goo.gl/XGjTeYouGkLRFCEk7";

export default function App() {
  if (window.location.pathname === recommendationsPath) {
    document.title = "Desmond's Amsterdam Recommendations";
    return <RecommendationsPage />;
  }

  if (window.location.pathname === emergencyPath) {
    document.title = "In Case of Emergency";
    return <EmergencyPage />;
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
        <OfflineDownloads />
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

function OfflineDownloads() {
  return (
    <section id="offline-downloads" className="bg-parchment px-6 py-14 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl rounded-lg border border-brass/25 bg-cream p-6 shadow-soft sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.65fr_1.35fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-canal">
              Offline Downloads
            </p>
            <h2 className="mt-3 font-serif text-4xl leading-tight text-highland">
              Save Before You Go
            </h2>
            <p className="mt-4 leading-7 text-ink">
              Save these to your phone before the trip so they're available without service.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {downloads.map((item) => (
              <DownloadCard key={item.href} item={item} />
            ))}
            <DownloadPlaceholder title="Amsterdam Map" />
            <DownloadPlaceholder title="Edinburgh Map" />
          </div>
        </div>
      </div>
    </section>
  );
}

function DownloadCard({ item }: { item: (typeof downloads)[number] }) {
  return (
    <article className="rounded-md border border-brass/25 bg-parchment p-4">
      <h3 className="font-serif text-2xl leading-tight text-highland">
        {item.title}
      </h3>
      <a className="action-button mt-4 min-h-12 w-full justify-center px-4" href={item.href} download={item.fileName}>
        <Download aria-hidden="true" size={16} />
        {item.label}
      </a>
    </article>
  );
}

function DownloadPlaceholder({ title }: { title: string }) {
  return (
    <article className="rounded-md border border-brass/25 bg-parchment/75 p-4">
      <h3 className="font-serif text-2xl leading-tight text-highland">
        {title}
      </h3>
      <span className="action-button action-button-disabled mt-4 min-h-12 w-full justify-center px-4" aria-disabled="true">
        Coming Soon
      </span>
    </article>
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

        <nav aria-label="Main navigation" className="grid grid-cols-4 items-center gap-2 pb-1 lg:flex lg:gap-7">
          <a className="nav-link" href="/#overview">Overview</a>
          <a className="nav-link" href="/#amsterdam">Amsterdam</a>
          <a className="nav-link" href="/#scotland">Scotland</a>
          <a className="nav-link" href="/#trip-details">Trip Details</a>
          <a className="nav-link" href={emergencyPath}>Emergency</a>
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
            src={amsterdamHeroPhoto}
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
          <a className="action-button mt-6 min-h-12 px-4" href="/downloads/trip-guide.pdf" download="Diana-Mina-European-Adventure-Trip-Guide.pdf">
            <Download aria-hidden="true" size={16} />
            Download Trip Guide PDF
          </a>
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
              src={isScotland ? scotlandPhoto : amsterdamSectionPhoto}
              alt={isScotland ? "View of Edinburgh, Scotland." : "View of Amsterdam"}
              loading="lazy"
              className={`${isAmsterdam ? "mt-8" : ""} aspect-[16/9] w-full rounded-md object-cover ${isScotland ? "object-[55%_45%]" : "object-[50%_48%]"}`}
            />
          ) : (
            <Thistle className="h-32 w-28 opacity-55" />
          )}
          <p className="mt-8 font-serif text-3xl text-highland">Coming Soon</p>
          <DestinationConsiderations id={isScotland ? "scotland" : "amsterdam"} />
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

function DestinationConsiderations({ id }: { id: "amsterdam" | "scotland" }) {
  const considerations = getDestinationConsiderations(id);

  if (!considerations) return null;

  return (
    <div className="mt-10 border-t border-brass/30 pt-8">
      <div className="mb-6">
        <h3 className="font-serif text-4xl leading-tight text-highland sm:text-5xl">
          {considerations.title}
        </h3>
        <p className="mt-3 max-w-xl leading-7 text-ink">
          {considerations.intro}
        </p>
      </div>
      <div className="grid gap-8">
        {considerations.groups.map((group) => (
          <section key={group.id} aria-labelledby={`${id}-${group.id}`}>
            <div className="mb-4 flex items-center gap-4">
              <h4 id={`${id}-${group.id}`} className="font-serif text-3xl leading-tight text-highland">
                {group.label}
              </h4>
              <span className="h-px flex-1 bg-brass/35" aria-hidden="true" />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {group.places.map((place) => (
                <article
                  key={place.id}
                  className="rounded-md border border-brass/25 bg-cream/85 p-5 shadow-soft"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h5 className="font-serif text-2xl leading-tight text-highland">
                        {place.name}
                      </h5>
                      <p className={`mt-1 text-sm font-bold uppercase tracking-[0.14em] ${place.country === "England" ? "text-heather" : "text-moss"}`}>
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
          </section>
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <a className="inline-flex min-h-12 items-center gap-2 rounded-md border border-brass/35 bg-cream px-5 text-sm font-bold uppercase tracking-[0.14em] text-highland shadow-soft transition hover:bg-parchment focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tulip" href="/">
              <ArrowLeft aria-hidden="true" size={17} />
              Back to Trip Guide
            </a>
            <a className="action-button min-h-12 px-4" href={emergencyPath}>
              <PhoneCall aria-hidden="true" size={16} />
              Emergency
            </a>
            <a className="action-button min-h-12 px-4" href="/downloads/dezrecs.pdf" download="Diana-Mina-Amsterdam-Recommendations.pdf">
              <Download aria-hidden="true" size={16} />
              Download dezrecs PDF
            </a>
          </div>
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

function EmergencyPage() {
  return (
    <div className="min-h-screen bg-parchment text-highland">
      <SiteHeader />
      <main className="px-5 py-6 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <a className="inline-flex min-h-12 items-center gap-2 rounded-md border border-brass/35 bg-cream px-5 text-sm font-bold uppercase tracking-[0.14em] text-highland shadow-soft transition hover:bg-parchment focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tulip" href="/">
            <ArrowLeft aria-hidden="true" size={17} />
            Back to Trip Guide
          </a>

          <header className="py-8 sm:py-10">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-tulip">
              Emergency
            </p>
            <h1 className="mt-3 font-serif text-5xl leading-tight text-highland sm:text-7xl">
              In Case of Emergency
            </h1>
          </header>

          <section className="rounded-lg border border-brass/35 bg-cream p-5 shadow-soft sm:p-7">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-tulip">
              Emergency
            </p>
            <div className="mt-3 grid gap-1 font-serif text-2xl leading-tight text-highland sm:text-3xl">
              <p>Call 112 in Amsterdam</p>
              <p>Call 999 or 112 in Edinburgh</p>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <EmergencyNumberCard city="Amsterdam" number="112" href="tel:112" />
              <EmergencyNumberCard city="Edinburgh" number="999" href="tel:999" secondaryNumber="112" secondaryHref="tel:112" />
            </div>
            <a className="action-button mt-5 min-h-12 px-4" href="/downloads/emergency.pdf" download="Diana-Mina-Emergency-Contacts.pdf">
              <Download aria-hidden="true" size={16} />
              Download Emergency PDF
            </a>
          </section>

          <QuickCallGuide />

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {emergencyCities.map((city) => (
              <section key={city.name} aria-labelledby={`${city.name.toLowerCase()}-emergency`}>
                <div className="mb-5 flex items-center gap-4">
                  <h2 id={`${city.name.toLowerCase()}-emergency`} className="font-serif text-4xl text-highland sm:text-5xl">
                    {city.name}
                  </h2>
                  <span className="h-px flex-1 bg-brass/55" aria-hidden="true" />
                </div>
                <div className="grid gap-4">
                  {city.contacts.map((contact) => (
                    <EmergencyContactCard key={contact.title} contact={contact} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-10 rounded-lg border border-brass/30 bg-cream p-5 shadow-soft sm:p-7">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-canal">
              {stateDepartmentFallback.title}
            </p>
            <p className="mt-3 max-w-3xl leading-7 text-ink">
              {stateDepartmentFallback.description}
            </p>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-moss">
              {stateDepartmentFallback.label}
            </p>
            <a className="mt-3 inline-flex min-h-14 items-center justify-center gap-2 rounded-md border border-brass/45 bg-parchment px-5 text-base font-extrabold uppercase tracking-[0.12em] text-highland transition hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tulip" href={stateDepartmentFallback.href}>
              <PhoneCall aria-hidden="true" size={18} />
              {stateDepartmentFallback.number}
            </a>
          </section>
        </div>
      </main>
    </div>
  );
}

function EmergencyNumberCard({ city, number, href, secondaryNumber, secondaryHref }: { city: string; number: string; href: string; secondaryNumber?: string; secondaryHref?: string }) {
  return (
    <article className="rounded-md border border-brass/25 bg-parchment p-5">
      <h2 className="font-serif text-3xl leading-tight text-highland">{city}</h2>
      <a className="mt-4 flex min-h-16 items-center justify-center gap-3 rounded-md border border-tulip/30 bg-highland px-5 text-lg font-extrabold uppercase tracking-[0.12em] text-cream shadow-soft transition hover:bg-canal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tulip" href={href}>
        <PhoneCall aria-hidden="true" size={22} />
        Call {number}
      </a>
      {secondaryNumber && secondaryHref ? (
        <a className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-md border border-brass/45 bg-cream px-4 text-sm font-extrabold uppercase tracking-[0.12em] text-highland transition hover:bg-parchment focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tulip" href={secondaryHref}>
          <PhoneCall aria-hidden="true" size={16} />
          Or call {secondaryNumber}
        </a>
      ) : null}
    </article>
  );
}

function QuickCallGuide() {
  return (
    <section className="mt-8 rounded-lg border border-brass/25 bg-canal/10 p-5 sm:p-7" aria-labelledby="quick-call-guide">
      <h2 id="quick-call-guide" className="font-serif text-3xl leading-tight text-highland">
        What Do I Call?
      </h2>
      <div className="mt-5 grid gap-3">
        {quickCallGuide.map((item) => (
          <article key={item.need} className="rounded-md border border-brass/20 bg-cream/90 p-4">
            <h3 className="font-bold leading-6 text-ink">{item.need}</h3>
            <div className="mt-3 grid gap-2 text-sm font-bold uppercase tracking-[0.1em] sm:grid-cols-2">
              {item.amsterdam ? <p>Amsterdam → {item.amsterdam}</p> : null}
              <p>Edinburgh → {item.edinburgh}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EmergencyContactCard({ contact }: { contact: (typeof emergencyCities)[number]["contacts"][number] }) {
  const primaryAction = contact.actions.find((action) => action.emphasis === "primary");
  const secondaryActions = contact.actions.filter((action) => action !== primaryAction);

  return (
    <article className="rounded-lg border border-brass/25 bg-cream p-5 shadow-soft sm:p-6">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-canal">
        {contact.title}
      </p>
      {contact.number ? (
        <p className="mt-3 font-serif text-5xl leading-none text-highland">
          {contact.number}
        </p>
      ) : null}
      {contact.label ? (
        <h3 className="mt-3 font-serif text-2xl leading-tight text-highland">
          {contact.label}
        </h3>
      ) : null}
      {contact.address ? (
        <address className="mt-3 not-italic leading-7 text-ink">
          {contact.address.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
      ) : null}
      {contact.description ? (
        <p className="mt-3 leading-7 text-ink">
          {contact.description}
        </p>
      ) : null}
      <div className="mt-5 grid gap-3">
        {primaryAction ? <CallAction action={primaryAction} /> : null}
        {secondaryActions.map((action) => (
          <CallAction key={action.href} action={action} />
        ))}
      </div>
      {contact.warning ? (
        <p className="mt-5 border-l-2 border-tulip/55 pl-3 text-sm font-extrabold uppercase tracking-[0.1em] text-highland">
          {contact.warning}
        </p>
      ) : null}
    </article>
  );
}

function CallAction({ action }: { action: (typeof emergencyCities)[number]["contacts"][number]["actions"][number] }) {
  const isPrimary = action.emphasis === "primary";

  return (
    <a
      className={`${isPrimary ? "min-h-16 bg-highland text-cream hover:bg-canal" : "min-h-12 bg-parchment text-highland hover:bg-cream"} inline-flex items-center justify-center gap-2 rounded-md border border-brass/45 px-5 py-3 text-center text-sm font-extrabold uppercase leading-5 tracking-[0.1em] shadow-soft transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tulip sm:text-base`}
      href={action.href}
    >
      <PhoneCall aria-hidden="true" size={isPrimary ? 21 : 17} />
      {action.label}
    </a>
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
