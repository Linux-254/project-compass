import { SiteLayout } from "@/components/site/SiteLayout";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, HandHeart, Users } from "lucide-react";

const supporterSteps = [
  {
    icon: Users,
    title: "Invite a supporter",
    body: "From the app, choose one person you trust. They get their own ReForge account as a supporter.",
  },
  {
    icon: Eye,
    title: "Choose the scope",
    body: "Dashboard only, dashboard and journal, or full access. You control exactly what they can see, and you can revoke it any time.",
  },
  {
    icon: HandHeart,
    title: "They see progress, not details",
    body: "Supporters see streaks, milestones, and trends — never raw journal entries unless you've explicitly allowed it. Nothing sensitive ever lands in a notification.",
  },
];

export default function Supporters() {
  return (
    <SiteLayout>
      <section className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-stone-900 mb-4">
          For the people who love them
        </h1>
        <p className="text-xl text-stone-600 mb-12">
          You can't do it for them, but you don't have to be blind to their
          journey either.
        </p>

        <div className="space-y-6 mb-16">
          {supporterSteps.map((step, idx) => (
            <div
              key={step.title}
              className="flex gap-5 rounded-2xl border border-stone-200 bg-white p-6"
            >
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <step.icon className="h-6 w-6" />
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-amber-600 mb-1">
                  Step {idx + 1}
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-stone-600">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-t border-stone-200 py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">
            Know when to call, not just when to worry
          </h2>
          <p className="text-lg text-stone-600 mb-8">
            A supporter view built for kindness, not surveillance.
          </p>
          <Button size="lg" onClick={() => startLogin()}>
            Learn more in the app <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
