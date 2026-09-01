export type Recommendation = {
  id: string;
  name: string;
  group: RecommendationGroupId;
  category?: string;
  shortRecommendation?: string;
  personalNote?: string;
  images?: {
    src: string;
    alt: string;
  }[];
  mapsUrl?: string;
  reservationUrl?: string | null;
  proximityNote?: string;
  websiteUrl?: string;
};

export type RecommendationGroupId = "food-drink" | "things-to-do" | "treats-gifts";

export const recommendationGroups: {
  id: RecommendationGroupId;
  label: string;
}[] = [
  { id: "food-drink", label: "Food & Drink" },
  { id: "things-to-do", label: "Things to Do" },
  { id: "treats-gifts", label: "Treats & Gifts" },
];

export const recommendations: Recommendation[] = [
  {
    id: "eggs-benaddicted-prinsengracht",
    name: "Eggs Benaddicted Prinsengracht",
    group: "food-drink",
    category: "Restaurant",
    shortRecommendation: "My favorite restaurant in Amsterdam.",
    proximityNote: "Near where you're staying.",
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
    id: "blushing",
    name: "Blushing",
    group: "food-drink",
    category: "Restaurant",
    shortRecommendation: "Also really good, and close to where you're staying.",
    proximityNote: "Near where you're staying.",
    mapsUrl:
      "https://www.google.com/maps/place/Blushing/@52.3588108,4.8777835,17z/data=!3m1!4b1!4m6!3m5!1s0x47c609ef84312b37:0x3b945b98b15e15c7!8m2!3d52.3588108!4d4.8803584!16s%2Fg%2F11bw5x9_yx?entry=tts&g_ep=EgoyMDI2MDgyNi4wIPu8ASoASAFQAw%3D%3D&skid=4c4b1f09-deea-43f0-ac49-22ca0e355279",
    images: [],
  },
  {
    id: "flagship-amsterdam",
    name: "Flagship Amsterdam",
    group: "things-to-do",
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
  {
    id: "rijksmuseum",
    name: "Rijksmuseum",
    group: "things-to-do",
    category: "Museum",
    shortRecommendation: "A must-see, with good food and sweet treats.",
    personalNote:
      "I remember just being able to grab a seat and scan the QR code at the table for the menu.",
    mapsUrl: "https://maps.app.goo.gl/fZf4nKisMuGax5WG7",
    images: [],
  },
  {
    id: "hans-egstorf",
    name: "Hans Egstorf",
    group: "treats-gifts",
    category: "Treats & Gifts",
    shortRecommendation: "Freshly made stroopwafels — a great place for gifts.",
    personalNote: "A fun place to shop and people-watch.",
    mapsUrl: "https://maps.app.goo.gl/pnacyRkHXySgdA9W9",
    images: [],
  },
];
