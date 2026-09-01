import { ArrowRight, MapPinned, Sparkles } from "lucide-react";

export function DesmondRecommendationsEntry() {
  return (
    <section className="bg-[linear-gradient(180deg,rgba(255,249,239,0.92),rgba(246,240,229,0.96))] px-5 py-14 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <article className="overflow-hidden rounded-lg border border-canal/18 bg-cream shadow-soft">
          <div className="grid md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-48 bg-canal">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(23,50,77,0.92),rgba(61,127,152,0.72)),radial-gradient(circle_at_26%_28%,rgba(198,161,91,0.38),transparent_26%)]" />
              <div className="relative flex h-full min-h-48 items-end p-6 text-cream sm:p-8">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-cream/30 bg-cream/12 backdrop-blur">
                  <MapPinned aria-hidden="true" size={26} />
                </span>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-tulip">
                <Sparkles aria-hidden="true" size={15} />
                A few favorites from Desmond
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-tight text-highland sm:text-4xl">
                Desmond's Amsterdam Recommendations
              </h2>
              <a className="action-button mt-6 min-h-12 px-4" href="/desmonds-amsterdam-recommendations">
                Explore Recommendations
                <ArrowRight aria-hidden="true" size={17} />
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
