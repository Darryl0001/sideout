import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PlayerSortOption } from '@/types';
import { useData } from '@/context/DataContext';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlayerPublicCard } from '@/components/public/players/PlayerPublicCard';
import { EmptySearchState } from '@/components/public/players/EmptySearchState';

export function PublicPlayersView() {
  const { players, matches } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<PlayerSortOption>('rating');

  const filteredAndSortedPlayers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return [...players]
      .filter((player) => !query || player.displayName.toLowerCase().includes(query))
      .sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return b.stats.rating - a.stats.rating;
          case 'winRate':
            return b.stats.winRate - a.stats.winRate;
          case 'totalMatches':
            return b.stats.totalMatches - a.stats.totalMatches;
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'nameAsc':
          default:
            return a.displayName.localeCompare(b.displayName);
        }
      });
  }, [players, searchQuery, sortBy]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Header */}
      <section className="border-b border-border/60 pb-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
              The players
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-5 text-xs text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">{players.length}</span> players
            </div>

            <div className="h-3.5 w-px bg-border" />

            <div>
              <span className="font-medium text-foreground">{matches.length}</span> matches
            </div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="py-6">
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <motion.div 
            className="relative flex-1"
            whileFocus={{ scale: 1.005 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search players..."
              className="h-10 rounded-lg border-border/70 bg-background pl-9 text-sm shadow-none placeholder:text-muted-foreground/60 focus-visible:ring-1"
            />
          </motion.div>

          <Select
            value={sortBy}
            onValueChange={(val) => setSortBy(val as PlayerSortOption)}
          >
            <SelectTrigger className="h-10 w-full rounded-lg border-border/70 bg-background text-xs shadow-none sm:w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest rating</SelectItem>
              <SelectItem value="winRate">Win rate</SelectItem>
              <SelectItem value="totalMatches">Most matches</SelectItem>
              <SelectItem value="nameAsc">Name (A-Z)</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Animated Grid */}
      {filteredAndSortedPlayers.length > 0 ? (
        <motion.section 
          layout
          className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSortedPlayers.map((player, index) => (
              <PlayerPublicCard
                key={player.id}
                player={player}
                rankIndex={sortBy === 'rating' ? index + 1 : undefined}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.section>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
        >
          <EmptySearchState />
        </motion.div>
      )}
    </main>
  );
}