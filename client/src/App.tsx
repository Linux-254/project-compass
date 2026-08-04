import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import SiteHome from "@/pages/site/Home";
import About from "@/pages/site/About";
import HowItWorks from "@/pages/site/HowItWorks";
import Dimensions from "@/pages/site/Dimensions";
import DailyPractice from "@/pages/site/DailyPractice";
import Success from "@/pages/site/Success";
import Faq from "@/pages/site/Faq";
import Supporters from "@/pages/site/Supporters";
import Contact from "@/pages/site/Contact";
import Privacy from "@/pages/site/Privacy";
import Terms from "@/pages/site/Terms";
import Dashboard from "@/pages/Dashboard";
import Onboarding from "@/pages/Onboarding";
import Progress from "@/pages/Progress";
import CheckInHistory from "@/pages/CheckInHistory";
import Journal from "@/pages/Journal";
import Rules from "@/pages/Rules";
import Goals from "@/pages/Goals";
import Guides from "@/pages/Guides";
import Music from "@/pages/Music";
import Devotional from "@/pages/Devotional";
import Newsletter from "@/pages/Newsletter";
import Settings from "@/pages/Settings";
import Admin from "@/pages/Admin";
import Auth from "@/pages/Auth";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import RequireAuth from "./components/RequireAuth";
import { ThemeProvider } from "./contexts/ThemeContext";

const protectedRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/progress", component: Progress },
  { path: "/check-ins", component: CheckInHistory },
  { path: "/journal", component: Journal },
  { path: "/rules", component: Rules },
  { path: "/goals", component: Goals },
  { path: "/guides", component: Guides },
  { path: "/music", component: Music },
  { path: "/devotional", component: Devotional },
  { path: "/settings", component: Settings },
  { path: "/admin", component: Admin },
  { path: "/onboarding", component: Onboarding },
];

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={SiteHome} />
      <Route path={"/about"} component={About} />
      <Route path={"/how-it-works"} component={HowItWorks} />
      <Route path={"/dimensions"} component={Dimensions} />
      <Route path={"/daily-practice"} component={DailyPractice} />
      <Route path={"/success"} component={Success} />
      <Route path={"/faq"} component={Faq} />
      <Route path={"/supporters"} component={Supporters} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/auth"} component={Auth} />
      <Route path={"/newsletter"} component={Newsletter} />
      {protectedRoutes.map(({ path, component: Component }) => (
        <Route key={path} path={path}>
          <RequireAuth>
            <Component />
          </RequireAuth>
        </Route>
      ))}
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}


function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
