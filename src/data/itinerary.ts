export type Period = "Morning" | "Afternoon" | "Evening" | "Travel";

export type ItineraryItem = {
  time?: string;
  title: string;
  description: string;
  address?: string;
  mapUrl?: string;
  websiteUrl?: string;
  reservationRequired?: boolean;
  transportation?: string;
  notes?: string;
  image?: {
    src: string;
    alt: string;
  };
  placeholder?: boolean;
};

export type DaySection = {
  period: Period;
  items: ItineraryItem[];
};

export type TripDay = {
  id: string;
  dayNumber: number;
  date: string;
  city: string;
  country: "Scotland" | "Netherlands";
  title: string;
  subtitle?: string;
  heroImage?: {
    src: string;
    alt: string;
  };
  placeholder: boolean;
  sections: DaySection[];
};

const image = {
  src: "/images/scotland-amsterdam-hero.png",
  alt: "Editorial placeholder blending Scottish Highlands with Amsterdam canal houses.",
};

export const itinerary: TripDay[] = [
  {
    id: "scotland-day-1",
    dayNumber: 1,
    date: "Date coming soon",
    city: "Scotland",
    country: "Scotland",
    title: "Arrival in Scotland",
    subtitle: "Sample day only — replace once travel plans are confirmed.",
    heroImage: image,
    placeholder: true,
    sections: [
      {
        period: "Morning",
        items: [
          {
            title: "Arrival / transportation placeholder",
            description: "Add airport, train, or car pickup details when confirmed.",
            transportation: "Transportation details coming soon.",
            placeholder: true,
          },
        ],
      },
      {
        period: "Afternoon",
        items: [
          {
            title: "Check-in placeholder",
            description: "Accommodation name, address, check-in time, and map link will be added later.",
            placeholder: true,
          },
          {
            title: "Neighborhood stroll",
            description: "A gentle first walk near the home base, pending the actual location.",
            placeholder: true,
          },
        ],
      },
      {
        period: "Evening",
        items: [
          {
            title: "Welcome dinner placeholder",
            description: "Add a confirmed restaurant or casual dinner plan once chosen.",
            reservationRequired: true,
            placeholder: true,
          },
        ],
      },
    ],
  },
  {
    id: "scotland-day-2",
    dayNumber: 2,
    date: "Date coming soon",
    city: "Scotland",
    country: "Scotland",
    title: "Castles & Old Streets",
    subtitle: "Sample day only — no castles or bookings are confirmed yet.",
    heroImage: image,
    placeholder: true,
    sections: [
      {
        period: "Morning",
        items: [
          {
            title: "Historic streets placeholder",
            description: "Add the actual town, walking route, or guided tour details later.",
            placeholder: true,
          },
        ],
      },
      {
        period: "Afternoon",
        items: [
          {
            title: "Castle visit placeholder",
            description: "Replace with a confirmed castle, ticket link, opening times, and transport plan.",
            reservationRequired: true,
            placeholder: true,
          },
        ],
      },
      {
        period: "Evening",
        items: [
          {
            title: "Dinner / unwind placeholder",
            description: "Add dining plans or a quiet evening note once known.",
            placeholder: true,
          },
        ],
      },
    ],
  },
  {
    id: "scotland-day-3",
    dayNumber: 3,
    date: "Date coming soon",
    city: "Highlands",
    country: "Scotland",
    title: "Highlands Adventure",
    subtitle: "Sample day only — actual route and timing to be supplied.",
    heroImage: image,
    placeholder: true,
    sections: [
      {
        period: "Morning",
        items: [
          {
            title: "Highland route placeholder",
            description: "Add confirmed scenic stops, pickup times, and driving or tour notes.",
            transportation: "Route details coming soon.",
            placeholder: true,
          },
        ],
      },
      {
        period: "Afternoon",
        items: [
          {
            title: "Viewpoint / village placeholder",
            description: "Replace with real locations and map links.",
            placeholder: true,
          },
        ],
      },
      {
        period: "Evening",
        items: [
          {
            title: "Return and dinner placeholder",
            description: "Add return timing and meal plans once confirmed.",
            placeholder: true,
          },
        ],
      },
    ],
  },
  {
    id: "amsterdam-day-4",
    dayNumber: 4,
    date: "Date coming soon",
    city: "Amsterdam",
    country: "Netherlands",
    title: "Hello, Amsterdam",
    subtitle: "Sample day only — replace with confirmed travel details.",
    heroImage: image,
    placeholder: true,
    sections: [
      {
        period: "Travel",
        items: [
          {
            title: "Travel / arrival placeholder",
            description: "Add flight or train details, transfer route, and luggage plan.",
            transportation: "Arrival details coming soon.",
            placeholder: true,
          },
        ],
      },
      {
        period: "Afternoon",
        items: [
          {
            title: "Canal walk placeholder",
            description: "A first Amsterdam stroll near the home base, pending the actual neighborhood.",
            placeholder: true,
          },
        ],
      },
      {
        period: "Evening",
        items: [
          {
            title: "Dinner placeholder",
            description: "Add a confirmed restaurant, booking status, and map link later.",
            reservationRequired: true,
            placeholder: true,
          },
        ],
      },
    ],
  },
  {
    id: "amsterdam-day-5",
    dayNumber: 5,
    date: "Date coming soon",
    city: "Amsterdam",
    country: "Netherlands",
    title: "Canals & Neighborhoods",
    subtitle: "Sample day only — neighborhoods and stops are not confirmed.",
    heroImage: image,
    placeholder: true,
    sections: [
      {
        period: "Morning",
        items: [
          {
            title: "Coffee and canals placeholder",
            description: "Add a real cafe, walking route, and map links later.",
            placeholder: true,
          },
        ],
      },
      {
        period: "Afternoon",
        items: [
          {
            title: "Neighborhood wandering placeholder",
            description: "Replace with the chosen district, shops, market, or museum plan.",
            placeholder: true,
          },
        ],
      },
      {
        period: "Evening",
        items: [
          {
            title: "Canal-side evening placeholder",
            description: "Add dinner, drinks, or a canal cruise if confirmed.",
            placeholder: true,
          },
        ],
      },
    ],
  },
  {
    id: "amsterdam-day-6",
    dayNumber: 6,
    date: "Date coming soon",
    city: "Amsterdam",
    country: "Netherlands",
    title: "Art, Flowers & Amsterdam",
    subtitle: "Sample day only — no museum, flower, or ticket plans are confirmed.",
    heroImage: image,
    placeholder: true,
    sections: [
      {
        period: "Morning",
        items: [
          {
            title: "Art visit placeholder",
            description: "Add confirmed museum, ticket time, website link, and accessibility notes.",
            reservationRequired: true,
            placeholder: true,
          },
        ],
      },
      {
        period: "Afternoon",
        items: [
          {
            title: "Flower stop placeholder",
            description: "Replace with a real flower market, garden, or seasonal stop.",
            placeholder: true,
          },
        ],
      },
      {
        period: "Evening",
        items: [
          {
            title: "Final Amsterdam evening placeholder",
            description: "Add a farewell dinner or flexible evening plan when chosen.",
            placeholder: true,
          },
        ],
      },
    ],
  },
];
