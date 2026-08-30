import type { Player } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface RosterSummaryProps {
  players: Player[];
}

export function RosterSummary({ players }: RosterSummaryProps) {
  const totalPlayers = players.length;

  // Find player with highest win rate (min 1 match played to qualify)
  const topPerformer = players.reduce<Player | null>((best, current) => {
    if (current.stats.totalMatches === 0) return best;
    if (!best) return current;
    return current.stats.winRate > best.stats.winRate ? current : best;
  }, null);

  // Find player with most matches played
  const mostActive = players.reduce<Player | null>((most, current) => {
    if (!most) return current;
    return current.stats.totalMatches > most.stats.totalMatches ? current : most;
  }, null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
      {/* Total Registered Players */}
      <Card className="border-border/60 bg-card">
        <CardContent className="p-4 flex flex-col justify-between space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/70">
            Total Roster
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {totalPlayers}
            </span>
            <span className="text-xs font-semibold text-muted-foreground/60">
              Players
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Leader */}
      <Card className="border-border/60 bg-card">
        <CardContent className="p-4 flex flex-col justify-between space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/70">
            Win-Rate Leader
          </span>
          <div className="flex items-baseline justify-between gap-2 min-w-0">
            <span className="text-base font-bold text-foreground truncate">
              {topPerformer ? topPerformer.displayName : '—'}
            </span>
            {topPerformer && (
              <span className="text-base font-extrabold tracking-tight text-foreground shrink-0">
                {topPerformer.stats.winRate.toFixed(1)}%
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Most Active Player */}
      <Card className="border-border/60 bg-card">
        <CardContent className="p-4 flex flex-col justify-between space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/70">
            Most Active
          </span>
          <div className="flex items-baseline justify-between gap-2 min-w-0">
            <span className="text-base font-bold text-foreground truncate">
              {mostActive && mostActive.stats.totalMatches > 0
                ? mostActive.displayName
                : '—'}
            </span>
            {mostActive && mostActive.stats.totalMatches > 0 && (
              <span className="text-xs font-bold text-muted-foreground/70 shrink-0">
                {mostActive.stats.totalMatches} matches
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}