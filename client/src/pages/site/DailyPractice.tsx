import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { dailyBeats } from "@/lib/site-content";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  HeartHandshake,
  Music,
  NotebookPen,
  ShieldAlert,
  Timer,
} from "lucide-react";
import { Link } from "wouter";

const beatDetail: Record<string, { image: string; asks: string[] }> = {
  "07:10": {
    image: "/assets/journal-morning.jpg",
    asks: [
      "How did you sleep? (four taps)",
      "Mood right now, 1–10",
      "Craving level, 1–10",
      "One intention for today",
    ],
  },
  "13:00": {
    image: "/assets/movement.jpg",
    asks: [
      "One nudge, chosen from what you named this morning",
      "A ten-minute option and a two-minute option",
      "Snooze it without guilt",
      "Saves to your guide library",
    ],
  },
  "18:00": {
    image: "/assets/connection.jpg",
    asks: [
      "Your own rules, one tap away",
      "Craving timer with a breathing set",
      "The message script you wrote when calm",
      "Call a supporter, without explaining first",
    ],
  },
  "21:40": {
    image: "/assets/evening-journal.jpg",
    asks: [
      "One line: what held, what slipped",
      "Milestones recorded quietly",
      "Tomorrow's intention, pre-written",
      "Lights out — nothing else asked of you",
    ],
  },
};

const tools = [
  {
    icon: NotebookPen,
    title: "Journal",
    body: "Free writing with optional prompts. Encrypted at rest, visible to nobody but you.",
  },
  {
    icon: ShieldAlert,
    title: "Rules & triggers",
    body: "The rules you wrote when you were calm, ready for when you're not.",
  },
  {
    icon: Timer,
    title: "Craving timer",
    body: "A ten-minute timer with breathing pacing, because most waves pass inside it.",
  },
  {
    icon: BookOpen,
    title: "Guides",
    body: "Activity, situation and relationship guides matched to the moment you named.",
  },
  {
    icon: Music,
    title: "Music rehab",
    body: "Move away from trigger artists gradually, toward a soundscape that helps.",
  },
  {
    icon: HeartHandshake,
    title: "Supporters",
    body: "Invite one person, choose exactly what they see, revoke it whenever.",
  },
];

const streakRules = [
  "A missed day does not delete a milestone.",
  "There is no red, no scolding, no 'you failed' screen.",
  "One check-in a day counts as a full day.",
  "Slips get a debrief, not a punishment.",
];

export default function DailyPractice() {
  return (
    <SiteLayout>
      <section className="border-b border-stone-200 bg-[#faf8f4]">
        <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-[1.05fr_1fr] gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold text-stone-900 mb-3">
              The daily practice
            </h1>
            <p className="text-lg text-stone-600 mb-4">
              Four short moments a day, none of them longer than a coffee
              queue. The rhythm is the product — everything else exists to
              support it.
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {["2 min mornings", "1 nudge midday", "hard-hour kit", "1 line at night"].map(
                chip => (
                  <span
                    key={chip}
                    className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800"
                  >
                    {chip}
                  </span>
                )
              )}
            </div>
            <Button onClick={() => startLogin()}>
              Do my first check-in <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <img
            src="/assets/hero-dawn.jpg"
            alt="Dawn light over a quiet landscape"
            loading="lazy"
            className="w-full h-[260px] lg:h-[320px] object-cover rounded-3xl border border-stone-200"
          />
        </div>
      </section>

      {/* Timeline with detail */}
      <section className="py-10 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 space-y-5">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-600" />
            <h2 className="text-2xl font-bold">A day, beat by beat</h2>
          </div>
          {dailyBeats.map((beat, i) => {
            const detail = beatDetail[beat.time];
            return (
              <Reveal key={beat.time} delay={i * 40}>
                <article
                  className={`grid lg:grid-cols-[1fr_320px] gap-5 rounded-3xl border border-stone-200 overflow-hidden bg-stone-50 ${
                    i % 2 ? "lg:grid-cols-[320px_1fr]" : ""
                  }`}
                >
                  {i % 2 ? (
                    <img
                      src={detail?.image ?? "/assets/hero-dawn.jpg"}
                      alt={beat.title}
                      loading="lazy"
                      className="h-48 lg:h-full w-full object-cover"
                    />
                  ) : null}
                  <div className="p-5">
                    <div className="text-sm font-mono text-amber-600 mb-1">
                      {beat.time}
                    </div>
                    <h3 className="text-xl font-semibold text-stone-900 mb-2">
                      {beat.title}
                    </h3>
                    <p className="text-stone-600 mb-4">{beat.body}</p>
                    <ul className="grid sm:grid-cols-2 gap-x-5 gap-y-1.5 text-sm text-stone-700">
                      {(detail?.asks ?? []).map(ask => (
                        <li key={ask} className="flex gap-2">
                          <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                          {ask}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {i % 2 ? null : (
                    <img
                      src={detail?.image ?? "/assets/hero-dawn.jpg"}
                      alt={beat.title}
                      loading="lazy"
                      className="h-48 lg:h-full w-full object-cover"
                    />
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Tools */}
      <section className="py-10 bg-stone-50 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-5">What sits behind the rhythm</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, i) => (
              <Reveal key={tool.title} delay={i * 30}>
                <div className="h-full rounded-2xl border border-stone-200 bg-white p-5 lift">
                  <tool.icon className="h-6 w-6 text-amber-600 mb-3" />
                  <h3 className="font-semibold text-stone-900 mb-1.5">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-stone-600">{tool.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Streak philosophy */}
      <section className="py-10 bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-5 items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-5 w-5 text-amber-600" />
              <h2 className="text-2xl font-bold">
                Streaks that forgive you
              </h2>
            </div>
            <p className="text-stone-600 mb-4">
              Most habit apps punish the miss, which is exactly the wrong
              instinct for recovery. Ours is built the other way round.
            </p>
            <ul className="space-y-2 text-sm text-stone-700">
              {streakRules.map(rule => (
                <li key={rule} className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
            <div className="text-xs uppercase tracking-widest text-stone-400 mb-3">
              Last 14 days
            </div>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-8 rounded-lg ${
                    [3, 9].includes(i) ? "bg-stone-200" : "bg-amber-400/80"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-stone-600">
              Two missed days, twelve kept. The month still counts — and the
              milestone from day 7 is still yours.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-stone-900 text-white py-12 grain">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">
            Two minutes is enough to start
          </h2>
          <p className="text-stone-300 mb-6">
            Do one check-in today. That's the whole ask.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => startLogin()}>
              Start free <ArrowRight className="ml-1 h-5 w-5" />
            </Button>
            <Link href="/dimensions">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                See the 21 dimensions
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
