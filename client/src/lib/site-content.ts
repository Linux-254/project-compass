/**
 * Shared content for the ReForge marketing site and app copy.
 * Keeps pages in sync and preserves the warm, non-clinical voice.
 */

export const partners = [
  "Recovery Capital Framework",
  "SAMHSA-informed",
  "Gottman-informed repair",
  "Habit formation research",
  "Peer-support networks",
  "Faith & values friendly",
];

export const phases = [
  {
    step: "Weeks 1–2",
    title: "Baseline",
    body: "A conversational assessment sets your profile, substance focus and starting scores across the dimensions.",
    detail:
      "No forms with forty fields. You answer in your own words, skip anything you're not ready for, and come back to it later. At the end you see one page: where you are right now, without judgement.",
  },
  {
    step: "Weeks 3–8",
    title: "Rhythm",
    body: "Check-ins, guides and journalling become routine. Small wins get recorded so relapse doesn't erase them.",
    detail:
      "This is the stage that decides everything. We optimise for a streak you can keep — two minutes, one honest answer, one suggested guide for the situation you named.",
  },
  {
    step: "Weeks 9–16",
    title: "Repair",
    body: "Attention shifts outward: relationships, work, money, and the situations you used to avoid.",
    detail:
      "Scripts for apologies and boundaries, a plan for the first work event, a money page that stops being frightening. You choose the order; nothing is forced.",
  },
  {
    step: "Weeks 17–24",
    title: "Standing on your own",
    body: "Your rules, routines and support map are yours to keep. The app becomes optional — by design.",
    detail:
      "You export your rules, your triggers, your support map and your milestones. Success is you needing us less, and we build for that outcome on purpose.",
  },
];

export const dimensionGroups = [
  {
    group: "Body",
    tone: "The physical baseline everything else stands on.",
    items: ["Sleep", "Nutrition", "Movement", "Physical health", "Substance load"],
  },
  {
    group: "Mind",
    tone: "How steady the inside of your head feels.",
    items: ["Mood", "Anxiety", "Cravings", "Self-image", "Focus"],
  },
  {
    group: "People",
    tone: "The relationships drinking quietly rearranged.",
    items: ["Family", "Partner", "Friendships", "Trust rebuilt", "Support network"],
  },
  {
    group: "Life",
    tone: "The practical scaffolding of an ordinary good week.",
    items: ["Work", "Money", "Home", "Routine", "Legal & admin"],
  },
  {
    group: "Meaning",
    tone: "The reason any of this is worth the effort.",
    items: ["Purpose"],
  },
];

export const stories = [
  {
    quote:
      "The check-in was the only thing I could manage in week one. Four months later it's the reason I can see how far I've come.",
    name: "Marcus D.",
    detail: "Self-starter, 5 months",
  },
  {
    quote:
      "I left a programme with a folder of paperwork and no plan for Tuesday night. ReForge gave me Tuesday night.",
    name: "Aisha R.",
    detail: "Post-rehab, 3 months",
  },
  {
    quote:
      "The repair scripts stopped me sending three messages I'd have regretted. My sister is talking to me again.",
    name: "Tom W.",
    detail: "Reducing, 6 months",
  },
  {
    quote: "Nothing about it felt clinical. It read like a friend who happened to be organised.",
    name: "Priya N.",
    detail: "Self-starter, 4 months",
  },
  {
    quote:
      "I use the supporter view to know when to call and when to leave him alone. That alone was worth it.",
    name: "Ellen K.",
    detail: "Supporter",
  },
  {
    quote:
      "Seeing sleep and money climb while cravings dropped made the whole thing believable.",
    name: "Dan H.",
    detail: "Reducing, 5 months",
  },
];

export const dailyBeats = [
  {
    time: "07:10",
    title: "Morning check-in",
    body: "Mood, sleep, cravings and one intention for the day. Two minutes, four taps, no essay required.",
  },
  {
    time: "13:00",
    title: "A nudge, not a lecture",
    body: "One suggestion tied to what you named this morning — a walk playlist, a breathing set, a message you've been avoiding.",
  },
  {
    time: "18:00",
    title: "The hard hour",
    body: "Your own rules, one tap away. Trigger plan, craving timer, and the guide you saved for exactly this.",
  },
  {
    time: "21:40",
    title: "Close the day",
    body: "One line in the journal. What held, what slipped. Milestones recorded quietly so a bad day never deletes a good month.",
  },
];

