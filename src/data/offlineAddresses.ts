export type OfflineAddressStatus =
  | "VERIFIED ADDRESS"
  | "VERIFIED LOCATION LABEL"
  | "NO SINGLE STREET ADDRESS"
  | "UNRESOLVED";

export type OfflineAddress = {
  id: string;
  lines: string[];
  status: OfflineAddressStatus;
  sourceUrl: string;
};

export const offlineAddresses: Record<string, OfflineAddress> = {
  "max-brown-hotel-museum-square": {
    id: "max-brown-hotel-museum-square",
    lines: ["Jan Luijkenstraat 13-15", "1071 CJ Amsterdam"],
    status: "VERIFIED ADDRESS",
    sourceUrl: "https://maps.app.goo.gl/GzzUFzn2gMcURruFA",
  },
  "eggs-benaddicted-prinsengracht": {
    id: "eggs-benaddicted-prinsengracht",
    lines: ["Prinsengracht 474", "1017 KG Amsterdam", "Netherlands"],
    status: "VERIFIED ADDRESS",
    sourceUrl:
      "https://www.google.com/maps/place/Eggs+Benaddicted+Prinsengracht/@52.364388,4.8843264,19z/data=!4m6!3m5!1s0x47c609c9b0259f8b:0xfa8c0f7d53d9f5b4!8m2!3d52.364388!4d4.8849487!16s%2Fg%2F11mvkb6b16?entry=tts&g_ep=EgoyMDI2MDgyNi4wIPu8ASoASAFQAw%3D%3D&skid=7f00d923-7d40-4c48-bccb-59a060c9ea65",
  },
  blushing: {
    id: "blushing",
    lines: ["Paulus Potterstraat 30A", "1071 DA Amsterdam", "Netherlands"],
    status: "VERIFIED ADDRESS",
    sourceUrl:
      "https://www.google.com/maps/place/Blushing/@52.3588108,4.8777835,17z/data=!3m1!4b1!4m6!3m5!1s0x47c609ef84312b37:0x3b945b98b15e15c7!8m2!3d52.3588108!4d4.8803584!16s%2Fg%2F11bw5x9_yx?entry=tts&g_ep=EgoyMDI2MDgyNi4wIPu8ASoASAFQAw%3D%3D&skid=4c4b1f09-deea-43f0-ac49-22ca0e355279",
  },
  "cafe-de-baron": {
    id: "cafe-de-baron",
    lines: ["Tweede Jacob van Campenstraat 150H", "1073 XZ Amsterdam", "Netherlands"],
    status: "VERIFIED ADDRESS",
    sourceUrl: "https://maps.app.goo.gl/VtotJiniCWz3TW8M9",
  },
  "coffeeshop-roxy": {
    id: "coffeeshop-roxy",
    lines: ["Gerard Doustraat 188", "1073 XA Amsterdam", "Netherlands"],
    status: "VERIFIED ADDRESS",
    sourceUrl: "https://maps.app.goo.gl/XtEhjwkDedbdj4j89",
  },
  "house-of-rituals": {
    id: "house-of-rituals",
    lines: ["Spui 10", "1012 PR Amsterdam"],
    status: "VERIFIED ADDRESS",
    sourceUrl: "https://maps.app.goo.gl/1DBjhPfdNTB5WUx28",
  },
  weteringsplantsoen: {
    id: "weteringsplantsoen",
    lines: ["Weteringsplantsoen", "Amsterdam", "Netherlands"],
    status: "VERIFIED LOCATION LABEL",
    sourceUrl: "https://maps.app.goo.gl/bMNoKkDEnjBvWJQ77",
  },
  bloemenmarkt: {
    id: "bloemenmarkt",
    lines: ["Singel 630 to 600", "1017 AZ Amsterdam", "Netherlands"],
    status: "VERIFIED LOCATION LABEL",
    sourceUrl: "https://maps.app.goo.gl/KrUW66brx1A87XJ5A",
  },
  "red-light-district": {
    id: "red-light-district",
    lines: ["De Wallen", "Amsterdam, Netherlands"],
    status: "NO SINGLE STREET ADDRESS",
    sourceUrl:
      "https://www.google.com/maps/search/?api=1&query=De%20Wallen%2C%20Amsterdam%2C%20Netherlands",
  },
  "flagship-amsterdam": {
    id: "flagship-amsterdam",
    lines: ["Departure point: check booking confirmation"],
    status: "UNRESOLVED",
    sourceUrl:
      "https://www.getyourguide.com/amsterdam-l36/amsterdam-luxury-canal-cruise-with-unlimited-drinks-bite-t396132/?utm_medium=sharing&utm_campaign=activity_details_ios",
  },
  rijksmuseum: {
    id: "rijksmuseum",
    lines: ["Museumstraat 1", "1071 XX Amsterdam", "Netherlands"],
    status: "VERIFIED ADDRESS",
    sourceUrl: "https://maps.app.goo.gl/fZf4nKisMuGax5WG7",
  },
  "hans-egstorf": {
    id: "hans-egstorf",
    lines: ["Spuistraat 274", "1012 VX Amsterdam", "Netherlands"],
    status: "VERIFIED ADDRESS",
    sourceUrl: "https://maps.app.goo.gl/pnacyRkHXySgdA9W9",
  },
  jordaan: {
    id: "jordaan",
    lines: ["Jordaan", "Amsterdam", "Netherlands"],
    status: "NO SINGLE STREET ADDRESS",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Jordaan%2C%20Amsterdam%2C%20Netherlands",
  },
  "nine-streets": {
    id: "nine-streets",
    lines: ["Wolvenstraat 9", "1016 EM Amsterdam", "Netherlands"],
    status: "VERIFIED LOCATION LABEL",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Nine%20Streets%2C%20Amsterdam%2C%20Netherlands",
  },
  "canal-belt": {
    id: "canal-belt",
    lines: ["Canal Belt", "Amsterdam", "Netherlands"],
    status: "NO SINGLE STREET ADDRESS",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Canal%20Belt%2C%20Amsterdam%2C%20Netherlands",
  },
  "de-pijp": {
    id: "de-pijp",
    lines: ["De Pijp", "Amsterdam", "Netherlands"],
    status: "NO SINGLE STREET ADDRESS",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=De%20Pijp%2C%20Amsterdam%2C%20Netherlands",
  },
  vondelpark: {
    id: "vondelpark",
    lines: ["1071 AA Amsterdam", "Netherlands"],
    status: "VERIFIED LOCATION LABEL",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Vondelpark%2C%20Amsterdam%2C%20Netherlands",
  },
  "albert-cuyp-market": {
    id: "albert-cuyp-market",
    lines: ["Albert Cuypstraat", "1073 BD Amsterdam", "Netherlands"],
    status: "VERIFIED LOCATION LABEL",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Albert%20Cuyp%20Market%2C%20Amsterdam%2C%20Netherlands",
  },
  museumplein: {
    id: "museumplein",
    lines: ["Museumplein", "1071 DJ Amsterdam", "Netherlands"],
    status: "VERIFIED LOCATION LABEL",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Museumplein%2C%20Amsterdam%2C%20Netherlands",
  },
  "dam-square": {
    id: "dam-square",
    lines: ["Dam", "1012 RJ Amsterdam", "Netherlands"],
    status: "VERIFIED LOCATION LABEL",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Dam%20Square%2C%20Amsterdam%2C%20Netherlands",
  },
  begijnhof: {
    id: "begijnhof",
    lines: ["Begijnhof 30", "1012 WT Amsterdam", "Netherlands"],
    status: "VERIFIED ADDRESS",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Begijnhof%2C%20Amsterdam%2C%20Netherlands",
  },
  "anne-frank-house": {
    id: "anne-frank-house",
    lines: ["Westermarkt 20", "1016 DK Amsterdam", "Netherlands"],
    status: "VERIFIED ADDRESS",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Anne%20Frank%20House%2C%20Amsterdam%2C%20Netherlands",
  },
  haarlem: {
    id: "haarlem",
    lines: ["Haarlem", "Netherlands"],
    status: "NO SINGLE STREET ADDRESS",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Haarlem%2C%20Netherlands",
  },
  "grote-markt-haarlem": {
    id: "grote-markt-haarlem",
    lines: ["Grote Markt", "2011 RD Haarlem", "Netherlands"],
    status: "VERIFIED LOCATION LABEL",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Grote%20Markt%2C%20Haarlem%2C%20Netherlands",
  },
  "zaanse-schans": {
    id: "zaanse-schans",
    lines: ["Schansend 7", "1509 AW Zaandam", "Netherlands"],
    status: "VERIFIED LOCATION LABEL",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Zaanse%20Schans%2C%20Netherlands",
  },
  "palace-of-holyroodhouse": {
    id: "palace-of-holyroodhouse",
    lines: ["Canongate", "Edinburgh EH8 8DX", "United Kingdom"],
    status: "VERIFIED ADDRESS",
    sourceUrl: "https://www.google.com/maps/search/Palace+of+Holyroodhouse,+Edinburgh",
  },
  "the-real-mary-kings-close": {
    id: "the-real-mary-kings-close",
    lines: ["2 Warriston's Close", "High Street", "Edinburgh EH1 1PG", "United Kingdom"],
    status: "VERIFIED ADDRESS",
    sourceUrl: "https://www.google.com/maps/search/The+Real+Mary+King's+Close,+Edinburgh",
  },
  "victoria-street": {
    id: "victoria-street",
    lines: ["Victoria St", "Edinburgh", "United Kingdom"],
    status: "NO SINGLE STREET ADDRESS",
    sourceUrl: "https://www.google.com/maps/search/Victoria+Street,+Edinburgh",
  },
  knoops: {
    id: "knoops",
    lines: ["11-15 Victoria Street", "Edinburgh EH1 2HE", "United Kingdom"],
    status: "VERIFIED ADDRESS",
    sourceUrl: "https://www.google.com/maps/search/Knoops,+Edinburgh",
  },
  "st-giles-cathedral": {
    id: "st-giles-cathedral",
    lines: ["High Street", "Edinburgh EH1 1RE", "United Kingdom"],
    status: "VERIFIED ADDRESS",
    sourceUrl: "https://www.google.com/maps/search/St+Giles'+Cathedral,+Edinburgh",
  },
  "the-georgian-house": {
    id: "the-georgian-house",
    lines: ["7 Charlotte Square", "Edinburgh EH2 4DR", "United Kingdom"],
    status: "VERIFIED ADDRESS",
    sourceUrl: "https://www.google.com/maps/search/The+Georgian+House,+Edinburgh",
  },
  "edinburgh-castle": {
    id: "edinburgh-castle",
    lines: ["Castlehill", "Edinburgh EH1 2NG", "United Kingdom"],
    status: "VERIFIED ADDRESS",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Edinburgh%20Castle%2C%20Edinburgh%2C%20Scotland",
  },
  "royal-mile": {
    id: "royal-mile",
    lines: ["Edinburgh EH1 1QS", "United Kingdom"],
    status: "VERIFIED LOCATION LABEL",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Royal%20Mile%2C%20Edinburgh%2C%20Scotland",
  },
  grassmarket: {
    id: "grassmarket",
    lines: ["Grassmarket", "Edinburgh EH1", "United Kingdom"],
    status: "NO SINGLE STREET ADDRESS",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Grassmarket%2C%20Edinburgh%2C%20Scotland",
  },
  greyfriars: {
    id: "greyfriars",
    lines: ["Greyfriars Place", "Edinburgh EH1 2QQ", "United Kingdom"],
    status: "VERIFIED LOCATION LABEL",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Greyfriars%2C%20Edinburgh%2C%20Scotland",
  },
  "scotch-whisky-experience": {
    id: "scotch-whisky-experience",
    lines: ["354 Castlehill", "The Royal Mile", "Edinburgh EH1 2NE", "United Kingdom"],
    status: "VERIFIED ADDRESS",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Scotch%20Whisky%20Experience%2C%20Edinburgh%2C%20Scotland",
  },
  "calton-hill": {
    id: "calton-hill",
    lines: ["Calton Hill", "Edinburgh EH7 5AA", "United Kingdom"],
    status: "VERIFIED LOCATION LABEL",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Calton%20Hill%2C%20Edinburgh%2C%20Scotland",
  },
  "arthurs-seat": {
    id: "arthurs-seat",
    lines: ["Edinburgh EH15 3PY", "United Kingdom"],
    status: "VERIFIED LOCATION LABEL",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Arthur's%20Seat%2C%20Edinburgh%2C%20Scotland",
  },
  stockbridge: {
    id: "stockbridge",
    lines: ["Stockbridge", "Edinburgh", "United Kingdom"],
    status: "NO SINGLE STREET ADDRESS",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Stockbridge%2C%20Edinburgh%2C%20Scotland",
  },
  "dean-village": {
    id: "dean-village",
    lines: ["Dean Village", "Edinburgh EH4 3AY", "United Kingdom"],
    status: "VERIFIED LOCATION LABEL",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Dean%20Village%2C%20Edinburgh%2C%20Scotland",
  },
  "old-town": {
    id: "old-town",
    lines: ["Old Town", "Edinburgh", "United Kingdom"],
    status: "NO SINGLE STREET ADDRESS",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Old%20Town%2C%20Edinburgh%2C%20Scotland",
  },
  "new-town": {
    id: "new-town",
    lines: ["New Town", "Edinburgh", "United Kingdom"],
    status: "NO SINGLE STREET ADDRESS",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=New%20Town%2C%20Edinburgh%2C%20Scotland",
  },
  "princes-street-gardens": {
    id: "princes-street-gardens",
    lines: ["Princes St.", "Edinburgh EH2 2HG", "United Kingdom"],
    status: "VERIFIED LOCATION LABEL",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Princes%20Street%20Gardens%2C%20Edinburgh%2C%20Scotland",
  },
  "princes-street": {
    id: "princes-street",
    lines: ["Princes Street", "Edinburgh", "Scotland"],
    status: "NO SINGLE STREET ADDRESS",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Princes%20Street%2C%20Edinburgh%2C%20Scotland",
  },
  "scottish-parliament": {
    id: "scottish-parliament",
    lines: ["Horse Wynd", "Edinburgh EH99 1SP", "United Kingdom"],
    status: "VERIFIED ADDRESS",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Scottish%20Parliament%2C%20Edinburgh%2C%20Scotland",
  },
  "water-of-leith": {
    id: "water-of-leith",
    lines: ["Water of Leith", "Edinburgh", "Scotland"],
    status: "NO SINGLE STREET ADDRESS",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Water%20of%20Leith%2C%20Edinburgh%2C%20Scotland",
  },
  "lake-district-national-park": {
    id: "lake-district-national-park",
    lines: ["Lake District National Park", "England", "United Kingdom"],
    status: "NO SINGLE STREET ADDRESS",
    sourceUrl: "https://www.google.com/maps/search/Lake+District+National+Park,+UK",
  },
};

