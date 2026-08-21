import { SiteLayout } from "@/components/site/SiteLayout";

export default function Terms() {
  return (
    <SiteLayout>
      <section className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-stone-900 mb-4">Terms of use</h1>
        <p className="text-xl text-stone-600 mb-12">
          The plain-language agreement between you and ReForge.
        </p>

        <div className="space-y-8 text-stone-600 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-stone-900 mb-2">
              Not a medical service
            </h2>
            <p>
              ReForge is a lifestyle companion for people changing their
              relationship with substances. It is not therapy, medical advice,
              or treatment. It does not diagnose, treat, or prevent any
              condition. If you are in crisis or need urgent help, contact local
              emergency services or a helpline in your region.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-stone-900 mb-2">
              Your data is yours
            </h2>
            <p>
              You own the content you create. You can export or delete it at any
              time. ReForge does not sell your data.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-stone-900 mb-2">
              Using the service
            </h2>
            <p>
              Be responsible for your own recovery and decisions. ReForge is a
              support tool, not a guarantee of any outcome. Do not misuse the
              service or attempt to access other users' data.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-stone-900 mb-2">
              Account deletion
            </h2>
            <p>
              You may delete your account at any time from the app. Deletion
              removes your personal data from our systems, subject to legal
              retention requirements.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-stone-900 mb-2">
              Contact
            </h2>
            <p>
              Questions about these terms? Use the contact page and we'll
              respond within a couple of days.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
