import { AchievementCard } from "@/components/ui/achievement-card";

export default function AchievementsPage() {
  return (
    <div className="max-w-container-max mx-auto px-gutter py-unit-xxl">
      <header className="mb-unit-xxl">
        <h1 className="font-display-xl text-display-xl text-on-surface mb-unit-sm">Hall of Honor</h1>
        <p className="text-on-surface-variant font-body-lg max-w-2xl">Your legacy across the GitVerse, preserved in hyper-realistic glass relics.</p>
      </header>

      <section className="mb-unit-xxl">
        <div className="flex items-center gap-unit-md mb-unit-lg">
          <span className="material-symbols-outlined text-secondary">explore</span>
          <h2 className="font-headline-lg text-headline-lg">Voyage</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-unit-lg">
          <AchievementCard title="First Frontier" date="Oct 2023" icon="🚀" rarity="rare" />
          <AchievementCard title="Nebula Pilot" date="Dec 2023" icon="🛸" rarity="epic" />
          <AchievementCard title="Galactic Dev" locked progress={65} icon="" rarity="common" />
          <AchievementCard title="Black Hole Survivor" locked progress={15} icon="" rarity="common" />
        </div>
      </section>
    </div>
  );
}
