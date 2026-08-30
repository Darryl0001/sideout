import { Swords } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface MatchBreakdownCardProps {
  label: string;
  wins: number;
  totalMatches: number;
}

export function MatchBreakdownCard({ label, wins, totalMatches }: MatchBreakdownCardProps) {
  const percentage = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

  return (
    <Card className="rounded-2xl border-border/70 bg-card shadow-none transition-colors duration-200 hover:border-border">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">
              {wins}
              <span className="mx-1 text-muted-foreground/40">/</span>
              <span className="text-muted-foreground">{totalMatches}</span>
            </p>
          </div>
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Swords className="size-4 text-muted-foreground/50" />
          </motion.div>
        </div>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: percentage / 100 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.15 }}
            className="h-full origin-left rounded-full bg-foreground"
          />
        </div>
      </CardContent>
    </Card>
  );
}