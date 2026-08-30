export type HomeBase = {
  destination: "Scotland" | "Amsterdam";
  propertyName?: string;
  address?: string;
  neighborhood?: string;
  checkIn?: string;
  checkOut?: string;
  mapsUrl?: string;
  bookingNotes?: string;
  status: "placeholder" | "confirmed";
};

export type DetailGroup = {
  title: string;
  description: string;
  status: "placeholder" | "confirmed";
  action?: {
    label: string;
    href: string;
  };
};

export const trip = {
  title: "Mina & Diana's European Adventure",
  subtitle: "Scotland × Amsterdam",
  dates: "Coming Soon",
  tagline: "Castles, cobblestones, canals & a little adventure.",
  welcome:
    "Everything for the adventure in one place — where you're going, what you're doing, and the little details worth remembering.",
  destinations: [
    { label: "Scotland", flag: "🏴", tone: "highland" },
    { label: "Amsterdam", flag: "🇳🇱", tone: "canal" },
  ],
  homeBases: [
    {
      destination: "Scotland",
      propertyName: "Accommodation details coming soon",
      status: "placeholder",
    },
    {
      destination: "Amsterdam",
      propertyName: "Accommodation details coming soon",
      status: "placeholder",
    },
  ] satisfies HomeBase[],
  details: [
    {
      title: "Flights",
      description: "Flight times and airport notes will be added once confirmed.",
      status: "placeholder",
    },
    {
      title: "Train Travel",
      description: "Rail or transfer details between destinations are not confirmed yet.",
      status: "placeholder",
    },
    {
      title: "Accommodation",
      description: "Hotel names, neighborhoods, and check-in windows will live here.",
      status: "placeholder",
    },
    {
      title: "Emergency Information",
      description: "Local emergency numbers and embassy details can be added before departure.",
      status: "placeholder",
    },
    {
      title: "Currency",
      description: "Scotland uses GBP. Amsterdam uses EUR. Add card/cash notes later.",
      status: "placeholder",
    },
    {
      title: "Weather Links",
      description: "Reliable forecast links can be added closer to the trip.",
      status: "placeholder",
    },
    {
      title: "Transportation",
      description: "Transit passes, taxi notes, and walking routes will be added when known.",
      status: "placeholder",
    },
    {
      title: "Packing Reminders",
      description: "Layers, rain gear, walking shoes, chargers, and medication notes.",
      status: "placeholder",
    },
  ] satisfies DetailGroup[],
};
