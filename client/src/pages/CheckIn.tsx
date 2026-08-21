import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { REFORGE_ASSETS } from "@/config/assets";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Check, Heart, Moon, ShieldCheck, Smile, Sparkles, Sun, Zap } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const prompts = {
  morning: { eyebrow: "Begin with a little honesty", title: "How do you want to meet this day?", description: "This is not a test. It is a small pause before the day starts asking things of you.", placeholder: "What would help you feel a little more held today?", icon: Sun },
  evening: { eyebrow: "Let the day settle", title: "What did today teach you about yourself?", description: "You do not have to solve the day tonight. Just notice what deserves care tomorrow.", placeholder: "What are you proud of, relieved by, or still carrying?", icon: Moon },
} as const;

function ScaleField({ label, description, icon: Icon, value, onChange, low, high }: { label: string; description: string; icon: typeof Smile; value: number; onChange: (value: number) => void; low: string; high: string }) {
  return <Card className="rounded-2xl border-border/70 bg-card/85 shadow-none"><CardHeader className="pb-3"><CardTitle className="flex items-center gap-3 font-serif text-2xl"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span>{label}</CardTitle><CardDescription>{description}</CardDescription></CardHeader><CardContent className="space-y-4"><div className="flex justify-between text-xs text-muted-foreground"><span>{low}</span><span>{high}</span></div><Slider value={[value]} onValueChange={(values) => onChange(values[0] ?? value)} min={1} max={10} step={1} /><div className="flex items-baseline justify-center gap-2"><span className="font-serif text-4xl text-primary">{value}</span><span className="text-sm text-muted-foreground">out of 10</span></div></CardContent></Card>;
}

export default function CheckIn() {
  const [, setLocation] = useLocation();
  const [part, setPart] = useState<"morning" | "evening">("morning");
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [cravings, setCravings] = useState(3);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const todayQuery = trpc.checkIn.getToday.useQuery();
  const createMutation = trpc.checkIn.create.useMutation({ onSuccess: () => { setSaved(true); setErrorMessage(""); void todayQuery.refetch(); } });
  const prompt = prompts[part];
  const PromptIcon = prompt.icon;
  const isCompleted = part === "morning" ? todayQuery.data?.morning : todayQuery.data?.evening;

  const handleSubmit = async () => {
    setErrorMessage("");
    try { await createMutation.mutateAsync({ part, mood, energy, cravings, notes: notes.trim() || undefined }); } catch { setErrorMessage("We could not save this check-in. Please try again without losing your reflection."); }
  };

  if (todayQuery.isLoading) return <DashboardLayout><div className="mx-auto max-w-4xl space-y-5"><Skeleton className="h-64 w-full rounded-3xl" /><Skeleton className="h-40 w-full rounded-3xl" /></div></DashboardLayout>;

  return <DashboardLayout><div className="mx-auto max-w-5xl space-y-6">
    <section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-[#304333] text-[#f7eddc]"><img src={REFORGE_ASSETS.checkIn} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" /><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(38,57,42,.94),rgba(38,57,42,.45),rgba(38,57,42,.12))]" /><div className="relative grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end"><div className="max-w-xl space-y-4"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200"><PromptIcon className="h-4 w-4" />{prompt.eyebrow}</div><h1 className="font-serif text-4xl leading-tight sm:text-5xl">{prompt.title}</h1><p className="max-w-lg text-sm leading-7 text-white/75 sm:text-base">{prompt.description}</p></div><div className="flex rounded-full border border-white/15 bg-black/10 p-1"><Button variant="ghost" onClick={() => { setPart("morning"); setSaved(false); }} className={`rounded-full px-4 ${part === "morning" ? "bg-[#f5ead8] text-[#304333] hover:bg-[#f5ead8]" : "text-white hover:bg-white/10 hover:text-white"}`}><Sun className="mr-2 h-4 w-4" />Morning</Button><Button variant="ghost" onClick={() => { setPart("evening"); setSaved(false); }} className={`rounded-full px-4 ${part === "evening" ? "bg-[#f5ead8] text-[#304333] hover:bg-[#f5ead8]" : "text-white hover:bg-white/10 hover:text-white"}`}><Moon className="mr-2 h-4 w-4" />Evening</Button></div></div></section>
    <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr] lg:items-start"><div className="space-y-5">
      {isCompleted && <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/8 p-4 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><p>You already have a {part} check-in today. You can gently update it below.</p></div>}
      <div className="grid gap-5 md:grid-cols-2"><ScaleField label="Mood" description="Your emotional weather, without judgement." icon={Smile} value={mood} onChange={setMood} low="Heavy" high="Light" /><ScaleField label="Energy" description="How much capacity is available today?" icon={Zap} value={energy} onChange={setEnergy} low="Running low" high="Steady" /></div>
      <ScaleField label="Cravings" description="Naming the pull can make it less lonely." icon={Heart} value={cravings} onChange={setCravings} low="Quiet" high="Intense" />
      <Card className="rounded-2xl border-border/70 bg-card/85 shadow-none"><CardHeader><CardTitle className="font-serif text-2xl">A few words, if they want to come</CardTitle><CardDescription>{prompt.placeholder}</CardDescription></CardHeader><CardContent><Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={prompt.placeholder} className="min-h-36 resize-y rounded-2xl bg-background/70" /><div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Optional notes are encrypted before storage.</div></CardContent></Card>
      {errorMessage && <p className="rounded-xl border border-destructive/30 bg-destructive/8 p-3 text-sm text-destructive">{errorMessage}</p>}
      <div className="flex flex-col gap-3 sm:flex-row"><Button variant="outline" onClick={() => setLocation("/dashboard")} className="rounded-full sm:flex-1">Return to overview</Button><Button onClick={handleSubmit} disabled={createMutation.isPending} className="rounded-full sm:flex-1">{createMutation.isPending ? "Saving your check-in…" : saved ? "Saved — update again" : "Save this check-in"}<ArrowRight className="ml-2 h-4 w-4" /></Button></div>
    </div><aside className="space-y-5 lg:sticky lg:top-24"><Card className="rounded-2xl border-primary/20 bg-primary/7 shadow-none"><CardContent className="space-y-4 p-6"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/12 text-primary"><Sparkles className="h-5 w-5" /></div><h2 className="font-serif text-2xl">A small next step</h2><p className="text-sm leading-6 text-muted-foreground">After you save, choose one thing that would make the next hour a little kinder: water, a shower, a message, fresh air, or simply staying with yourself.</p><Button variant="link" onClick={() => setLocation("/goals")} className="h-auto px-0 text-primary">Turn it into a goal <ArrowRight className="ml-2 h-4 w-4" /></Button></CardContent></Card><Card className="rounded-2xl border-border/70 bg-card/70 shadow-none"><CardContent className="p-6"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Your practice</p><p className="mt-3 font-serif text-2xl">Return, notice, repair.</p><p className="mt-2 text-sm leading-6 text-muted-foreground">The value is not in getting every number right. It is in keeping the thread visible.</p></CardContent></Card></aside></div>
  </div></DashboardLayout>;
}
