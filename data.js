/* ============================================================
   DATA LAYER — Dhoni vs Gambhir
   Every number below is sourced. See SOURCES at the bottom of
   this file and the "Sources & method" section on the page.
   International career figures: Wikipedia player articles
   (career statistics infobox + captaincy tables).
   IPL figures: career totals as of the 2026 IPL season.
   ============================================================ */

const PLAYERS = {
  dhoni: {
    key: "dhoni",
    name: "MS Dhoni",
    full: "Mahendra Singh Dhoni",
    born: "7 July 1981",
    birthplace: "Ranchi, Bihar (now Jharkhand)",
    role: "Wicketkeeper-batter · Right-handed",
    accent: "#f9cd05",   // CSK yellow
    accent2: "#1b3a6b",
    jersey: "7",
    tagline: "The finisher who became India's most decorated captain.",
    initials: "MSD",
  },
  gambhir: {
    key: "gambhir",
    name: "Gautam Gambhir",
    full: "Gautam Gambhir",
    born: "14 October 1981",
    birthplace: "Delhi, India",
    role: "Opening batter · Left-handed",
    accent: "#7b5cd6",   // KKR purple
    accent2: "#3a225d",
    jersey: "5",
    tagline: "The big-match opener who now coaches India.",
    initials: "GG",
  },
};

/* ---------- International career, by format ---------- */
const FORMATS = {
  test: {
    label: "Test",
    blurb: "The five-day game — the format where the two careers diverge most.",
    dhoni:   { mat: 90,  runs: 4876,  avg: 38.09, sr: null, hundreds: 6,  fifties: 33, hs: "224",   catches: 256, stumpings: 38 },
    gambhir: { mat: 58,  runs: 4154,  avg: 41.95, sr: null, hundreds: 9,  fifties: 22, hs: "206",   catches: 38,  stumpings: 0  },
  },
  odi: {
    label: "ODI",
    blurb: "50-over cricket — both men peaked in the same era, and both played the 2011 final.",
    dhoni:   { mat: 350, runs: 10773, avg: 50.57, sr: 87.56, hundreds: 10, fifties: 73, hs: "183*", catches: 321, stumpings: 123 },
    gambhir: { mat: 147, runs: 5238,  avg: 39.68, sr: null,  hundreds: 11, fifties: 34, hs: "150*", catches: 36,  stumpings: 0   },
  },
  t20i: {
    label: "T20I",
    blurb: "The shortest international format, where Dhoni captained the 2007 world title and Gambhir made 75 in the final.",
    dhoni:   { mat: 98,  runs: 1617, avg: 37.60, sr: null, hundreds: 0, fifties: 2, hs: "56", catches: 57, stumpings: 34 },
    gambhir: { mat: 37,  runs: 932,  avg: 27.41, sr: null, hundreds: 0, fifties: 7, hs: "75", catches: 11, stumpings: 0  },
  },
  ipl: {
    label: "IPL",
    blurb: "Franchise cricket — Dhoni is still active for CSK; Gambhir's playing career ended in 2018.",
    dhoni:   { mat: 278, runs: 5439, avg: 38.30, sr: 137.0, hundreds: 0, fifties: 24, hs: "84*", catches: 200, stumpings: 42, note: "active" },
    gambhir: { mat: 154, runs: 4217, avg: 31.23, sr: null,  hundreds: 0, fifties: 36, hs: "93",  catches: 44,  stumpings: 0,  note: "retired 2018" },
  },
};

/* ---------- Captaincy ---------- */
const CAPTAINCY = {
  dhoni: {
    rows: [
      { type: "Test", mat: 60,  won: 27,  lost: 18,  drawn: 15, tie: 0, nr: 0,  pct: 45.00 },
      { type: "ODI",  mat: 200, won: 110, lost: 74,  drawn: 0,  tie: 5, nr: 11, pct: 55.00 },
      { type: "T20I", mat: 72,  won: 42,  lost: 28,  drawn: 0,  tie: 0, nr: 2,  pct: 58.33 },
    ],
    total: { mat: 332, won: 179, lost: 120, drawn: 15, tie: 5, nr: 13, pct: 53.91 },
    note: "Most matches as captain of India in any format. Won the 2007 T20 World Cup, 2011 ODI World Cup and 2013 Champions Trophy — the only captain to win all three ICC limited-overs titles.",
  },
  gambhir: {
    rows: [
      { type: "ODI", mat: 6, won: 6, lost: 0, drawn: 0, tie: 0, nr: 0, pct: 100.00 },
    ],
    total: { mat: 6, won: 6, lost: 0, drawn: 0, tie: 0, nr: 0, pct: 100.00 },
    note: "Led India in six ODIs between late 2010 and late 2011 — and won every one of them, including a 5–0 whitewash of New Zealand.",
    caveat: "Six matches is a small sample; this is a perfect record, not a body of captaincy work.",
  },
};

