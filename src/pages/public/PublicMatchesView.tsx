import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Match, MatchTypeFilter } from '@/types';
import { useData } from '@/context/DataContext';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { MatchResultCard } from '@/components/public/matches/MatchResultCard';

export function PublicMatchesView() {
  const { matches } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [matchType, setMatchType] = useState<MatchTypeFilter>('all');

  const filteredMatches = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return matches.filter((match) => {
      const matchesSearch =
        !query ||
        match.location.name.toLowerCase().includes(query) ||
        match.team1.some((p) => p.displayName.toLowerCase().includes(query)) ||
        match.team2.some((p) => p.displayName.toLowerCase().includes(query));

      const matchesType = matchType === 'all' || match.matchType === matchType;

      return matchesSearch && matchesType;
    });
  }, [matches, searchQuery, matchType]);

  const dateGroups = useMemo(() => {
    const groups: Record<string, Match[]> = {};

    filteredMatches.forEach((match) => {
      const dateKey = new Date(match.playedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }).toUpperCase();

      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(match);
    });

    return groups;
  }, [filteredMatches]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <header className="border-b border-border pb-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Match results
          </h1>
          <p className="shrink-0 text-xs text-muted-foreground">
            {matches.length} matches recorded
          </p>
        </div>
      </header>

      <section className="border-b border-border py-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <motion.div 
            className="relative flex-1"
            whileFocus={{ scale: 1.005 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search player or court"
              className="h-10 rounded-lg border-border/70 bg-background pl-9 text-sm shadow-none focus-visible:ring-1"
            />
          </motion.div>

          <Select
            value={matchType}
            onValueChange={(val) => setMatchType(val as MatchTypeFilter)}
          >
            <SelectTrigger className="h-10 w-full rounded-lg border-border/70 bg-background text-sm shadow-none sm:w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All matches</SelectItem>
              <SelectItem value="singles">Singles</SelectItem>
              <SelectItem value="doubles">Doubles</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {filteredMatches.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="rounded-xl border-dashed border-border/70 bg-muted/10 shadow-none">
                <CardContent className="flex min-h-32 items-center justify-center px-6 py-10 text-center">
                  <div>
                    <p className="text-sm font-medium text-foreground">No matches found</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Try a different player, court, or match type.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div key="results" className="space-y-10" layout>
              {Object.entries(dateGroups).map(([date, groupMatches], groupIdx) => (
                <motion.section 
                  key={date} 
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIdx * 0.05 }}
                >
                  {/* Timeline Header */}
                  <div className="flex items-center gap-4">
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      {date}
                    </motion.span>
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="h-px flex-1 origin-left bg-border/70" 
                    />
                  </div>

                  {/* Match List */}
                  <div className="mt-3 space-y-2">
                    <AnimatePresence mode="popLayout">
                      {groupMatches.map((match, matchIdx) => (
                        <MatchResultCard 
                          key={match.id} 
                          match={match} 
                          index={matchIdx}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.section>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}