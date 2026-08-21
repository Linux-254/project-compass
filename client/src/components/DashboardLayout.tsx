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
  Home,
  LayoutDashboard,
  Leaf,
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

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
  { icon: HeartPulse, label: "Today", path: "/check-ins" },
  { icon: TrendingUp, label: "Progress", path: "/progress" },
  { icon: BookOpen, label: "Journal", path: "/journal" },
  { icon: Goal, label: "Goals", path: "/goals" },
  { icon: ShieldCheck, label: "Boundaries", path: "/rules" },
  { icon: Compass, label: "Guides", path: "/guides" },
  { icon: Music2, label: "Music reset", path: "/music" },
  { icon: Sparkles, label: "Devotional", path: "/devotional" },
  { icon: FileHeart, label: "Newsletter", path: "/newsletter" },
];

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 220;
const MAX_WIDTH = 420;

export function SignInGate() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
      <div className="nature-card w-full max-w-md p-8 text-center sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/12 text-primary">
          <Leaf className="h-6 w-6" />
        </div>
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
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const activeMenuItem = menuItems.find(item => location === item.path);

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
      <div className="relative" ref={sidebarRef}>
        <Sidebar collapsible="icon" className="border-r border-sidebar-border/70 bg-sidebar/95" disableTransition={isResizing}>
          <SidebarHeader className="h-[4.75rem] justify-center border-b border-sidebar-border/60">
            <div className="flex w-full items-center gap-3 px-2">
              <button onClick={toggleSidebar} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Toggle navigation">
                <PanelLeft className="h-4 w-4" />
              </button>
              {!isCollapsed && (
                <button onClick={() => setLocation("/dashboard")} className="min-w-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <span className="block font-serif text-xl font-semibold tracking-tight text-sidebar-foreground">Re<span className="text-primary">Forge</span></span>
                  <span className="block truncate text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/55">Return to yourself</span>
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
            {user?.role === "admin" && (
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

      <SidebarInset className="min-w-0 bg-background">
        {isMobile && (
          <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/60 bg-background/92 px-3 backdrop-blur">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-9 w-9 rounded-xl" />
              <span className="font-serif text-xl font-semibold">{activeMenuItem?.label ?? "ReForge"}</span>
            </div>
            <button onClick={() => setLocation("/dashboard")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-label="Go to overview"><Home className="h-4 w-4" /></button>
          </div>
        )}
        <main className="min-h-[calc(100vh-3.5rem)] p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </>
  );
}