/* ---------- Team trophies ---------- */
const TROPHIES = {
  dhoni: [
    { year: "2007", what: "ICC World T20", role: "Captain" },
    { year: "2010", what: "Asia Cup", role: "Captain" },
    { year: "2010", what: "IPL — Chennai Super Kings", role: "Captain" },
    { year: "2010", what: "Champions League T20", role: "Captain" },
    { year: "2011", what: "ICC Cricket World Cup", role: "Captain" },
    { year: "2011", what: "IPL — Chennai Super Kings", role: "Captain" },
    { year: "2013", what: "ICC Champions Trophy", role: "Captain" },
    { year: "2014", what: "Champions League T20", role: "Captain" },
    { year: "2016", what: "Asia Cup", role: "Captain" },
    { year: "2018", what: "Asia Cup", role: "Captain" },
    { year: "2018", what: "IPL — Chennai Super Kings", role: "Captain" },
    { year: "2021", what: "IPL — Chennai Super Kings", role: "Captain" },
    { year: "2023", what: "IPL — Chennai Super Kings", role: "Captain" },
  ],
  gambhir: [
    { year: "2007", what: "ICC World T20", role: "Player" },
    { year: "2010", what: "Asia Cup", role: "Player" },
    { year: "2011", what: "ICC Cricket World Cup", role: "Player" },
    { year: "2012", what: "IPL — Kolkata Knight Riders", role: "Captain" },
    { year: "2014", what: "IPL — Kolkata Knight Riders", role: "Captain" },
    { year: "2024", what: "IPL — Kolkata Knight Riders", role: "Mentor" },
    { year: "2025", what: "ICC Champions Trophy", role: "Head coach" },
    { year: "2025", what: "Asia Cup", role: "Head coach" },
    { year: "2026", what: "ICC Men's T20 World Cup", role: "Head coach" },
  ],
};

/* ---------- Head-to-head scorecard ---------- */
const SCORECARD = [
  { cat: "Test batting",       winner: "gambhir", why: "Higher average (41.95 v 38.09) and more centuries (9 v 6) in 32 fewer matches. Gambhir's 137 and 167 in New Zealand in 2009 are the standout knocks." },
  { cat: "ODI batting",        winner: "dhoni",   why: "10,773 runs at 50.57 against 5,238 at 39.68 — twice the volume at a much higher average, plus 73 fifties to 34." },
  { cat: "T20I batting",       winner: "dhoni",   why: "1,617 runs at 37.60 from 98 matches, against 932 at 27.41 from 37." },
  { cat: "IPL batting",        winner: "dhoni",   why: "5,439 runs at 38.30 and a strike rate around 137 — the only wicketkeeper to pass 5,000 IPL runs." },
  { cat: "Finals & big matches", winner: "gambhir", why: "75 off 54 in the 2007 World T20 final and 97 off 122 in the 2011 World Cup final. He also finished the 2007 World T20 as India's leading run-scorer with 227." },
  { cat: "Keeping & fielding", winner: "dhoni",   why: "321 ODI catches and 123 stumpings; the first wicketkeeper to 100 ODI stumpings. Gambhir was an outfielder, not a keeper." },
  { cat: "International captaincy", winner: "dhoni", why: "332 matches as captain, 179 wins, and all three ICC limited-overs trophies. Gambhir's 6-for-6 record is perfect but tiny." },
  { cat: "Franchise leadership", winner: "dhoni", why: "Five IPL titles as captain and ten finals (joint-record titles with Rohit Sharma), versus Gambhir's two as captain and one as mentor." },
  { cat: "Longevity & records", winner: "dhoni",   why: "95 international fifties-plus scores across formats, 98 T20Is, still playing the IPL at 45, and a retired No. 7 jersey." },
  { cat: "Post-playing legacy", winner: "gambhir", why: "India's head coach since 2024, with the 2025 Champions Trophy, 2025 Asia Cup and 2026 T20 World Cup already in the cabinet." },
];

