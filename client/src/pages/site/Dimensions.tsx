import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { dimensionGroups, dimensions21 } from "@/lib/site-content";
import { ArrowRight, CheckCircle2, LineChart, Sparkles } from "lucide-react";
import { Link } from "wouter";

const scoring = [
  {
    band: "0–25",
    label: "Under water",
    body: "The dimension is actively costing you. It becomes a focus, gently, one step at a time.",
  },
  {
    band: "26–50",
    label: "Unsteady",
    body: "Some ground exists but it moves. Guides here are about repetition, not ambition.",
  },
  {
    band: "51–75",
    label: "Holding",
    body: "Good weeks outnumber bad ones. We protect it and stop it slipping back.",
  },
  {
    band: "76–100",
    label: "A strength",
    body: "This is now something you can lean on — and use to pull another dimension up.",
  },
];

const groupImages: Record<string, string> = {
  Body: "/assets/movement.jpg",
  Mind: "/assets/evening-journal.jpg",
  People: "/assets/connection.jpg",
  Life: "/assets/hero-dawn.jpg",
  Meaning: "/assets/journal-morning.jpg",
};

export default function Dimensions() {
  return (
    <SiteLayout>
      <section className="border-b border-stone-200 bg-[#faf8f4]">
        <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-[1.1fr_1fr] gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold text-stone-900 mb-3">
              The 21 dimensions
            </h1>
            <p className="text-lg text-stone-600 mb-4">
              Recovery is whole-life work. These are the 21 areas ReForge tracks
              and scores from 0 to 100 — a map you can actually see move, so a
              hard week never gets to claim the whole story.
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-stone-700 mb-5">
              {[
                "Scored at baseline, then re-scored as you check in",
                "Grouped into five areas of life",
                "Every dimension has its own guides",
                "You choose which two to work on at a time",
              ].map(item => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button onClick={() => startLogin()}>
              Get my baseline scores <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <img
            src="/assets/journal-morning.jpg"
            alt="Morning journal and notes"
            loading="lazy"
            className="w-full h-[260px] lg:h-[340px] object-cover rounded-3xl border border-stone-200"
          />
        </div>
      </section>

      {/* Scoring bands */}
      <section className="bg-white border-b border-stone-200 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-5">
            <LineChart className="h-5 w-5 text-amber-600" />
            <h2 className="text-2xl font-bold">How a score is read</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {scoring.map((band, i) => (
              <Reveal key={band.band} delay={i * 40}>
                <div className="h-full rounded-2xl border border-stone-200 bg-stone-50 p-5 lift">
                  <div className="text-sm font-mono text-amber-600">
                    {band.band}
                  </div>
                  <h3 className="font-semibold text-stone-900 mb-1.5">
                    {band.label}
                  </h3>
                  <p className="text-sm text-stone-600">{band.body}</p>
                  <div className="mt-3 h-1.5 rounded-full bg-stone-200 overflow-hidden">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${(i + 1) * 25}%` }}
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Grouped dimensions with imagery */}
      <section className="py-10 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          {dimensionGroups.map(group => {
            const items = dimensions21.filter(d => d.group === group.group);
            return (
              <Reveal key={group.group}>
                <div className="grid lg:grid-cols-[280px_1fr] gap-5 rounded-3xl border border-stone-200 bg-white overflow-hidden">
                  <div className="relative min-h-[180px]">
                    <img
                      src={groupImages[group.group] ?? "/assets/hero-dawn.jpg"}
                      alt={group.group}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-stone-950/55" />
                    <div className="relative p-5 text-white">
                      <h2 className="text-2xl font-bold text-amber-300 mb-1">
                        {group.group}
                      </h2>
                      <p className="text-sm text-stone-200">{group.tone}</p>
                      <p className="mt-3 text-xs uppercase tracking-widest text-stone-300">
                        {items.length || group.items.length} dimensions
                      </p>
                    </div>
                  </div>
                  <div className="p-5 grid sm:grid-cols-2 gap-3">
                    {(items.length
                      ? items
                      : group.items.map(label => ({
                          slug: label,
                          label,
                          group: group.group,
                          blurb: "Tracked and scored alongside the rest.",
                        }))
                    ).map(dim => (
                      <div
                        key={dim.slug}
                        className="rounded-xl border border-stone-200 bg-stone-50 p-4 lift"
                      >
                        <h3 className="font-medium text-stone-900 text-sm mb-1">
                          {dim.label}
                        </h3>
                        <p className="text-sm text-stone-600">{dim.blurb}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="bg-stone-900 text-white py-12 grain">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Sparkles className="h-6 w-6 text-amber-400 mx-auto mb-3" />
          <h2 className="text-3xl font-bold mb-3">
            See your own 21 in about ten minutes
          </h2>
          <p className="text-stone-300 mb-6">
            The baseline conversation asks in plain language, skips anything
            you're not ready for, and gives you one page at the end: where you
            are right now, without judgement.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => startLogin()}>
              Start free <ArrowRight className="ml-1 h-5 w-5" />
            </Button>
            <Link href="/daily-practice">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                See the daily practice
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
