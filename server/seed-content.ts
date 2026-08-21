export type ResourceSeed = {
  type:
    | "activity_guide"
    | "situation_guide"
    | "relationship_guide"
    | "devotional"
    | "article";
  title: string;
  body: string;
  tags: string;
  faithVariant: "faith" | "secular" | "neutral";
  dimensionSlug?: string;
};

export const resourceSeeds: ResourceSeed[] = [
  // ---------------------------------------------------------------------------
  // ACTIVITY GUIDES
  // ---------------------------------------------------------------------------
  {
    type: "activity_guide",
    title: "Restoring a healthy work rhythm",
    body:
      "When work collapsed during active use, the first step back is a sustainable routine. Start with a " +
      "single anchor: the same start time each morning, a 90-minute deep-work block, and a defined end. " +
      "Add one restoration habit per week — a lunch walk, a tidy desk, or a 5-minute shutdown ritual. " +
      "Protect the routine from urgency; consistency rebuilds trust in yourself and your colleagues.",
    tags: "work, routine, deep-work, career",
    faithVariant: "neutral",
    dimensionSlug: "work-career",
  },
  {
    type: "activity_guide",
    title: "A 15-minute walk to clear the head",
    body:
      "When a craving or a heavy thought hits, a short walk interrupts the loop. Walk for 15 minutes " +
      "without a phone. Notice five things you can see, four you can hear, three you can touch. " +
      "Returning with a calmer nervous system makes the next decision easier.",
    tags: "walk, grounding, cravings, exercise",
    faithVariant: "neutral",
    dimensionSlug: "physical-health",
  },
  {
    type: "activity_guide",
    title: "The evening shutdown ritual",
    body:
      "A reliable evening routine signals to your body that the day is closing. Choose three actions: " +
      "write tomorrow's single priority, clear the kitchen, and turn screens off 30 minutes before bed. " +
      "Repeat for two weeks before changing anything. Small, repeatable wins compound faster than ambition.",
    tags: "routine, sleep, evening, structure",
    faithVariant: "neutral",
    dimensionSlug: "daily-routines",
  },
  {
    type: "activity_guide",
    title: "An honest look at the money ledger",
    body:
      "Financial recovery is a mirror of behaviour. Open a blank sheet and list every expense from the " +
      "last month without judgement. Circle the spending that served recovery and the spending that fed " +
      "the old pattern. Then pick one leak to plug this week. Progress is a direction, not a number.",
    tags: "finance, budget, planning",
    faithVariant: "neutral",
    dimensionSlug: "financial",
  },

  // ---------------------------------------------------------------------------
  // SITUATION GUIDES
  // ---------------------------------------------------------------------------
  {
    type: "situation_guide",
    title: "Facing an old environment",
    body:
      "Old places and old faces carry old permission. Before entering a high-risk environment, name the " +
      "outcome you actually want, set a hard exit time, and rehearse the sentence you will use to leave. " +
      "Permission is easier to keep before the moment than to reclaim inside it.",
    tags: "environment, triggers, high-risk, exit-plan",
    faithVariant: "neutral",
    dimensionSlug: "avoiding",
  },
  {
    type: "situation_guide",
    title: "When a craving shows up at 9pm",
    body:
      "Cravings rarely announce themselves; they arrive as boredom, restlessness, or a familiar cue. " +
      "When one shows up, buy time: a 10-minute delay, a glass of water, and a change of room. " +
      "Most cravings peak and pass within twenty minutes. The delay is the decision.",
    tags: "cravings, evening, coping, delay",
    faithVariant: "neutral",
    dimensionSlug: "escaping-from",
  },
  {
    type: "situation_guide",
    title: "Handling the first weekend",
    body:
      "Weekends were built around the old habit, so they need rebuilding too. Pre-book the first three " +
      "weekends of recovery with people and activities that are safe by design. Idle time is the " +
      "loudest voice of the old pattern; fill it before it fills you.",
    tags: "weekend, planning, isolation, people",
    faithVariant: "neutral",
    dimensionSlug: "daily-routines",
  },
  {
    type: "situation_guide",
    title: "When someone offers you a drink",
    body:
      'The offer will come. Have a prepared, honest line: "I\'m not drinking these days." No apology, ' +
      "no lecture. If pressed, a calm repeat of the same line holds the boundary. People mirror your " +
      "calm; your discomfort will pass long before the evening does.",
    tags: "social, offers, boundaries, assertiveness",
    faithVariant: "neutral",
    dimensionSlug: "social-environment",
  },

  // ---------------------------------------------------------------------------
  // RELATIONSHIP GUIDES
  // ---------------------------------------------------------------------------
  {
    type: "relationship_guide",
    title: "A repair conversation with a loved one",
    body:
      "Repair is not an apology monologue; it is an invitation to be heard. Sit with the person, name the " +
      "specific harm without excuses, and ask what would begin to rebuild trust. Then stop talking and " +
      "listen. Trust is rebuilt in small kept promises, not in big speeches.",
    tags: "relationships, apology, trust, family",
    faithVariant: "neutral",
    dimensionSlug: "impact-loved-ones",
  },
  {
    type: "relationship_guide",
    title: "Choosing who gets the inner circle",
    body:
      "Your environment is your strategy. In recovery, the inner circle shrinks on purpose. Keep the " +
      "people who speak truth kindly and support your change; gently distance from those who trade on " +
      "the old you. This is not abandonment — it is honesty about who can hold this season with you.",
    tags: "friends, inner-circle, environment, boundaries",
    faithVariant: "neutral",
    dimensionSlug: "relationships",
  },
  {
    type: "relationship_guide",
    title: "Inviting a supporter in",
    body:
      "Recovery is loud in isolation and quieter in community. Choose one trusted person to give " +
      "dashboard access or daily check-in visibility to, and agree together on the scope. A supporter " +
      "who sees progress can celebrate it; one who only hears silence worries. Visibility builds both.",
    tags: "supporter, accountability, transparency",
    faithVariant: "neutral",
    dimensionSlug: "relationships",
  },

  // ---------------------------------------------------------------------------
  // DEVOTIONALS
  // ---------------------------------------------------------------------------
  {
    type: "devotional",
    title: "A new heart — a fresh start",
    body:
      "“Create in me a clean heart, O God, and renew a right spirit within me.” Today you are not " +
      "repeating yesterday; you are beginning again. Lay down the shame of the past and receive the " +
      "mercy that meets you at the start of each day. Recovery is not earning your way back — it is " +
      "walking forward with the One who already forgave.",
    tags: "faith, new-beginning, mercy, psalm",
    faithVariant: "faith",
    dimensionSlug: "faith-relationship",
  },
  {
    type: "devotional",
    title: "One day at a time",
    body:
      "The horizon of 90 or 180 days can feel overwhelming. Wisdom lives in the present day only. " +
      "Today you can choose once, take one small step, and rest. Tomorrow will meet you with the same " +
      "grace. Sufficient for each day are its own tasks — and its own mercy.",
    tags: "faith, daily, patience, perseverance",
    faithVariant: "faith",
    dimensionSlug: "mental-health",
  },
  {
    type: "devotional",
    title: "Reclaiming your own story",
    body:
      "You are more than the chapters you are ashamed of. Before the substance, there was a person " +
      "with gifts, humour, and dreams. That person is still inside you, waiting to be reintroduced. " +
      "Recovery is the act of reintroducing yourself to yourself — and, in time, to the world.",
    tags: "secular, identity, self-image, hope",
    faithVariant: "secular",
    dimensionSlug: "self-image",
  },
  {
    type: "devotional",
    title: "The strength in starting small",
    body:
      "We overestimate what we can do in a day and underestimate what a week of small choices can " +
      "build. Progress does not have to look dramatic to be real. One glass of water, one honest " +
      "check-in, one walk, one early night — strung together, they become a life you recognise.",
    tags: "secular, small-steps, momentum, habits",
    faithVariant: "secular",
    dimensionSlug: "short-term-changes",
  },

  // ---------------------------------------------------------------------------
  // ARTICLES
  // ---------------------------------------------------------------------------
  {
    type: "article",
    title: "How the 21-dimension assessment maps your recovery",
    body:
      "Recovery is whole-life work, and the 21 life dimensions exist to make that visible. Each " +
      "dimension — from work and finance to faith and self-image — is scored from 0 to 100 during " +
      "onboarding and re-checked over time. The result is a living map: you can see where life is " +
      "healing, where it is still tender, and where to place your next focus. This article walks " +
      "through each dimension group and how scores are captured at daily check-ins.",
    tags: "assessment, dimensions, progress, how-it-works",
    faithVariant: "neutral",
  },
  {
    type: "article",
    title: "Why daily check-ins build durable change",
    body:
      "Habits are built on identity, and identity is built on repeated small decisions. The morning " +
      "and evening check-ins capture mood, energy, cravings, and free-form notes, feeding a streak and " +
      "a set of dimension scores over time. Research on habit formation shows that tracking behaviour " +
      "increases self-awareness and motivation. The check-in is not a test you pass — it is a mirror " +
      "that keeps your goals in view.",
    tags: "check-ins, habits, streaks, science",
    faithVariant: "neutral",
  },
  {
    type: "article",
    title: "Setting your first 30/90/180-day goal",
    body:
      "Goals give direction to the energy that recovery releases. A 30-day goal is about immediate " +
      "stability, a 90-day goal about rebuilding structure, and a 180-day goal about the life you are " +
      "moving toward. Choose one active goal per focus area, break it into steps, and review it weekly. " +
      "A goal you can see is a goal you can reach.",
    tags: "goals, planning, horizons, milestones",
    faithVariant: "neutral",
  },
  {
    type: "article",
    title: "Rebuilding your relationship with music",
    body:
      "For many, certain genres and artists are wired to old memories and old habits. Music " +
      "rehabilitation is not censorship — it is curation. Map your trigger genres and artists, " +
      "deliberately build a safe playlist, and give your ears a new soundscape. The same reward " +
      "chemistry that old songs triggered can be retrained toward music that heals.",
    tags: "music, triggers, playlists, rehabilitation",
    faithVariant: "neutral",
    dimensionSlug: "escaping-from",
  },
];

