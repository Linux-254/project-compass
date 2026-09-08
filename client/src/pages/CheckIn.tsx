import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { REFORGE_ASSETS } from "@/config/assets";
import { Reveal } from "@/components/Reveal";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";
import {
  Sunrise,
  MoonStar,
  Smile,
  Zap,
  Heart,
  Leaf,
  Check,
  Sparkles,
} from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

const MOOD_LABELS = ["Very low", "Low", "A little low", "Uneven", "Okay", "Steady", "Good", "Grounded", "Bright", "Very high"];
const ENERGY_LABELS = ["Exhausted", "Drained", "Low", "Tired", "Even", "Calm", "Alert", "Strong", "Energetic", "Renewed"];
const CRAVING_LABELS = ["None", "A whisper", "Light", "Drifting", "Moderate", "Noticeable", "Strong", "Loud", "Urgent", "Overwhelming"];

function SliderRow({
  icon: Icon,
  title,
  description,
  value,
  onChange,
  labels,
  marker,
}: {
  icon: typeof Smile;
  title: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  labels: string[];
  marker: string;
}) {
  return (
    <Reveal className="nature-card">
      <Card className="border-none bg-transparent shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/12 text-primary">
              <Icon className="h-4 w-4" />
            </span>
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Slider
            value={[value]}
            onValueChange={val => onChange(val[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
            aria-label={title}
          />
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{labels[0]}</span>
            <Badge variant="secondary" className="rounded-full px-3 py-1 font-accent text-base font-semibold text-primary">
              {labels[value - 1]}
            </Badge>
            <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{labels[9]}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground/70">
            <span>{marker}</span>
            <span className="font-medium text-primary">{value}/10</span>
          </div>
        </CardContent>
      </Card>
    </Reveal>
  );
}

export default function CheckIn() {
  useAuth({ redirectOnUnauthenticated: true, redirectPath: "/" });
  const [, setLocation] = useLocation();
  const [part, setPart] = useState<"morning" | "evening">("morning");
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [cravings, setCravings] = useState(5);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayQuery = trpc.checkIn.getToday.useQuery();
  const createCheckInMutation = trpc.checkIn.create.useMutation();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createCheckInMutation.mutateAsync({
        part,
        mood,
        energy,
        cravings,
        notes: notes || undefined,
      });
      toast.success(`${part === "morning" ? "Morning" : "Evening"} check-in recorded.`, {
        description: "Small honest steps become a steady rhythm.",
      });
      setLocation("/check-ins");
    } catch (error) {
      console.error("Failed to save check-in:", error);
      toast.error("We could not save this check-in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (todayQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-3xl space-y-4">
          <Skeleton className="h-56 w-full rounded-[2rem] bg-primary/10" />
          <Skeleton className="h-40 w-full rounded-2xl bg-primary/10" />
          <Skeleton className="h-40 w-full rounded-2xl bg-primary/10" />
        </div>
      </DashboardLayout>
    );
  }

  const isCompleted = part === "morning" ? todayQuery.data?.morning : todayQuery.data?.evening;
  const otherPartRecorded =
    part === "morning" ? todayQuery.data?.evening : todayQuery.data?.morning;
  const partMeta =
    part === "morning"
      ? { icon: Sunrise, label: "Morning", tagline: "Name how you are arriving." }
      : { icon: MoonStar, label: "Evening", tagline: "Name what you can set down." };
  const PartIcon = partMeta.icon;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-7">
        {/* Page hero band — matches the rest of the workspace */}
        <section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-[#174A2A] text-[#f7eddc]">
          <img src={REFORGE_ASSETS.checkIn} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(23,74,42,.96),rgba(23,74,42,.58),rgba(23,74,42,.12))]" />
          <div className="relative flex flex-col gap-5 p-7 sm:p-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
                <PartIcon className="h-4 w-4" /> {partMeta.label} check-in
              </p>
              <h1 className="font-serif text-4xl leading-tight sm:text-5xl">Name this moment honestly.</h1>
              <p className="text-sm leading-7 text-white/75 sm:text-base">
                Two minutes, four taps, no essay required. {partMeta.tagline}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/10 px-4 py-3 text-xs text-white/75">
              <Sparkles className="h-4 w-4 text-amber-200" />
              {todayQuery.data?.morning && todayQuery.data?.evening
                ? "Both parts recorded"
                : otherPartRecorded
                  ? isCompleted
                    ? "Both parts recorded"
                    : "Other part recorded"
                  : isCompleted
                    ? `${partMeta.label} recorded`
                    : "Ready when you are"}
            </div>
          </div>
        </section>

        {/* Part Selection */}
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border/70 bg-card/80 p-1.5 backdrop-blur">
          {(["morning", "evening"] as const).map(option => (
            <button
              key={option}
              onClick={() => setPart(option)}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${part === option ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {option === "morning" ? <Sunrise className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              {option === "morning" ? "Morning" : "Evening"}
            </button>
          ))}
        </div>

        {isCompleted && (
          <Reveal>
            <div className="flex items-start gap-3 rounded-2xl border border-primary/25 bg-primary/8 p-4">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-primary">Already recorded</p>
                <p className="mt-1 text-sm text-muted-foreground">You have completed your {part} check-in today. You can update it below.</p>
              </div>
            </div>
          </Reveal>
        )}

        <div className="space-y-5">
          <SliderRow icon={Smile} title="How is your mood?" description="A number, not a verdict — nothing here is graded." value={mood} onChange={setMood} labels={MOOD_LABELS} marker="Tune the dial to how you honestly feel." />
          <SliderRow icon={Zap} title="What is your energy?" description="Physical and mental energy, one gentle reading." value={energy} onChange={setEnergy} labels={ENERGY_LABELS} marker="Low energy is information, not failure." />
          <SliderRow icon={Heart} title="How strong are the cravings?" description="Notice them without negotiating with them." value={cravings} onChange={setCravings} labels={CRAVING_LABELS} marker="Naming them is part of letting them pass." />
        </div>

        <Reveal delay={0.12}>
          <Card className="nature-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/12 text-primary"><Leaf className="h-4 w-4" /></span>
                Anything else on your mind?
              </CardTitle>
              <CardDescription>Optional — a private note for your future self.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What is happening in your life right now? How are you feeling about your journey?"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="min-h-28 resize-y rounded-2xl bg-background/70"
              />
            </CardContent>
          </Card>
        </Reveal>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" className="flex-1 rounded-full" onClick={() => setLocation("/dashboard")}>
            Cancel
          </Button>
          <Button className="flex-1 rounded-full" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : isCompleted ? "Update check-in" : "Save check-in"}
            {!isSubmitting && <Check className="ml-2 h-4 w-4" />}
          </Button>
        </div>

        <Reveal delay={0.2}>
          <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/70 p-4 backdrop-blur">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm leading-6 text-muted-foreground">
              <span className="font-medium text-foreground">You’re doing the quiet work.</span> Each check-in is a
              moment of self-awareness and care. These reflections map your patterns so you can honor the progress
              that is already moving.
            </p>
          </div>
        </Reveal>
      </div>
    </DashboardLayout>
  );
}