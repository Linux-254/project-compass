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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft,
  ShieldCheck,
  Users,
  Newspaper,
  Plus,
  Leaf,
  Sparkles,
  UserCheck,
  Pencil,
  Trash2,
  X,
  Save,
} from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

const ROLES = ["supporter", "mentor", "moderator", "admin"] as const;

export default function Admin() {
  const { user } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: "/",
  });
  const [, setLocation] = useLocation();
  const [issueType, setIssueType] = useState("weekly");
  const [issueSubject, setIssueSubject] = useState("");
  const [issueBody, setIssueBody] = useState("");
  const [editingIssueId, setEditingIssueId] = useState<number | null>(null);

  const rolesQuery = trpc.auth.getRoles.useQuery();
  const usersQuery = trpc.admin.listUsers.useQuery({ limit: 50, offset: 0 });
  const issuesQuery = trpc.newsletter.getIssues.useQuery({ limit: 20, offset: 0 });
  const utils = trpc.useUtils();

  const grantMutation = trpc.admin.grantRole.useMutation({
    onSuccess: () => {
      toast.success("Role successfully granted");
      utils.admin.listUsers.invalidate();
    },
    onError: () => toast.error("Failed to grant role"),
  });
  const revokeMutation = trpc.admin.revokeRole.useMutation({
    onSuccess: () => {
      toast.success("Role successfully revoked");
      utils.admin.listUsers.invalidate();
    },
    onError: () => toast.error("Failed to revoke role"),
  });
  const createIssueMutation = trpc.newsletter.createIssue.useMutation({
    onSuccess: () => {
      toast.success("Newsletter edition published successfully");
      setIssueSubject("");
      setIssueBody("");
      utils.newsletter.getIssues.invalidate();
    },
    onError: () => toast.error("Failed to publish newsletter issue"),
  });
  const updateIssueMutation = trpc.newsletter.updateIssue.useMutation({
    onSuccess: () => {
      toast.success("Newsletter edition updated");
      setEditingIssueId(null);
      setIssueSubject("");
      setIssueBody("");
      utils.newsletter.getIssues.invalidate();
    },
    onError: () => toast.error("Failed to update newsletter issue"),
  });
  const deleteIssueMutation = trpc.newsletter.deleteIssue.useMutation({
    onSuccess: () => {
      toast.success("Newsletter edition removed");
      utils.newsletter.getIssues.invalidate();
    },
    onError: () => toast.error("Failed to remove newsletter issue"),
  });

  const isAdmin = rolesQuery.data?.includes("admin") ?? false;

  const handleCreateIssue = async () => {
    if (!issueSubject.trim() || !issueBody.trim()) return;
    const type = issueType as
      | "daily"
      | "weekly"
      | "milestone"
      | "dimension"
      | "situation";
    if (editingIssueId !== null) {
      await updateIssueMutation.mutateAsync({
        id: editingIssueId,
        type,
        subject: issueSubject.trim(),
        body: issueBody.trim(),
      });
      return;
    }
    await createIssueMutation.mutateAsync({
      type,
      subject: issueSubject.trim(),
      body: issueBody.trim(),
    });
  };

  const handleEditIssue = (issue: NonNullable<typeof issuesQuery.data>[number]) => {
    setEditingIssueId(issue.id);
    setIssueType(issue.type);
    setIssueSubject(issue.subject);
    setIssueBody(issue.body);
  };

  const cancelIssueEdit = () => {
    setEditingIssueId(null);
    setIssueSubject("");
    setIssueBody("");
    setIssueType("weekly");
  };

  if (rolesQuery.isLoading || usersQuery.isLoading || issuesQuery.isLoading) {
    return (
      <div className="nature-shell min-h-screen py-12 px-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <Skeleton className="h-20 w-full rounded-2xl bg-primary/10" />
          <Skeleton className="h-[420px] w-full rounded-3xl bg-primary/10" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="nature-shell min-h-screen flex items-center justify-center p-6">
        <div className="nature-card nature-glass max-w-md w-full p-8 text-center space-y-6">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="burnt-wood-heading font-serif text-3xl">Restricted Sanctuary</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              You are signed in as <span className="font-semibold text-foreground">{user?.name || user?.email || "User"}</span>. This administrative control room is reserved for ReForge platform maintainers.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <Button
              onClick={() => setLocation("/dashboard")}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Return to Your Recovery Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
              className="w-full border-primary/30"
            >
              Back to Home Sanctuary
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const users = usersQuery.data ?? [];

  return (
    <div className="nature-shell min-h-screen pb-16">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/dashboard")}
              className="gap-2 text-foreground/80 hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-primary">
                <Leaf className="h-4 w-4" />
              </span>
              <div>
                <h1 className="burnt-wood-heading font-serif text-xl font-bold">Admin Control Room</h1>
                <p className="text-xs text-muted-foreground">Manage user roles, community access, and editorial publications</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3 w-3" />
              Administrator Verified
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pt-8 space-y-8">
        {/* User-to-Admin Flow Note */}
        <div className="nature-card nature-glass p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="nature-eyebrow">User-to-Admin Flow</span>
            <h2 className="burnt-wood-heading text-xl font-serif">Community & Role Governance</h2>
            <p className="text-sm text-muted-foreground">
              Promote trusted members to supporters, mentors, or administrators instantly below.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <UserCheck className="h-4 w-4 text-primary" />
            {users.length} active registered accounts
          </div>
        </div>

        {/* Users & Roles Card */}
        <Card className="nature-card nature-glass border-border/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-2xl burnt-wood-heading">
              <Users className="h-6 w-6 text-primary" />
              Member Roster & Roles
            </CardTitle>
            <CardDescription>
              Grant or revoke administrative and mentoring privileges across registered profiles
            </CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No accounts discovered in the database.</p>
            ) : (
              <div className="space-y-3">
                {users.map(u => (
                  <div
                    key={u.id}
                    className="group rounded-2xl border border-border/60 bg-card/60 p-4 transition-all duration-200 hover:border-primary/40 hover:bg-card flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-foreground">{u.name || "Anonymous Member"}</span>
                        <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary text-xs">
                          {u.role}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{u.email || u.openId}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {ROLES.map(role => {
                        const hasRole = u.role === role;
                        return (
                          <Button
                            key={role}
                            variant={hasRole ? "default" : "outline"}
                            size="sm"
                            onClick={() =>
                              hasRole
                                ? revokeMutation.mutate({ userId: u.id, role })
                                : grantMutation.mutate({ userId: u.id, role })
                            }
                            className={`h-8 text-xs capitalize ${hasRole ? "bg-primary text-primary-foreground" : "border-border hover:border-primary/50"}`}
                          >
                            {hasRole ? `✓ ${role}` : `+ ${role}`}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Newsletter & Content Publishing Card */}
        <Card className="nature-card nature-glass border-border/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-2xl burnt-wood-heading">
              <Newspaper className="h-6 w-6 text-primary" />
              Publish Editorial Edition
            </CardTitle>
            <CardDescription>
              Create daily reflections, weekly rhythms, or milestone issues for newsletter subscribers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="issue-type" className="text-sm font-medium">Publication Type</Label>
                <select
                  id="issue-type"
                  value={issueType}
                  onChange={e => setIssueType(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-input bg-background/90 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="daily">Daily Reflection</option>
                  <option value="weekly">Weekly Rhythm</option>
                  <option value="milestone">Milestone Celebration</option>
                  <option value="dimension">Life Dimension Deep-Dive</option>
                  <option value="situation">Situation Guide</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="issue-subject" className="text-sm font-medium">Edition Subject / Title</Label>
                <Input
                  id="issue-subject"
                  placeholder="e.g. Grounding in the autumn pause"
                  value={issueSubject}
                  onChange={e => setIssueSubject(e.target.value)}
                  className="h-11 rounded-xl bg-background/90"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="issue-body" className="text-sm font-medium">Edition Body (Markdown Supported)</Label>
              <textarea
                id="issue-body"
                placeholder="Write your restorative message or guided practice..."
                value={issueBody}
                onChange={e => setIssueBody(e.target.value)}
                className="flex min-h-[180px] w-full rounded-2xl border border-input bg-background/90 p-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={handleCreateIssue}
                disabled={
                  !issueSubject.trim() ||
                  !issueBody.trim() ||
                  createIssueMutation.isPending ||
                  updateIssueMutation.isPending
                }
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 rounded-xl font-medium shadow-lg shadow-primary/25"
              >
                {editingIssueId !== null ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {updateIssueMutation.isPending
                  ? "Saving Edition..."
                  : createIssueMutation.isPending
                    ? "Publishing Edition..."
                    : editingIssueId !== null
                      ? "Save Newsletter Edition"
                      : "Publish Newsletter Edition"}
              </Button>
              {editingIssueId !== null && (
                <Button type="button" variant="outline" onClick={cancelIssueEdit} className="h-11 gap-2 rounded-xl">
                  <X className="h-4 w-4" />
                  Cancel edit
                </Button>
              )}
            </div>

            <div className="border-t border-border/60 pt-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Existing editions</p>
                  <p className="text-xs text-muted-foreground">Review, refine, or remove previously published editorial content.</p>
                </div>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  {issuesQuery.data?.length ?? 0} visible
                </Badge>
              </div>
              <div className="space-y-3">
                {(issuesQuery.data ?? []).map(issue => (
                  <div key={issue.id} className="rounded-2xl border border-border/60 bg-background/55 p-4 transition-colors hover:border-primary/35">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary" className="capitalize">{issue.type}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(issue.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="font-serif text-xl font-semibold burnt-wood-heading">{issue.subject}</p>
                        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{issue.body}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 rounded-xl"
                          onClick={() => handleEditIssue(issue)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10"
                          disabled={deleteIssueMutation.isPending}
                          onClick={() => {
                            if (window.confirm("Remove this newsletter edition?")) {
                              deleteIssueMutation.mutate({ id: issue.id });
                            }
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {(issuesQuery.data ?? []).length === 0 && (
                  <p className="rounded-2xl border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">
                    No newsletter editions have been created yet.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
