export type ConsiderationPlace = {
  id: string;
  name: string;
  location: string;
  country: "Netherlands" | "Scotland" | "England";
  mapsUrl: string;
};

export type ConsiderationGroup = {
  id: string;
  label: string;
  places: ConsiderationPlace[];
};

export type DestinationConsiderations = {
  id: "amsterdam" | "scotland";
  title: string;
  intro: string;
  groups: ConsiderationGroup[];
};

const mapSearch = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const destinationConsiderations: DestinationConsiderations[] = [
  {
    id: "amsterdam",
    title: "Places You're Considering",
    intro: "Amsterdam and Netherlands possibilities.",
    groups: [
      {
        id: "city-neighborhoods",
        label: "City & Neighborhoods",
        places: [
          {
            id: "jordaan",
            name: "Jordaan",
            location: "Amsterdam",
            country: "Netherlands",
            mapsUrl: mapSearch("Jordaan, Amsterdam, Netherlands"),
          },
          {
            id: "nine-streets",
            name: "Nine Streets",
            location: "Amsterdam",
            country: "Netherlands",
            mapsUrl: mapSearch("Nine Streets, Amsterdam, Netherlands"),
          },
          {
            id: "canal-belt",
            name: "Canal Belt",
            location: "Amsterdam",
            country: "Netherlands",
            mapsUrl: mapSearch("Canal Belt, Amsterdam, Netherlands"),
          },
          {
            id: "de-pijp",
            name: "De Pijp",
            location: "Amsterdam",
            country: "Netherlands",
            mapsUrl: mapSearch("De Pijp, Amsterdam, Netherlands"),
          },
        ],
      },
      {
        id: "parks-markets",
        label: "Parks & Markets",
        places: [
          {
            id: "vondelpark",
            name: "Vondelpark",
            location: "Amsterdam",
            country: "Netherlands",
            mapsUrl: mapSearch("Vondelpark, Amsterdam, Netherlands"),
          },
          {
            id: "albert-cuyp-market",
            name: "Albert Cuyp Market",
            location: "Amsterdam",
            country: "Netherlands",
            mapsUrl: mapSearch("Albert Cuyp Market, Amsterdam, Netherlands"),
          },
        ],
      },
      {
        id: "museums-landmarks",
        label: "Museums & Landmarks",
        places: [
          {
            id: "rijksmuseum",
            name: "Rijksmuseum",
            location: "Amsterdam",
            country: "Netherlands",
            mapsUrl: mapSearch("Rijksmuseum, Amsterdam, Netherlands"),
          },
          {
            id: "museumplein",
            name: "Museumplein",
            location: "Amsterdam",
            country: "Netherlands",
            mapsUrl: mapSearch("Museumplein, Amsterdam, Netherlands"),
          },
          {
            id: "dam-square",
            name: "Dam Square",
            location: "Amsterdam",
            country: "Netherlands",
            mapsUrl: mapSearch("Dam Square, Amsterdam, Netherlands"),
          },
          {
            id: "begijnhof",
            name: "Begijnhof",
            location: "Amsterdam",
            country: "Netherlands",
            mapsUrl: mapSearch("Begijnhof, Amsterdam, Netherlands"),
          },
          {
            id: "anne-frank-house",
            name: "Anne Frank House",
            location: "Amsterdam",
            country: "Netherlands",
            mapsUrl: mapSearch("Anne Frank House, Amsterdam, Netherlands"),
          },
        ],
      },
      {
        id: "day-trips",
        label: "Day Trips",
        places: [
          {
            id: "haarlem",
            name: "Haarlem",
            location: "Netherlands",
            country: "Netherlands",
            mapsUrl: mapSearch("Haarlem, Netherlands"),
          },
          {
            id: "grote-markt-haarlem",
            name: "Grote Markt",
            location: "Haarlem",
            country: "Netherlands",
            mapsUrl: mapSearch("Grote Markt, Haarlem, Netherlands"),
          },
          {
            id: "zaanse-schans",
            name: "Zaanse Schans",
            location: "Netherlands",
            country: "Netherlands",
            mapsUrl: mapSearch("Zaanse Schans, Netherlands"),
          },
        ],
      },
    ],
  },
  {
    id: "scotland",
    title: "Places You're Considering",
    intro: "Some ideas for your time in and around Edinburgh.",
    groups: [
      {
        id: "edinburgh",
        label: "Edinburgh",
        places: [
          {
            id: "palace-of-holyroodhouse",
            name: "Palace of Holyroodhouse",
            location: "Edinburgh",
            country: "Scotland",
            mapsUrl: "https://www.google.com/maps/search/Palace+of+Holyroodhouse,+Edinburgh",
          },
          {
            id: "the-real-mary-kings-close",
            name: "The Real Mary King's Close",
            location: "Edinburgh",
            country: "Scotland",
            mapsUrl: "https://www.google.com/maps/search/The+Real+Mary+King's+Close,+Edinburgh",
          },
          {
            id: "victoria-street",
            name: "Victoria Street",
            location: "Edinburgh",
            country: "Scotland",
            mapsUrl: "https://www.google.com/maps/search/Victoria+Street,+Edinburgh",
          },
          {
            id: "knoops",
            name: "Knoops",
            location: "Edinburgh",
            country: "Scotland",
            mapsUrl: "https://www.google.com/maps/search/Knoops,+Edinburgh",
          },
          {
            id: "st-giles-cathedral",
            name: "St Giles' Cathedral",
            location: "Edinburgh",
            country: "Scotland",
            mapsUrl: "https://www.google.com/maps/search/St+Giles'+Cathedral,+Edinburgh",
          },
          {
            id: "the-georgian-house",
            name: "The Georgian House",
            location: "Edinburgh",
            country: "Scotland",
            mapsUrl: "https://www.google.com/maps/search/The+Georgian+House,+Edinburgh",
          },
          {
            id: "edinburgh-castle",
            name: "Edinburgh Castle",
            location: "Edinburgh",
            country: "Scotland",
            mapsUrl: mapSearch("Edinburgh Castle, Edinburgh, Scotland"),
          },
          {
            id: "royal-mile",
            name: "Royal Mile",
            location: "Edinburgh",
            country: "Scotland",
            mapsUrl: mapSearch("Royal Mile, Edinburgh, Scotland"),
          },
          {
            id: "grassmarket",
            name: "Grassmarket",
            location: "Edinburgh",
            country: "Scotland",
            mapsUrl: mapSearch("Grassmarket, Edinburgh, Scotland"),
          },
          {
            id: "greyfriars",
            name: "Greyfriars",
            location: "Edinburgh",
            country: "Scotland",
            mapsUrl: mapSearch("Greyfriars, Edinburgh, Scotland"),
          },
          {
            id: "scotch-whisky-experience",
            name: "Scotch Whisky Experience",
            location: "Edinburgh",
            country: "Scotland",
            mapsUrl: mapSearch("Scotch Whisky Experience, Edinburgh, Scotland"),
          },
          {
            id: "calton-hill",
            name: "Calton Hill",
            location: "Edinburgh",
            country: "Scotland",
            mapsUrl: mapSearch("Calton Hill, Edinburgh, Scotland"),
          },
          {
            id: "arthurs-seat",
            name: "Arthur's Seat",
            location: "Edinburgh",
            country: "Scotland",
            mapsUrl: mapSearch("Arthur's Seat, Edinburgh, Scotland"),
          },
          {
            id: "stockbridge",
            name: "Stockbridge",
            location: "Edinburgh",
            country: "Scotland",
            mapsUrl: mapSearch("Stockbridge, Edinburgh, Scotland"),
          },
          {
            id: "dean-village",
            name: "Dean Village",
            location: "Edinburgh",
            country: "Scotland",
            mapsUrl: mapSearch("Dean Village, Edinburgh, Scotland"),
          },
          {
            id: "water-of-leith",
            name: "Water of Leith",
            location: "Edinburgh",
            country: "Scotland",
            mapsUrl: mapSearch("Water of Leith, Edinburgh, Scotland"),
          },
          {
            id: "old-town",
            name: "Old Town",
            location: "Edinburgh",
            country: "Scotland",
            mapsUrl: mapSearch("Old Town, Edinburgh, Scotland"),
          },
          {
            id: "new-town",
            name: "New Town",
            location: "Edinburgh",
            country: "Scotland",
            mapsUrl: mapSearch("New Town, Edinburgh, Scotland"),
          },
          {
            id: "princes-street-gardens",
            name: "Princes Street Gardens",
            location: "Edinburgh",
            country: "Scotland",
            mapsUrl: mapSearch("Princes Street Gardens, Edinburgh, Scotland"),
          },
          {
            id: "princes-street",
            name: "Princes Street",
            location: "Edinburgh",
            country: "Scotland",
            mapsUrl: mapSearch("Princes Street, Edinburgh, Scotland"),
          },
          {
            id: "scottish-parliament",
            name: "Scottish Parliament",
            location: "Edinburgh",
            country: "Scotland",
            mapsUrl: mapSearch("Scottish Parliament, Edinburgh, Scotland"),
          },
        ],
      },
      {
        id: "glencoe-highlands",
        label: "Glencoe / Highlands",
        places: [
          {
            id: "stirling",
            name: "Stirling",
            location: "Scotland",
            country: "Scotland",
            mapsUrl: mapSearch("Stirling, Scotland"),
          },
          {
            id: "stirling-castle",
            name: "Stirling Castle",
            location: "Stirling",
            country: "Scotland",
            mapsUrl: mapSearch("Stirling Castle, Stirling, Scotland"),
          },
          {
            id: "loch-lomond",
            name: "Loch Lomond",
            location: "Scotland",
            country: "Scotland",
            mapsUrl: mapSearch("Loch Lomond, Scotland"),
          },
          {
            id: "glencoe-valley",
            name: "Glencoe Valley",
            location: "Highlands",
            country: "Scotland",
            mapsUrl: mapSearch("Glencoe Valley, Scotland"),
          },
          {
            id: "three-sisters-of-glencoe",
            name: "Three Sisters of Glencoe",
            location: "Glencoe",
            country: "Scotland",
            mapsUrl: mapSearch("Three Sisters of Glencoe, Scotland"),
          },
          {
            id: "loch-achtriochtan",
            name: "Loch Achtriochtan",
            location: "Glencoe",
            country: "Scotland",
            mapsUrl: mapSearch("Loch Achtriochtan, Glencoe, Scotland"),
          },
          {
            id: "glencoe-village",
            name: "Glencoe Village",
            location: "Glencoe",
            country: "Scotland",
            mapsUrl: mapSearch("Glencoe Village, Scotland"),
          },
          {
            id: "glenfinnan",
            name: "Glenfinnan",
            location: "Highlands",
            country: "Scotland",
            mapsUrl: mapSearch("Glenfinnan, Scotland"),
          },
          {
            id: "eilean-donan-castle",
            name: "Eilean Donan Castle",
            location: "Highlands",
            country: "Scotland",
            mapsUrl: mapSearch("Eilean Donan Castle, Scotland"),
          },
          {
            id: "fort-william",
            name: "Fort William",
            location: "Highlands",
            country: "Scotland",
            mapsUrl: mapSearch("Fort William, Scotland"),
          },
          {
            id: "rannoch-moor",
            name: "Rannoch Moor",
            location: "Highlands",
            country: "Scotland",
            mapsUrl: mapSearch("Rannoch Moor, Scotland"),
          },
        ],
      },
      {
        id: "isle-of-skye",
        label: "Isle of Skye",
        places: [
          {
            id: "isle-of-skye",
            name: "Isle of Skye",
            location: "Scotland",
            country: "Scotland",
            mapsUrl: mapSearch("Isle of Skye, Scotland"),
          },
          {
            id: "portree",
            name: "Portree",
            location: "Isle of Skye",
            country: "Scotland",
            mapsUrl: mapSearch("Portree, Isle of Skye, Scotland"),
          },
          {
            id: "trotternish-peninsula",
            name: "Trotternish Peninsula",
            location: "Isle of Skye",
            country: "Scotland",
            mapsUrl: mapSearch("Trotternish Peninsula, Isle of Skye, Scotland"),
          },
          {
            id: "old-man-of-storr",
            name: "Old Man of Storr",
            location: "Isle of Skye",
            country: "Scotland",
            mapsUrl: mapSearch("Old Man of Storr, Isle of Skye, Scotland"),
          },
          {
            id: "kilt-rock",
            name: "Kilt Rock",
            location: "Isle of Skye",
            country: "Scotland",
            mapsUrl: mapSearch("Kilt Rock, Isle of Skye, Scotland"),
          },
          {
            id: "mealt-falls",
            name: "Mealt Falls",
            location: "Isle of Skye",
            country: "Scotland",
            mapsUrl: mapSearch("Mealt Falls, Isle of Skye, Scotland"),
          },
          {
            id: "quiraing",
            name: "Quiraing",
            location: "Isle of Skye",
            country: "Scotland",
            mapsUrl: mapSearch("Quiraing, Isle of Skye, Scotland"),
          },
          {
            id: "dunvegan",
            name: "Dunvegan",
            location: "Isle of Skye",
            country: "Scotland",
            mapsUrl: mapSearch("Dunvegan, Isle of Skye, Scotland"),
          },
          {
            id: "dunvegan-castle",
            name: "Dunvegan Castle",
            location: "Isle of Skye",
            country: "Scotland",
            mapsUrl: mapSearch("Dunvegan Castle, Isle of Skye, Scotland"),
          },
          {
            id: "neist-point",
            name: "Neist Point",
            location: "Isle of Skye",
            country: "Scotland",
            mapsUrl: mapSearch("Neist Point, Isle of Skye, Scotland"),
          },
          {
            id: "talisker-bay",
            name: "Talisker Bay",
            location: "Isle of Skye",
            country: "Scotland",
            mapsUrl: mapSearch("Talisker Bay, Isle of Skye, Scotland"),
          },
          {
            id: "fairy-pools",
            name: "Fairy Pools",
            location: "Isle of Skye",
            country: "Scotland",
            mapsUrl: mapSearch("Fairy Pools, Isle of Skye, Scotland"),
          },
          {
            id: "glenbrittle",
            name: "Glenbrittle",
            location: "Isle of Skye",
            country: "Scotland",
            mapsUrl: mapSearch("Glenbrittle, Isle of Skye, Scotland"),
          },
          {
            id: "cuillin-mountains",
            name: "Cuillin Mountains",
            location: "Isle of Skye",
            country: "Scotland",
            mapsUrl: mapSearch("Cuillin Mountains, Isle of Skye, Scotland"),
          },
          {
            id: "sligachan",
            name: "Sligachan",
            location: "Isle of Skye",
            country: "Scotland",
            mapsUrl: mapSearch("Sligachan, Isle of Skye, Scotland"),
          },
        ],
      },
      {
        id: "other-countries",
        label: "Other Countries",
        places: [
          {
            id: "lake-district-national-park",
            name: "Lake District National Park",
            location: "England",
            country: "England",
            mapsUrl: "https://www.google.com/maps/search/Lake+District+National+Park,+UK",
          },
        ],
      },
    ],
  },
];

export const getDestinationConsiderations = (id: DestinationConsiderations["id"]) =>
  destinationConsiderations.find((destination) => destination.id === id);
