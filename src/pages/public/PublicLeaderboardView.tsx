import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';
import type { Player, Match } from '@/types';

const MotionLink = motion(Link);

interface LeaderboardPlayer {
  id: string;
  rank: number;
  name: string;
  avatar?: string;
  rating: number;
  wins: number;
  losses: number;
  totalMatches: number;
  winRate: number;
}

// Calculate Elo rating & record stats dynamically from matches
function calculateLeaderboard(
  allPlayers: Player[],
  matches: Match[],
  mode: 'singles' | 'doubles'
): LeaderboardPlayer[] {
  const K = 32;
  const DEFAULT_RATING = 1200;

  const statsMap = new Map<
    string,
    { rating: number; wins: number; losses: number }
  >();

  allPlayers.forEach((p) => {
    statsMap.set(p.id, {
      rating: p.rating ?? DEFAULT_RATING,
      wins: 0,
      losses: 0,
    });
  });

  const filteredMatches = matches
    .filter((m) => m.matchType === mode)
    .sort(
      (a, b) =>
        new Date(a.playedAt).getTime() - new Date(b.playedAt).getTime()
    );

  filteredMatches.forEach((match) => {
    const team1Ids = match.team1.map((p) => p.id);
    const team2Ids = match.team2.map((p) => p.id);

    const team1Won = match.winningTeam === 1;

    const team1Ratings = team1Ids.map(
      (id) => statsMap.get(id)?.rating ?? DEFAULT_RATING
    );
    const team2Ratings = team2Ids.map(
      (id) => statsMap.get(id)?.rating ?? DEFAULT_RATING
    );

    const avgRating1 =
      team1Ratings.reduce((a, b) => a + b, 0) / (team1Ratings.length || 1);
    const avgRating2 =
      team2Ratings.reduce((a, b) => a + b, 0) / (team2Ratings.length || 1);

    const expected1 = 1 / (1 + Math.pow(10, (avgRating2 - avgRating1) / 400));
    const expected2 = 1 - expected1;

    const actual1 = team1Won ? 1 : 0;
    const actual2 = team1Won ? 0 : 1;

    team1Ids.forEach((id) => {
      const current = statsMap.get(id) ?? {
        rating: DEFAULT_RATING,
        wins: 0,
        losses: 0,
      };
      const newRating = Math.round(current.rating + K * (actual1 - expected1));
      statsMap.set(id, {
        rating: newRating,
        wins: current.wins + (team1Won ? 1 : 0),
        losses: current.losses + (team1Won ? 0 : 1),
      });
    });

    team2Ids.forEach((id) => {
      const current = statsMap.get(id) ?? {
        rating: DEFAULT_RATING,
        wins: 0,
        losses: 0,
      };
      const newRating = Math.round(current.rating + K * (actual2 - expected2));
      statsMap.set(id, {
        rating: newRating,
        wins: current.wins + (team1Won ? 0 : 1),
        losses: current.losses + (team1Won ? 1 : 0),
      });
    });
  });

  const leaderboard: LeaderboardPlayer[] = allPlayers
    .map((player) => {
      const stats = statsMap.get(player.id) ?? {
        rating: DEFAULT_RATING,
        wins: 0,
        losses: 0,
      };
      const total = stats.wins + stats.losses;
      return {
        id: player.id,
        rank: 0,
        name: player.displayName || player.name || 'Unknown Player',
        avatar: player.avatarUrl,
        rating: stats.rating,
        wins: stats.wins,
        losses: stats.losses,
        totalMatches: total,
        winRate: total > 0 ? (stats.wins / total) * 100 : 0,
      };
    })
    .filter((p) => p.totalMatches > 0)
    .sort((a, b) => b.rating - a.rating || b.winRate - a.winRate);

  return leaderboard.map((player, index) => ({
    ...player,
    rank: index + 1,
  }));
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: { duration: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 17,
    },
  },
};

