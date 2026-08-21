import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { dimensions21 } from "@/lib/site-content";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
} from "lucide-react";
import { useLocation } from "wouter";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type Step =
  | { kind: "welcome" }
  | { kind: "substance" }
  | { kind: "profile" }
  | { kind: "dimension"; dimensionId: number; slug: string }
  | { kind: "done" };

const substances = [
  "alcohol",
  "nicotine",
  "marijuana",
  "codeine",
  "prescription",
] as const;
const frequencies = ["daily", "weekly", "occasional"] as const;
const approaches = ["quit", "reduce"] as const;

export default function Onboarding() {
  const { user } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: "/",
  });
  const [, setLocation] = useLocation();

  const dimsQuery = trpc.onboarding.getDimensions.useQuery(undefined, {
    retry: false,
  });
  const startMutation = trpc.onboarding.startAssessment.useMutation();
  const saveResponseMutation = trpc.onboarding.saveResponse.useMutation();
  const saveScoreMutation = trpc.onboarding.saveScore.useMutation();
  const completeMutation = trpc.onboarding.completeAssessment.useMutation();
  const updateProfileMutation = trpc.profile.update.useMutation();

  const dimsById = useMemo(
    () => new Map((dimsQuery.data ?? []).map(d => [d.id, d])),
    [dimsQuery.data]
  );

  const steps: Step[] = useMemo(() => {
    const dimensionSteps: Step[] = (dimsQuery.data ?? []).map(d => ({
      kind: "dimension" as const,
      dimensionId: d.id,
      slug: d.slug,
    }));
    return [
      { kind: "welcome" },
      { kind: "substance" },
      { kind: "profile" },
      ...dimensionSteps,
      { kind: "done" },
    ];
  }, [dimsQuery.data]);

  const [stepIndex, setStepIndex] = useState(0);
  const [assessmentId, setAssessmentId] = useState<number | null>(null);

  const [substance, setSubstance] =
    useState<(typeof substances)[number]>("alcohol");
  const [frequency, setFrequency] =
    useState<(typeof frequencies)[number]>("daily");
  const [approach, setApproach] = useState<(typeof approaches)[number]>("quit");
  const [duration, setDuration] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [faithPreference, setFaithPreference] = useState<
    "faith" | "secular" | "both"
  >("both");
  const [answers, setAnswers] = useState<
    Record<string, { answer: string; rating: number }>
  >({});
  const [busy, setBusy] = useState(false);

  const step = steps[stepIndex];
  const total = steps.length;

  const isDimensionStep = step?.kind === "dimension";

  const currentAnswer = isDimensionStep ? answers[step.slug] : undefined;

  const startAssessmentIfNeeded = async (): Promise<number> => {
    if (assessmentId) return assessmentId;
    const result = await startMutation.mutateAsync();
    const id = result?.id ?? null;
    if (id === null) {
      throw new Error("Failed to start assessment");
    }
    setAssessmentId(id);
    return id;
  };

  const advance = async () => {
    if (stepIndex === 0) {
      // Welcome -> begin assessment
      setBusy(true);
      try {
        await startAssessmentIfNeeded();
      } catch {
        toast.error("Couldn't start your assessment. Please try again.");
        setBusy(false);
        return;
      }
      setBusy(false);
    }

    if (stepIndex === steps.length - 2) {
      // last dimension -> complete
      setBusy(true);
      try {
        const id = await startAssessmentIfNeeded();
        await updateProfileMutation.mutateAsync({
          displayName: displayName || undefined,
          faithPreference,
        });
        await completeMutation.mutateAsync({
          assessmentId: id,
          substanceFocus: substance,
          substanceFrequency: frequency,
          substanceApproach: approach,
        });
      } catch (error) {
        console.error(error);
        toast.error(
          "Something went wrong while finishing up. Please try again."
        );
        setBusy(false);
        return;
      }
      setBusy(false);
    }

    setStepIndex(i => Math.min(i + 1, steps.length - 1));
  };

  const back = () => setStepIndex(i => Math.max(i - 1, 0));

  const handleSaveCurrent = async (): Promise<boolean> => {
    if (step?.kind !== "dimension") return true;
    const slug = step.slug;
    const answer = answers[slug];
    const id = await startAssessmentIfNeeded();
    const dim = dimsById.get(step.dimensionId);

    try {
      if (answer?.answer) {
        await saveResponseMutation.mutateAsync({
          assessmentId: id,
          dimensionId: step.dimensionId,
          response: { answer: answer.answer, rating: answer.rating },
        });
      }
      if (dim) {
        await saveScoreMutation.mutateAsync({
          dimensionId: step.dimensionId,
          score: answer?.rating ?? 5,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Couldn't save your answer. Please try again.");
      return false;
    }
    return true;
  };

  const next = async () => {
    if (isDimensionStep) {
      const ok = await handleSaveCurrent();
      if (!ok) return;
    }
    await advance();
  };

  if (dimsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-500">Loading your assessment…</div>
      </div>
    );
  }

  const renderStep = () => {
    switch (step.kind) {
      case "welcome":
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <HeartHandshake className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900">
              Before we begin
            </h1>
            <p className="text-lg text-stone-600 max-w-xl mx-auto">
              This is a conversation, not an exam. Answer in your own words,
              skip anything you're not ready for, and be as honest as you can
              manage today. It takes about ten minutes and you can finish it
              later.
            </p>
            <div className="text-sm text-stone-500">
              21 areas of your life, one gentle question at a time.
            </div>
          </div>
        );
      case "substance":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-stone-900">
              What are you changing?
            </h1>
            <p className="text-stone-600">
              No judgement here — this shapes the support we offer you.
            </p>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Primary substance
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {substances.map(s => (
                  <Button
                    key={s}
                    type="button"
                    variant={substance === s ? "default" : "outline"}
                    onClick={() => setSubstance(s)}
                    className="capitalize"
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                How often?
              </label>
              <div className="flex flex-wrap gap-2">
                {frequencies.map(f => (
                  <Button
                    key={f}
                    type="button"
                    variant={frequency === f ? "default" : "outline"}
                    onClick={() => setFrequency(f)}
                    className="capitalize"
                  >
                    {f}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                What's your goal?
              </label>
              <div className="flex flex-wrap gap-2">
                {approaches.map(a => (
                  <Button
                    key={a}
                    type="button"
                    variant={approach === a ? "default" : "outline"}
                    onClick={() => setApproach(a)}
                    className="capitalize"
                  >
                    {a}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                How long has this been part of your life?{" "}
                <span className="text-stone-400">(optional)</span>
              </label>
              <Input
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="e.g. about five years, on and off"
              />
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-stone-900">
              A little about you
            </h1>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                What should we call you?{" "}
                <span className="text-stone-400">(optional)</span>
              </label>
              <Input
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder={user?.name || "Your name"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Do you want faith-based content, secular, or both?
              </label>
              <div className="flex flex-wrap gap-2">
                {(["faith", "secular", "both"] as const).map(f => (
                  <Button
                    key={f}
                    type="button"
                    variant={faithPreference === f ? "default" : "outline"}
                    onClick={() => setFaithPreference(f)}
                    className="capitalize"
                  >
                    {f}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );
      case "dimension": {
        const def = dimensions21.find(d => d.slug === step.slug);
        const dim = dimsById.get(step.dimensionId);
        const answer = answers[step.slug];
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{def?.group ?? "Dimension"}</Badge>
              {dim?.label && (
                <span className="text-sm text-stone-500">{dim.label}</span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-stone-900">
              {def?.label ?? "Tell us about this part of your life"}
            </h1>
            {def?.blurb && <p className="text-stone-600">{def.blurb}</p>}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                In your own words
              </label>
              <Textarea
                value={answer?.answer ?? ""}
                onChange={e =>
                  setAnswers(prev => ({
                    ...prev,
                    [step.slug]: {
                      answer: e.target.value,
                      rating: prev[step.slug]?.rating ?? 5,
                    },
                  }))
                }
                placeholder="Take your time. One or two sentences is plenty."
                className="min-h-28"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-stone-700">
                Where are you today?{" "}
                <span className="text-stone-400">(0 = rough, 10 = solid)</span>
              </label>
              <Slider
                value={[answer?.rating ?? 5]}
                onValueChange={val =>
                  setAnswers(prev => ({
                    ...prev,
                    [step.slug]: {
                      answer: prev[step.slug]?.answer ?? "",
                      rating: val[0],
                    },
                  }))
                }
                min={0}
                max={10}
                step={1}
              />
              <div className="text-center text-3xl font-bold text-amber-600">
                {answer?.rating ?? 5}
                <span className="text-sm text-stone-500 ml-1">/10</span>
              </div>
            </div>
            <div className="text-xs text-stone-400">
              You can skip this one if you'd rather not — just tap next.
            </div>
          </div>
        );
      }
      case "done":
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-stone-900">
              Welcome to your journey
            </h1>
            <p className="text-lg text-stone-600 max-w-xl mx-auto">
              Your map is ready. In a few seconds you'll see your starting
              scores across the 21 dimensions — a place to stand, not a verdict.
            </p>
            <Button
              size="lg"
              onClick={() => setLocation("/dashboard")}
              className="gap-2"
            >
              See my dashboard <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        );
    }
  };

  const dimensionIndex = isDimensionStep
    ? (dimsQuery.data ?? []).findIndex(d => d.id === step.dimensionId)
    : -1;
  const progressPercent =
    stepIndex === steps.length - 1
      ? 100
      : Math.round(((stepIndex + 1) / total) * 100);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <div className="max-w-2xl w-full mx-auto px-4 py-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="text-xl font-bold text-stone-900">
            Re<span className="text-amber-600">Forge</span>
          </div>
          <div className="text-sm text-stone-500">
            {stepIndex + 1} / {total}
          </div>
        </div>

        <Progress value={progressPercent} className="h-1.5 mb-10" />

        <div className="flex-1 flex flex-col justify-center pb-10">
          {renderStep()}
        </div>

        <div className="flex items-center justify-between gap-4 pb-8">
          <Button
            variant="ghost"
            onClick={back}
            disabled={stepIndex === 0 || busy}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          {step.kind !== "done" && (
            <Button size="lg" onClick={next} disabled={busy} className="gap-2">
              {busy
                ? "Saving…"
                : stepIndex === steps.length - 2
                  ? "Finish"
                  : "Next"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
