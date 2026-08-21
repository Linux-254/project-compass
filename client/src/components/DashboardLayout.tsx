import { useAuth } from "@/_core/hooks/useAuth";
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
import { REFORGE_ASSETS } from "@/config/assets";
import { useIsMobile } from "@/hooks/useMobile";
import {
  BookOpen,
  ClipboardCheck,
  Compass,
  LayoutDashboard,
  Library,
  LogOut,
  MoonStar,
  Music2,
  PanelLeft,
  Settings,
  ShieldCheck,
  Sparkles,
  SunMedium,
  Target,
  TrendingUp,
} from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
  { icon: ClipboardCheck, label: "Daily check-in", path: "/check-in" },
  { icon: TrendingUp, label: "Whole-life progress", path: "/progress" },
  { icon: BookOpen, label: "Private journal", path: "/journal" },
  { icon: Target, label: "Goals & next steps", path: "/goals" },
  { icon: ShieldCheck, label: "Rules & boundaries", path: "/rules" },
  { icon: Music2, label: "Music reset", path: "/music" },
  { icon: Library, label: "Guides & motivation", path: "/guides" },
  { icon: Settings, label: "Settings & privacy", path: "/settings" },
];

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 220;
const MAX_WIDTH = 420;

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <img src="/manus-storage/reforge-mark_10b4e944.svg" alt="" className="h-8 w-8 rounded-xl shadow-sm" />
      {!compact && <span className="font-serif text-lg font-semibold tracking-tight">Re<span className="text-primary">Forge</span></span>}
    </span>
  );
}

export function SignInGate() {
  return (
    <div className="min-h-screen bg-background px-4 py-4 text-foreground sm:px-8 sm:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-[0_28px_100px_-50px_rgba(53,45,29,0.65)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden min-h-[620px] overflow-hidden lg:block">
          <img src={REFORGE_ASSETS.signIn} alt="Warm autumn light in a quiet recovery room" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(35,54,39,.78),rgba(79,53,35,.44)_56%,rgba(151,82,51,.42))]" />
          <div className="relative flex h-full flex-col justify-between p-12 text-white">
            <BrandMark />
            <div className="max-w-md space-y-5">
              <p className="flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-amber-100"><Sparkles className="h-4 w-4" /> A softer way forward</p>
              <h1 className="font-serif text-5xl leading-[1.05]">Come back to the life you are rebuilding.</h1>
              <p className="text-base leading-7 text-white/80">A private, whole-life recovery space for the small decisions that become a different kind of future.</p>
            </div>
            <p className="text-sm text-white/65">Your pace is welcome here. There is no perfect way to begin.</p>
          </div>
        </div>
        <div className="relative flex min-h-[calc(100vh-2rem)] flex-col justify-between bg-card p-6 sm:p-10 lg:p-14">
          <div className="flex items-center justify-between"><button onClick={() => { window.location.href = "/"; }} aria-label="Return to ReForge home"><BrandMark /></button><ThemeToggle compact /></div>
          <div className="mx-auto w-full max-w-sm space-y-8 py-12 lg:py-0">
            <div className="space-y-3"><p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Your private room</p><h2 className="font-serif text-4xl leading-tight">Sign in to continue gently.</h2><p className="leading-7 text-muted-foreground">Your dashboard, reflections, check-ins, and progress stay connected to your account.</p></div>
            <div className="space-y-3"><Button onClick={() => startLogin()} size="lg" className="w-full rounded-full">Sign in with Manus</Button><p className="text-center text-xs leading-5 text-muted-foreground">By continuing, you agree to use ReForge as a personal reflection tool, not as emergency or clinical care.</p></div>
            <div className="grid gap-3 rounded-2xl border border-border/70 bg-muted/30 p-4 text-sm"><div className="flex items-center gap-3"><Compass className="h-4 w-4 text-primary" /><span>See your whole-life view in one place.</span></div><div className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-primary" /><span>Receive prompts that meet you where you are.</span></div></div>
          </div>
          <p className="text-center text-xs text-muted-foreground">ReForge · Private by design · Not a medical service</p>
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

  useEffect(() => { localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString()); }, [sidebarWidth]);
  if (loading) return <DashboardLayoutSkeleton />;
  if (!user) return <SignInGate />;

  return <SidebarProvider style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}><DashboardLayoutContent setSidebarWidth={setSidebarWidth}>{children}</DashboardLayoutContent></SidebarProvider>;
}