/* ---------- Iconic moments ---------- */
const MOMENTS = [
  { year: "2003", who: "gambhir", text: "ODI debut against Bangladesh; a first Test follows the next year, against Australia." },
  { year: "2005", who: "dhoni",   text: "Announces himself with 183* off 145 balls against Sri Lanka in Jaipur — then the highest ODI score by an Indian wicketkeeper." },
  { year: "2007", who: "gambhir", text: "Ends the World T20 as India's top run-scorer with 227 runs, then makes 75 off 54 in the final in Johannesburg as India win the first-ever T20 world title." },
  { year: "2007", who: "dhoni",   text: "Handed the T20I captaincy for the World T20 — and wins it. An era begins." },
  { year: "2008", who: "dhoni",   text: "Named ICC ODI Player of the Year, and the world's most expensive IPL signing at US$1.5m for Chennai Super Kings." },
  { year: "2009", who: "dhoni",   text: "Awarded the Padma Shri; retains the ICC ODI Player of the Year crown." },
  { year: "2010", who: "gambhir", text: "Captains India to a 5–0 ODI whitewash of New Zealand, winning all five games." },
  { year: "2011", who: "dhoni",   text: "Lifts the ODI World Cup at home, promoting himself up the order and making 91* in the final to be named Player of the Match." },
  { year: "2011", who: "gambhir", text: "97 off 122 in the same final — the innings that kept India's chase alive." },
  { year: "2012", who: "gambhir", text: "Captains Kolkata Knight Riders to their first IPL title, beating Chennai in Chennai." },
  { year: "2013", who: "dhoni",   text: "Wins the Champions Trophy to complete the set of all three ICC limited-overs titles as captain." },
  { year: "2014", who: "gambhir", text: "A second IPL title as KKR captain." },
  { year: "2017", who: "dhoni",   text: "Becomes the first wicketkeeper to effect 100 ODI stumpings." },
  { year: "2018", who: "dhoni",   text: "Awarded the Padma Bhushan — India's third-highest civilian honour." },
  { year: "2023", who: "dhoni",   text: "Wins a fifth IPL title as captain at 41; a record he shares with Rohit Sharma. BCCI retires the No. 7 jersey." },
  { year: "2024", who: "gambhir", text: "Returns to KKR as mentor and wins the IPL; in July he is appointed India's head coach." },
  { year: "2025", who: "gambhir", text: "Coaches India to the Champions Trophy and the Asia Cup." },
  { year: "2026", who: "gambhir", text: "Guides India to the ICC Men's T20 World Cup title — a world title as both player and head coach." },
];

const SOURCES = [
  { label: "MS Dhoni — Wikipedia (career statistics infobox, captaincy table, franchise honours)", url: "https://en.wikipedia.org/wiki/MS_Dhoni" },
  { label: "Gautam Gambhir — Wikipedia (career statistics infobox, honours, captaincy and coaching)", url: "https://en.wikipedia.org/wiki/Gautam_Gambhir" },
  { label: "IPL career totals (through the 2026 season)", url: "https://www.ipl.com/player/ms-dhoni" },
  { label: "Gambhir IPL career totals", url: "https://timesofindia.indiatimes.com/sports/cricket/ipl/player-stats/gautam-gambhir/3478" },
];

const META = {
  dataThrough: "IPL 2026 season",
  builtNote: "International career figures are final (both men have retired from international cricket). IPL figures for MS Dhoni are current as of the 2026 season; Gautam Gambhir's playing career ended in 2018.",
};

if (typeof module !== "undefined") {
  module.exports = { PLAYERS, FORMATS, CAPTAINCY, TROPHIES, SCORECARD, MOMENTS, SOURCES, META };
}
