import { useState } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { REFORGE_ASSETS } from "@/config/assets";
import { trpc } from "@/lib/trpc";
import { useMusic } from "@/lib/MusicPlayer";
import { MUSIC_MOODS } from "@shared/music";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, CloudRain, Flame, Focus, Headphones, Heart, Lock, Music2, Pause, Play, Plus, PlusCircle, Save, ShieldCheck, Sparkles, Sprout, Sunrise, Target, Trash2, TrendingUp, Wind } from "lucide-react";

function Workspace({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <header className="space-y-3"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p><h1 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl">{title}</h1><p className="max-w-2xl text-base leading-7 text-muted-foreground">{description}</p></header>;
}

function EmptyState({ title, description, icon: Icon = Sparkles }: { title: string; description: string; icon?: typeof Sparkles }) {
  return <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-8 text-center"><div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div><p className="font-serif text-2xl">{title}</p><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p></div>;
}

export function ProgressPage() {
  const query = trpc.dashboard.getDimensionScores.useQuery();
  return <Workspace><div className="mx-auto max-w-5xl space-y-7"><section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-[#285C32] text-[#f7eddc]"><img src={REFORGE_ASSETS.progress} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" /><div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(40,92,50,.96),rgba(40,92,50,.5),rgba(23,74,42,.12))]" /><div className="relative max-w-2xl space-y-3 p-7 sm:p-10"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">Your whole-life view</p><h1 className="font-serif text-4xl leading-tight sm:text-5xl">Progress across 21 dimensions</h1><p className="text-sm leading-7 text-white/75 sm:text-base">Small, honest steps count. This view helps you notice where care is already taking root.</p></div></section>{query.isLoading ? <div className="space-y-4"><Progress value={35} className="h-2" /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <Card key={index} className="h-28 animate-pulse rounded-2xl bg-muted/50" />)}</div></div> : query.isError ? <Card className="rounded-2xl border-destructive/30"><CardContent className="pt-6"><p className="text-sm text-destructive">We could not load your progress right now. Please try again in a moment.</p></CardContent></Card> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{(query.data ?? []).map((dimension) => <Card key={dimension.dimensionId} className="rounded-2xl border-border/70 bg-card/80 shadow-none"><CardHeader className="pb-3"><CardTitle className="font-serif text-xl">{dimension.dimensionLabel}</CardTitle></CardHeader><CardContent><div className="mb-2 flex items-center justify-between text-sm"><span className="text-muted-foreground">Current signal</span><span className="font-semibold text-primary">{dimension.score}%</span></div><Progress value={dimension.score} /></CardContent></Card>)}</div>}</div></Workspace>;
}

const journalPrompts = [
  { label: "Name what is true", text: "Right now, what feels most true is…" },
  { label: "Notice the win", text: "One thing I did today that helped me stay connected was…" },
  { label: "Make room for repair", text: "A place in my life that deserves a little care next is…" },
  { label: "Speak to tomorrow", text: "Tomorrow, I want to remember…" },
];

export function JournalPage() {
  const [body, setBody] = useState("");
  const [activePrompt, setActivePrompt] = useState<string>();
  const listQuery = trpc.journal.list.useQuery({ limit: 20, offset: 0 });
  const createMutation = trpc.journal.create.useMutation({ onSuccess: () => { setBody(""); setActivePrompt(undefined); void listQuery.refetch(); } });
  const selectPrompt = (prompt: typeof journalPrompts[number]) => { setActivePrompt(prompt.label); setBody((current) => current ? `${current}\n\n${prompt.text} ` : `${prompt.text} `); };
  return <Workspace><div className="mx-auto max-w-5xl space-y-7"><section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-[#285C32] text-[#f7eddc]"><img src={REFORGE_ASSETS.journal} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" /><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(40,92,50,.96),rgba(40,92,50,.54),rgba(40,92,50,.14))]" /><div className="relative grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end"><div className="max-w-xl space-y-3"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200"><BookOpen className="h-4 w-4" /> Private reflection</p><h1 className="font-serif text-4xl leading-tight sm:text-5xl">Make room for the truth.</h1><p className="text-sm leading-7 text-white/75 sm:text-base">Your journal is not a performance. It is a private place to notice what you have been carrying, learning, and choosing.</p></div><div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/10 px-4 py-3 text-xs text-white/75"><Lock className="h-4 w-4 text-amber-200" /> Encrypted before storage</div></div></section><div className="grid gap-6 lg:grid-cols-[.88fr_1.12fr] lg:items-start"><Card className="rounded-2xl border-border/70 bg-card/85 shadow-none"><CardHeader><CardTitle className="font-serif text-2xl">Choose a doorway in</CardTitle><CardDescription>Use a prompt if it helps. Or begin anywhere.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="flex flex-wrap gap-2">{journalPrompts.map((prompt) => <Button key={prompt.label} type="button" variant={activePrompt === prompt.label ? "default" : "outline"} onClick={() => selectPrompt(prompt)} className="rounded-full text-xs">{prompt.label}</Button>)}</div><Textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="What feels important today?" className="min-h-56 resize-y rounded-2xl bg-background/70" /><div className="flex items-center gap-2 text-xs leading-5 text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" /> Your entry is private to you and sensitive text is encrypted before it is stored.</div>{createMutation.error && <p className="rounded-xl border border-destructive/30 bg-destructive/8 p-3 text-sm text-destructive">We could not save this reflection. Please try again.</p>}<Button disabled={!body.trim() || createMutation.isPending} onClick={() => createMutation.mutate({ body: body.trim() })} className="w-full rounded-full gap-2"><Save className="h-4 w-4" />{createMutation.isPending ? "Saving your page…" : "Save reflection"}</Button></CardContent></Card><Card className="rounded-2xl border-border/70 bg-card/80 shadow-none"><CardHeader><CardTitle className="font-serif text-2xl">Recent reflections</CardTitle><CardDescription>A gentle record of what you have been carrying and learning.</CardDescription></CardHeader><CardContent className="space-y-3">{listQuery.isLoading ? <div className="space-y-3">{[1, 2, 3].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl bg-muted/50" />)}</div> : listQuery.isError ? <p className="text-sm text-destructive">We could not load your private reflections right now.</p> : listQuery.data?.length ? listQuery.data.map((entry) => <article key={entry.id} className="rounded-2xl border border-border/50 bg-muted/30 p-4"><p className="whitespace-pre-wrap text-sm leading-6">{entry.body}</p><p className="mt-3 text-xs text-muted-foreground">{new Date(entry.createdAt).toLocaleString()}</p></article>) : <EmptyState title="Your first page is waiting." description="There is no right way to begin. A few honest words are enough." icon={BookOpen} />}</CardContent></Card></div></div></Workspace>;
}

export function GoalsPage() {
  const [title, setTitle] = useState("");
  const [horizon, setHorizon] = useState<"30" | "90" | "180">("30");
  const listQuery = trpc.goals.list.useQuery();
  const createMutation = trpc.goals.create.useMutation({ onSuccess: () => { setTitle(""); void listQuery.refetch(); } });
  return <Workspace><div className="mx-auto max-w-5xl space-y-7"><section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-[#174A2A] text-[#f7eddc]"><img src={REFORGE_ASSETS.goals} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" /><div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(23,74,42,.96),rgba(23,74,42,.55),rgba(23,74,42,.12))]" /><div className="relative max-w-2xl space-y-3 p-7 sm:p-10"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">Forward, not perfect</p><h1 className="font-serif text-4xl leading-tight sm:text-5xl">Goals that fit your real life.</h1><p className="text-sm leading-7 text-white/75 sm:text-base">Choose one next step at a time. You can change the shape of the journey as you learn.</p></div></section><Card className="rounded-2xl border-border/70 bg-card/85 shadow-none"><CardHeader><CardTitle className="flex items-center gap-2 font-serif text-2xl"><Plus className="h-5 w-5 text-primary" /> Add a goal</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-[1fr_160px_auto] md:items-end"><div className="space-y-2"><Label htmlFor="goal-title">What would you like to move toward?</Label><Input id="goal-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Take a walk after work three days this week" className="rounded-xl" /></div><div className="space-y-2"><Label htmlFor="goal-horizon">Horizon</Label><select id="goal-horizon" value={horizon} onChange={(event) => setHorizon(event.target.value as "30" | "90" | "180")} className="h-10 w-full rounded-xl border bg-background px-3 text-sm"><option value="30">30 days</option><option value="90">90 days</option><option value="180">180 days</option></select></div><Button disabled={!title.trim() || createMutation.isPending} onClick={() => createMutation.mutate({ title: title.trim(), horizon })} className="rounded-full">{createMutation.isPending ? "Creating…" : "Create goal"}</Button></CardContent></Card><div className="grid gap-4 md:grid-cols-2">{listQuery.isLoading ? [1, 2].map((item) => <Card key={item} className="h-36 animate-pulse rounded-2xl bg-muted/50" />) : listQuery.isError ? <Card className="md:col-span-2 rounded-2xl border-destructive/30"><CardContent className="pt-6 text-sm text-destructive">We could not load your goals right now.</CardContent></Card> : listQuery.data?.length ? listQuery.data.map((goal) => <Card key={goal.id} className="rounded-2xl border-border/70 bg-card/80 shadow-none"><CardHeader><div className="flex items-start justify-between gap-3"><CardTitle className="font-serif text-xl">{goal.title}</CardTitle><Badge variant="secondary" className="rounded-full">{goal.horizon} days</Badge></div><CardDescription>{goal.description || "A meaningful step in your recovery practice."}</CardDescription></CardHeader><CardContent><Progress value={0} /><p className="mt-2 text-xs text-muted-foreground">Created {new Date(goal.createdAt).toLocaleDateString()}</p></CardContent></Card>) : <Card className="md:col-span-2 rounded-2xl border-border/70 shadow-none"><CardContent className="pt-6"><EmptyState title="No active goals yet." description="Start with something small enough to keep." icon={Target} /></CardContent></Card>}</div></div></Workspace>;
}

const moodIcons: Record<string, typeof Wind> = {
  calm: Wind,
  focus: Focus,
  uplift: Sunrise,
  grief: CloudRain,
  urge: Flame,
  hope: Sprout,
};

export function MusicPage() {
  const libraryQuery = trpc.music.library.useQuery();
  const addMutation = trpc.music.addTrack.useMutation({ onSuccess: () => void libraryQuery.refetch() });
  const removeMutation = trpc.music.removeTrack.useMutation({ onSuccess: () => void libraryQuery.refetch() });
  const profileQuery = trpc.music.getProfile.useQuery();
  const updateMutation = trpc.music.updateProfile.useMutation({ onSuccess: () => void profileQuery.refetch() });
  const { current, playing, play, toggle, stop } = useMusic();
  const [activeMood, setActiveMood] = useState<"calm" | "focus" | "uplift" | "grief" | "urge" | "hope">("calm");
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [triggerGenres, setTriggerGenres] = useState("");
  const [triggerArtists, setTriggerArtists] = useState("");
  const [safeGenres, setSafeGenres] = useState("");
  const [assessmentOpen, setAssessmentOpen] = useState(false);

  const library = libraryQuery.data;
  const profile = profileQuery.data;
  const moodTracks = (library?.tracks ?? []).filter(track => track.mood === activeMood);
  const activeDef = MUSIC_MOODS.find(mood => mood.key === activeMood);

  const addTrack = () => {
    const title = newTitle.trim();
    const url = newUrl.trim();
    if (!title) { toast.error("Give the track a name first."); return; }
    if (!/^https?:\/\//i.test(url)) { toast.error("Paste a direct audio link that starts with http:// or https://"); return; }
    toast.promise(addMutation.mutateAsync({ title, mood: activeMood, url }), {
      loading: "Adding to your library…",
      success: () => { setNewTitle(""); setNewUrl(""); return "Track added to your library."; },
      error: "We could not add that track. The link may not be a direct audio file.",
    });
  };

  if (libraryQuery.isLoading || profileQuery.isLoading) {
    return <Workspace><div className="mx-auto max-w-3xl"><Card className="h-64 animate-pulse rounded-3xl bg-muted/50" /></div></Workspace>;
  }

  return (
    <Workspace>
      <div className="mx-auto max-w-3xl space-y-7">
        <section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-[#174A2A] text-[#f7eddc]">
          <img src={REFORGE_ASSETS.music} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(23,74,42,.96),rgba(23,74,42,.5),rgba(23,74,42,.08))]" />
          <div className="relative max-w-2xl space-y-3 p-7 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">Sound with intention</p>
            <h1 className="font-serif text-4xl leading-tight sm:text-5xl">Your music reset.</h1>
            <p className="text-sm leading-7 text-white/75 sm:text-base">
              Pick the track that matches this moment and let it keep playing while you move through the app.
            </p>
          </div>
        </section>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {MUSIC_MOODS.map(mood => {
            const MoodIcon = moodIcons[mood.key];
            const count = (library?.tracks ?? []).filter(track => track.mood === mood.key).length;
            return (
              <button
                key={mood.key}
                onClick={() => setActiveMood(mood.key)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${activeMood === mood.key ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border/80 bg-card/85 text-muted-foreground hover:text-foreground"}`}
              >
                <MoodIcon className="h-4 w-4" />
                {mood.label}
                <span className={`rounded-full px-1.5 text-[10px] ${activeMood === mood.key ? "bg-white/20" : "bg-muted text-muted-foreground"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        <section className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{activeDef?.eyebrow}</p>
            <h2 className="mt-1 font-serif text-2xl leading-tight">{activeDef?.label}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{activeDef?.description}</p>
          </div>

          {moodTracks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
              <Headphones className="mx-auto h-7 w-7 text-primary/70" />
              <p className="mt-3 font-serif text-xl">Nothing here yet</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">Add a song below to start this mood's library.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {moodTracks.map(track => {
                const isCurrent = current?.id === track.id;
                return (
                  <div key={track.id} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/85 p-3 shadow-none">
                    <button
                      onClick={() => { if (isCurrent) { void toggle(); } else { void play(track, moodTracks); } }}
                      aria-label={isCurrent && playing ? "Pause" : "Play"}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      {isCurrent && playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-[1px]" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">{track.title}</p>
                        {isCurrent && <Badge className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{playing ? "Playing" : "Paused"}</Badge>}
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{track.source === "bundled" ? "Soothed by ReForge" : "Added by you"}</p>
                    </div>
                    {track.source === "custom" && (
                      <button
                        onClick={() => { if (isCurrent) void stop(); removeMutation.mutate({ trackId: track.id }); }}
                        aria-label="Remove track"
                        className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <Card className="rounded-2xl border-border/70 bg-card/85 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-serif text-xl"><PlusCircle className="h-5 w-5 text-primary" /> Add a song for {activeDef?.label.toLowerCase()}</CardTitle>
              <CardDescription>Paste a direct audio link (MP3, WAV or OGG). It streams here while you browse — keep it to sounds that steady you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="track-title">Track name</Label>
                  <Input id="track-title" value={newTitle} onChange={event => setNewTitle(event.target.value)} placeholder="e.g. Gentle river flow" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="track-url">Audio link</Label>
                  <Input id="track-url" value={newUrl} onChange={event => setNewUrl(event.target.value)} placeholder="https://example.com/song.mp3" className="rounded-xl" />
                </div>
              </div>
              <Button onClick={addTrack} disabled={addMutation.isPending} className="rounded-full"><Plus className="mr-1.5 h-4 w-4" />{addMutation.isPending ? "Adding…" : "Add track"}</Button>
            </CardContent>
          </Card>
        </section>

        <Card className="rounded-2xl border-border/70 bg-card/85 shadow-none">
          <CardHeader>
            <button className="flex w-full items-center justify-between text-left" onClick={() => setAssessmentOpen(open => !open)}>
              <div>
                <CardTitle className="flex items-center gap-2 font-serif text-2xl"><Music2 className="h-5 w-5 text-primary" /> Trigger and safe-list assessment</CardTitle>
                <CardDescription className="mt-1">Name what pulls you backward, then what steadies you.</CardDescription>
              </div>
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${assessmentOpen ? "rotate-180" : ""}`} />
            </button>
          </CardHeader>
          {assessmentOpen && (
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>Trigger genres</Label><Input value={triggerGenres || profile?.triggerGenres || ""} onChange={event => setTriggerGenres(event.target.value)} placeholder="e.g. club mixes, aggressive trap" className="rounded-xl" /></div>
                <div className="space-y-2"><Label>Trigger artists</Label><Input value={triggerArtists || profile?.triggerArtists || ""} onChange={event => setTriggerArtists(event.target.value)} placeholder="e.g. artist names" className="rounded-xl" /></div>
              </div>
              <div className="space-y-2"><Label>Safe genres to explore</Label><Input value={safeGenres || profile?.safeGenres || ""} onChange={event => setSafeGenres(event.target.value)} placeholder="e.g. acoustic, chanting, calm worship" className="rounded-xl" /></div>
              <Button onClick={() => updateMutation.mutate({ triggerGenres: (triggerGenres || profile?.triggerGenres)?.trim(), triggerArtists: (triggerArtists || profile?.triggerArtists)?.trim(), safeGenres: (safeGenres || profile?.safeGenres)?.trim() })} disabled={updateMutation.isPending} className="rounded-full"><Save className="mr-1.5 h-4 w-4" />{updateMutation.isPending ? "Saving…" : "Save preferences"}</Button>
            </CardContent>
          )}
        </Card>
      </div>
    </Workspace>
  );
}

const motivationByKeyword: Record<string, string> = { body: "Your body is not a problem to fix. It is a place to come home to, one caring choice at a time.", mind: "A thought can be loud without being a command. Notice it, then choose your next small action.", emotion: "You are allowed to feel the whole weather of a day and still move gently through it.", relationship: "Repair begins with honesty, boundaries, and one conversation that does not need to be perfect.", work: "A sustainable life is built with rhythms you can return to, not standards that punish you.", money: "Small acts of stewardship can become evidence that your future deserves care.", home: "Your environment can become a quiet ally. Start with one corner that helps you breathe.", meaning: "Meaning is not always found in grand answers. Sometimes it is made in the way you show up today.", music: "You can change the soundtrack without erasing where you came from.", default: "There is no perfect entry point. Choose one small practice and let it teach you what comes next." };
function motivationFor(label: string) { const key = Object.keys(motivationByKeyword).find((candidate) => candidate !== "default" && label.toLowerCase().includes(candidate)); return motivationByKeyword[key ?? "default"]; }

export function GuidesPage() {
  const dimensionsQuery = trpc.onboarding.getDimensions.useQuery();
  const [dimensionId, setDimensionId] = useState<number>();
  const resourcesQuery = trpc.resources.getByDimension.useQuery({ dimensionId: dimensionId ?? 0 }, { enabled: Boolean(dimensionId) });
  const selectedDimension = dimensionsQuery.data?.find((dimension) => dimension.id === dimensionId);
  return <Workspace><div className="mx-auto max-w-5xl space-y-7"><section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-[#285C32] text-[#f7eddc]"><img src={REFORGE_ASSETS.guides} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" /><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(40,92,50,.94),rgba(40,92,50,.45),rgba(40,92,50,.08))]" /><div className="relative max-w-2xl space-y-3 p-7 sm:p-10"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200"><BookOpen className="h-4 w-4" /> Context when you need it</p><h1 className="font-serif text-4xl leading-tight sm:text-5xl">Guides for the next right step.</h1><p className="text-sm leading-7 text-white/75 sm:text-base">Choose a life dimension and find activities, situation guides, and repair practices that meet you there.</p></div></section><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{dimensionsQuery.isLoading ? Array.from({ length: 9 }).map((_, index) => <div key={index} className="h-14 animate-pulse rounded-xl bg-muted/50" />) : (dimensionsQuery.data ?? []).map((dimension) => <Button key={dimension.id} variant={dimensionId === dimension.id ? "default" : "outline"} className="h-auto min-h-14 justify-start whitespace-normal rounded-xl p-4 text-left" onClick={() => setDimensionId(dimension.id)}>{dimension.label}</Button>)}</div>{selectedDimension && <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><Card className="rounded-2xl border-primary/20 bg-primary/7 shadow-none"><CardContent className="space-y-4 p-6"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/12 text-primary"><Sparkles className="h-5 w-5" /></div><Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">{selectedDimension.label}</Badge><p className="font-serif text-2xl leading-tight">{motivationFor(selectedDimension.label)}</p><p className="text-sm leading-6 text-muted-foreground">Let this be the reason you keep the practice small enough to return to.</p></CardContent></Card><Card className="rounded-2xl border-border/70 bg-card/80 shadow-none"><CardHeader><CardTitle className="font-serif text-2xl">Resources for this dimension</CardTitle><CardDescription>Read, reflect, then choose one action that feels possible.</CardDescription></CardHeader><CardContent className="space-y-3">{resourcesQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading resources…</p> : resourcesQuery.isError ? <p className="text-sm text-destructive">We could not load these guides right now.</p> : resourcesQuery.data?.length ? resourcesQuery.data.map((resource) => <article key={resource.id} className="rounded-2xl border border-border/60 bg-muted/25 p-4"><h3 className="font-serif text-xl">{resource.title}</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{resource.body}</p></article>) : <EmptyState title="This shelf is still being written." description="Choose another dimension or return later as new guides are added." icon={BookOpen} />}</CardContent></Card></div>}{!selectedDimension && <EmptyState title="Choose a dimension to begin." description="Every guide is connected to one of the 21 places where life can be restored." icon={BookOpen} />}</div></Workspace>;
}

export function SettingsPage() {
  const profileQuery = trpc.profile.get.useQuery();
  const preferencesQuery = trpc.preferences.get.useQuery();
  const profileMutation = trpc.profile.update.useMutation({ onSuccess: () => void profileQuery.refetch() });
  const preferencesMutation = trpc.preferences.update.useMutation({ onSuccess: () => void preferencesQuery.refetch() });
  const [displayName, setDisplayName] = useState("");
  const [faithPreference, setFaithPreference] = useState<"faith" | "secular" | "both">("both");
  const profile = profileQuery.data;
  const preferences = preferencesQuery.data;
  return <Workspace><div className="mx-auto max-w-3xl space-y-7"><section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-[#285C32] text-[#f7eddc]"><img src={REFORGE_ASSETS.settings} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" /><div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(40,92,50,.96),rgba(40,92,50,.56),rgba(40,92,50,.08))]" /><div className="relative max-w-2xl space-y-3 p-7 sm:p-10"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">Your pace, your choices</p><h1 className="font-serif text-4xl leading-tight sm:text-5xl">Settings and privacy.</h1><p className="text-sm leading-7 text-white/75 sm:text-base">Personalize the language and rhythm of your recovery space. Devotional content is always opt-in.</p></div></section><Card className="rounded-2xl border-border/70 bg-card/85 shadow-none"><CardHeader><CardTitle className="font-serif text-2xl">Profile and content preference</CardTitle><CardDescription>Choose how ReForge addresses you and which reflection style you want to see.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label>Display name</Label><Input value={displayName || profile?.displayName || ""} onChange={(event) => setDisplayName(event.target.value)} placeholder="How should ReForge address you?" className="rounded-xl" /></div><div className="space-y-2"><Label>Devotional preference</Label><select value={faithPreference || profile?.faithPreference || "both"} onChange={(event) => setFaithPreference(event.target.value as "faith" | "secular" | "both")} className="h-10 w-full rounded-xl border bg-background px-3 text-sm"><option value="faith">Faith-based prompts</option><option value="secular">Secular prompts</option><option value="both">Show both, clearly labelled</option></select></div><Button onClick={() => profileMutation.mutate({ displayName: displayName || profile?.displayName || "", faithPreference })} disabled={profileMutation.isPending} className="rounded-full">{profileMutation.isPending ? "Saving…" : "Save profile"}</Button></CardContent></Card><Card className="rounded-2xl border-border/70 bg-card/80 shadow-none"><CardHeader><CardTitle className="font-serif text-2xl">Notifications and privacy</CardTitle><CardDescription>Keep the thread visible without allowing it to become noise.</CardDescription></CardHeader><CardContent className="space-y-3"><label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={preferences?.notificationsEnabled ?? true} onChange={(event) => preferencesMutation.mutate({ notificationsEnabled: event.target.checked })} /> In-app reminders</label><label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={preferences?.emailNotifications ?? true} onChange={(event) => preferencesMutation.mutate({ emailNotifications: event.target.checked })} /> Email reminders</label><div className="flex items-center gap-2 text-xs leading-5 text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary" /> Sensitive journal and check-in text is encrypted before storage and never written to application logs.</div></CardContent></Card></div></Workspace>;
}

export function OnboardingPage() {
  const [, setLocation] = useLocation();
  const dimensionsQuery = trpc.onboarding.getDimensions.useQuery();
  const startMutation = trpc.onboarding.startAssessment.useMutation();
  const saveMutation = trpc.onboarding.saveResponse.useMutation();
  const completeMutation = trpc.onboarding.completeAssessment.useMutation();
  const dimensions = dimensionsQuery.data ?? [];
  const [step, setStep] = useState(0);
  const [assessmentId, setAssessmentId] = useState<number>();
  const [substanceFocus, setSubstanceFocus] = useState<"alcohol" | "nicotine" | "marijuana" | "codeine" | "prescription">("alcohol");
  const [score, setScore] = useState(3);
  const [response, setResponse] = useState("");
  const [started, setStarted] = useState(false);
  const isSubstanceStep = step === 0;
  const dimensionIndex = step - 1;
  const dimension = dimensions[dimensionIndex];
  const totalSteps = dimensions.length + 1;
  const begin = async () => { const result = await startMutation.mutateAsync(); setAssessmentId(result?.id); setStarted(true); };
  const next = async () => { if (!assessmentId || !dimension) return; await saveMutation.mutateAsync({ assessmentId, dimensionId: dimension.id, response: { score, reflection: response } }); setResponse(""); setScore(3); if (dimensionIndex === dimensions.length - 1) { await completeMutation.mutateAsync({ assessmentId, substanceFocus }); setLocation("/dashboard"); } else setStep((current) => current + 1); };
  return <Workspace><div className="mx-auto max-w-3xl space-y-7"><section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-[#285C32] text-[#f7eddc]"><img src={REFORGE_ASSETS.onboarding} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" /><div className="absolute inset-0 bg-[#285C32]/75" /><div className="relative space-y-3 p-7 sm:p-10"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">A conversation with yourself</p><h1 className="font-serif text-4xl leading-tight sm:text-5xl">Start with where you are.</h1><p className="max-w-xl text-sm leading-7 text-white/75 sm:text-base">This is not a test. It is a gentle starting map across the parts of life you want to restore.</p></div></section>{!started ? <Card className="rounded-2xl border-border/70 bg-card/85 shadow-none"><CardHeader><CardTitle className="font-serif text-2xl">What are you focusing on first?</CardTitle><CardDescription>Choose one primary substance or habit. You can revisit your focus later.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="grid gap-2 sm:grid-cols-2">{(["alcohol", "nicotine", "marijuana", "codeine", "prescription"] as const).map((substance) => <Button key={substance} variant={substanceFocus === substance ? "default" : "outline"} onClick={() => setSubstanceFocus(substance)} className="justify-start rounded-xl capitalize">{substance}</Button>)}</div><Button onClick={begin} disabled={startMutation.isPending || !dimensions.length} className="w-full rounded-full">{startMutation.isPending ? "Opening your assessment…" : "Begin assessment"}<ArrowRight className="ml-2 h-4 w-4" /></Button></CardContent></Card> : <Card className="rounded-2xl border-border/70 bg-card/85 shadow-none"><CardHeader><div className="mb-2 flex items-center justify-between text-sm text-muted-foreground"><span>Step {step + 1} of {totalSteps}</span><span>{Math.round(((step + 1) / totalSteps) * 100)}%</span></div><Progress value={((step + 1) / totalSteps) * 100} /><CardTitle className="pt-4 font-serif text-2xl">{dimension?.label || "Your focus"}</CardTitle><CardDescription>{isSubstanceStep ? "Your focus is saved with your assessment." : dimension?.description || "What would care look like here?"}</CardDescription></CardHeader><CardContent className="space-y-5">{isSubstanceStep ? <div className="rounded-2xl bg-primary/8 p-4 text-sm">Focus selected: <strong className="capitalize">{substanceFocus}</strong>. The next steps will move through all 21 life dimensions.</div> : <><div className="space-y-3"><Label>How supported does this area feel today? <span className="font-semibold text-primary">{score}/5</span></Label><input type="range" min="1" max="5" value={score} onChange={(event) => setScore(Number(event.target.value))} className="w-full accent-[var(--primary)]" /></div><div className="space-y-2"><Label htmlFor="reflection">A few words, if you want</Label><Textarea id="reflection" value={response} onChange={(event) => setResponse(event.target.value)} placeholder="What is true here right now?" className="rounded-xl" /></div></>}<Button onClick={() => isSubstanceStep ? setStep(1) : void next()} disabled={saveMutation.isPending || completeMutation.isPending} className="w-full rounded-full">{isSubstanceStep ? "Continue" : dimensionIndex === dimensions.length - 1 ? "Finish assessment" : "Save and continue"}<ArrowRight className="ml-2 h-4 w-4" /></Button></CardContent></Card>}</div></Workspace>;
}

export function FeaturePlaceholder({ title, description }: { title: string; description: string }) { return <Workspace><Card className="mx-auto max-w-2xl rounded-2xl"><CardHeader><CardTitle className="font-serif text-2xl">{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader><CardContent><Button onClick={() => window.history.back()} variant="outline" className="gap-2 rounded-full"><ArrowLeft className="h-4 w-4" /> Back</Button></CardContent></Card></Workspace>; }

export default function RecoveryWorkspace() { return null; }
