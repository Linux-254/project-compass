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
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

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
      <Route path={"/dashboard"} component={Dashboard} />
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
