import { SitePage } from "@/components/site/SitePage";

export default function Terms() {
  return (
    <SitePage
      asset="terms"
      eyebrow="The plain-language agreement"
      title="Terms of use"
      description="The plain-language agreement between you and ReForge."
    >
      <section className="container max-w-3xl py-20">
        <div className="space-y-8 leading-relaxed text-muted-foreground">
          <div>
            <h2 className="mb-2 font-serif text-2xl text-foreground">Not a medical service</h2>
            <p>
              ReForge is a lifestyle companion for people changing their
              relationship with substances. It is not therapy, medical advice,
              or treatment. It does not diagnose, treat, or prevent any
              condition. If you are in crisis or need urgent help, contact local
              emergency services or a helpline in your region.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-serif text-2xl text-foreground">Your data is yours</h2>
            <p>
              You own the content you create. You can export or delete it at any
              time. ReForge does not sell your data.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-serif text-2xl text-foreground">Using the service</h2>
            <p>
              Be responsible for your own recovery and decisions. ReForge is a
              support tool, not a guarantee of any outcome. Do not misuse the
              service or attempt to access other users' data.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-serif text-2xl text-foreground">Account deletion</h2>
            <p>
              You may delete your account at any time from the app. Deletion
              removes your personal data from our systems, subject to legal
              retention requirements.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-serif text-2xl text-foreground">Contact</h2>
            <p>
              Questions about these terms? Use the contact page and we'll
              respond within a couple of days.
            </p>
          </div>
        </div>
      </section>
    </SitePage>
  );
}