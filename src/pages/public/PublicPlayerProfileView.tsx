import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

import { useData } from '@/context/DataContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RankMark } from '@/components/public/player/RankMark';
import { MatchBreakdownCard } from '@/components/public/player/MatchBreakdownCard';
import { MatchHistoryRow } from '@/components/public/player/MatchHistoryRow';
import { getInitials, formatDate, getRankStyle } from '@/lib/player-utils';

export function PublicPlayerProfileView() {
  const { playerId } = useParams<{ playerId: string }>();
  const { players, matches } = useData();

  const player = useMemo(() => {
    return players.find(
      (p) =>
        p.id === playerId ||
        p.slug === playerId ||
        p.name?.toLowerCase().replaceAll(' ', '-') === playerId
    );
  }, [players, playerId]);

  const playerMatches = useMemo(() => {
    if (!player) return [];
    return matches
      .filter(
        (m) =>
          m.team1.some((p) => p.id === player.id) ||
          m.team2.some((p) => p.id === player.id)
      )
      .sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime());
  }, [matches, player]);

  const stats = useMemo(() => {
    if (!player) return { wins: 0, losses: 0, total: 0, winRate: 0, singlesWins: 0, doublesWins: 0, singlesMatches: 0, doublesMatches: 0 };

    let wins = 0;
    let losses = 0;
    let singlesWins = 0;
    let doublesWins = 0;
    let singlesMatches = 0;
    let doublesMatches = 0;

    playerMatches.forEach((match) => {
      const inTeam1 = match.team1.some((p) => p.id === player.id);
      const playerWon =
        (inTeam1 && match.winningTeam === 1) || (!inTeam1 && match.winningTeam === 2);

      if (match.matchType === 'singles') singlesMatches++;
      else doublesMatches++;

      if (playerWon) {
        wins++;
        if (match.matchType === 'singles') singlesWins++;
        else doublesWins++;
      } else {
        losses++;
      }
    });

    const total = wins + losses;
    return {
      wins,
      losses,
      total,
      winRate: total > 0 ? (wins / total) * 100 : 0,
      singlesWins,
      doublesWins,
      singlesMatches,
      doublesMatches,
    };
  }, [player, playerMatches]);

  if (!player) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-xl font-semibold tracking-tight">Player not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">The requested player profile doesn't exist.</p>
        <Link
          to="/leaderboard"
          className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to leaderboard
        </Link>
      </main>
    );
  }

  const playerName = player.displayName || player.name;
  const rank = player.stats.rank;

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Navigation */}
      <div className="mb-8">
        <Link
          to="/leaderboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
        </Link>
      </div>

      {/* Header */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="border-b border-border pb-8"
      >
        <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Avatar className="size-20 shrink-0 border border-border sm:size-24">
                <AvatarImage src={player.avatarUrl} alt={playerName} />
                <AvatarFallback className="bg-muted text-lg font-semibold text-muted-foreground">
                  {getInitials(playerName)}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
                {playerName}
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">@{player.slug}</p>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Playing since {formatDate(player.createdAt)}
              </p>
            </div>
          </div>

          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
            className="sm:text-right"
          >
            <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] sm:justify-end ${getRankStyle(rank)}`}>
              <RankMark rank={rank} />
              <span>{rank}</span>
            </div>
            <div className="mt-1 flex items-baseline gap-2 sm:justify-end">
              <span className="text-4xl font-semibold tracking-tight tabular-nums">
                {player.stats.rating.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">rating</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Core Stats Bar */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } }
        }}
        className="grid grid-cols-2 divide-x border-b border-border sm:grid-cols-4"
      >
        {[
          { label: 'Record', value: <>{stats.wins}<span className="mx-1 text-muted-foreground/40">–</span><span className="text-muted-foreground">{stats.losses}</span></> },
          { label: 'Win rate', value: `${stats.winRate.toFixed(1)}%` },
          { label: 'Matches', value: stats.total },
          { label: 'Wins', value: stats.wins }
        ].map((item, index) => (
          <motion.div 
            key={item.label}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 }
            }}
            className={`py-5 ${index % 2 === 0 ? 'pr-4 sm:px-5' : 'pl-4 sm:px-5'} ${index >= 2 ? 'border-t border-border sm:border-t-0' : ''}`}
          >
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{item.label}</p>
            <p className="mt-1.5 text-xl font-semibold tracking-tight tabular-nums">{item.value}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Match Breakdown */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-8"
      >
        <div className="mb-4">
          <h2 className="text-sm font-semibold tracking-tight">Match breakdown</h2>
          <p className="mt-1 text-xs text-muted-foreground">Performance across singles and doubles.</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MatchBreakdownCard label="Singles" wins={stats.singlesWins} totalMatches={stats.singlesMatches} />
          <MatchBreakdownCard label="Doubles" wins={stats.doublesWins} totalMatches={stats.doublesMatches} />
        </div>
      </motion.section>

      {/* Match History */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-10"
      >
        <div className="flex items-end justify-between border-b border-border pb-3">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Match history</h2>
            <p className="mt-1 text-xs text-muted-foreground">Recent recorded matches.</p>
          </div>
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {playerMatches.length} played
          </span>
        </div>

        {playerMatches.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            No match history recorded yet.
          </div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
            className="divide-y divide-border"
          >
            {playerMatches.map((match) => (
              <motion.div
                key={match.id}
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 }
                }}
              >
                <MatchHistoryRow match={match} currentPlayer={player} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>
    </motion.main>
  );
}