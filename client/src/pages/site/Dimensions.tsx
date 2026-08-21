import { SiteLayout } from "@/components/site/SiteLayout";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { dimensionGroups, dimensions21 } from "@/lib/site-content";
import { ArrowRight } from "lucide-react";

export default function Dimensions() {
  return (
    <SiteLayout>
      <section className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-stone-900 mb-4">
          The 21 dimensions
        </h1>
        <p className="text-xl text-stone-600 mb-12">
          Recovery is whole-life work. These are the 21 areas ReForge tracks and
          scores from 0 to 100 — a map you can actually see move.
        </p>

        <div className="space-y-10">
          {dimensionGroups.map(group => (
            <div key={group.group}>
              <div className="flex items-baseline gap-3 mb-4">
                <h2 className="text-2xl font-bold text-stone-900">
                  {group.group}
                </h2>
                <p className="text-sm text-stone-500">{group.tone}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {dimensions21
                  .filter(d => d.group === group.group)
                  .map(dimension => (
                    <div
                      key={dimension.slug}
                      className="rounded-2xl border border-stone-200 bg-white p-5"
                    >
                      <h3 className="font-semibold text-stone-900 mb-1">
                        {dimension.label}
                      </h3>
                      <p className="text-sm text-stone-600">
                        {dimension.blurb}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-t border-stone-200 py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">See where you stand today</h2>
          <p className="text-lg text-stone-600 mb-8">
            The conversational assessment scores each dimension — no essays, no
            judgement.
          </p>
          <Button size="lg" onClick={() => startLogin()}>
            Begin the assessment <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
