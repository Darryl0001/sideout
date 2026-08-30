import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import type { Player, Match } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface LeaderboardTableProps {
  players: Player[];
  matches: Match[];
}

type FormatFilter = 'all' | 'singles' | 'doubles';

interface LeaderboardEntry {
  player: Player;
  wins: number;
  losses: number;
  totalMatches: number;
  winRate: number;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const filterOptions: { value: FormatFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'singles', label: 'Singles' },
  { value: 'doubles', label: 'Doubles' },
];

export function LeaderboardTable({ players, matches }: LeaderboardTableProps) {
  const [format, setFormat] = useState<FormatFilter>('all');

  const standings = useMemo<LeaderboardEntry[]>(() => {
    const statsMap = new Map<string, { wins: number; losses: number; totalMatches: number }>();

    players.forEach((player) => {
      statsMap.set(player.id, { wins: 0, losses: 0, totalMatches: 0 });
    });

    const filteredMatches = format === 'all' ? matches : matches.filter((m) => m.matchType === format);

    filteredMatches.forEach((match) => {
      const team1Won = match.winningTeam === 1;

      match.team1.forEach((player) => {
        const stats = statsMap.get(player.id);
        if (!stats) return;
        stats.totalMatches += 1;
        if (team1Won) stats.wins += 1;
        else stats.losses += 1;
      });

      match.team2.forEach((player) => {
        const stats = statsMap.get(player.id);
        if (!stats) return;
        stats.totalMatches += 1;
        if (team1Won) stats.losses += 1;
        else stats.wins += 1;
      });
    });

    return players
      .map((player) => {
        const stats = statsMap.get(player.id) ?? { wins: 0, losses: 0, totalMatches: 0 };
        const winRate = stats.totalMatches > 0 ? (stats.wins / stats.totalMatches) * 100 : 0;
        return { player, ...stats, winRate };
      })
      .sort((a, b) => {
        if (b.winRate !== a.winRate) return b.winRate - a.winRate;
        if (b.wins !== a.wins) return b.wins - a.wins;
        return b.totalMatches - a.totalMatches;
      });
  }, [players, matches, format]);

  return (
    <Card className="overflow-hidden rounded-2xl border-border/70 bg-card shadow-none">
      <CardHeader className="border-b border-border/60 px-5 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <Trophy className="size-4 text-muted-foreground" />
            Leaderboard
          </CardTitle>

          {/* Sliding Pill Tabs */}
          <div className="relative flex h-8 shrink-0 rounded-lg bg-muted p-0.5">
            {filterOptions.map((option) => {
              const isSelected = format === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormat(option.value)}
                  className="relative rounded-md px-3 text-xs font-medium transition-colors"
                >
                  {isSelected && (
                    <motion.div
                      layoutId="adminLeaderboardTabBg"
                      className="absolute inset-0 rounded-md bg-background shadow-sm"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className={`relative z-10 ${isSelected ? 'font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-16 px-5 text-xs font-medium text-muted-foreground">#</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Player</TableHead>
                <TableHead className="text-right text-xs font-medium text-muted-foreground">Win rate</TableHead>
                <TableHead className="text-right text-xs font-medium text-muted-foreground">Record</TableHead>
                <TableHead className="w-24 text-right pr-5 text-xs font-medium text-muted-foreground">Matches</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <AnimatePresence mode="popLayout">
                {standings.map((entry, index) => {
                  const rank = index + 1;
                  const isTopThree = rank <= 3;

                  return (
                    <motion.tr
                      key={entry.player.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                      className="group border-b border-border/60 transition-colors hover:bg-muted/30"
                    >
                      <TableCell className="px-5">
                        <span className={isTopThree ? 'text-sm font-semibold text-foreground' : 'text-sm tabular-nums text-muted-foreground'}>
                          {rank}
                        </span>
                      </TableCell>

                      <TableCell>
                        <Link to={`/p/${entry.player.slug}`} className="group/player flex w-fit items-center gap-3">
                          <Avatar className="size-8 transition-transform duration-200 group-hover/player:scale-105">
                            <AvatarImage src={entry.player.avatarUrl} alt={entry.player.displayName} />
                            <AvatarFallback className="bg-muted text-[10px] font-medium text-muted-foreground">
                              {getInitials(entry.player.displayName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate text-sm font-medium text-foreground">{entry.player.displayName}</span>
                              <ArrowUpRight className="size-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/player:opacity-100" />
                            </div>
                            <span className="block truncate text-xs text-muted-foreground">@{entry.player.slug}</span>
                          </div>
                        </Link>
                      </TableCell>

                      <TableCell className="text-right">
                        <span className="text-sm font-medium tabular-nums text-foreground">{entry.winRate.toFixed(1)}%</span>
                      </TableCell>

                      <TableCell className="text-right">
                        <span className="text-sm tabular-nums">
                          <span className="text-foreground">{entry.wins}</span>
                          <span className="mx-1.5 text-muted-foreground/40">–</span>
                          <span className="text-muted-foreground">{entry.losses}</span>
                        </span>
                      </TableCell>

                      <TableCell className="pr-5 text-right">
                        <span className="text-sm tabular-nums text-muted-foreground">{entry.totalMatches}</span>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>

              {standings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-sm font-medium text-foreground">No players yet</p>
                      <p className="mt-1 text-xs text-muted-foreground">Players will appear here once they are added.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}