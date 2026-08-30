import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Match } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { TeamSide } from './TeamSide';
import { MatchMetadata } from './MatchMetadata';

interface MatchResultCardProps {
  match: Match;
  index?: number;
}

export function MatchResultCard({ match, index = 0 }: MatchResultCardProps) {
  const formattedTime = new Date(match.playedAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          type: 'spring',
          stiffness: 280,
          damping: 22,
          delay: index * 0.04,
        }
      }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Link to={`/matches/${match.id}`} className="group block">
        <Card className="overflow-hidden rounded-xl border-border/60 bg-card shadow-none transition-all duration-200 hover:border-border hover:bg-muted/10 hover:shadow-sm">
          <CardContent className="p-0">
            {/* Desktop View */}
            <div className="hidden min-h-[92px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-6 px-5 py-4 sm:grid">
              <TeamSide players={match.team1} isWinner={match.winningTeam === 1} />

              <div className="flex min-w-[180px] flex-col items-center text-center">
                <div className="flex items-center gap-2 font-mono text-xl font-semibold tabular-nums tracking-tight">
                  <motion.span 
                    initial={{ scale: match.winningTeam === 1 ? 1.15 : 1 }}
                    animate={{ scale: 1 }}
                    className={match.winningTeam === 1 ? 'text-foreground' : 'text-muted-foreground'}
                  >
                    {match.team1Score}
                  </motion.span>
                  <span className="text-xs text-muted-foreground/35">—</span>
                  <motion.span 
                    initial={{ scale: match.winningTeam === 2 ? 1.15 : 1 }}
                    animate={{ scale: 1 }}
                    className={match.winningTeam === 2 ? 'text-foreground' : 'text-muted-foreground'}
                  >
                    {match.team2Score}
                  </motion.span>
                </div>

                <MatchMetadata
                  type={match.matchType}
                  court={match.location.name}
                  time={formattedTime}
                />
              </div>

              <TeamSide players={match.team2} isWinner={match.winningTeam === 2} align="right" />
            </div>

            {/* Mobile View */}
            <div className="sm:hidden">
              <div className="px-4 pb-4 pt-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                  <TeamSide players={match.team1} isWinner={match.winningTeam === 1} mobile />

                  <div className="flex min-w-[66px] justify-center font-mono text-lg font-semibold tabular-nums">
                    <span className={match.winningTeam === 1 ? 'text-foreground' : 'text-muted-foreground'}>
                      {match.team1Score}
                    </span>
                    <span className="px-1 text-[10px] text-muted-foreground/35">—</span>
                    <span className={match.winningTeam === 2 ? 'text-foreground' : 'text-muted-foreground'}>
                      {match.team2Score}
                    </span>
                  </div>

                  <TeamSide players={match.team2} isWinner={match.winningTeam === 2} align="right" mobile />
                </div>
              </div>

              <div className="border-t border-border/40 px-4 py-2.5">
                <MatchMetadata
                  type={match.matchType}
                  court={match.location.name}
                  time={formattedTime}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}