type DashboardLayoutContentProps = { children: React.ReactNode; setSidebarWidth: (width: number) => void };

function DashboardLayoutContent({ children, setSidebarWidth }: DashboardLayoutContentProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeMenuItem = menuItems.find(item => item.path === location);
  const isMobile = useIsMobile();

  useEffect(() => { if (isCollapsed) setIsResizing(false); }, [isCollapsed]);
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isResizing) return;
      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = event.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => { document.removeEventListener("mousemove", handleMouseMove); document.removeEventListener("mouseup", handleMouseUp); document.body.style.cursor = ""; document.body.style.userSelect = ""; };
  }, [isResizing, setSidebarWidth]);

  return <>
    <div className="relative" ref={sidebarRef}>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border/60 bg-sidebar/95" disableTransition={isResizing}>
        <SidebarHeader className="h-20 justify-center border-b border-sidebar-border/50">
          <div className="flex w-full items-center gap-3 px-2"><button onClick={toggleSidebar} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-sidebar-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Toggle navigation"><PanelLeft className="h-4 w-4" /></button>{!isCollapsed && <button onClick={() => setLocation("/dashboard")} className="min-w-0 text-left"><BrandMark /></button>}</div>
        </SidebarHeader>
        <SidebarContent className="gap-0"><div className="px-4 pb-2 pt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-sidebar-foreground/50">Your practice</div><SidebarMenu className="px-2 py-1">{menuItems.map(item => { const isActive = location === item.path; return <SidebarMenuItem key={item.path}><SidebarMenuButton isActive={isActive} onClick={() => setLocation(item.path)} tooltip={item.label} className="h-11 rounded-xl font-normal"><item.icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} /><span>{item.label}</span></SidebarMenuButton></SidebarMenuItem>; })}</SidebarMenu></SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border/50 p-3"><DropdownMenu><DropdownMenuTrigger asChild><button className="flex w-full items-center gap-3 rounded-xl px-1 py-1 text-left hover:bg-sidebar-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Avatar className="h-9 w-9 border border-primary/20"><AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">{user?.name?.charAt(0).toUpperCase() || "R"}</AvatarFallback></Avatar><div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden"><p className="truncate text-sm font-medium leading-none">{user?.name || "Your ReForge space"}</p><p className="mt-1.5 truncate text-xs text-muted-foreground">{user?.email || "Private account"}</p></div></button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-48"><DropdownMenuItem onClick={() => setLocation("/settings")} className="cursor-pointer"><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem><DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive"><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem></DropdownMenuContent></DropdownMenu></SidebarFooter>
      </Sidebar>
      <div className={`absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/20 ${isCollapsed ? "hidden" : ""}`} onMouseDown={() => !isCollapsed && setIsResizing(true)} style={{ zIndex: 50 }} />
    </div>
    <SidebarInset className="bg-background/95">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/60 bg-background/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8"><div className="flex items-center gap-3">{isMobile && <SidebarTrigger className="h-9 w-9 rounded-full" />}<button onClick={() => setLocation("/dashboard")} aria-label="Go to ReForge overview" className="flex min-w-0 items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"><BrandMark compact={isMobile} /></button><div className="hidden lg:block"><p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">ReForge practice</p><p className="font-serif text-lg">{activeMenuItem?.label ?? "Your overview"}</p></div></div><div className="flex items-center gap-2"><ThemeToggle compact /><Button variant="ghost" size="sm" onClick={() => setLocation("/check-in")} className="hidden rounded-full sm:flex sm:gap-2"><SunMedium className="h-4 w-4 text-primary" />Today’s check-in</Button></div></header>
      <main className="min-h-[calc(100vh-4rem)] flex-1 bg-[radial-gradient(circle_at_top_right,rgba(181,107,66,.11),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(83,103,71,.09),transparent_38%)] p-4 sm:p-6 lg:p-8">{children}</main>
    </SidebarInset>
  </>;
}
