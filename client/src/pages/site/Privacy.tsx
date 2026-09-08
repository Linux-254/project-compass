import { SitePage } from "@/components/site/SitePage";

export default function Privacy() {
  return (
    <SitePage
      asset="privacy"
      eyebrow="Private by design"
      title="Privacy"
      description="What ReForge stores, what stays yours, and what we never do."
    >
      <section className="container max-w-3xl py-20">
        <div className="space-y-8 leading-relaxed text-muted-foreground">
          <div>
            <h2 className="mb-2 font-serif text-2xl text-foreground">The short version</h2>
            <p>
              Your journal and assessment answers are encrypted at rest.
              Supporters only ever see what you explicitly choose to share. We
              do not sell your data, and nothing sensitive ever appears in
              emails or notifications.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-serif text-2xl text-foreground">What we store</h2>
            <p>
              Your account details (name, email, login method), your profile and
              preferences, your check-ins, journal, goals, rules, dimension
              scores, music preferences, and newsletter subscription status.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-serif text-2xl text-foreground">Encryption</h2>
            <p>
              Tier-1 sensitive content — journal entries and assessment answers
              — is encrypted at rest using AES-256-GCM. Encryption keys are
              managed server-side and never exposed to the browser.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-serif text-2xl text-foreground">Your control</h2>
            <p>
              You can delete your account and its data at any time. Supporters
              can be revoked with one tap. Unsubscribing from the newsletter
              removes you from all future sends.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-serif text-2xl text-foreground">What we never do</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>We never sell or rent personal data.</li>
              <li>
                We never show journal content to supporters unless you allow it.
              </li>
              <li>We never claim to be a medical service.</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground/70">
            This is a plain-language summary. For full terms, see the Terms
            page.
          </p>
        </div>
      </section>
    </SitePage>
  );
}