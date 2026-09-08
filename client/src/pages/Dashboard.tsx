import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { REFORGE_ASSETS } from "@/config/assets";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  BookOpen,
  Check,
  Compass,
  Flame,
  Goal,
  HeartPulse,
  Leaf,
  LockKeyhole,
  Music2,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useLocation } from "wouter";

const quickLinks = [
  { label: "Check in", description: "Name what is here today.", path: "/check-in", icon: HeartPulse, tone: "bg-primary/10 text-primary" },
  { label: "Journal", description: "Make room for the truth.", path: "/journal", icon: BookOpen, tone: "bg-[#ead8bf]/55 text-[#85533b]" },
  { label: "Goals", description: "Choose the next kind step.", path: "/goals", icon: Target, tone: "bg-[#dbe4c7]/70 text-[#4d684b]" },
  { label: "Boundaries", description: "Protect the life returning.", path: "/rules", icon: ShieldCheck, tone: "bg-[#e5d5c9]/70 text-[#714935]" },
  { label: "Music reset", description: "Make sound an ally.", path: "/music", icon: Music2, tone: "bg-[#d5e3df]/75 text-[#416b63]" },
  { label: "Guides", description: "Find a gentle doorway in.", path: "/guides", icon: Compass, tone: "bg-[#ece4ba]/75 text-[#7a6a32]" },
];

