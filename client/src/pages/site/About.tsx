import { SiteLayout } from "@/components/site/SiteLayout";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const values = [
  {
    title: "You are the expert on your life",
    body: "We don't prescribe. We mirror back what you tell us and organise it into something usable — your pace, your order, your words.",
  },
  {
    title: "Non-clinical by design",
    body: "The voice is warm, plain, and occasionally funny. This is a companion, not a chart. Nothing reads like a discharge summary.",
  },
  {
    title: "Small beats grand",
    body: "Two-minute check-ins outperform ambitious plans. We optimise for the streak you can keep on your worst day, not your best one.",
  },
  {
    title: "Privacy is the foundation",
    body: "Your journal and assessment answers are encrypted at rest. Supporters only ever see what you explicitly choose to share.",
  },
  {
    title: "Faith-friendly, never faith-imposed",
    body: "Devotionals always have a secular parallel. Your relationship with the big questions is yours to shape.",
  },
];

export default function About() {
  return (
    <SiteLayout>
      <section className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-stone-900 mb-6">
          Why ReForge exists
        </h1>
        <div className="prose prose-stone max-w-none text-stone-600 space-y-4">
          <p className="text-lg">
            Most programmes end where the hard part begins. You leave with a
            folder of paperwork, a list of triggers, and no plan for a Tuesday
            night when the old voice gets loud.
          </p>
          <p className="text-lg">
            ReForge is that plan for Tuesday night — and Wednesday morning, and
            the first weekend, and the wedding where everyone is drinking. It
            was built around one belief:{" "}
            <span className="text-stone-900 font-medium">
              recovery is a whole-life project
            </span>
            , and it deserves a tool that treats the whole life, not just the
            substance.
          </p>
          <p className="text-lg">
            The 21 life dimensions — from work and money to faith and self-image
            — give you a map you can actually see move. Daily check-ins keep you
            honest and small. Guides meet you in the specific situation you
            name. And supporters see only what you choose, at the level of
            privacy you choose.
          </p>
          <p className="text-lg">
            We are not therapy and we are not medicine. If you are in crisis,
            contact local emergency services or a helpline in your region. What
            we are is a steady, organised friend who happens to be very good at
            helping you keep going.
          </p>
        </div>
      </section>

      <section className="bg-white border-y border-stone-200 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What we believe
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map(value => (
              <div
                key={value.title}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-6"
              >
                <h3 className="font-semibold text-stone-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-stone-600">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">
            Your version of the story is waiting
          </h2>
          <p className="text-lg text-stone-600 mb-8">
            It starts with one honest check-in.
          </p>
          <Button size="lg" onClick={() => startLogin()}>
            Start free <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
