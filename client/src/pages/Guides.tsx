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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  Compass,
  HeartHandshake,
  Users,
  Newspaper,
} from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

type ResourceType =
  | "activity_guide"
  | "situation_guide"
  | "relationship_guide"
  | "devotional"
  | "article";

const TABS: { type: ResourceType; label: string; icon: typeof BookOpen }[] = [
  { type: "activity_guide", label: "Activities", icon: Compass },
  { type: "situation_guide", label: "Situations", icon: Sparkles },
  { type: "relationship_guide", label: "Relationships", icon: Users },
  { type: "devotional", label: "Devotionals", icon: HeartHandshake },
  { type: "article", label: "Articles", icon: Newspaper },
];

const TYPE_LABEL: Record<ResourceType, string> = {
  activity_guide: "Activity Guide",
  situation_guide: "Situation Guide",
  relationship_guide: "Relationship Guide",
  devotional: "Devotional",
  article: "Article",
};

type Resource = {
  id: number;
  type: string;
  title: string;
  body: string | null;
  tags: string | null;
  faithVariant: string | null;
};

export default function Guides() {
  const { user } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: "/",
  });
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<ResourceType>("activity_guide");
  const [selected, setSelected] = useState<Resource | null>(null);

  const resourcesQuery = trpc.resources.getByType.useQuery({
    type: tab,
    limit: 50,
  });

  if (resourcesQuery.isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  const resources = resourcesQuery.data ?? [];

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
            <h1 className="text-xl font-bold">Library</h1>
            <p className="text-sm text-slate-600">
              Guides, devotionals, and articles for every season
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map(t => {
            const Icon = t.icon;
            const isActive = tab === t.type;
            return (
              <Button
                key={t.type}
                variant={isActive ? "default" : "outline"}
                onClick={() => setTab(t.type)}
                className="gap-2"
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </Button>
            );
          })}
        </div>

        {resources.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-10 w-10 text-amber-300 mx-auto mb-4" />
              <p className="text-slate-600">
                No {TABS.find(t => t.type === tab)?.label.toLowerCase()} yet.
                Check back soon.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map(resource => (
              <Card
                key={resource.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelected(resource)}
              >
                <CardHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">
                      {TYPE_LABEL[resource.type as ResourceType] ?? "Resource"}
                    </Badge>
                    {resource.faithVariant === "faith" && (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        Faith
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base leading-snug">
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {resource.tags && (
                    <p className="text-xs text-slate-500 truncate">
                      {resource.tags}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={o => !o && setSelected(null)}
      >
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {selected?.tags && (
              <p className="text-sm text-slate-500">{selected.tags}</p>
            )}
            <div className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
              {selected?.body}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
