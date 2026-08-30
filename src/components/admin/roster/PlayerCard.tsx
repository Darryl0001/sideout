import {
  Swords,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
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

import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PlayerCardProps {
  player: Player;
  onEdit: (player: Player) => void;
  onDelete: (playerId: string) => void;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/* -------------------------------------------------------------------------- */
/* Rank                                                                       */
/* -------------------------------------------------------------------------- */

function RankMark({ rank }: { rank: PlayerRank }) {
  switch (rank) {
    case 'Diamond':
      return <Gem className="size-3.5" />;

    case 'Platinum':
      return <Crown className="size-3.5" />;

    case 'Gold':
      return <Trophy className="size-3.5" />;

    case 'Silver':
      return <Medal className="size-3.5" />;

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

/* -------------------------------------------------------------------------- */
/* Player Card                                                                */
/* -------------------------------------------------------------------------- */

export function PlayerCard({
  player,
  onEdit,
  onDelete,
}: PlayerCardProps) {
  const handleCopyLink = async (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();

    const profileUrl = `${window.location.origin}/p/${player.slug}`;

    try {
      await navigator.clipboard.writeText(profileUrl);
    } catch {
      // Clipboard access can fail in insecure contexts.
    }
  };

  const handleEdit = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
    onEdit(player);
  };

  const handleDelete = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
    onDelete(player.id);
  };

  return (
    <Card className="group overflow-hidden rounded-2xl border-border/70 bg-card shadow-none transition-colors hover:border-border">
      <CardContent className="p-5">

        {/* ---------------------------------------------------------------- */}
        {/* Player identity                                                   */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="size-10 shrink-0">
              <AvatarImage
                src={player.avatarUrl}
                alt={player.displayName}
              />

              <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
                {getInitials(player.displayName)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold tracking-tight text-foreground">
                {player.displayName}
              </h3>

              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                @{player.slug}
              </p>
            </div>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 -mr-1 -mt-1 rounded-lg text-muted-foreground opacity-100 transition-opacity hover:bg-muted hover:text-foreground sm:opacity-0 sm:group-hover:opacity-100"
                aria-label={`Actions for ${player.displayName}`}
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-40"
            >
              <DropdownMenuItem
                onClick={handleEdit}
                className="gap-2 text-xs"
              >
                <Pencil className="size-3.5" />
                Edit profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleCopyLink}
                className="gap-2 text-xs"
              >
                <Copy className="size-3.5" />
                Copy profile link
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleDelete}
                className="gap-2 text-xs text-destructive focus:text-destructive"
              >
                <Trash2 className="size-3.5" />
                Remove player
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Rating                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div className="mt-7">

          {/* Rank */}
          <div
            className={[
              'flex items-center gap-1.5 text-[11px] font-semibold',
              'uppercase tracking-[0.12em]',
              getRankStyle(player.stats.rank),
            ].join(' ')}
          >
            <RankMark rank={player.stats.rank} />

            <span>{player.stats.rank}</span>
          </div>

          {/* Rating */}
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
              {player.stats.rating.toLocaleString()}
            </span>

            <span className="text-xs text-muted-foreground">
              rating
            </span>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Stats                                                             */}
        {/* ---------------------------------------------------------------- */}

        <div className="mt-6 grid grid-cols-2 border-t border-border/60 pt-4">

          {/* Record */}
          <div>
            <p className="text-xs text-muted-foreground">
              Record
            </p>

            <p className="mt-1 text-sm font-medium tabular-nums text-foreground">
              {player.stats.wins}W

              <span className="mx-1 text-muted-foreground/40">
                –
              </span>

              <span className="text-muted-foreground">
                {player.stats.losses}L
              </span>

              <span className="ml-1.5 text-xs text-muted-foreground/70">
                {player.stats.winRate.toFixed(1)}%
              </span>
            </p>
          </div>

          {/* Matches */}
          <div className="border-l border-border/60 pl-4">
            <p className="text-xs text-muted-foreground">
              Matches
            </p>

            <div className="mt-1 flex items-center gap-1.5">
              <Swords className="size-3.5 text-muted-foreground/60" />

              <span className="text-sm font-medium tabular-nums text-foreground">
                {player.stats.totalMatches}
              </span>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}