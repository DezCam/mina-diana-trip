import { getDestinationConsiderations } from "./considerations";

export type ScotlandConsideration = {
  name: string;
  location: string;
  mapsUrl: string;
};

export const scotlandConsiderations: ScotlandConsideration[] =
  getDestinationConsiderations("scotland")?.groups.flatMap((group) =>
    group.places.map((place) => ({
      name: place.name,
      location: place.location,
      mapsUrl: place.mapsUrl,
    })),
  ) ?? [];
