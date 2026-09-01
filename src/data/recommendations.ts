export type Recommendation = {
  id: string;
  name: string;
  category?: string;
  shortRecommendation?: string;
  images?: {
    src: string;
    alt: string;
  }[];
  mapsUrl?: string;
  reservationUrl?: string | null;
  websiteUrl?: string;
};

export const recommendations: Recommendation[] = [
  {
    id: "eggs-benaddicted-prinsengracht",
    name: "Eggs Benaddicted Prinsengracht",
    category: "Restaurant",
    shortRecommendation: "My favorite restaurant in Amsterdam.",
    mapsUrl:
      "https://www.google.com/maps/place/Eggs+Benaddicted+Prinsengracht/@52.364388,4.8843264,19z/data=!4m6!3m5!1s0x47c609c9b0259f8b:0xfa8c0f7d53d9f5b4!8m2!3d52.364388!4d4.8849487!16s%2Fg%2F11mvkb6b16?entry=tts&g_ep=EgoyMDI2MDgyNi4wIPu8ASoASAFQAw%3D%3D&skid=7f00d923-7d40-4c48-bccb-59a060c9ea65",
    images: [
      {
        src: "/images/recommendations/eggs-benaddicted-prinsengracht/table-spread.jpeg",
        alt: "Breakfast dishes and drinks at Eggs Benaddicted Prinsengracht",
      },
      {
        src: "/images/recommendations/eggs-benaddicted-prinsengracht/eggs-benedict.jpeg",
        alt: "Eggs Benedict with spinach",
      },
      {
        src: "/images/recommendations/eggs-benaddicted-prinsengracht/desmond-and-friends.jpeg",
        alt: "Desmond and friends dining at Eggs Benaddicted Prinsengracht",
      },
    ],
  },
  {
    id: "flagship-amsterdam",
    name: "Flagship Amsterdam",
    category: "Boat Tour",
    shortRecommendation:
      "The Boat tour company, Flagship Amsterdam, was incredible — the tour is a must. It was a great way to explore the city, Drinks were included and I recommend doing this early on in the trip.",
    reservationUrl: null,
    images: [
      {
        src: "/images/recommendations/flagship-amsterdam/flagship-amsterdam-boat-tour.jpeg",
        alt: "Flagship Amsterdam boat docked along the canal",
      },
    ],
  },
];
