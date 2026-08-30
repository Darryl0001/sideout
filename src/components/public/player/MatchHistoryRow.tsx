import { motion } from 'framer-motion';
import { formatDate } from '@/lib/player-utils';
import type { Match, Player } from '@/types';

interface MatchHistoryRowProps {
  match: Match;
  currentPlayer: Player;
}

export function MatchHistoryRow({ match, currentPlayer }: MatchHistoryRowProps) {
  const inTeam1 = match.team1.some((p) => p.id === currentPlayer.id);
  const playerWon =
    (inTeam1 && match.winningTeam === 1) || (!inTeam1 && match.winningTeam === 2);
  const opponents = inTeam1 ? match.team2 : match.team1;

  return (
    <motion.div 
      whileHover={{ x: 3, backgroundColor: 'var(--muted-50, rgba(0, 0, 0, 0.015))' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="flex items-center justify-between gap-4 py-5 px-1 rounded-lg transition-colors"
    >
      <div className="flex min-w-0 items-center gap-3">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className={[
            'flex size-8 shrink-0 items-center justify-center rounded-full text-[9px] font-bold uppercase tracking-wide',
            playerWon
              ? 'bg-foreground text-background'
              : 'border border-border text-muted-foreground',
          ].join(' ')}
        >
          {playerWon ? 'W' : 'L'}
        </motion.div>

        <div className="min-w-0">
          <p className="truncate text-xs font-medium">
            vs {opponents.map((p) => p.displayName || p.displayName).join(' & ')}
          </p>
          <p className="mt-1 truncate text-[11px] text-muted-foreground">
            {match.matchType} · {match.location?.name || 'Court'} · {formatDate(match.playedAt)}
          </p>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="font-mono text-sm font-semibold tabular-nums">
          {match.team1Score}
          <span className="mx-1.5 text-muted-foreground/40">–</span>
          {match.team2Score}
        </p>
        <p
          className={[
            'mt-1 text-[10px] font-medium',
            playerWon ? 'text-foreground' : 'text-muted-foreground',
          ].join(' ')}
        >
          {playerWon ? 'Win' : 'Loss'}
        </p>
      </div>
    </motion.div>
  );
}