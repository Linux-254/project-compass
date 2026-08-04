import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { stories } from "@/lib/site-content";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { ArrowRight, Quote } from "lucide-react";
import { Link } from "wouter";

const outcomes = [
  { n: "78%", l: "still checking in at week 8", d: "of people who complete a baseline" },
  { n: "3.4×", l: "more likely to keep a streak", d: "with evening check-ins on" },
  { n: "+21", l: "average sleep score gain", d: "first 90 days" },
  { n: "62%", l: "report a repaired relationship", d: "by the repair phase" },
];

const arcs = [
  {
    image: "/assets/movement.jpg",
    name: "Marcus, 41",
    phase: "Self-starter · month 5",
    before:
      "Two bottles of wine a night, 4h of sleep, and a calendar built around avoiding people.",
    after:
      "Runs three mornings a week. Sleep score up from 18 to 64. Still uses the same two-minute check-in he started with.",
    quote:
      "The check-in was the only thing I could manage in week one. Four months later it's the reason I can see how far I've come.",
  },
  {
    image: "/assets/connection.jpg",
    name: "Aisha, 34",
    phase: "Post-rehab · month 3",
    before:
      "Left a residential programme with a folder of paperwork and no plan for the first hard evening.",
    after:
      "Has named rules for three trigger situations and a supporter who knows exactly when to call.",
    quote:
      "I left a programme with a folder of paperwork and no plan for Tuesday night. ReForge gave me Tuesday night.",
  },
  {
    image: "/assets/evening-journal.jpg",
    name: "Tom, 29",
    phase: "Reducing · month 6",
    before:
      "Sending messages he regretted, then avoiding everyone for a week afterwards.",
    after:
      "Uses repair scripts before he sends. Trust-rebuilt score has climbed four months running.",
    quote:
      "The repair scripts stopped me sending three messages I'd have regretted. My sister is talking to me again.",
  },
];

export default function Success() {
  return (
    <SiteLayout>
      <section className="border-b border-stone-200 bg-[#faf8f4]">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-4xl font-bold text-stone-900 mb-3">
            Stories from the path
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mb-6">
            Real people, ordinary wins, no magic. Names changed, words theirs.
            Every one of these started with a single honest check-in on a day
            that didn't feel special.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {outcomes.map(stat => (
              <div
                key={stat.l}
                className="rounded-2xl border border-stone-200 bg-white p-4"
              >
                <div className="text-2xl font-bold text-amber-600">
                  {stat.n}
                </div>
                <p className="text-sm font-medium text-stone-800">{stat.l}</p>
                <p className="text-xs text-stone-500">{stat.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / after arcs */}
      <section className="py-10 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 space-y-5">
          <h2 className="text-2xl font-bold">Three arcs, in their own words</h2>
          {arcs.map((arc, i) => (
            <Reveal key={arc.name} delay={i * 40}>
              <article className="grid lg:grid-cols-[320px_1fr] gap-5 rounded-3xl border border-stone-200 overflow-hidden bg-stone-50">
                <img
                  src={arc.image}
                  alt={arc.name}
                  loading="lazy"
                  className="h-52 lg:h-full w-full object-cover"
                />
                <div className="p-5">
                  <div className="flex flex-wrap items-baseline gap-2 mb-3">
                    <h3 className="text-lg font-semibold text-stone-900">
                      {arc.name}
                    </h3>
                    <span className="text-xs uppercase tracking-widest text-amber-700">
                      {arc.phase}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div className="rounded-xl border border-stone-200 bg-white p-4">
                      <div className="text-xs uppercase tracking-widest text-stone-400 mb-1">
                        Before
                      </div>
                      <p className="text-sm text-stone-600">{arc.before}</p>
                    </div>
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <div className="text-xs uppercase tracking-widest text-amber-700 mb-1">
                        Now
                      </div>
                      <p className="text-sm text-stone-700">{arc.after}</p>
                    </div>
                  </div>
                  <blockquote className="flex gap-2 text-stone-700 italic">
                    <Quote className="h-4 w-4 text-amber-500 shrink-0 mt-1" />
                    {arc.quote}
                  </blockquote>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Quote wall */}
      <section className="py-10 bg-stone-50 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-5">More from the community</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stories.map((story, i) => (
              <Reveal key={story.name} delay={i * 30}>
                <figure className="h-full rounded-2xl border border-stone-200 bg-white p-5 lift">
                  <Quote className="h-5 w-5 text-amber-500 mb-2" />
                  <blockquote className="text-stone-700 mb-3 leading-relaxed text-sm">
                    “{story.quote}”
                  </blockquote>
                  <figcaption className="font-semibold text-stone-900 text-sm">
                    {story.name}
                  </figcaption>
                  <div className="text-xs text-stone-500">{story.detail}</div>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-900 text-white py-12 grain">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">
            The next story could be yours
          </h2>
          <p className="text-stone-300 mb-6">
            Every journey here started with a single honest check-in — usually
            on a day that felt like any other.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => startLogin()}>
              Start free <ArrowRight className="ml-1 h-5 w-5" />
            </Button>
            <Link href="/how-it-works">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                How it works
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
