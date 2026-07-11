"use client";

export default function WrappedPage() {
  return (
    <main className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[160px] pointer-events-none"></div>
      
      <section className="relative z-10 w-full max-w-7xl px-gutter flex flex-col items-center text-center">
        <h1 className="font-display-xl text-[12vw] leading-none tracking-tighter text-glow-primary">
          842,000 <span className="block font-headline-lg text-primary/80">Commits</span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-unit-md w-full max-w-4xl mt-unit-xxl">
          <div className="glass-panel p-unit-lg rounded-xl">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Night Owl</h3>
            <p className="text-body-sm text-on-surface-variant">Most productive at 2 AM.</p>
          </div>
          <div className="glass-panel p-unit-lg rounded-xl bg-primary/5 border-primary/20">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Top 0.1%</h3>
            <p className="text-body-sm text-on-surface-variant">Global contributor titan.</p>
          </div>
          <div className="glass-panel p-unit-lg rounded-xl">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Main Stack</h3>
            <p className="text-body-sm text-on-surface-variant">TypeScript, WASM, K8s.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
