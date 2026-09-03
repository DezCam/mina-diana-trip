import { ArrowRight, ExternalLink, MapPin } from "lucide-react";
import { recommendationGroups, type Recommendation, type RecommendationVideo as RecommendationVideoData } from "../data/recommendations";

type RecommendationsListProps = {
  recommendations: Recommendation[];
};

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  if (recommendations.length === 0) {
    return <p className="rounded-lg border border-brass/25 bg-cream p-8 font-serif text-3xl text-highland shadow-soft">Coming Soon</p>;
  }

  return (
    <div className="grid gap-14">
      {recommendationGroups.map((group) => {
        const groupRecommendations = recommendations.filter((recommendation) => recommendation.group === group.id);

        if (groupRecommendations.length === 0) {
          return null;
        }

        return (
          <section key={group.id} aria-labelledby={`${group.id}-heading`}>
            <div className="mb-6 flex items-center gap-5">
              <h2 id={`${group.id}-heading`} className="font-serif text-4xl leading-tight text-highland sm:text-5xl">
                {group.label}
              </h2>
              <span className="h-px flex-1 bg-brass/55" aria-hidden="true" />
            </div>
            <div className="grid gap-7">
              {groupRecommendations.map((recommendation) => (
                <div key={recommendation.id}>
                  <RecommendationCard recommendation={recommendation} />
                  {recommendation.video ? <RecommendationVideo video={recommendation.video} /> : null}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function RecommendationVideo({ video }: { video: RecommendationVideoData }) {
  const headingId = `${video.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-video`;

  return (
    <section className="mt-5 rounded-lg border border-brass/25 bg-cream p-3 shadow-soft sm:p-4" aria-labelledby={headingId}>
      <h3 id={headingId} className="px-2 pb-3 font-serif text-2xl leading-tight text-highland sm:text-3xl">
        {video.title}
      </h3>
      <div className="aspect-video overflow-hidden rounded-md bg-canal/10">
        <iframe
          className="h-full w-full"
          src={video.embedUrl}
          title={video.title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </section>
  );
}

function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const [featuredImage, ...supportingImages] = recommendation.images ?? [];

  return (
    <article id={recommendation.id} className="scroll-mt-28 overflow-hidden rounded-lg border border-brass/25 bg-cream shadow-soft">
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
        {recommendation.personalNote ? (
          <p className="mt-4 border-l border-brass/55 pl-4 text-base leading-7 text-ink/80 sm:text-lg">
            {recommendation.personalNote}
          </p>
        ) : null}
        {recommendation.historicalCost ? (
          <div className="mt-5 rounded-md border border-brass/30 bg-parchment/75 p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-canal">
              {recommendation.historicalCost.label}
            </p>
            <p className="mt-2 font-serif text-2xl leading-tight text-highland">
              {recommendation.historicalCost.value}
            </p>
            {recommendation.historicalCost.note ? (
              <p className="mt-2 text-sm font-bold text-moss">
                {recommendation.historicalCost.note}
              </p>
            ) : null}
          </div>
        ) : null}
        {recommendation.continueTo ? (
          <a
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md border border-brass/30 bg-parchment px-4 text-xs font-bold uppercase tracking-[0.14em] text-canal transition hover:bg-canal/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tulip"
            href={`#${recommendation.continueTo.id}`}
          >
            {recommendation.continueTo.label}
            <ArrowRight aria-hidden="true" size={15} />
          </a>
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
              {recommendation.reservationLabel ?? "Reservation"}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
