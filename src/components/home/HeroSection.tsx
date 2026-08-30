import React from 'react';
import { Crown, Flame, Search, Trophy, Zap } from 'lucide-react';
import { HeroSectionProps } from '@/types/hero';

export const HeroSection: React.FC<HeroSectionProps> = ({
  groupName,
  lastUpdatedText,
  activePlayersCount,
  stats,
  activeMode,
  onModeChange,
  activeTimeframe,
  onTimeframeChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <section className="space-y-6 pt-2 pb-6">
      {/* 1. Group Identity & Live Indicator */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {groupName}
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE
            </span>
          </div>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Last match logged {lastUpdatedText} • {activePlayersCount} Active Players
          </p>
        </div>
      </div>

      {/* 2. Quick-Stats Grid */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 scrollbar-none md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
        
        {/* Card 1: Current #1 Seed */}
        <div className="min-w-[280px] shrink-0 snap-center rounded-2xl border bg-card p-4 text-card-foreground shadow-sm transition-shadow hover:shadow-md md:min-w-0 md:shrink">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Current #1 Seed
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
              <Crown className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <p className="text-lg font-bold text-foreground">{stats.topSeed.name}</p>
              <p className="text-xs text-muted-foreground">{stats.topSeed.matches} matches played</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black tracking-tight text-amber-600 dark:text-amber-400">
                {stats.topSeed.winRate}%
              </span>
              <span className="block text-[10px] font-medium uppercase text-muted-foreground">Winrate</span>
            </div>
          </div>
        </div>

        {/* Card 2: Hot Streak */}
        <div className="min-w-[280px] shrink-0 snap-center rounded-2xl border bg-card p-4 text-card-foreground shadow-sm transition-shadow hover:shadow-md md:min-w-0 md:shrink">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Hot Streak
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <p className="text-lg font-bold text-foreground">{stats.hotStreak.name}</p>
              <p className="text-xs text-muted-foreground">Unbeaten run</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black tracking-tight text-orange-600 dark:text-orange-400">
                {stats.hotStreak.streakCount}W
              </span>
              <span className="block text-[10px] font-medium uppercase text-muted-foreground">Streak</span>
            </div>
          </div>
        </div>

        {/* Card 3: Latest Match Result */}
        <div className="min-w-[280px] shrink-0 snap-center rounded-2xl border bg-card p-4 text-card-foreground shadow-sm transition-shadow hover:shadow-md md:min-w-0 md:shrink">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Latest Match
              </span>
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                {stats.latestMatch.type}
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">{stats.latestMatch.timeAgo}</span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="truncate text-xs font-bold text-foreground">
                <span className="text-emerald-600 dark:text-emerald-400">W: </span>
                {stats.latestMatch.winners.join(', ')}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                <span>L: </span>
                {stats.latestMatch.losers.join(', ')}
              </p>
            </div>
            <div className="rounded-lg bg-muted px-2.5 py-1 text-right">
              <span className="text-base font-extrabold tracking-tight text-foreground">
                {stats.latestMatch.score}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Sticky Filter Toolbar */}
      <div className="sticky top-16 z-40 rounded-2xl border bg-background/95 p-2 backdrop-blur-md shadow-sm">
        <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
          
          {/* Game Mode Pills */}
          <div className="flex rounded-xl bg-muted/70 p-1 border">
            <button
              onClick={() => onModeChange('singles')}
              className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all md:flex-none ${
                activeMode === 'singles'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Singles (1v1)
            </button>
            <button
              onClick={() => onModeChange('doubles')}
              className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all md:flex-none ${
                activeMode === 'doubles'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Doubles (2v2)
            </button>
          </div>

          {/* Timeframe & Search Input */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-muted/70 p-1 border">
              <button
                onClick={() => onTimeframeChange('all-time')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeTimeframe === 'all-time'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All-Time
              </button>
              <button
                onClick={() => onTimeframeChange('month')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeTimeframe === 'month'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                This Month
              </button>
            </div>

            <div className="relative flex-1 md:w-56">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search player..."
                className="w-full rounded-xl border bg-background py-1.5 pl-8 pr-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};