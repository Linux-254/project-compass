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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, ShieldCheck, Users, Newspaper, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

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

  const rolesQuery = trpc.auth.getRoles.useQuery();
  const usersQuery = trpc.admin.listUsers.useQuery({ limit: 50, offset: 0 });
  const grantMutation = trpc.admin.grantRole.useMutation({
    onSuccess: () => toast.success("Role granted"),
    onError: () => toast.error("Failed to grant role"),
  });
  const revokeMutation = trpc.admin.revokeRole.useMutation({
    onSuccess: () => toast.success("Role revoked"),
    onError: () => toast.error("Failed to revoke role"),
  });
  const createIssueMutation = trpc.newsletter.createIssue.useMutation({
    onSuccess: () => {
      toast.success("Issue created");
      setIssueSubject("");
      setIssueBody("");
    },
    onError: () => toast.error("Failed to create issue"),
  });

  const isAdmin = rolesQuery.data?.includes("admin") ?? false;

  const handleCreateIssue = async () => {
    if (!issueSubject.trim() || !issueBody.trim()) return;
    await createIssueMutation.mutateAsync({
      type: issueType as
        | "daily"
        | "weekly"
        | "milestone"
        | "dimension"
        | "situation",
      subject: issueSubject.trim(),
      body: issueBody.trim(),
    });
  };

  if (rolesQuery.isLoading || usersQuery.isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card>
          <CardContent className="py-12 px-8 text-center">
            <ShieldCheck className="h-10 w-10 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">
              You don't have access to this area.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const users = usersQuery.data ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
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
            <h1 className="text-xl font-bold">Admin</h1>
            <p className="text-sm text-slate-600">
              User roles and newsletter publishing
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-600" />
              Users & Roles
            </CardTitle>
            <CardDescription>
              Manage supporters, mentors, moderators, and admins
            </CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-sm text-slate-600">No users found.</p>
            ) : (
              <div className="space-y-3">
                {users.map(u => (
                  <div
                    key={u.id}
                    className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {u.name || u.email}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="outline">
                          {u.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
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

        {/* Newsletter Issue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-amber-600" />
              Publish Newsletter Edition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="issue-type">Type</Label>
              <select
                id="issue-type"
                value={issueType}
                onChange={e => setIssueType(e.target.value)}
                className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="milestone">Milestone</option>
                <option value="dimension">Dimension</option>
                <option value="situation">Situation</option>
              </select>
            </div>
            <div>
              <Label htmlFor="issue-subject">Subject</Label>
              <Input
                id="issue-subject"
                value={issueSubject}
                onChange={e => setIssueSubject(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="issue-body">Body</Label>
              <textarea
                id="issue-body"
                value={issueBody}
                onChange={e => setIssueBody(e.target.value)}
                className="mt-2 flex min-h-40 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <Button
              onClick={handleCreateIssue}
              disabled={
                !issueSubject.trim() ||
                !issueBody.trim() ||
                createIssueMutation.isPending
              }
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {createIssueMutation.isPending
                ? "Publishing..."
                : "Publish Issue"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
