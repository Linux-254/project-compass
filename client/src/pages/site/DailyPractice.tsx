import { SiteLayout } from "@/components/site/SiteLayout";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { dailyBeats } from "@/lib/site-content";
import { ArrowRight, Sunrise, Bell, Moon } from "lucide-react";

const practice = [
  {
    icon: Sunrise,
    title: "Morning check-in",
    body: "Mood, sleep, cravings and one intention. Four taps, no essay. It sets the day's compass.",
  },
  {
    icon: Bell,
    title: "The nudge at the hard hour",
    body: "One suggestion tied to what you named this morning — a walk, a breathing set, the message you've been avoiding.",
  },
  {
    icon: Moon,
    title: "Close the day",
    body: "One line in the journal. What held, what slipped. Milestones recorded quietly, so a bad day never deletes a good month.",
  },
];

export default function DailyPractice() {
  return (
    <SiteLayout>
      <section className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-stone-900 mb-4">
          Daily practice
        </h1>
        <p className="text-xl text-stone-600 mb-12">
          The whole system is built to fit inside the corners of an ordinary
          day. Nothing here takes more than a few minutes.
        </p>

        <div className="space-y-6 mb-16">
          {practice.map(item => (
            <div
              key={item.title}
              className="flex gap-5 rounded-2xl border border-stone-200 bg-white p-6"
            >
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <item.icon className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-stone-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-stone-600">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-stone-200 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">A sample day</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {dailyBeats.map(beat => (
              <div
                key={beat.time}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-6"
              >
                <div className="text-sm font-mono text-amber-600 mb-2">
                  {beat.time}
                </div>
                <h3 className="font-semibold text-stone-900 mb-2">
                  {beat.title}
                </h3>
                <p className="text-sm text-stone-600">{beat.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">
            Two minutes is enough to start
          </h2>
          <p className="text-lg text-stone-600 mb-8">
            Your streak is built on days like today.
          </p>
          <Button size="lg" onClick={() => startLogin()}>
            Start today's check-in <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