export function PublicLeaderboardView() {
  const { players: rawPlayers, matches } = useData();
  const [mode, setMode] = useState<'singles' | 'doubles'>('singles');

  const leaderboard = useMemo(
    () => calculateLeaderboard(rawPlayers, matches, mode),
    [rawPlayers, matches, mode]
  );

  const leader = leaderboard[0];
  const rest = leaderboard.slice(1);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {/* Header */}
      <header className="border-b border-border pb-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Leaderboard
            </h1>
          </div>

          {/* Mode Switcher */}
          <div className="relative flex self-start rounded-lg border border-border bg-muted/40 p-1 sm:self-auto">
            {(['singles', 'doubles'] as const).map((type) => {
              const isActive = mode === type;
              return (
                <Button
                  key={type}
                  variant="ghost"
                  size="sm"
                  onClick={() => setMode(type)}
                  className={[
                    'relative h-8 rounded-md px-4 text-xs font-medium transition-colors z-10',
                    isActive
                      ? 'text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-transparent',
                  ].join(' ')}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 z-[-1] rounded-md bg-background shadow-sm"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 32,
                      }}
                    />
                  )}
                  {type === 'singles' ? 'Singles' : 'Doubles'}
                </Button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Dynamic Data Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {leaderboard.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No recorded matches found for {mode}.
            </div>
          ) : (
            <>
              {/* #01 Current Leader Card Spotlight */}
              {leader && (
                <section className="border-b border-border py-8">
                  <motion.div
                    className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between rounded-xl p-3 sm:p-4 transition-colors"
                    variants={itemVariants}
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="flex items-center gap-5">
                      <motion.div
                        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-foreground text-background"
                        initial={{ rotate: -15, scale: 0.9 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                      >
                        <Trophy className="size-5" />
                      </motion.div>

                      <Avatar className="size-16 border border-border sm:size-20">
                        <AvatarImage src={leader.avatar} alt={leader.name} />
                        <AvatarFallback>{leader.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                          #01 · Current leader
                        </p>

                        <Link
                          to={`/players/${leader.id}`}
                          className="text-xl font-semibold tracking-tight hover:underline"
                        >
                          {leader.name}
                        </Link>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {leader.wins}W · {leader.losses}L ({leader.winRate.toFixed(1)}% WR)
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p className="font-mono text-4xl font-semibold tracking-tight tabular-nums">
                        {leader.rating}
                      </p>

                      <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                        Rating Points
                      </p>
                    </div>
                  </motion.div>
                </section>
              )}

              {/* Ranking Table */}
              {rest.length > 0 && (
                <section className="pt-8">
                  <div className="mb-3 grid grid-cols-[52px_minmax(0,1fr)_90px_100px_90px] items-center px-4 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:grid-cols-[60px_minmax(0,1fr)_120px_110px_100px]">
                    <span>Rank</span>
                    <span>Player</span>
                    <span className="text-right">Record</span>
                    <span className="text-right">Win Rate</span>
                    <span className="text-right">Rating</span>
                  </div>

                  <div className="divide-y divide-border border-y border-border">
                    {rest.map((player) => (
                      <MotionLink
                        key={player.id}
                        to={`/players/${player.id}`}
                        className="group grid grid-cols-[52px_minmax(0,1fr)_90px_100px_90px] items-center px-4 py-4 transition-colors hover:bg-muted/40 sm:grid-cols-[60px_minmax(0,1fr)_120px_110px_100px]"
                        variants={itemVariants}
                        whileHover={{ x: 4, transition: { duration: 0.1 } }}
                        whileTap={{ scale: 0.998 }}
                      >
                        {/* Rank */}
                        <span className="font-mono text-xs tabular-nums text-muted-foreground">
                          {String(player.rank).padStart(2, '0')}
                        </span>

                        {/* Player Details */}
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar className="size-9 border border-border shrink-0">
                            <AvatarImage src={player.avatar} alt={player.name} />
                            <AvatarFallback>{player.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium group-hover:underline">
                              {player.name}
                            </p>

                            <p className="text-[11px] text-muted-foreground">
                              {player.totalMatches} matches
                            </p>
                          </div>
                        </div>

                        {/* Record */}
                        <span className="text-right text-xs text-muted-foreground">
                          {player.wins}W · {player.losses}L
                        </span>

                        {/* Win Rate */}
                        <span className="text-right text-xs text-muted-foreground font-mono tabular-nums">
                          {player.winRate.toFixed(1)}%
                        </span>

                        {/* Rating */}
                        <div className="text-right">
                          <span className="font-mono text-sm font-semibold tabular-nums">
                            {player.rating}
                          </span>
                        </div>
                      </MotionLink>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 text-xs text-muted-foreground">
                    <span>{leaderboard.length} players ranked</span>
                    <span>Ratings calculated via match outcomes</span>
                  </div>
                </section>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}