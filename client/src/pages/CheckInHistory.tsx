import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { REFORGE_ASSETS } from "@/config/assets";
import { Reveal } from "@/components/Reveal";
import { ArrowLeft, Flame, Trophy, Smile, Zap, Heart, Sunrise, MoonStar, Leaf } from "lucide-react";
import { useLocation } from "wouter";
import { useMemo, useState } from "react";

const PART_LABEL: Record<string, string> = {
  morning: "Morning",
  evening: "Evening",
};

type PartFilter = "all" | "morning" | "evening";

const moodTone = (value: number) =>
  value >= 7 ? "text-primary" : value >= 4 ? "text-[#8a6d3b]" : "text-[#a05a4a]";

export default function CheckInHistory() {
  const { user } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: "/",
  });
  const [, setLocation] = useLocation();
  const [limit, setLimit] = useState(30);
  const [partFilter, setPartFilter] = useState<PartFilter>("all");

  const historyQuery = trpc.checkIn.history.useQuery({ limit });
  const milestonesQuery = trpc.checkIn.milestones.useQuery();
  const streakQuery = trpc.checkIn.streak.useQuery();

  const checkIns = historyQuery.data ?? [];
  const filtered = useMemo(
    () => (partFilter === "all" ? checkIns : checkIns.filter(entry => entry.part === partFilter)),
    [checkIns, partFilter]
  );
  const milestones = milestonesQuery.data ?? [];
  const streak = streakQuery.data;

  if (historyQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-4">
          <Skeleton className="h-48 w-full rounded-[2rem]" />
          <Skeleton className="h-56 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const filterTabs: { key: PartFilter; label: string; icon?: typeof Sunrise }[] = [
    { key: "all", label: "All" },
    { key: "morning", label: "Morning", icon: Sunrise },
    { key: "evening", label: "Evening", icon: MoonStar },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <img src={REFORGE_ASSETS.history} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.15]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--background)_80%,transparent),var(--background)_55%)]" />

      <div className="relative mx-auto max-w-4xl px-4 py-6 sm:py-10">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setLocation("/dashboard")} className="rounded-full border-border/70 bg-background/70 backdrop-blur">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl leading-tight">Check-In History</h1>
            <p className="text-xs text-muted-foreground">Your consistency, rhythms, and milestones</p>
          </div>
        </div>

        {/* Streak stats */}
        <Reveal className="mb-6 grid gap-3 sm:grid-cols-3">
          <Card className="nature-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Flame className="h-4 w-4 text-primary" />
                Current rhythm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-accent text-4xl font-semibold text-primary">
                {streak?.current ?? 0}
                <span className="ml-2 text-base font-normal text-muted-foreground">days</span>
              </div>
              {streak?.longest ? <Progress value={Math.min(100, ((streak.current ?? 0) / streak.longest) * 100)} className="mt-3 h-1" /> : null}
            </CardContent>
          </Card>

          <Card className="nature-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Flame className="h-4 w-4 text-[#c0772a]" />
                Longest rhythm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-accent text-4xl font-semibold text-[#8a6d3b]">
                {streak?.longest ?? 0}
                <span className="ml-2 text-base font-normal text-muted-foreground">days</span>
              </div>
            </CardContent>
          </Card>

          <Card className="nature-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Trophy className="h-4 w-4 text-[#c09a2f]" />
                Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-accent text-4xl font-semibold text-[#8a6d3b]">{milestones.length}</div>
            </CardContent>
          </Card>
        </Reveal>

        {/* Milestones */}
        <Reveal className="mb-6">
          <Card className="nature-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Trophy className="h-4 w-4 text-primary" />
                Milestones reached
              </CardTitle>
              <CardDescription>Every week, fortnight, month, and beyond deserves its own celebration.</CardDescription>
            </CardHeader>
            <CardContent>
              {milestones.length === 0 ? (
                <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 p-4">
                  <Leaf className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm leading-6 text-muted-foreground">
                    No milestones yet. Keep showing up daily and your first one unlocks at 7 days.
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {milestones.map(m => (
                    <Badge key={m.dayCount} className="rounded-full bg-primary/12 px-4 py-1.5 text-sm font-medium text-primary hover:bg-primary/12">
                      {m.dayCount}-day rhythm
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </Reveal>

        {/* History */}
        <Reveal>
          <Card className="nature-card overflow-hidden">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div>
                  <CardTitle className="text-xl">Past check-ins</CardTitle>
                  <CardDescription>
                    {filtered.length} reflection{filtered.length === 1 ? "" : "s"}
                    {partFilter !== "all" ? ` · ${PART_LABEL[partFilter]}` : ""}
                  </CardDescription>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  {filterTabs.map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setPartFilter(tab.key)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        partFilter === tab.key ? "bg-primary text-primary-foreground shadow-sm" : "border border-border/70 bg-background/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.icon ? <tab.icon className="h-3.5 w-3.5" /> : null}
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
                  <p className="font-serif text-xl">Nothing here yet.</p>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                    {partFilter !== "all"
                      ? `No ${PART_LABEL[partFilter].toLowerCase()} check-ins found.`
                      : "Complete your first check-in to start your rhythm."}
                  </p>
                  <Button onClick={() => setLocation("/check-in")} className="mt-5 rounded-full">
                    Complete a check-in
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map((entry, index) => {
                    const payload = entry.payload as { notes?: string } | null;
                    const isMorning = entry.part === "morning";
                    return (
                      <Reveal key={entry.id} delay={Math.min(index % 4, 3) * 0.05}>
                        <div className="rounded-2xl border border-border/60 bg-card/60 p-4 transition-colors hover:border-primary/25">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className={`grid h-8 w-8 place-items-center rounded-xl ${isMorning ? "bg-[#e9dfb8]/70 text-[#7a6a32]" : "bg-primary/10 text-primary"}`}>
                                {isMorning ? <Sunrise className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                              </span>
                              <Badge variant="outline" className="rounded-full bg-background/60">{PART_LABEL[entry.part]}</Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(entry.createdAt).toLocaleDateString()} ·{" "}
                              {new Date(entry.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                            </span>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-3">
                            {entry.mood != null && (
                              <div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1"><Smile className="h-3.5 w-3.5" /> Mood</span>
                                  <span className={`font-semibold ${moodTone(entry.mood)}`}>{entry.mood}/10</span>
                                </div>
                                <Progress value={entry.mood * 10} className="mt-1.5 h-1" />
                              </div>
                            )}
                            {entry.energy != null && (
                              <div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5" /> Energy</span>
                                  <span className={`font-semibold ${moodTone(entry.energy)}`}>{entry.energy}/10</span>
                                </div>
                                <Progress value={entry.energy * 10} className="mt-1.5 h-1" />
                              </div>
                            )}
                            {entry.cravings != null && (
                              <div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> Cravings</span>
                                  <span className={`font-semibold ${moodTone(entry.cravings)}`}>{entry.cravings}/10</span>
                                </div>
                                <Progress value={entry.cravings * 10} className="mt-1.5 h-1" />
                              </div>
                            )}
                          </div>
                          {payload?.notes && (
                            <p className="mt-3 border-t border-border/55 pt-3 text-sm leading-6 text-muted-foreground">
                              {payload.notes}
                            </p>
                          )}
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              )}
              {filtered.length >= limit && (
                <Button
                  variant="outline"
                  className="mt-6 w-full rounded-full"
                  onClick={() => setLimit(l => l + 30)}
                >
                  Load more reflections
                </Button>
              )}
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}