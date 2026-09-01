import { ExternalLink, MapPin } from "lucide-react";
import type { Recommendation } from "../data/recommendations";

type RecommendationsListProps = {
  recommendations: Recommendation[];
};

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  if (recommendations.length === 0) {
    return (
      <div className="rounded-lg border border-canal/18 bg-cream/82 p-6 text-center shadow-soft sm:p-8">
        <p className="font-serif text-2xl text-highland">Recommendations coming soon.</p>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-heather">
          Placeholder content
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-7">
      {recommendations.map((recommendation) => (
        <RecommendationCard key={recommendation.id} recommendation={recommendation} />
      ))}
    </div>
  );
}

function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const meta = [recommendation.category, recommendation.neighborhood].filter(Boolean).join(" · ");

  return (
    <article className="overflow-hidden rounded-lg border border-highland/10 bg-cream shadow-soft">
      {recommendation.image ? (
        <div className="aspect-[4/3] w-full overflow-hidden bg-canal/10 sm:aspect-[16/9]">
          <img
            src={recommendation.image}
            alt={recommendation.imageAlt ?? ""}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <div className="p-5 sm:p-7">
        <h2 className="font-serif text-3xl leading-tight text-highland">{recommendation.name}</h2>
        {meta ? <p className="mt-2 text-sm font-bold uppercase tracking-[0.14em] text-canal">{meta}</p> : null}
        {recommendation.description ? (
          <p className="mt-5 text-base leading-7 text-ink/78">{recommendation.description}</p>
        ) : null}
        {recommendation.personalNote ? (
          <p className="mt-4 border-l-2 border-brass pl-4 text-sm leading-6 text-ink/72">
            {recommendation.personalNote}
          </p>
        ) : null}
        {recommendation.address ? <p className="mt-5 text-sm font-semibold text-highland">{recommendation.address}</p> : null}
        <div className="mt-5 flex flex-wrap gap-3">
          {recommendation.mapUrl ? (
            <a className="action-button" href={recommendation.mapUrl} target="_blank" rel="noreferrer">
              <MapPin aria-hidden="true" size={16} />
              Open in Maps
            </a>
          ) : null}
          {recommendation.websiteUrl ? (
            <a className="action-button" href={recommendation.websiteUrl} target="_blank" rel="noreferrer">
              <ExternalLink aria-hidden="true" size={16} />
              Website
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
