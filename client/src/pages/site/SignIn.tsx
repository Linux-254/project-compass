import { Link } from "wouter";
import { ArrowRight, Leaf, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { natureAsset } from "@/config/assets";

export default function SignIn() {
  return (
    <main className="relative min-h-[calc(100vh-4.6rem)] overflow-hidden bg-[oklch(0.96_0.025_105)]">
      <img src={natureAsset("signIn")} alt="Soft light through green leaves" className="absolute inset-0 h-full w-full object-cover opacity-45" />
      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(247,245,232,.96),rgba(247,245,232,.72),rgba(39,58,43,.22))]" />
      <div className="container relative grid min-h-[calc(100vh-4.6rem)] items-center gap-12 py-16 lg:grid-cols-[1fr_430px]">
        <section className="max-w-xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <Leaf className="h-4 w-4" /> Return to the garden
          </Link>
          <p className="mt-12 text-xs font-semibold uppercase tracking-[0.22em] text-primary">Your private space</p>
          <h1 className="mt-4 font-serif text-5xl leading-[0.98] text-[oklch(0.26_0.055_145)] sm:text-6xl">Come back to what matters.</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-foreground/65">A quiet place for honest check-ins, private reflection, and the small steps that make a life feel more like your own.</p>
        </section>
        <section className="nature-card bg-background/88 p-7 shadow-[0_24px_70px_-35px_rgba(39,58,43,.6)] backdrop-blur-xl sm:p-9" aria-labelledby="sign-in-title">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/12 text-primary"><ShieldCheck className="h-6 w-6" /></div>
          <h2 id="sign-in-title" className="mt-7 font-serif text-3xl text-[oklch(0.3_0.055_145)]">Sign in gently</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Use your secure ReForge account to continue. Your sensitive reflections remain private and encrypted.</p>
          <Button size="lg" className="mt-8 h-12 w-full rounded-full" onClick={() => startLogin()}>Continue with secure sign-in <ArrowRight className="ml-2 h-4 w-4" /></Button>
          <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">By continuing, you agree to our <Link href="/terms" className="text-primary underline">Terms</Link> and <Link href="/privacy" className="text-primary underline">Privacy</Link>.</p>
          <Link href="/" className="mt-7 block text-center text-sm text-foreground/60 hover:text-primary">Not ready? Explore ReForge first</Link>
        </section>
      </div>
    </main>
  );
}
