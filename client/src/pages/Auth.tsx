import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const promises = [
  "Your journal and assessment answers are encrypted at rest.",
  "Supporters only ever see what you explicitly choose to share.",
  "Nothing sensitive appears in emails or notifications.",
  "Export or delete everything, at any time, without asking us.",
];

const firstFiveMinutes = [
  {
    step: "01",
    title: "Verify it's you",
    body: "One secure hand-off — no password to invent, remember or lose.",
  },
  {
    step: "02",
    title: "Set your baseline",
    body: "A short conversation sets your profile and starting scores across the 21 dimensions.",
  },
  {
    step: "03",
    title: "Your first check-in",
    body: "Two minutes. Mood, sleep, cravings, one intention. That's day one done.",
  },
];

export default function Auth() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const next = new URLSearchParams(window.location.search).get("next");
      setLocation(next && next.startsWith("/") ? next : "/dashboard");
    }
  }, [loading, user, setLocation]);

  const go = () => {
    setPending(true);
    startLogin();
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr] bg-stone-50">
      {/* Story side */}
      <aside className="relative hidden lg:block overflow-hidden">
        <img
          src="/assets/hero-window.jpg"
          alt="A person standing at an open window at dawn"
          className="absolute inset-0 h-full w-full object-cover"
          width={1600}
          height={1104}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/55 to-stone-900/35" />
        <div className="relative h-full flex flex-col justify-between p-10 text-white">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Re<span className="text-amber-400">Forge</span>
          </Link>
          <div className="space-y-6 max-w-md">
            <h2 className="text-3xl font-bold leading-tight">
              The hard hour is easier with a plan you wrote yourself.
            </h2>
            <ul className="space-y-2.5 text-sm text-stone-200">
              {promises.map(item => (
                <li key={item} className="flex gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/15">
              <div>
                <div className="text-2xl font-bold text-amber-400">21</div>
                <p className="text-xs text-stone-300">dimensions tracked</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">2 min</div>
                <p className="text-xs text-stone-300">per check-in</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">24 wks</div>
                <p className="text-xs text-stone-300">guided journey</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-stone-400 max-w-sm">
            ReForge is a lifestyle companion, not therapy or a medical service.
            In a crisis, contact local emergency services or a helpline in your
            region.
          </p>
        </div>
      </aside>

      {/* Form side */}
      <section className="flex flex-col justify-center px-5 sm:px-10 py-10">
        <div className="w-full max-w-md mx-auto">
          <Link
            href="/"
            className="lg:hidden text-xl font-bold tracking-tight text-stone-900"
          >
            Re<span className="text-amber-600">Forge</span>
          </Link>

          <Reveal>
            <div className="mt-6 inline-flex rounded-full border border-stone-200 bg-white p-1 text-sm">
              <button
                type="button"
                onClick={() => setMode("signIn")}
                className={`rounded-full px-4 py-1.5 font-medium transition-colors ${
                  mode === "signIn"
                    ? "bg-stone-900 text-white"
                    : "text-stone-600"
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode("signUp")}
                className={`rounded-full px-4 py-1.5 font-medium transition-colors ${
                  mode === "signUp"
                    ? "bg-stone-900 text-white"
                    : "text-stone-600"
                }`}
              >
                Create account
              </button>
            </div>

            <h1 className="mt-6 text-3xl font-bold text-stone-900">
              {mode === "signIn" ? "Welcome back" : "Start where you are"}
            </h1>
            <p className="mt-2 text-stone-600">
              {mode === "signIn"
                ? "Pick up your streak, your rules and your dimension map exactly where you left them."
                : "No forms with forty fields. One secure sign-up, then a two-minute first check-in."}
            </p>

            <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-5">
              <Button
                size="lg"
                className="w-full"
                disabled={pending || loading}
                onClick={go}
              >
                {pending
                  ? "Opening secure sign-in…"
                  : mode === "signIn"
                    ? "Continue securely"
                    : "Create my account"}
                <ArrowRight className="ml-1 h-5 w-5" />
              </Button>
              <p className="mt-3 flex items-start gap-2 text-xs text-stone-500">
                <Lock className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                Passwordless and encrypted. We never see or store a password,
                and we never sell data — ever.
              </p>
              <div className="mt-4 pt-4 border-t border-stone-100 space-y-2">
                {[
                  "Free to start, no card required",
                  "Faith content is always opt-in",
                  "A broken streak never deletes your progress",
                ].map(item => (
                  <p
                    key={item}
                    className="flex items-center gap-2 text-sm text-stone-600"
                  >
                    <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-100/70 p-5">
              <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-stone-900">
                <Sparkles className="h-4 w-4 text-amber-600" /> Your first five
                minutes
              </div>
              <ol className="space-y-3">
                {firstFiveMinutes.map(item => (
                  <li key={item.step} className="flex gap-3">
                    <span className="font-mono text-xs text-amber-700 mt-0.5">
                      {item.step}
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-stone-900">
                        {item.title}
                      </span>
                      <span className="block text-sm text-stone-600">
                        {item.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-5 text-xs text-stone-500">
              By continuing you agree to our{" "}
              <Link href="/terms" className="underline">
                terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline">
                privacy policy
              </Link>
              . Supporting someone else?{" "}
              <Link href="/supporters" className="underline">
                See the supporter view
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
