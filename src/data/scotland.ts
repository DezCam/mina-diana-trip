export type ScotlandConsideration = {
  name: string;
  location: "Edinburgh" | "England";
  mapsUrl: string;
};

export const scotlandConsiderations: ScotlandConsideration[] = [
  {
    name: "Palace of Holyroodhouse",
    location: "Edinburgh",
    mapsUrl: "https://www.google.com/maps/search/Palace+of+Holyroodhouse,+Edinburgh",
  },
  {
    name: "The Real Mary King's Close",
    location: "Edinburgh",
    mapsUrl: "https://www.google.com/maps/search/The+Real+Mary+King's+Close,+Edinburgh",
  },
  {
    name: "Victoria Street",
    location: "Edinburgh",
    mapsUrl: "https://www.google.com/maps/search/Victoria+Street,+Edinburgh",
  },
  {
    name: "Knoops",
    location: "Edinburgh",
    mapsUrl: "https://www.google.com/maps/search/Knoops,+Edinburgh",
  },
  {
    name: "St Giles' Cathedral",
    location: "Edinburgh",
    mapsUrl: "https://www.google.com/maps/search/St+Giles'+Cathedral,+Edinburgh",
  },
  {
    name: "The Georgian House",
    location: "Edinburgh",
    mapsUrl: "https://www.google.com/maps/search/The+Georgian+House,+Edinburgh",
  },
  {
    name: "Lake District National Park",
    location: "England",
    mapsUrl: "https://www.google.com/maps/search/Lake+District+National+Park,+UK",
  },
];
