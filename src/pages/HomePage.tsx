import React, { useState } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { QuickStatsData } from '@/types/hero';

const MOCK_HERO_STATS: QuickStatsData = {
  topSeed: {
    name: 'Alex Perez',
    winRate: 81.3,
    matches: 32,
  },
  hotStreak: {
    name: 'Jordan Lee',
    streakCount: 6,
  },
  latestMatch: {
    type: 'Doubles',
    winners: ['Alex P.', 'Sam T.'],
    losers: ['Jordan L.', 'Casey M.'],
    score: '11 - 9',
    timeAgo: '12m ago',
  },
};

export const HomePage: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'singles' | 'doubles'>('doubles');
  const [activeTimeframe, setActiveTimeframe] = useState<'all-time' | 'month'>('all-time');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <HeroSection
        groupName="Metro Pickleball Club"
        lastUpdatedText="12 mins ago"
        activePlayersCount={14}
        stats={MOCK_HERO_STATS}
        activeMode={activeMode}
        onModeChange={setActiveMode}
        activeTimeframe={activeTimeframe}
        onTimeframeChange={setActiveTimeframe}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Leaderboard Table Section */}
      <div className="mt-6 rounded-2xl border bg-card p-6 text-card-foreground shadow-sm">
        <p className="text-sm text-muted-foreground">
          Leaderboard query active: <span className="font-semibold text-foreground">{activeMode}</span> •{' '}
          <span className="font-semibold text-foreground">{activeTimeframe}</span>
          {searchQuery && (
            <span>
              {' '}
              • Filtered by "<span className="font-semibold text-foreground">{searchQuery}</span>"
            </span>
          )}
        </p>
      </div>
    </>
  );
};

export default HomePage;