const scenicScotlandLabels = [
  ["stirling", "Stirling", "Scotland"],
  ["stirling-castle", "Stirling Castle", "Castle Wynd", "Stirling FK8 1EN", "United Kingdom"],
  ["loch-lomond", "Loch Lomond", "Scotland"],
  ["glencoe-valley", "Glencoe Valley", "Ballachulish", "Scotland"],
  ["three-sisters-of-glencoe", "Three Sisters of Glencoe", "Ballachulish", "Scotland"],
  ["loch-achtriochtan", "Loch Achtriochtan", "Glencoe", "Scotland"],
  ["glencoe-village", "Glencoe", "Ballachulish PH49", "United Kingdom"],
  ["glenfinnan", "Glenfinnan", "PH37 4LT", "United Kingdom"],
  ["eilean-donan-castle", "Eilean Donan Castle", "Dornie", "Kyle of Lochalsh IV40 8DX", "United Kingdom"],
  ["fort-william", "Fort William", "PH33", "Scotland"],
  ["rannoch-moor", "Rannoch Moor", "Scotland"],
  ["isle-of-skye", "Isle of Skye", "Scotland"],
  ["portree", "Portree", "Isle of Skye", "Scotland"],
  ["trotternish-peninsula", "Trotternish Peninsula", "Isle of Skye", "Scotland"],
  ["old-man-of-storr", "Old Man of Storr", "Isle of Skye IV51 9HX", "United Kingdom"],
  ["kilt-rock", "Kilt Rock", "Isle of Skye IV51 9JE", "United Kingdom"],
  ["mealt-falls", "Mealt Falls", "Isle of Skye IV51 9JE", "United Kingdom"],
  ["quiraing", "Quiraing", "Isle of Skye", "Scotland"],
  ["dunvegan", "Dunvegan", "Isle of Skye", "Scotland"],
  ["dunvegan-castle", "Dunvegan Castle", "Dunvegan", "Isle of Skye IV55 8WF", "United Kingdom"],
  ["neist-point", "Neist Point", "Isle of Skye IV55 8WU", "United Kingdom"],
  ["talisker-bay", "Talisker Bay", "Isle of Skye", "Scotland"],
  ["fairy-pools", "Fairy Pools", "Glenbrittle", "Isle of Skye IV47 8TA", "United Kingdom"],
  ["glenbrittle", "Glenbrittle", "Isle of Skye", "Scotland"],
  ["cuillin-mountains", "Cuillin Mountains", "Isle of Skye", "Scotland"],
  ["sligachan", "Sligachan", "Isle of Skye", "Scotland"],
];

for (const [id, ...lines] of scenicScotlandLabels) {
  offlineAddresses[id] = {
    id,
    lines,
    status: lines.length > 3 ? "VERIFIED LOCATION LABEL" : "NO SINGLE STREET ADDRESS",
    sourceUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lines[0]}, Scotland`)}`,
  };
}

export const getOfflineAddress = (id: string) => offlineAddresses[id];
