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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, User, Bell, Mail, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function Settings() {
  const { user } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: "/",
  });
  const [, setLocation] = useLocation();

  const profileQuery = trpc.profile.get.useQuery();
  const preferencesQuery = trpc.preferences.get.useQuery();
  const rolesQuery = trpc.auth.getRoles.useQuery();

  const isAdmin = rolesQuery.data?.includes("admin") ?? false;

  const profileMutation = trpc.profile.update.useMutation({
    onSuccess: () => toast.success("Profile saved"),
    onError: () => toast.error("Failed to save profile"),
  });
  const preferencesMutation = trpc.preferences.update.useMutation({
    onSuccess: () => toast.success("Preferences saved"),
    onError: () => toast.error("Failed to save preferences"),
  });

  const [displayName, setDisplayName] = useState<string | undefined>(undefined);
  const [timezone, setTimezone] = useState<string | undefined>(undefined);
  const [faithPreference, setFaithPreference] = useState<
    "faith" | "secular" | "both" | undefined
  >(undefined);

  const profile = profileQuery.data;
  const prefs = preferencesQuery.data;

  const handleSaveProfile = async () => {
    await profileMutation.mutateAsync({
      displayName: displayName ?? profile?.displayName ?? undefined,
      timezone: timezone ?? profile?.timezone ?? undefined,
      faithPreference: faithPreference ?? profile?.faithPreference ?? undefined,
    });
    profileQuery.refetch();
  };

  const handleToggle = async (
    key:
      | "notificationsEnabled"
      | "emailNotifications"
      | "musicConsent"
      | "morningCheckInTime"
      | "eveningCheckInTime",
    value: string | boolean
  ) => {
    await preferencesMutation.mutateAsync({
      [key]: value,
    });
    preferencesQuery.refetch();
  };

  if (profileQuery.isLoading || preferencesQuery.isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold">Settings</h1>
            <p className="text-sm text-slate-600">
              Your profile, notifications, and account
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-amber-600" />
              Profile
            </CardTitle>
            <CardDescription>
              How you appear in the app and your content preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="settings-name">Display name</Label>
              <Input
                id="settings-name"
                defaultValue={profile?.displayName ?? ""}
                onChange={e => setDisplayName(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="settings-timezone">Timezone</Label>
              <Input
                id="settings-timezone"
                defaultValue={profile?.timezone ?? ""}
                onChange={e => setTimezone(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="settings-faith">Faith preference</Label>
              <select
                id="settings-faith"
                defaultValue={profile?.faithPreference ?? "both"}
                onChange={e =>
                  setFaithPreference(
                    e.target.value as "faith" | "secular" | "both"
                  )
                }
                className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="faith">Faith-based</option>
                <option value="secular">Secular</option>
                <option value="both">Both</option>
              </select>
            </div>
            <Button
              onClick={handleSaveProfile}
              disabled={profileMutation.isPending}
            >
              {profileMutation.isPending ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-600" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">In-app reminders</p>
                <p className="text-sm text-slate-500">
                  Gentle nudges to complete your check-ins
                </p>
              </div>
              <Switch
                checked={prefs?.notificationsEnabled ?? true}
                onCheckedChange={v => handleToggle("notificationsEnabled", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email notifications</p>
                <p className="text-sm text-slate-500">
                  Newsletters and milestone updates
                </p>
              </div>
              <Switch
                checked={prefs?.emailNotifications ?? true}
                onCheckedChange={v => handleToggle("emailNotifications", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Music rehabilitation</p>
                <p className="text-sm text-slate-500">
                  Allow music-based content in your guides
                </p>
              </div>
              <Switch
                checked={prefs?.musicConsent ?? false}
                onCheckedChange={v => handleToggle("musicConsent", v)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-amber-600" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm">
              <span className="text-slate-500">Signed in as</span>{" "}
              <span className="font-medium">{user?.email}</span>
            </div>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setLocation("/newsletter")}
            >
              <Mail className="h-4 w-4" />
              Manage Newsletter
            </Button>
            {isAdmin && (
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setLocation("/admin")}
              >
                <ShieldCheck className="h-4 w-4" />
                Admin Panel
              </Button>
            )}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4" />
              Your journal, notes, and reflections are encrypted and private.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
