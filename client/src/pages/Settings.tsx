import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { REFORGE_ASSETS } from "@/config/assets";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  ArrowRight,
  Bell,
  LockKeyhole,
  Mail,
  Palette,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function Settings() {
  const { user } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/" });
  const [, setLocation] = useLocation();
  const profileQuery = trpc.profile.get.useQuery();
  const preferencesQuery = trpc.preferences.get.useQuery();
  const rolesQuery = trpc.auth.getRoles.useQuery();
  const profileMutation = trpc.profile.update.useMutation({
    onSuccess: () => toast.success("Your profile has been saved."),
    onError: () => toast.error("We could not save that change just yet."),
  });
  const preferencesMutation = trpc.preferences.update.useMutation({
    onSuccess: () => toast.success("Your preference has been updated."),
    onError: () => toast.error("We could not update that preference."),
  });

  const profile = profileQuery.data;
  const preferences = preferencesQuery.data;
  const [displayName, setDisplayName] = useState<string>();
  const [timezone, setTimezone] = useState<string>();
  const [faithPreference, setFaithPreference] = useState<"faith" | "secular" | "both">();
  const isAdmin = rolesQuery.data?.includes("admin") ?? false;
  const busy = profileQuery.isLoading || preferencesQuery.isLoading;

  const saveProfile = async () => {
    await profileMutation.mutateAsync({
      displayName: displayName ?? profile?.displayName ?? undefined,
      timezone: timezone ?? profile?.timezone ?? undefined,
      faithPreference: faithPreference ?? profile?.faithPreference ?? undefined,
    });
    await profileQuery.refetch();
  };

  const updatePreference = async (
    key: "notificationsEnabled" | "emailNotifications" | "musicConsent",
    value: boolean,
  ) => {
    await preferencesMutation.mutateAsync({ [key]: value });
    await preferencesQuery.refetch();
  };

  if (busy) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-5xl space-y-6">
          <Skeleton className="h-48 rounded-[2rem]" />
          <div className="grid gap-5 lg:grid-cols-2">
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-7">
        <section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-[#304333] text-[#f7eddc]">
          <img src={REFORGE_ASSETS.settings} alt="Soft light through botanical leaves" className="absolute inset-0 h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(39,58,43,.97),rgba(39,58,43,.64),rgba(39,58,43,.16))]" />
          <div className="relative max-w-2xl space-y-4 p-7 sm:p-10">
            <Badge className="rounded-full border-white/15 bg-white/10 text-amber-100 hover:bg-white/10">Your private room</Badge>
            <h1 className="font-serif text-4xl leading-tight sm:text-5xl">Set the conditions for a gentler day.</h1>
            <p className="max-w-xl text-sm leading-7 text-white/75 sm:text-base">Your settings shape the pace, reminders, and language of your ReForge practice. Nothing here is a test, and every choice can change.</p>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
          <Card className="rounded-2xl border-border/70 bg-card/85 shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-2xl"><UserRound className="h-5 w-5 text-primary" /> Your profile</CardTitle>
              <CardDescription>Keep the details that help the space feel like yours.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2"><Label htmlFor="settings-name">Display name</Label><Input id="settings-name" value={displayName ?? profile?.displayName ?? ""} onChange={(event) => setDisplayName(event.target.value)} placeholder={user?.name ?? "Your name"} className="rounded-xl bg-background/60" /></div>
              <div className="space-y-2"><Label htmlFor="settings-timezone">Timezone</Label><Input id="settings-timezone" value={timezone ?? profile?.timezone ?? ""} onChange={(event) => setTimezone(event.target.value)} placeholder="Africa/Nairobi" className="rounded-xl bg-background/60" /></div>
              <div className="space-y-2"><Label htmlFor="settings-faith">Content preference</Label><select id="settings-faith" value={faithPreference ?? profile?.faithPreference ?? "both"} onChange={(event) => setFaithPreference(event.target.value as "faith" | "secular" | "both")} className="flex h-10 w-full rounded-xl border border-input bg-background/60 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="faith">Faith-based reflections</option><option value="secular">Secular reflections</option><option value="both">A blend of both</option></select></div>
              <Button onClick={saveProfile} disabled={profileMutation.isPending} className="gap-2 rounded-full">{profileMutation.isPending ? "Saving…" : "Save profile"}<ArrowRight className="h-4 w-4" /></Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/70 bg-card/85 shadow-none">
            <CardHeader><CardTitle className="flex items-center gap-2 font-serif text-2xl"><Bell className="h-5 w-5 text-primary" /> Gentle reminders</CardTitle><CardDescription>Choose what is useful, not what creates noise.</CardDescription></CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-medium">In-app reminders</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Prompts for morning and evening check-ins.</p></div><Switch checked={preferences?.notificationsEnabled ?? true} onCheckedChange={(value) => updatePreference("notificationsEnabled", value)} /></div>
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-medium">Email notes</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Newsletter and milestone messages you choose.</p></div><Switch checked={preferences?.emailNotifications ?? true} onCheckedChange={(value) => updatePreference("emailNotifications", value)} /></div>
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-medium">Music practice</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Let music-based prompts appear in your space.</p></div><Switch checked={preferences?.musicConsent ?? false} onCheckedChange={(value) => updatePreference("musicConsent", value)} /></div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Card className="rounded-2xl border-primary/20 bg-primary/7 shadow-none md:col-span-2"><CardContent className="flex gap-3 p-6"><LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><p className="font-serif text-xl">Private by design.</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Journal and check-in notes are encrypted before storage. ReForge does not turn your reflections into public content.</p></div></CardContent></Card>
          <Card className="rounded-2xl border-border/70 bg-card/85 shadow-none"><CardHeader><CardTitle className="flex items-center gap-2 font-serif text-xl"><Palette className="h-4 w-4 text-primary" /> Keep exploring</CardTitle></CardHeader><CardContent className="space-y-3"><Button variant="outline" className="w-full justify-between rounded-full" onClick={() => setLocation("/newsletter")}>Newsletter <Mail className="h-4 w-4" /></Button>{isAdmin && <Button variant="outline" className="w-full justify-between rounded-full" onClick={() => setLocation("/admin")}>Admin panel <ShieldCheck className="h-4 w-4" /></Button>}</CardContent></Card>
        </div>

        <div className="rounded-2xl border border-border/60 bg-muted/20 p-5 text-sm text-muted-foreground"><p className="font-medium text-foreground">Signed in as {user?.email ?? "your account"}.</p><p className="mt-1 leading-6">You can leave at any time. Your practice belongs to you.</p></div>
      </div>
    </DashboardLayout>
  );
}
