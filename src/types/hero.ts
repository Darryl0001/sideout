export interface QuickStatsData {
  topSeed: {
    name: string;
    winRate: number;
    matches: number;
    avatarUrl?: string;
  };
  hotStreak: {
    name: string;
    streakCount: number;
    avatarUrl?: string;
  };
  latestMatch: {
    type: 'Singles' | 'Doubles';
    winners: string[];
    losers: string[];
    score: string;
    timeAgo: string;
  };
}

export interface HeroSectionProps {
  groupName: string;
  lastUpdatedText: string;
  activePlayersCount: number;
  stats: QuickStatsData;
  activeMode: 'singles' | 'doubles';
  onModeChange: (mode: 'singles' | 'doubles') => void;
  activeTimeframe: 'all-time' | 'month';
  onTimeframeChange: (tf: 'all-time' | 'month') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}