export default function Dashboard() {
  const { user } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/" });
  const [, setLocation] = useLocation();
  const dashboardQuery = trpc.dashboard.getOverview.useQuery();
  const onboardingStatusQuery = trpc.onboarding.status.useQuery(undefined, { retry: false });
  const { data: overview, isLoading, isError } = dashboardQuery;
  const needsOnboarding = onboardingStatusQuery.data?.needsOnboarding;
  const displayName = overview?.profile?.displayName || user?.name?.split(" ")[0] || "friend";
  const currentStreak = overview?.streak?.current || 0;
  const longestStreak = overview?.streak?.longest || 0;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="h-72 animate-pulse rounded-[2rem] bg-muted/50" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-32 animate-pulse rounded-2xl bg-muted/50" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-3xl py-16">
          <Card className="nature-card text-center">
            <CardContent className="space-y-4 p-8">
              <Leaf className="mx-auto h-8 w-8 text-primary" />
              <h1 className="font-serif text-3xl">Your space is taking a breath.</h1>
              <p className="text-sm leading-6 text-muted-foreground">We could not load the dashboard just now. Your private data has not been changed.</p>
              <Button onClick={() => void dashboardQuery.refetch()} className="rounded-full">Try again</Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-7">
        <section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-[#285C32] text-[#f7eddc] shadow-[0_24px_60px_-40px_rgba(40,92,50,.8)]">
          <img src={REFORGE_ASSETS.dashboard} alt="Soft light across a leafy path" className="absolute inset-0 h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(40,92,50,.98),rgba(40,92,50,.66),rgba(23,74,42,.2))]" />
          <div className="relative grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl space-y-4">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200"><Sparkles className="h-4 w-4" /> Your daily landing place</p>
              <h1 className="font-serif text-4xl leading-tight sm:text-6xl">Welcome back, {displayName}.</h1>
              <p className="max-w-xl text-sm leading-7 text-white/76 sm:text-base">You do not have to solve the whole life today. Notice the next honest thing, then let that be enough for this morning.</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button onClick={() => setLocation("/check-in")} className="rounded-full bg-[#f2d39c] text-[#304333] hover:bg-[#f6dfb1]">Begin today <ArrowRight className="ml-2 h-4 w-4" /></Button>
                <Button variant="outline" onClick={() => setLocation("/progress")} className="rounded-full border-white/25 bg-white/5 text-white hover:bg-white/12 hover:text-white">See my map</Button>
              </div>
            </div>
            <div className="grid min-w-[220px] gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/15 bg-black/10 p-4 backdrop-blur-sm"><div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-white/65"><Flame className="h-4 w-4 text-amber-200" /> Current rhythm</div><p className="mt-2 font-serif text-4xl">{currentStreak}<span className="ml-2 text-base text-white/65">days</span></p></div>
              <div className="rounded-2xl border border-white/15 bg-black/10 p-4 backdrop-blur-sm"><div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-white/65"><TrendingUp className="h-4 w-4 text-amber-200" /> Longest rhythm</div><p className="mt-2 font-serif text-4xl">{longestStreak}<span className="ml-2 text-base text-white/65">days</span></p></div>
            </div>
          </div>
        </section>

        {needsOnboarding && (
          <section className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary/7 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div><p className="font-serif text-2xl">Let us build your starting map.</p><p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">A ten-minute conversation across 21 areas gives you a place to stand, not a verdict.</p></div>
            <Button onClick={() => setLocation("/onboarding")} className="shrink-0 rounded-full">Start gently <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </section>
        )}

        <section className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <Card className="nature-card overflow-hidden">
            <CardHeader><div className="flex items-center justify-between gap-4"><div><CardTitle className="font-serif text-2xl">Today’s check-in</CardTitle><CardDescription>Two small pauses can change the shape of a day.</CardDescription></div><Badge variant="secondary" className="rounded-full">Private</Badge></div></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {[{ label: "Morning", complete: Boolean(overview?.todayCheckIns?.morning), prompt: "How are you arriving?" }, { label: "Evening", complete: Boolean(overview?.todayCheckIns?.evening), prompt: "What can you set down?" }].map(item => <button key={item.label} onClick={() => setLocation("/check-in")} className="rounded-2xl border border-border/65 bg-muted/20 p-4 text-left transition-colors hover:border-primary/35 hover:bg-primary/6 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"><div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{item.label}</span><span className={`flex h-7 w-7 items-center justify-center rounded-full ${item.complete ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>{item.complete ? <Check className="h-4 w-4" /> : <HeartPulse className="h-4 w-4" />}</span></div><p className="mt-5 font-serif text-xl">{item.complete ? "You showed up." : item.prompt}</p><p className="mt-1 text-xs text-muted-foreground">{item.complete ? "Recorded for today" : "Take a couple of minutes"}</p></button>)}
            </CardContent>
          </Card>
          <Card className="nature-card relative overflow-hidden"><img src={REFORGE_ASSETS.reflection} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" /><div className="absolute inset-0 bg-gradient-to-br from-card via-card/92 to-primary/8" /><div className="relative"><CardHeader><CardTitle className="font-serif text-2xl">Your whole-life map</CardTitle><CardDescription>There are 21 places to notice. None of them define your worth.</CardDescription></CardHeader><CardContent><div className="flex items-end gap-3"><span className="font-serif text-5xl text-primary">{overview?.dimensionScores?.length || 0}</span><span className="pb-2 text-sm text-muted-foreground">dimensions in view</span></div><Progress value={overview?.dimensionScores?.length ? Math.min(100, (overview.dimensionScores.length / 21) * 100) : 0} className="mt-5 h-2" /><Button variant="outline" onClick={() => setLocation("/progress")} className="mt-6 w-full rounded-full">Explore your progress <TrendingUp className="ml-2 h-4 w-4" /></Button></CardContent></div></Card>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Keep moving gently</p><h2 className="mt-1 font-serif text-3xl">Choose a doorway.</h2></div><span className="hidden text-sm text-muted-foreground sm:block">Nothing here is mandatory.</span></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{quickLinks.map(link => <button key={link.path} onClick={() => setLocation(link.path)} className="group rounded-2xl border border-border/65 bg-card/80 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_15px_35px_-25px_rgba(40,92,50,.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${link.tone}`}><link.icon className="h-5 w-5" /></div><div className="mt-4 flex items-end justify-between gap-3"><div><p className="font-serif text-xl">{link.label}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{link.description}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" /></div></button>)}</div>
        </section>

        {overview?.activeGoals?.length ? <Card className="nature-card"><CardHeader><div className="flex items-center justify-between gap-4"><div><CardTitle className="flex items-center gap-2 font-serif text-2xl"><Goal className="h-5 w-5 text-primary" /> Active goals</CardTitle><CardDescription>Keep the next step close enough to touch.</CardDescription></div><Button variant="ghost" onClick={() => setLocation("/goals")} className="rounded-full">View all</Button></div></CardHeader><CardContent className="grid gap-3 md:grid-cols-2">{overview.activeGoals.slice(0, 4).map(goal => <div key={goal.id} className="rounded-2xl border border-border/55 bg-muted/20 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{goal.title}</p><p className="mt-1 text-xs text-muted-foreground">A {goal.horizon}-day horizon</p></div><span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary"><Check className="h-4 w-4" /></span></div><Progress value={0} className="mt-4 h-1.5" /></div>)}</CardContent></Card> : null}

        <p className="flex items-center justify-center gap-2 pb-2 text-center text-xs text-muted-foreground"><LockKeyhole className="h-3.5 w-3.5 text-primary" /> Sensitive reflections and check-in notes are encrypted before storage.</p>
      </div>
    </DashboardLayout>
  );
}
