import { SiteLayout } from "@/components/site/SiteLayout";

export default function Privacy() {
  return (
    <SiteLayout>
      <section className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-stone-900 mb-4">Privacy</h1>
        <p className="text-xl text-stone-600 mb-12">
          What ReForge stores, what stays yours, and what we never do.
        </p>

        <div className="space-y-8 text-stone-600 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-stone-900 mb-2">
              The short version
            </h2>
            <p>
              Your journal and assessment answers are encrypted at rest.
              Supporters only ever see what you explicitly choose to share. We
              do not sell your data, and nothing sensitive ever appears in
              emails or notifications.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-stone-900 mb-2">
              What we store
            </h2>
            <p>
              Your account details (name, email, login method), your profile and
              preferences, your check-ins, journal, goals, rules, dimension
              scores, music preferences, and newsletter subscription status.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-stone-900 mb-2">
              Encryption
            </h2>
            <p>
              Tier-1 sensitive content — journal entries and assessment answers
              — is encrypted at rest using AES-256-GCM. Encryption keys are
              managed server-side and never exposed to the browser.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-stone-900 mb-2">
              Your control
            </h2>
            <p>
              You can delete your account and its data at any time. Supporters
              can be revoked with one tap. Unsubscribing from the newsletter
              removes you from all future sends.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-stone-900 mb-2">
              What we never do
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>We never sell or rent personal data.</li>
              <li>
                We never show journal content to supporters unless you allow it.
              </li>
              <li>We never claim to be a medical service.</li>
            </ul>
          </div>
          <p className="text-sm text-stone-500">
            This is a plain-language summary. For full terms, see the Terms
            page.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
