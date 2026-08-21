import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import SignInPage from "@/pages/SignIn";
import Dashboard from "@/pages/Dashboard";
import CheckIn from "@/pages/CheckIn";
import { GoalsPage, GuidesPage, JournalPage, MusicPage, OnboardingPage, ProgressPage, SettingsPage } from "@/pages/RecoveryWorkspace";
import { NewsletterPage, RulesPage } from "@/pages/AdditionalFeatures";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/sign-in"} component={SignInPage} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/check-in"} component={CheckIn} />
      <Route path={"/onboarding"} component={OnboardingPage} />
      <Route path={"/progress"} component={ProgressPage} />
      <Route path={"/journal"} component={JournalPage} />
      <Route path={"/goals"} component={GoalsPage} />
      <Route path={"/rules"} component={RulesPage} />
      <Route path={"/music"} component={MusicPage} />
      <Route path={"/guides"} component={GuidesPage} />
      <Route path={"/settings"} component={SettingsPage} />
      <Route path={"/newsletter"} component={NewsletterPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
