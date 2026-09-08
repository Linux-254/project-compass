import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { startLogin } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import {
  BookOpen,
  Compass,
  FileHeart,
  Flame,
  Goal,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  Music2,
  PanelLeft,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";
import { Button } from "./ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { REFORGE_ASSETS } from "@/config/assets";

const locationArt: Record<string, string> = {
  "/dashboard": REFORGE_ASSETS.dashboard,
  "/check-in": REFORGE_ASSETS.checkIn,
  "/check-ins": REFORGE_ASSETS.history,
  "/progress": REFORGE_ASSETS.progress,
  "/journal": REFORGE_ASSETS.journal,
  "/goals": REFORGE_ASSETS.goals,
  "/rules": REFORGE_ASSETS.rules,
  "/guides": REFORGE_ASSETS.guides,
  "/music": REFORGE_ASSETS.music,
  "/devotional": REFORGE_ASSETS.devotional,
  "/newsletter": REFORGE_ASSETS.newsletter,
  "/settings": REFORGE_ASSETS.settings,
  "/onboarding": REFORGE_ASSETS.onboarding,
  "/admin": REFORGE_ASSETS.admin,
};

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
  { icon: HeartPulse, label: "Today", path: "/check-in" },
  { icon: Flame, label: "History", path: "/check-ins" },
  { icon: TrendingUp, label: "Progress", path: "/progress" },
  { icon: BookOpen, label: "Journal", path: "/journal" },
  { icon: Goal, label: "Goals", path: "/goals" },
  { icon: ShieldCheck, label: "Boundaries", path: "/rules" },
  { icon: Compass, label: "Guides", path: "/guides" },
  { icon: Music2, label: "Music reset", path: "/music" },
  { icon: Sparkles, label: "Devotional", path: "/devotional" },
  { icon: FileHeart, label: "Newsletter", path: "/newsletter" },
];

const mobileNavItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
  { icon: HeartPulse, label: "Check in", path: "/check-in" },
  { icon: TrendingUp, label: "Progress", path: "/progress" },
  { icon: BookOpen, label: "Journal", path: "/journal" },
  { icon: Goal, label: "Goals", path: "/goals" },
];

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 220;
const MAX_WIDTH = 420;

export function SignInGate() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-10">
      <img
        src={REFORGE_ASSETS.dashboard}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.07]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,var(--background)_82%)]" />
      <div className="relative">
      <div className="nature-card w-full max-w-md p-8 text-center sm:p-10">
        <img src="/logo-mark.svg" alt="" className="h-12 w-12" />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          A private place to begin again
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight">
          Welcome to ReForge
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
          Sign in to continue your recovery practice. Your reflections and check-ins belong to you.
        </p>
        <Button onClick={() => startLogin()} className="mt-7 w-full rounded-full" size="lg">
          Continue privately
        </Button>
        <p className="mt-4 text-xs text-muted-foreground">No judgement. No performance. Just the next honest step.</p>
      </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) return <DashboardLayoutSkeleton />;
  if (!user) return <SignInGate />;

  return (
    <SidebarProvider style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}>
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}

type DashboardLayoutContentProps = {
  children: React.ReactNode;
  setSidebarWidth: (width: number) => void;
};

