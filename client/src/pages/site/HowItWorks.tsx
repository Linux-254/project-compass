import { SiteLayout } from "@/components/site/SiteLayout";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { phases } from "@/lib/site-content";
import {
  ArrowRight,
  MessageSquare,
  BarChart3,
  CalendarCheck,
} from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "A conversation, not a form",
    body: "Onboarding asks the questions a thoughtful friend would ask — in your own words, at your own pace. Skip anything you're not ready for and come back to it later.",
  },
  {
    icon: BarChart3,
    title: "A map of your 21 dimensions",
    body: "The assessment becomes a starting score for each area of your life. One page, no judgement: where you are right now.",
  },
  {
    icon: CalendarCheck,
    title: "A rhythm you can keep",
    body: "Two-minute morning and evening check-ins, a nudge at the hard hour, and a one-line journal at night. Small wins recorded so relapse never erases them.",
  },
];

export default function HowItWorks() {
  return (
    <SiteLayout>
      <section className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-stone-900 mb-4">How it works</h1>
        <p className="text-xl text-stone-600 mb-12">
          A three-to-six-month journey through four phases, designed to end with
          you needing the app less.
        </p>

        <div className="space-y-8 mb-16">
          {steps.map((step, idx) => (
            <div key={step.title} className="flex gap-5">
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <step.icon className="h-6 w-6" />
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-amber-600 mb-1">
                  Step {idx + 1}
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-stone-600">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-stone-200 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            The four phases
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {phases.map((phase, idx) => (
              <div
                key={phase.title}
                className="rounded-2xl border border-stone-200 p-6"
              >
                <div className="text-4xl font-bold text-amber-500 mb-2">
                  {idx + 1}
                </div>
                <div className="text-xs uppercase tracking-wider text-stone-400 mb-1">
                  {phase.step}
                </div>
                <h3 className="font-semibold text-lg text-stone-900 mb-2">
                  {phase.title}
                </h3>
                <p className="text-sm text-stone-600">{phase.body}</p>
                <p className="text-sm text-stone-500 mt-3">{phase.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Your first two minutes</h2>
          <p className="text-lg text-stone-600 mb-8">
            The first morning check-in takes less time than making the tea.
          </p>
          <Button size="lg" onClick={() => startLogin()}>
            Start free <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
