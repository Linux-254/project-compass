import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Heart, Zap, Users, BookOpen, Music, Target, Smile } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (isAuthenticated && user) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-slate-900">
            Re<span className="text-amber-600">Forge</span>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => setLocation("/#how-it-works")}>
              How It Works
            </Button>
            <Button variant="ghost" onClick={() => setLocation("/#features")}>
              Features
            </Button>
            <Button onClick={() => startLogin()}>Sign In</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-6">
          Your Journey Back to Whole-Life Wellness
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          ReForge is a compassionate digital companion guiding you through a structured 3-6 month journey from substance dependence to a thriving, purposeful life.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => startLogin()}>
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white py-12 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-amber-600">21</div>
              <p className="text-slate-600">Life Dimensions Tracked</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600">100%</div>
              <p className="text-slate-600">Private & Secure</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600">24/7</div>
              <p className="text-slate-600">Always Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">What You'll Experience</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Heart className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle>Daily Check-Ins</CardTitle>
              <CardDescription>Track mood, energy, and cravings with gentle daily prompts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Simple morning and evening check-ins help you stay connected to your progress and celebrate small wins.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle>Whole-Life Progress</CardTitle>
              <CardDescription>Track 21 dimensions of your life, not just sobriety</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                From work and relationships to physical health and self-image, see how every area of your life transforms.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle>Personalized Guides</CardTitle>
              <CardDescription>Activity, situation, and relationship repair guides tailored to you</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Get context-aware recommendations based on your energy level, available time, and interests.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Music className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle>Music Rehabilitation</CardTitle>
              <CardDescription>Gently shift your music taste toward recovery-supporting genres</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Identify trigger artists and gradually discover safe, uplifting music that supports your journey.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Target className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle>Goal Tracking</CardTitle>
              <CardDescription>30, 90, and 180-day goals with daily step breakdowns</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Set meaningful goals across any life dimension and break them into manageable daily actions.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Smile className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle>Daily Devotionals</CardTitle>
              <CardDescription>Faith-based or secular inspiration, your choice</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Opt-in daily encouragement tailored to your spiritual preferences and recovery journey.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle>Supporter Network</CardTitle>
              <CardDescription>Invite trusted people to support your journey</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Share your progress with supporters at the level of privacy you choose—from dashboard only to full access.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle>Private Journal</CardTitle>
              <CardDescription>Encrypted entries that only you can see</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                A safe space to reflect on your journey with guided prompts and complete privacy protection.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-slate-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Your 3-6 Month Journey</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                phase: "Phase 1",
                title: "Foundation",
                description: "Complete onboarding, set your substance focus, and establish daily rhythms.",
              },
              {
                phase: "Phase 2",
                title: "Core Journey",
                description: "Daily check-ins, journal, goals, and dimension tracking become your rhythm.",
              },
              {
                phase: "Phase 3",
                title: "Community",
                description: "Connect with supporters and join peer-led challenges and mentorship.",
              },
              {
                phase: "Phase 4",
                title: "Thrive",
                description: "Celebrate milestones, deepen relationships, and plan your next chapter.",
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl font-bold text-amber-400 mb-2">{idx + 1}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-slate-300 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Reclaim Your Life?</h2>
        <p className="text-lg text-slate-600 mb-8">
          Join thousands on their journey to whole-life wellness. Start free today.
        </p>
        <Button size="lg" onClick={() => startLogin()}>
          Begin Your Journey
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">ReForge</h3>
              <p className="text-sm">Compassionate whole-life recovery platform.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2026 ReForge. All rights reserved. Not a medical service.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