function DashboardLayoutContent({ children, setSidebarWidth }: DashboardLayoutContentProps) {
  const { user, logout } = useAuth();
  const rolesQuery = trpc.auth.getRoles.useQuery(undefined, { enabled: Boolean(user) });
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const activeMenuItem = menuItems.find(item => location === item.path);
  const bgArt = locationArt[location] ?? REFORGE_ASSETS.dashboard;
  const canManagePlatform = user?.role === "admin" || rolesQuery.data?.includes("admin");

  useEffect(() => {
    if (isCollapsed) setIsResizing(false);
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isResizing) return;
      const left = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const width = event.clientX - left;
      if (width >= MIN_WIDTH && width <= MAX_WIDTH) setSidebarWidth(width);
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  const initials = (user?.name || user?.email || "R").slice(0, 1).toUpperCase();

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground">Skip to content</a>
      <div className="relative" ref={sidebarRef}>
        <Sidebar collapsible="icon" className="border-r border-sidebar-border/70 bg-sidebar/95" disableTransition={isResizing}>
          <SidebarHeader className="h-[4.75rem] justify-center border-b border-sidebar-border/60">
            <div className="flex w-full items-center gap-3 px-2">
              <button onClick={toggleSidebar} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Toggle navigation">
                <PanelLeft className="h-4 w-4" />
              </button>
              {!isCollapsed && (
                <button onClick={() => setLocation("/dashboard")} className="min-w-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <img src="/logo.svg" alt="ReForge" className="h-11 w-auto max-w-[12.5rem]" />
                  <span className="mt-1 block truncate text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/55">Return to yourself</span>
                </button>
              )}
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-0 px-2 py-3">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/45 group-data-[collapsible=icon]:hidden">Your practice</p>
            <SidebarMenu>
              {menuItems.map(item => {
                const isActive = location === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton isActive={isActive} onClick={() => setLocation(item.path)} tooltip={item.label} className="h-10 rounded-xl font-normal transition-colors">
                      <item.icon className={isActive ? "text-primary" : "text-sidebar-foreground/65"} />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
            {canManagePlatform && (
              <>
                <p className="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/45 group-data-[collapsible=icon]:hidden">Stewardship</p>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={location === "/admin"} onClick={() => setLocation("/admin")} tooltip="Admin" className="h-10 rounded-xl font-normal">
                      <Users className="text-sidebar-foreground/65" />
                      <span>Admin</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </>
            )}
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border/60 p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center gap-3 rounded-xl px-1 py-1.5 text-left transition-colors hover:bg-sidebar-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring group-data-[collapsible=icon]:justify-center">
                  <Avatar className="h-9 w-9 shrink-0 border border-sidebar-border">
                    <AvatarFallback className="bg-primary/12 text-xs font-semibold text-primary">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                    <p className="truncate text-sm font-medium leading-none text-sidebar-foreground">{user?.name || "Your account"}</p>
                    <p className="mt-1.5 truncate text-xs text-sidebar-foreground/55">{user?.email || "Private account"}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={() => setLocation("/settings")} className="cursor-pointer"><Settings className="mr-2 h-4 w-4" /> Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-destructive focus:text-destructive"><LogOut className="mr-2 h-4 w-4" /> Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div className={`absolute right-0 top-0 h-full w-1 cursor-col-resize transition-colors hover:bg-primary/20 ${isCollapsed ? "hidden" : ""}`} onMouseDown={() => setIsResizing(true)} style={{ zIndex: 50 }} />
      </div>

      <SidebarInset className="relative min-w-0 bg-background">
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
          <img src={bgArt} alt="" className="h-full w-full object-cover opacity-[0.06]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,var(--background)_82%)]" />
        </div>
        {isMobile && (
          <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/60 bg-background/92 px-3 backdrop-blur">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-9 w-9 rounded-xl" />
              <img src="/logo.svg" alt="ReForge" className="h-6 w-auto" />
            </div>
            <span className="truncate px-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {activeMenuItem?.label ?? "Your practice"}
            </span>
          </div>
        )}
        <main id="main-content" className="relative z-10 min-h-[calc(100vh-3.5rem)] p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 lg:pb-8">{children}</main>
      </SidebarInset>

      {isMobile && (
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/92 backdrop-blur-xl lg:hidden" aria-label="Primary app navigation">
          <div className="mx-auto grid max-w-md grid-cols-5">
            {mobileNavItems.map(item => {
              const isActive = location === item.path;
              const ItemIcon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => setLocation(item.path)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <span className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${isActive ? "bg-primary/12" : ""}`}>
                    <ItemIcon className={`h-5 w-5 ${isActive ? "drop-shadow-[0_0_6px_color-mix(in_oklab,var(--primary)_55%,transparent)]" : ""}`} />
                  </span>
                  <span className="leading-none">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
