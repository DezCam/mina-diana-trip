import { ArrowLeft } from "lucide-react";
import { RecommendationsList } from "../components/Recommendations";
import { recommendations } from "../data/recommendations";

export function DesmondRecommendationsPage() {
  return (
    <div className="min-h-screen bg-parchment text-ink">
      <main className="bg-[linear-gradient(180deg,rgba(61,127,152,0.18),rgba(255,249,239,0.96)_34%,rgba(246,240,229,1))]">
        <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8 lg:px-10">
          <a
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-highland/12 bg-cream/82 px-4 text-sm font-bold text-highland shadow-soft transition hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tulip"
          >
            <ArrowLeft aria-hidden="true" size={17} />
            Back to Trip Guide
          </a>

          <header className="pb-9 pt-12 sm:pb-12 sm:pt-16">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-tulip">Amsterdam</p>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-highland sm:text-6xl">
              Desmond's Amsterdam Recommendations
            </h1>
          </header>

          <RecommendationsList recommendations={recommendations} />
        </div>
      </main>
    </div>
  );
}
