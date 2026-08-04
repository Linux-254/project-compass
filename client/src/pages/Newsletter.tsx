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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ArrowLeft,
  Mail,
  MailCheck,
  Newspaper,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

const ISSUE_TYPE_LABEL: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  milestone: "Milestone",
  dimension: "Dimension",
  situation: "Situation",
};

type Issue = {
  id: number;
  type: string;
  subject: string;
  body: string;
  scheduledFor: Date | null;
};

export default function Newsletter() {
  const { user } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: "/",
  });
  const [, setLocation] = useLocation();
  const [daily, setDaily] = useState(true);
  const [weekly, setWeekly] = useState(true);
  const [milestones, setMilestones] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [reading, setReading] = useState<Issue | null>(null);

  const statusQuery = trpc.newsletter.getStatus.useQuery();
  const issuesQuery = trpc.newsletter.getIssues.useQuery({ limit: 20 });
  const updateMutation = trpc.newsletter.updatePreferences.useMutation({
    onSuccess: () => {
      toast.success("Preferences saved");
      statusQuery.refetch();
    },
    onError: () => toast.error("Failed to save preferences"),
  });

  const status = statusQuery.data as
    | { email?: string; status?: string; preferences?: Record<string, unknown> }
    | undefined;

  const isSubscribed = status?.status === "subscribed";

  const handleSave = async () => {
    await updateMutation.mutateAsync({
      preferences: {
        daily,
        weekly,
        milestones,
      },
      subscribe: isSubscribed,
    });
  };

  const handleToggleSubscription = async () => {
    await updateMutation.mutateAsync({
      preferences: {
        daily,
        weekly,
        milestones,
      },
      subscribe: !isSubscribed,
    });
  };

  if (statusQuery.isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  const issues = issuesQuery.data ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/settings")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold">Newsletter</h1>
            <p className="text-sm text-slate-600">
              Supportive words, on your schedule
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isSubscribed ? (
                <MailCheck className="h-5 w-5 text-emerald-600" />
              ) : (
                <Mail className="h-5 w-5 text-slate-400" />
              )}
              {isSubscribed ? "Subscribed" : "Not subscribed"}
            </CardTitle>
            <CardDescription>
              {status?.email ?? "No email on account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>What do you want to receive?</Label>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="pref-daily"
                  checked={daily}
                  onCheckedChange={c => setDaily(c === true)}
                />
                <label htmlFor="pref-daily" className="text-sm">
                  Daily reflections & reminders
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="pref-weekly"
                  checked={weekly}
                  onCheckedChange={c => setWeekly(c === true)}
                />
                <label htmlFor="pref-weekly" className="text-sm">
                  Weekly roundup & encouragement
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="pref-milestones"
                  checked={milestones}
                  onCheckedChange={c => setMilestones(c === true)}
                />
                <label htmlFor="pref-milestones" className="text-sm">
                  Milestone celebrations & new guides
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Preferences"}
              </Button>
              <Button
                variant={isSubscribed ? "outline" : "default"}
                onClick={handleToggleSubscription}
                disabled={updateMutation.isPending}
              >
                {isSubscribed ? "Unsubscribe" : "Subscribe"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Past Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-amber-600" />
              Past Editions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {issues.length === 0 ? (
              <p className="text-sm text-slate-600">
                No editions have been published yet.
              </p>
            ) : (
              <div className="space-y-3">
                {issues.map(issue => (
                  <div
                    key={issue.id}
                    className="p-4 bg-slate-50 rounded-lg border border-slate-100"
                  >
                    <button
                      className="w-full flex items-center justify-between gap-4 text-left"
                      onClick={() => setReading(issue)}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">
                            {ISSUE_TYPE_LABEL[issue.type] ?? issue.type}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {issue.scheduledFor
                              ? new Date(
                                  issue.scheduledFor
                                ).toLocaleDateString()
                              : "Unpublished"}
                          </span>
                        </div>
                        <p className="font-medium">{issue.subject}</p>
                      </div>
                      {expanded === issue.id ? (
                        <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={reading !== null}
        onOpenChange={o => !o && setReading(null)}
      >
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{reading?.subject}</DialogTitle>
          </DialogHeader>
          <div className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
            {reading?.body}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
