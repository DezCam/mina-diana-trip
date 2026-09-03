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
  reservationLabel?: string;
  proximityNote?: string;
  historicalCost?: {
    label: string;
    value: string;
    note?: string;
  };
  video?: {
    title: string;
    url: string;
    embedUrl: string;
  };
  continueTo?: {
    id: string;
    label: string;
  };
  websiteUrl?: string;
};

export type RecommendationVideo = NonNullable<Recommendation["video"]>;

export type RecommendationGroupId = "food-drink" | "things-to-do" | "treats-gifts";

export const recommendationGroups: {
  id: RecommendationGroupId;
  label: string;
}[] = [
  { id: "food-drink", label: "Food & Drink" },
  { id: "things-to-do", label: "Things to Do" },
  { id: "treats-gifts", label: "Treats & Gifts" },
];

export const recommendationsIntroVideo: RecommendationVideo = {
  title: "Welcome to Amsterdam",
  url: "https://youtu.be/zx2u8T9yWdI",
  embedUrl: "https://www.youtube-nocookie.com/embed/zx2u8T9yWdI",
};

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
    id: "cafe-de-baron",
    name: "Cafe De Baron",
    group: "food-drink",
    category: "Drinks",
    shortRecommendation:
      "The fellas and I stopped here for good beers and vibes after shopping and wandering.",
    proximityNote: "Near De Pijp",
    mapsUrl: "https://maps.app.goo.gl/VtotJiniCWz3TW8M9",
    images: [
      {
        src: "/images/recommendations/cafe-de-baron/cafe-de-baron-exterior.jpeg",
        alt: "Exterior of Cafe De Baron in Amsterdam",
      },
    ],
  },
  {
    id: "coffeeshop-roxy",
    name: "Coffeeshop Roxy",
    group: "food-drink",
    category: "Cannabis Coffeeshop",
    shortRecommendation:
      "Just up the street from Cafe De Baron. I stopped here after beers :). Bring cash.",
    mapsUrl: "https://maps.app.goo.gl/XtEhjwkDedbdj4j89",
    images: [],
  },
  {
    id: "weteringsplantsoen",
    name: "Weteringsplantsoen",
    group: "things-to-do",
    category: "Park / Walk",
    shortRecommendation:
      "An incredible park that you have to see. It's an easy walk and close by.",
    personalNote:
      "I recommend walking through here on your way to the Bloemenmarkt.",
    video: {
      title: "Desmond's Walk to Bloemenmarkt",
      url: "https://youtu.be/EhSwr5h30Hg",
      embedUrl: "https://www.youtube-nocookie.com/embed/EhSwr5h30Hg",
    },
    mapsUrl: "https://maps.app.goo.gl/bMNoKkDEnjBvWJQ77",
    images: [],
  },
  {
    id: "bloemenmarkt",
    name: "Bloemenmarkt",
    group: "things-to-do",
    category: "Flower Market",
    mapsUrl: "https://maps.app.goo.gl/KrUW66brx1A87XJ5A",
    images: [
      {
        src: "/images/recommendations/bloemenmarkt/bloemenmarkt-market-stalls.jpeg",
        alt: "Bloemenmarkt market stalls in Amsterdam",
      },
      {
        src: "/images/recommendations/bloemenmarkt/bloemenmarkt-market-selfie.jpeg",
        alt: "Bloemenmarkt market stalls in Amsterdam",
      },
    ],
  },
  {
    id: "flagship-amsterdam",
    name: "Flagship Amsterdam",
    group: "things-to-do",
    category: "Boat Tour",
    shortRecommendation:
      "The Boat tour company, Flagship Amsterdam, was incredible — the tour is a must. It was a great way to explore the city, Drinks were included and I recommend doing this early on in the trip.",
    personalNote:
      "Totally worth it. I recommend doing this as early as possible in your trip.",
    historicalCost: {
      label: "What we paid",
      value: "$122.58 total for three people",
      note: "Prices may change.",
    },
    reservationUrl:
      "https://www.getyourguide.com/amsterdam-l36/amsterdam-luxury-canal-cruise-with-unlimited-drinks-bite-t396132/?utm_medium=sharing&utm_campaign=activity_details_ios",
    reservationLabel: "Book Canal Cruise",
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
    shortRecommendation:
      "Freshly made stroopwafels — a great place for gifts. This is where I bought the stroop waffle gift bags, and they make the stroop waffles right in front of you.",
    personalNote: "A fun place to shop and people-watch.",
    mapsUrl: "https://maps.app.goo.gl/pnacyRkHXySgdA9W9",
    images: [
      {
        src: "/images/recommendations/hans-egstorf/hans-egstorf-stroopwafels.jpeg",
        alt: "Fresh stroopwafels at Hans Egstorf",
      },
      {
        src: "/images/recommendations/hans-egstorf/hans-egstorf-shop.jpeg",
        alt: "Hans Egstorf shop window in Amsterdam",
      },
    ],
  },
];
