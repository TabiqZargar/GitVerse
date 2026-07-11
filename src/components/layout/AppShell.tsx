import { TopNav } from "./TopNav";
import { SideNav } from "./SideNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="noise-overlay" aria-hidden="true" />
      <div className="aurora-bg" aria-hidden="true" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <TopNav />
      <div className="flex">
        <SideNav />
        <main id="main-content" tabIndex={-1} className="flex-1 pt-[90px] xl:pl-20 outline-none transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
