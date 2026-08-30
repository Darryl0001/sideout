import type { Match } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  User,
  Users,
  MapPin,
} from 'lucide-react';

interface MatchHistoryListProps {
  matches: Match[];
  onEdit?: (match: Match) => void;
  onDelete?: (matchId: string) => void;
}

function formatMatchDate(isoString: string) {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatMobileDate(isoString: string) {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function MatchHistoryList({
  matches,
  onEdit,
  onDelete,
}: MatchHistoryListProps) {
  if (matches.length === 0) {
    return (
      <Card className="rounded-xl border-dashed border-border/60 bg-muted/20 shadow-none">
        <CardContent className="flex min-h-28 items-center justify-center px-6 py-8">
          <p className="text-xs text-muted-foreground">
            No matches recorded yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const hasActions = Boolean(onEdit || onDelete);

  return (
    <div className="w-full space-y-2">
      {matches.map((match) => {
        const team1Won = match.winningTeam === 1;
        const team2Won = match.winningTeam === 2;

        const team1Names = match.team1
          .map((player) => player.displayName)
          .join(' & ');

        const team2Names = match.team2
          .map((player) => player.displayName)
          .join(' & ');

        return (
          <Card
            key={match.id}
            className="group overflow-hidden rounded-xl border-border/60 bg-card shadow-none transition-colors hover:border-border"
          >
            <CardContent className="p-0">
              {/* Desktop */}
              <div className="hidden min-h-[88px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-5 px-5 py-3.5 sm:grid">
                <TeamSide
                  players={match.team1}
                  names={team1Names}
                  isWinner={team1Won}
                />

                <DesktopScore
                  team1Score={match.team1Score}
                  team2Score={match.team2Score}
                  team1Won={team1Won}
                  team2Won={team2Won}
                  matchType={match.matchType}
                  locationName={match.location?.name}
                  playedAt={match.playedAt}
                />

                <div className="flex min-w-0 items-center justify-end gap-3">
                  <TeamSide
                    players={match.team2}
                    names={team2Names}
                    isWinner={team2Won}
                    align="right"
                  />

                  {hasActions && (
                    <MatchActions
                      match={match}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  )}
                </div>
              </div>

              {/* Mobile */}
              <div className="sm:hidden">
                <div className="relative px-3.5 pb-3.5 pt-4">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                    <MobileTeam
                      players={match.team1}
                      names={team1Names}
                      isWinner={team1Won}
                    />

                    <MobileScore
                      team1Score={match.team1Score}
                      team2Score={match.team2Score}
                      team1Won={team1Won}
                      team2Won={team2Won}
                    />

                    <MobileTeam
                      players={match.team2}
                      names={team2Names}
                      isWinner={team2Won}
                      align="right"
                    />
                  </div>

                  {hasActions && (
                    <div className="absolute right-2 top-2">
                      <MatchActions
                        match={match}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    </div>
                  )}
                </div>

                <MobileMetadata
                  matchType={match.matchType}
                  locationName={match.location?.name}
                  playedAt={match.playedAt}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Team                                                                     */
/* -------------------------------------------------------------------------- */

interface TeamSideProps {
  players: Match['team1'];
  names: string;
  isWinner: boolean;
  align?: 'left' | 'right';
}

function TeamSide({
  players,
  names,
  isWinner,
  align = 'left',
}: TeamSideProps) {
  const right = align === 'right';

  return (
    <div
      className={[
        'flex min-w-0 items-center gap-3',
        right ? 'justify-end' : 'justify-start',
      ].join(' ')}
    >
      {!right && (
        <AvatarStack
          players={players}
          isWinner={isWinner}
        />
      )}

      <p
        className={[
          'min-w-0 max-w-[220px] truncate text-sm',
          right ? 'text-right' : 'text-left',
          isWinner
            ? 'font-semibold text-foreground'
            : 'font-medium text-muted-foreground',
        ].join(' ')}
      >
        {names}
      </p>

      {right && (
        <AvatarStack
          players={players}
          isWinner={isWinner}
          reversed
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Desktop Score                                                              */
/* -------------------------------------------------------------------------- */

interface DesktopScoreProps {
  team1Score: number;
  team2Score: number;
  team1Won: boolean;
  team2Won: boolean;
  matchType: Match['matchType'];
  locationName?: string;
  playedAt: string;
}

function DesktopScore({
  team1Score,
  team2Score,
  team1Won,
  team2Won,
  matchType,
  locationName,
  playedAt,
}: DesktopScoreProps) {
  return (
    <div className="flex min-w-[170px] flex-col items-center text-center">
      <div className="flex items-center gap-2 font-mono text-lg font-semibold tabular-nums">
        <span
          className={
            team1Won ? 'text-foreground' : 'text-muted-foreground'
          }
        >
          {team1Score}
        </span>

        <span className="text-xs text-muted-foreground/35">
          —
        </span>

        <span
          className={
            team2Won ? 'text-foreground' : 'text-muted-foreground'
          }
        >
          {team2Score}
        </span>
      </div>

      <div className="mt-1 flex max-w-[240px] items-center gap-1.5 text-[10px] text-muted-foreground">
        {matchType === 'singles' ? (
          <User className="size-3 shrink-0" />
        ) : (
          <Users className="size-3 shrink-0" />
        )}

        <span className="capitalize">{matchType}</span>

        {locationName && (
          <>
            <span className="text-border">·</span>

            <MapPin className="size-3 shrink-0 text-muted-foreground/70" />

            <span className="max-w-[90px] truncate">
              {locationName}
            </span>
          </>
        )}

        <span className="text-border">·</span>

        <span className="shrink-0">
          {formatMatchDate(playedAt)}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Mobile Score                                                               */
/* -------------------------------------------------------------------------- */

interface MobileScoreProps {
  team1Score: number;
  team2Score: number;
  team1Won: boolean;
  team2Won: boolean;
}

function MobileScore({
  team1Score,
  team2Score,
  team1Won,
  team2Won,
}: MobileScoreProps) {
  return (
    <div className="flex min-w-[76px] flex-col items-center">
      <div className="flex items-center gap-1.5 font-mono text-xl font-semibold tabular-nums">
        <span
          className={
            team1Won ? 'text-foreground' : 'text-muted-foreground'
          }
        >
          {team1Score}
        </span>

        <span className="text-[10px] text-muted-foreground/35">
          —
        </span>

        <span
          className={
            team2Won ? 'text-foreground' : 'text-muted-foreground'
          }
        >
          {team2Score}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Mobile Team                                                                */
/* -------------------------------------------------------------------------- */

interface MobileTeamProps {
  players: Match['team1'];
  names: string;
  isWinner: boolean;
  align?: 'left' | 'right';
}

function MobileTeam({
  players,
  names,
  isWinner,
  align = 'left',
}: MobileTeamProps) {
  const right = align === 'right';

  return (
    <div
      className={[
        'flex min-w-0 items-center gap-2',
        right ? 'justify-end' : 'justify-start',
      ].join(' ')}
    >
      {!right && (
        <AvatarStack
          players={players}
          isWinner={isWinner}
          mobile
        />
      )}

      <p
        className={[
          'min-w-0 max-w-[92px] truncate text-xs',
          right ? 'text-right' : 'text-left',
          isWinner
            ? 'font-semibold text-foreground'
            : 'font-medium text-muted-foreground',
        ].join(' ')}
      >
        {names}
      </p>

      {right && (
        <AvatarStack
          players={players}
          isWinner={isWinner}
          reversed
          mobile
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Mobile Metadata                                                            */
/* -------------------------------------------------------------------------- */

interface MobileMetadataProps {
  matchType: Match['matchType'];
  locationName?: string;
  playedAt: string;
}

function MobileMetadata({
  matchType,
  locationName,
  playedAt,
}: MobileMetadataProps) {
  return (
    <div className="flex min-w-0 items-center border-t border-border/40 px-3.5 py-2">
      <div className="flex min-w-0 items-center gap-1.5 text-[10px] text-muted-foreground">
        {matchType === 'singles' ? (
          <User className="size-3 shrink-0" />
        ) : (
          <Users className="size-3 shrink-0" />
        )}

        <span className="capitalize">{matchType}</span>

        {locationName && (
          <>
            <span className="text-border">·</span>

            <MapPin className="size-3 shrink-0 text-muted-foreground/70" />

            <span className="max-w-[100px] truncate">
              {locationName}
            </span>
          </>
        )}

        <span className="text-border">·</span>

        <span className="shrink-0">
          {formatMobileDate(playedAt)}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Avatar Stack                                                               */
/* -------------------------------------------------------------------------- */

interface AvatarStackProps {
  players: Match['team1'];
  isWinner: boolean;
  reversed?: boolean;
  mobile?: boolean;
}

function AvatarStack({
  players,
  isWinner,
  reversed = false,
  mobile = false,
}: AvatarStackProps) {
  return (
    <div className="flex shrink-0 -space-x-2">
      {players.map((player, index) => (
        <Avatar
          key={player.id}
          className={[
            mobile ? 'size-8' : 'size-9',
            'border-2 border-background',
            index > 0 ? 'relative' : '',
            isWinner ? 'ring-1 ring-foreground/10' : '',
          ].join(' ')}
        >
          <AvatarImage
            src={player.avatarUrl}
            alt={player.displayName}
          />

          <AvatarFallback className="bg-muted text-[9px] font-medium text-muted-foreground">
            {getInitials(player.displayName)}
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Actions                                                                    */
/* -------------------------------------------------------------------------- */

interface MatchActionsProps {
  match: Match;
  onEdit?: (match: Match) => void;
  onDelete?: (matchId: string) => void;
  className?: string;
}

function MatchActions({
  match,
  onEdit,
  onDelete,
  className,
}: MatchActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={[
            'size-8 shrink-0 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground',
            className,
          ].join(' ')}
          aria-label="Match actions"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-32 rounded-lg"
      >
        {onEdit && (
          <DropdownMenuItem
            onClick={() => onEdit(match)}
            className="gap-2 text-xs"
          >
            <Pencil className="size-3.5" />
            Edit
          </DropdownMenuItem>
        )}

        {onDelete && (
          <DropdownMenuItem
            onClick={() => onDelete(match.id)}
            className="gap-2 text-xs text-destructive focus:text-destructive"
          >
            <Trash2 className="size-3.5" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}