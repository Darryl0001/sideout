import { MapPin, Building2, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Location, Match } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface CourtDetailProps {
  court: Location;
  courtMatches: Match[];
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

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function CourtDetail({ court, courtMatches }: CourtDetailProps) {
  const isIndoor = court.courtType === 'indoor';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 px-6 pb-6"
    >
      {/* Header */}
      <SheetHeader className="space-y-3 text-left px-0">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide"
          >
            {isIndoor ? (
              <Building2 className="mr-1.5 size-3" />
            ) : (
              <Sun className="mr-1.5 size-3" />
            )}
            {court.courtType}
          </Badge>
        </div>

        <div>
          <SheetTitle className="text-xl font-semibold tracking-tight sm:text-2xl">
            {court.name}
          </SheetTitle>

          <SheetDescription className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground leading-relaxed sm:text-sm">
            <MapPin className="mt-0.5 size-3.5 shrink-0" />
            <span>{court.address || 'Address unavailable'}</span>
          </SheetDescription>
        </div>
      </SheetHeader>

      {/* Image */}
      {court.imageUrl && (
        <motion.div 
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="overflow-hidden rounded-xl border border-border/60"
        >
          <img
            src={court.imageUrl}
            alt={court.name}
            className="aspect-[16/9] w-full object-cover"
          />
        </motion.div>
      )}

      {/* Stats */}
      <div className="-mx-6 grid grid-cols-2 divide-x border-y border-border/60 px-6">
        <div className="py-3.5 pr-3">
          <p className="text-xs text-muted-foreground">Matches</p>
          <p className="mt-0.5 text-xl font-semibold tracking-tight tabular-nums sm:text-2xl">
            {courtMatches.length}
          </p>
        </div>

        <div className="py-3.5 pl-4">
          <p className="text-xs text-muted-foreground">Registered</p>
          <p className="mt-0.5 text-xs font-medium sm:text-sm">
            {formatDate(court.createdAt)}
          </p>
        </div>
      </div>

      {/* Activity / Matches */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Activity
            </p>
            <h3 className="mt-0.5 text-sm font-semibold tracking-tight sm:text-base">
              Recent matches
            </h3>
          </div>

          {courtMatches.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {courtMatches.length} recorded
            </span>
          )}
        </div>

        {courtMatches.length === 0 ? (
          <div className="border-y border-dashed border-border/60 py-8 text-center">
            <p className="text-xs text-muted-foreground sm:text-sm">
              No matches recorded at this court yet.
            </p>
          </div>
        ) : (
          <div className="-mx-6 divide-y border-y border-border/60 px-6">
            {courtMatches.slice(0, 5).map((match, i) => {
              const team1Won = match.winningTeam === 1;
              const team2Won = match.winningTeam === 2;

              return (
                <motion.div 
                  key={match.id} 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 + 0.1 }}
                  className="py-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    {/* Team 1 */}
                    <div className="flex flex-1 items-center gap-2 min-w-0">
                      <Avatar className="size-6 shrink-0 border border-border/50">
                        <AvatarImage
                          src={match.team1[0]?.avatarUrl}
                          alt={match.team1[0]?.displayName}
                        />
                        <AvatarFallback className="text-[8px]">
                          {getInitials(match.team1[0]?.displayName ?? '?')}
                        </AvatarFallback>
                      </Avatar>

                      <span
                        className={[
                          'truncate text-xs',
                          team1Won
                            ? 'font-semibold text-foreground'
                            : 'text-muted-foreground',
                        ].join(' ')}
                      >
                        {match.team1
                          .map((player) => player.displayName)
                          .join(' & ')}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="shrink-0 font-mono text-xs font-semibold tabular-nums px-1">
                      <span className={team1Won ? 'text-foreground' : 'text-muted-foreground'}>
                        {match.team1Score}
                      </span>
                      <span className="mx-1 text-muted-foreground/40">–</span>
                      <span className={team2Won ? 'text-foreground' : 'text-muted-foreground'}>
                        {match.team2Score}
                      </span>
                    </div>

                    {/* Team 2 */}
                    <div className="flex flex-1 items-center justify-end gap-2 min-w-0">
                      <span
                        className={[
                          'truncate text-right text-xs',
                          team2Won
                            ? 'font-semibold text-foreground'
                            : 'text-muted-foreground',
                        ].join(' ')}
                      >
                        {match.team2
                          .map((player) => player.displayName)
                          .join(' & ')}
                      </span>

                      <Avatar className="size-6 shrink-0 border border-border/50">
                        <AvatarImage
                          src={match.team2[0]?.avatarUrl}
                          alt={match.team2[0]?.displayName}
                        />
                        <AvatarFallback className="text-[8px]">
                          {getInitials(match.team2[0]?.displayName ?? '?')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>

                  <div className="mt-1.5 flex justify-center text-[10px] text-muted-foreground">
                    <span className="capitalize">{match.matchType}</span>
                    <span className="mx-1.5 text-border">·</span>
                    <span>
                      {new Date(match.playedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </motion.div>
  );
}