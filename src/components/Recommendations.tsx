import { ExternalLink, MapPin } from "lucide-react";
import type { Recommendation } from "../data/recommendations";

type RecommendationsListProps = {
  recommendations: Recommendation[];
};

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  if (recommendations.length === 0) {
    return <p className="rounded-lg border border-brass/25 bg-cream p-8 font-serif text-3xl text-highland shadow-soft">Coming Soon</p>;
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
  const [featuredImage, ...supportingImages] = recommendation.images ?? [];

  return (
    <article className="overflow-hidden rounded-lg border border-brass/25 bg-cream shadow-soft">
      {featuredImage ? (
        <div className={supportingImages.length > 0 ? "grid gap-3 p-3 sm:grid-cols-[1.35fr_0.65fr] sm:p-4" : "p-3 sm:p-4"}>
          <div className={supportingImages.length > 0 ? "aspect-[4/3] overflow-hidden rounded-md bg-canal/10 sm:aspect-[4/3]" : "aspect-[4/3] overflow-hidden rounded-md bg-canal/10 sm:aspect-[16/9]"}>
            <img
              src={featuredImage.src}
              alt={featuredImage.alt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          {supportingImages.length > 0 ? (
            <div className="flex snap-x gap-3 overflow-x-auto pb-1 sm:grid sm:grid-rows-2 sm:overflow-visible sm:pb-0">
              {supportingImages.map((image) => (
                <div key={image.src} className="aspect-[4/3] min-w-[78%] snap-start overflow-hidden rounded-md bg-canal/10 sm:min-w-0">
                  <img src={image.src} alt={image.alt} loading="lazy" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="p-5 sm:p-7">
        <h2 className="font-serif text-3xl leading-tight text-highland sm:text-4xl">{recommendation.name}</h2>
        {recommendation.category ? (
          <p className="mt-2 text-sm font-bold uppercase tracking-[0.14em] text-canal">{recommendation.category}</p>
        ) : null}
        {recommendation.shortRecommendation ? (
          <p className="mt-5 font-serif text-2xl leading-8 text-ink">{recommendation.shortRecommendation}</p>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-3">
          {recommendation.proximityNote ? (
            <span className="proximity-note">{recommendation.proximityNote}</span>
          ) : null}
          {recommendation.mapsUrl ? (
            <a className="action-button min-h-12 px-4" href={recommendation.mapsUrl} target="_blank" rel="noreferrer">
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
          {recommendation.reservationUrl === null ? (
            <span className="action-button action-button-disabled min-h-12 px-4" aria-disabled="true">
              Reservation Link Coming Soon
            </span>
          ) : null}
          {recommendation.reservationUrl ? (
            <a className="action-button min-h-12 px-4" href={recommendation.reservationUrl} target="_blank" rel="noreferrer">
              <ExternalLink aria-hidden="true" size={16} />
              Reservation
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
