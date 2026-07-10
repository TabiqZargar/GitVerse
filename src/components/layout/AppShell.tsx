import { TopNav } from "./TopNav";
import { SideNav } from "./SideNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="noise-overlay" />
      <TopNav />
      <div className="flex">
        <SideNav />
        <main className="flex-1 pt-[100px] xl:pl-64">
          {children}
        </main>
      </div>
    </div>
  );
}
