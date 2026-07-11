import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-gutter pt-unit-xxl">
      <div className="max-w-4xl space-y-unit-lg">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-unit-sm px-4 py-1.5 rounded-full glass-panel border-white/10 mb-unit-md animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
          </span>
          <span className="font-label-mono text-label-mono text-secondary uppercase tracking-widest">New: Visual Commit Galaxy</span>
        </div>
        
        {/* Massive Headline */}
        <h1 className="font-display-xl text-display-xl tracking-tighter text-white leading-none">
          Explore Your <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary-container animate-pulse">Coding Universe</span>
        </h1>
        
        {/* Subheading */}
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed opacity-80">
          Every commit tells a story. Watch yours come alive through high-fidelity visualizations, deep repository insights, and an immersive developer identity experience.
        </p>
        
        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-unit-md pt-unit-lg">
          <Link href="/api/auth/signin" className="group relative px-unit-xl py-4 rounded-xl bg-primary text-on-primary font-bold flex items-center gap-unit-sm shadow-[0_0_30px_-5px_rgba(210,187,255,0.4)] hover:scale-105 transition-all">
            <span className="material-symbols-outlined">terminal</span>
            Login with GitHub
          </Link>
          <Link href="/dashboard" className="px-unit-xl py-4 rounded-xl glass-panel text-on-surface font-semibold border-white/10 hover:bg-white/5 transition-all">
            View Demo Universe
          </Link>
        </div>
      </div>
    </main>
  );
}
