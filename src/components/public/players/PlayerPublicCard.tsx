import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Swords,
  Trophy,
  Medal,
  Gem,
  Crown,
} from 'lucide-react';

import type { Player, PlayerRank } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

interface PlayerPublicCardProps {
  player: Player;
  rankIndex?: number;
  index: number;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function RankMark({ rank }: { rank: PlayerRank }) {
  switch (rank) {
    case 'Diamond':
      return <Gem className="size-3.5" />;
    case 'Platinum':
      return <Crown className="size-3.5" />;
    case 'Gold':
      return <Trophy className="size-3.5" />;
    case 'Silver':
    case 'Bronze':
    default:
      return <Medal className="size-3.5" />;
  }
}

function getRankStyle(rank: PlayerRank) {
  switch (rank) {
    case 'Diamond':
      return 'text-cyan-600 dark:text-cyan-400';
    case 'Platinum':
      return 'text-emerald-600 dark:text-emerald-400';
    case 'Gold':
      return 'text-amber-600 dark:text-amber-400';
    case 'Silver':
      return 'text-slate-500 dark:text-slate-300';
    case 'Bronze':
    default:
      return 'text-orange-700 dark:text-orange-400';
  }
}

export function PlayerPublicCard({
  player,
  rankIndex,
  index,
}: PlayerPublicCardProps) {
  const { stats } = player;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.96 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: index * 0.03, // Cascading stagger on mount
        }
      }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link
        to={`/p/${player.slug}`}
        className="group block h-full"
      >
        <Card className="h-full overflow-hidden rounded-2xl border-border/70 bg-card shadow-none transition-all duration-200 hover:border-border hover:shadow-md">
          <CardContent className="p-5">
            {/* Identity */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="size-10 shrink-0 transition-transform duration-200 group-hover:scale-105">
                  <AvatarImage
                    src={player.avatarUrl}
                    alt={player.displayName}
                  />
                  <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
                    {getInitials(player.displayName)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold tracking-tight text-foreground group-hover:underline">
                    {player.displayName}
                  </h3>

                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    @{player.slug}
                  </p>
                </div>
              </div>

              {/* Leaderboard Position */}
              {rankIndex !== undefined && (
                <span className="shrink-0 pt-0.5 text-xs font-medium tabular-nums text-muted-foreground">
                  #{rankIndex}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="mt-7">
              <div
                className={[
                  'flex items-center gap-1.5',
                  'text-[11px] font-semibold',
                  'uppercase tracking-[0.12em]',
                  getRankStyle(stats.rank),
                ].join(' ')}
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.3 }}
                >
                  <RankMark rank={stats.rank} />
                </motion.div>
                <span>{stats.rank}</span>
              </div>

              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
                  {stats.rating.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">
                  rating
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 border-t border-border/60 pt-4">
              <div>
                <p className="text-xs text-muted-foreground">Record</p>
                <p className="mt-1 text-sm font-medium tabular-nums text-foreground">
                  {stats.wins}W
                  <span className="mx-1 text-muted-foreground/40">–</span>
                  <span className="text-muted-foreground">{stats.losses}L</span>
                  <span className="ml-1.5 text-xs text-muted-foreground/70">
                    {stats.winRate.toFixed(1)}%
                  </span>
                </p>
              </div>

              <div className="border-l border-border/60 pl-4">
                <p className="text-xs text-muted-foreground">Matches</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <Swords className="size-3.5 text-muted-foreground/60" />
                  <span className="text-sm font-medium tabular-nums text-foreground">
                    {stats.totalMatches}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Affordance */}
            <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-3">
              <span className="text-[11px] text-muted-foreground">
                View profile
              </span>

              <ArrowUpRight
                className={[
                  'size-3.5 text-muted-foreground/50',
                  'transition-transform duration-200',
                  'group-hover:-translate-y-0.5',
                  'group-hover:translate-x-0.5',
                  'group-hover:text-foreground',
                ].join(' ')}
              />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}