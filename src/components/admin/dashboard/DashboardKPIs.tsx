import { Activity, Swords, Trophy, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Player, Match } from '@/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DashboardKPIsProps {
  players: Player[];
  matches: Match[];
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 28 },
  },
};

export function DashboardKPIs({ players, matches }: DashboardKPIsProps) {
  const totalPlayers = players.length;
  const totalMatches = matches.length;

  const singlesCount = matches.filter(
    (match) => match.matchType === 'singles'
  ).length;

  const doublesCount = matches.filter(
    (match) => match.matchType === 'doubles'
  ).length;

  const singlesPercentage =
    totalMatches > 0 ? Math.round((singlesCount / totalMatches) * 100) : 0;

  const doublesPercentage = totalMatches > 0 ? 100 - singlesPercentage : 0;

  const topPerformer = players.reduce<Player | null>((best, player) => {
    if (player.stats.totalMatches === 0) return best;
    if (!best) return player;
    return player.stats.winRate > best.stats.winRate ? player : best;
  }, null);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {/* Total Players */}
      <motion.div variants={cardVariants}>
        <Card className="rounded-2xl border-border/70 bg-card shadow-none transition-colors duration-200 hover:border-border">
          <CardHeader className="px-5 pb-3 pt-5">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              <span>Total players</span>
              <motion.div whileHover={{ scale: 1.15, rotate: 5 }} transition={{ type: 'spring', stiffness: 400 }}>
                <Users className="size-4 text-muted-foreground/60" />
              </motion.div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-semibold tracking-tight">{totalPlayers}</p>
                <p className="mt-1 text-xs text-muted-foreground">Registered players</p>
              </div>
              <span className="text-xs text-muted-foreground">Roster</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Matches Played */}
      <motion.div variants={cardVariants}>
        <Card className="rounded-2xl border-border/70 bg-card shadow-none transition-colors duration-200 hover:border-border">
          <CardHeader className="px-5 pb-3 pt-5">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              <span>Matches played</span>
              <motion.div whileHover={{ scale: 1.15, rotate: -10 }} transition={{ type: 'spring', stiffness: 400 }}>
                <Swords className="size-4 text-muted-foreground/60" />
              </motion.div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-semibold tracking-tight">{totalMatches}</p>
                <p className="mt-1 text-xs text-muted-foreground">Recorded matches</p>
              </div>
              <span className="text-xs text-muted-foreground">All time</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Match Format */}
      <motion.div variants={cardVariants}>
        <Card className="rounded-2xl border-border/70 bg-card shadow-none transition-colors duration-200 hover:border-border">
          <CardHeader className="px-5 pb-3 pt-5">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              <span>Match format</span>
              <motion.div whileHover={{ scale: 1.15 }} transition={{ type: 'spring', stiffness: 400 }}>
                <Activity className="size-4 text-muted-foreground/60" />
              </motion.div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium">Singles</span>
              <span className="text-sm text-muted-foreground">{singlesPercentage}%</span>
            </div>

            <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: singlesPercentage / 100 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
                className="h-full origin-left bg-foreground"
                style={{ width: '100%' }}
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{singlesCount} singles</span>
              <span>{doublesCount} doubles</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Performer */}
      <motion.div variants={cardVariants}>
        <Card className="rounded-2xl border-border/70 bg-card shadow-none transition-colors duration-200 hover:border-border">
          <CardHeader className="px-5 pb-3 pt-5">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              <span>Top performer</span>
              <motion.div whileHover={{ scale: 1.2, rotate: 12 }} transition={{ type: 'spring', stiffness: 400 }}>
                <Trophy className="size-4 text-muted-foreground/60" />
              </motion.div>
            </CardTitle>
          </CardHeader>

          <CardContent className="px-5 pb-5">
            {topPerformer ? (
              <div className="flex items-center gap-3">
                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400 }}>
                  <Avatar className="size-10 border border-border/60">
                    <AvatarImage src={topPerformer.avatarUrl} alt={topPerformer.displayName} />
                    <AvatarFallback className="text-xs font-medium">
                      {getInitials(topPerformer.displayName)}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{topPerformer.displayName}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {topPerformer.stats.winRate.toFixed(1)}% win rate
                    <span className="mx-1.5 text-border">·</span>
                    {topPerformer.stats.totalMatches} matches
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                  <Trophy className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">No performer yet</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Record a match to get started</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}