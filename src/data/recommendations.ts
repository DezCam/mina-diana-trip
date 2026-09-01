export type Recommendation = {
  id: string;
  name: string;
  category?: string;
  neighborhood?: string;
  image?: string;
  imageAlt?: string;
  description?: string;
  personalNote?: string;
  address?: string;
  mapUrl?: string;
  websiteUrl?: string;
};

export const recommendations: Recommendation[] = [];