export type NewsletterSeed = {
  type: "daily" | "weekly" | "milestone" | "dimension" | "situation";
  subject: string;
  body: string;
  daysAhead: number;
};

export const newsletterSeeds: NewsletterSeed[] = [
  {
    type: "weekly",
    subject: "Your first week of rebuilding",
    body:
      "This week was about showing up. You completed check-ins, maybe set a goal, and began mapping " +
      "the 21 dimensions of your life. Progress this early is measured in honesty, not achievement. " +
      "Next week, pick one dimension that feels most tender and give it a single small action each day.",
    daysAhead: 7,
  },
  {
    type: "milestone",
    subject: "14 days — a pattern is forming",
    body:
      "Two weeks of daily decisions has created something real: a pattern your mind and body are " +
      "starting to trust. Look back at your early scores and see what has moved. Keep the routines " +
      "that carried you here, and tell one trusted person what this moment means to you.",
    daysAhead: 14,
  },
  {
    type: "milestone",
    subject: "30 days — the first horizon",
    body:
      "Thirty days is not luck; it is thousands of small refusals and renewals. Your first milestone " +
      "is complete. Celebrate deliberately — with people, not things. Then set your next 90-day goal " +
      "with the confidence of someone who has already proven the formula.",
    daysAhead: 30,
  },
  {
    type: "dimension",
    subject: "Your faith dimension, explored",
    body:
      "Your faith-relationship dimension reflects your sense of purpose, forgiveness, and belonging. " +
      "Whether you draw on faith, on your own moral compass, or both, this dimension deepens when you " +
      "make space for reflection. Try a short devotional or a quiet morning pause this week and note " +
      "the shift in your check-in scores.",
    daysAhead: 21,
  },
  {
    type: "situation",
    subject: "Surviving the social season",
    body:
      "Holidays and social seasons are where boundaries get tested. Rehearse your line, pre-book safe " +
      "time, and remember: leaving early is never failure. This short guide walks through a social " +
      "situation plan you can adapt to any event.",
    daysAhead: 45,
  },
];