export type LifeDimensionDef = {
  slug: string;
  label: string;
  group: string;
  blurb: string;
};

/**
 * The canonical 21 life dimensions tracked by the app.
 * Mirrors the seeded `life_dimensions` table in the database.
 */
export const dimensions21: LifeDimensionDef[] = [
  { slug: "work-career", label: "Work & Career", group: "Life", blurb: "The work you do and the sense of purpose it gives back." },
  { slug: "aspirations-goals", label: "Aspirations & Goals", group: "Meaning", blurb: "What you're reaching for, one steady step at a time." },
  { slug: "impact-loved-ones", label: "Impact on Loved Ones", group: "People", blurb: "How your journey has touched the people closest to you." },
  { slug: "behavioural-changes", label: "Behavioural Changes", group: "Mind", blurb: "The small daily shifts that slowly add up to something big." },
  { slug: "who-before", label: "Who You Were Before", group: "Mind", blurb: "The version of you that existed before this season." },
  { slug: "escaping-from", label: "What You Were Escaping", group: "Mind", blurb: "The weight you were quietly trying to put down." },
  { slug: "getting-back-to", label: "What You Were Getting Back To", group: "Meaning", blurb: "The life and people you were hoping to return to." },
  { slug: "when-using", label: "What You Were Like When Using", group: "Mind", blurb: "An honest, judgement-free look at a difficult chapter." },
  { slug: "short-term-changes", label: "Short-Term Changes", group: "Body", blurb: "The wins you can feel in the first weeks." },
  { slug: "long-term-changes", label: "Long-Term Changes", group: "Body", blurb: "The slower transformations that last." },
  { slug: "going-for", label: "What You Were Going For", group: "Meaning", blurb: "The deeper reason this whole journey matters to you." },
  { slug: "faith-relationship", label: "Relationship with God / Faith", group: "Meaning", blurb: "Your spiritual life — faith, doubt, or simply the big questions." },
  { slug: "relationships", label: "Relationship with Others", group: "People", blurb: "The bonds that hold you, and the ones being rebuilt." },
  { slug: "avoiding", label: "What You Were Avoiding", group: "Mind", blurb: "The conversations and tasks you used to dodge." },
  { slug: "not-avoiding", label: "What You're No Longer Avoiding", group: "Mind", blurb: "Proof of the ground you've already gained." },
  { slug: "physical-health", label: "Physical Health", group: "Body", blurb: "Sleep, movement, energy — the body doing its quiet work." },
  { slug: "mental-health", label: "Mental Health", group: "Mind", blurb: "Mood, steadiness, and the inner weather." },
  { slug: "financial", label: "Financial Situation", group: "Life", blurb: "Money becoming less frightening, more manageable." },
  { slug: "daily-routines", label: "Daily Routines", group: "Life", blurb: "The ordinary scaffolding of an ordinary good week." },
  { slug: "social-environment", label: "Social Environment", group: "People", blurb: "The places and people your days are built around." },
  { slug: "self-image", label: "Self-Image", group: "Mind", blurb: "How you see yourself in the mirror these days." },
];

export const faqs = [
  {
    q: "Is ReForge a medical service?",
    a: "No. ReForge is a lifestyle companion for people changing their relationship with substances. It is not therapy and it is not a medical tool. If you are in crisis or need urgent help, please contact local emergency services or a helpline in your region.",
  },
  {
    q: "Do I have to complete the whole assessment at once?",
    a: "No. You can skip anything you're not ready for and come back later. The assessment is a conversation, not an exam.",
  },
  {
    q: "Who can see my journal and check-ins?",
    a: "Only you. Your journal and assessment answers are treated as the most private data we hold. Supporters can only ever see what you explicitly choose to share, and nothing sensitive ever appears in notifications or emails.",
  },
  {
    q: "What if I miss a day or slip up?",
    a: "Nothing is lost. We never punish a broken streak — the next morning you simply start again. A bad day never deletes a good month.",
  },
  {
    q: "Can I choose my own faith or secular content?",
    a: "Yes. Faith content is always opt-in, and every devotional has a parallel secular alternative.",
  },
  {
    q: "How long is the journey?",
    a: "Most people take three to six months to move through the four phases: baseline, rhythm, repair, and standing on your own. You set the pace.",
  },
];
