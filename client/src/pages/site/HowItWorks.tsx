import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { phases } from "@/lib/site-content";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Link } from "wouter";

const steps = [
  {
    icon: MessageSquare,
    title: "A conversation, not a form",
    body: "Onboarding asks the questions a thoughtful friend would ask — in your own words, at your own pace. Skip anything you're not ready for and come back later.",
    time: "~10 minutes",
  },
  {
    icon: BarChart3,
    title: "One page that tells the truth",
    body: "At the end you get baseline scores across the 21 dimensions. No grade, no diagnosis — just where you are right now, in plain language.",
    time: "instant",
  },
  {
    icon: CalendarCheck,
    title: "A rhythm you can keep",
    body: "Morning and evening check-ins, one midday nudge, and a hard-hour kit. Two minutes at a time, designed for your worst day rather than your best.",
    time: "2 min / day",
  },
  {
    icon: Users,
    title: "Support you control",
    body: "Invite one supporter and choose exactly what they can see — from streak-only to shared rules. Revoke it at any time without a conversation.",
    time: "opt-in",
  },
];

const principles = [
  {
    title: "Small beats grand",
    body: "We optimise for the streak you can keep on a bad day. Anything that takes more than two minutes is optional by design.",
  },
  {
    title: "A bad day never deletes a good month",
    body: "Milestones persist through slips. The scoring model smooths over weeks, so one hard night can't rewrite your map.",
  },
  {
    title: "You choose the order",
    body: "Work on two dimensions at a time, in whatever order you want. Nothing is locked behind a curriculum.",
  },
  {
    title: "Privacy is the foundation",
    body: "Journal and assessment answers are encrypted at rest, and nothing sensitive appears in any email or notification.",
  },
  {
    title: "Faith-friendly, never faith-imposed",
    body: "Every devotional has a secular parallel, and faith content is always opt-in.",
  },
  {
    title: "Success is needing us less",
    body: "By week 24 you export your rules, triggers, support map and milestones. The app becoming optional is the goal.",
  },
];

const weekOne = [
  { day: "Day 1", body: "Baseline conversation and your first morning check-in." },
  { day: "Day 2", body: "Name three trigger situations. Write one rule for each." },
  { day: "Day 3", body: "Pick your first two dimensions to work on." },
  { day: "Day 4", body: "First guide, matched to the situation you named." },
  { day: "Day 5", body: "Evening journal prompt: what held this week." },
  { day: "Day 6", body: "Optional: invite a supporter, choose their view." },
  { day: "Day 7", body: "First weekly review — your map, one week older." },
];

export default function HowItWorks() {
  return (
    <SiteLayout>
      <section className="border-b border-stone-200 bg-[#faf8f4]">
        <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-[1.05fr_1fr] gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold text-stone-900 mb-3">
              How ReForge works
            </h1>
            <p className="text-lg text-stone-600 mb-4">
              Four stages over roughly 24 weeks, built on a two-minute daily
              rhythm. You set the pace, and you can pause any part of it without
              losing your place.
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-stone-700 mb-5">
              {[
                "Baseline in about ten minutes",
                "21 dimensions scored 0–100",
                "Guides matched to the moment",
                "Export everything at week 24",
              ].map(item => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button onClick={() => startLogin()}>
              Start the baseline <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <img
            src="/assets/hero-window.jpg"
            alt="Morning light through an open window"
            loading="lazy"
            className="w-full h-[260px] lg:h-[330px] object-cover rounded-3xl border border-stone-200"
          />
        </div>
      </section>

      {/* Steps */}
      <section className="py-10 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-5">The first hour, honestly</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 40}>
                <div className="h-full rounded-2xl border border-stone-200 bg-stone-50 p-5 lift">
                  <step.icon className="h-6 w-6 text-amber-600 mb-3" />
                  <div className="text-xs uppercase tracking-widest text-stone-400 mb-1">
                    {step.time}
                  </div>
                  <h3 className="font-semibold text-stone-900 mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-sm text-stone-600">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Phases */}
      <section className="py-10 bg-stone-50 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-5">The 24-week arc</h2>
          <div className="space-y-4">
            {phases.map((phase, i) => (
              <Reveal key={phase.title} delay={i * 35}>
                <div className="grid md:grid-cols-[180px_1fr] gap-4 rounded-2xl border border-stone-200 bg-white p-5">
                  <div>
                    <div className="text-3xl font-bold text-amber-500">
                      {i + 1}
                    </div>
                    <div className="text-xs uppercase tracking-widest text-stone-400">
                      {phase.step}
                    </div>
                    <h3 className="font-semibold text-stone-900 mt-1">
                      {phase.title}
                    </h3>
                  </div>
                  <div>
                    <p className="text-stone-700 mb-2">{phase.body}</p>
                    <p className="text-sm text-stone-600">{phase.detail}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Week one */}
      <section className="py-10 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-[1fr_340px] gap-6 items-start">
          <div>
            <h2 className="text-2xl font-bold mb-4">Your first week, mapped</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {weekOne.map(item => (
                <div
                  key={item.day}
                  className="rounded-xl border border-stone-200 bg-stone-50 p-4"
                >
                  <div className="text-xs font-mono text-amber-600 mb-1">
                    {item.day}
                  </div>
                  <p className="text-sm text-stone-700">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-stone-200 overflow-hidden">
            <img
              src="/assets/movement.jpg"
              alt="Early morning trail"
              loading="lazy"
              className="h-44 w-full object-cover"
            />
            <div className="p-5 bg-stone-50">
              <ShieldCheck className="h-5 w-5 text-amber-600 mb-2" />
              <p className="text-sm text-stone-600">
                Nothing in week one is compulsory. If all you do is the morning
                check-in, week one still counts as a full week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-10 bg-stone-900 text-white grain">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-5">
            The principles we build against
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 30}>
                <div className="h-full rounded-2xl border border-stone-700 bg-stone-800/60 p-5">
                  <h3 className="font-semibold text-amber-300 mb-1.5">
                    {p.title}
                  </h3>
                  <p className="text-sm text-stone-300">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => startLogin()}>
              Start free <ArrowRight className="ml-1 h-5 w-5" />
            </Button>
            <Link href="/faq">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Read the FAQ
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
