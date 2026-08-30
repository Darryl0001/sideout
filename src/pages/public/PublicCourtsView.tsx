import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Location } from '@/types';
import { useData } from '@/context/DataContext';

import { Input } from '@/components/ui/input';
import { Sheet, SheetContent } from '@/components/ui/sheet';

import { CourtListItem } from '@/components/public/courts/CourtListItem';
import { CourtDetail } from '@/components/public/courts/CourtDetail';
import { CourtMap } from '@/components/public/courts/CourtMap';

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'indoor', label: 'Indoor' },
  { value: 'outdoor', label: 'Outdoor' },
] as const;

export function PublicCourtsView() {
  const { locations, matches } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'indoor' | 'outdoor'>('all');
  const [selectedCourt, setSelectedCourt] = useState<Location | null>(null);

  const defaultCenter = useMemo<[number, number]>(() => {
    if (locations.length > 0) {
      return [locations[0].latitude, locations[0].longitude];
    }
    return [8.4822, 124.6472];
  }, [locations]);

  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
  const [mapZoom, setMapZoom] = useState(13);

  const getCourtMatches = (courtId: string) => {
    return matches.filter((match) => match.location.id === courtId);
  };

  const filteredCourts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return locations.filter((court) => {
      const matchesSearch =
        !query ||
        court.name.toLowerCase().includes(query) ||
        court.address?.toLowerCase().includes(query);

      const matchesType =
        selectedType === 'all' || court.courtType === selectedType;

      return matchesSearch && matchesType;
    });
  }, [locations, searchQuery, selectedType]);

  const handleSelectCourt = (court: Location) => {
    setSelectedCourt(court);
    setMapCenter([court.latitude, court.longitude]);
    setMapZoom(15);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10"
    >
      {/* Page Header */}
      <motion.header 
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="mb-8 max-w-2xl"
      >
        <h1 className="mt-3 text-4xl font-medium tracking-[-0.04em] text-foreground sm:text-5xl">
          Where the community plays.
        </h1>
        <p className="mt-4 text-xs text-muted-foreground">
          {locations.length} registered {locations.length === 1 ? 'court' : 'courts'}
          <span className="mx-2 text-border">·</span>
          {matches.length} recorded matches
        </p>
      </motion.header>

      {/* Controls Bar */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courts or locations..."
            className="h-10 rounded-lg border-border/70 bg-background pl-10 text-sm shadow-none transition-shadow focus-visible:ring-1"
          />
        </div>

        {/* Sliding Filter Pills */}
        <div className="relative flex h-10 shrink-0 rounded-lg border border-border/70 bg-background p-0.5">
          {filterOptions.map((option) => {
            const isSelected = selectedType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedType(option.value)}
                className="relative rounded-md px-3 text-xs font-medium transition-colors"
              >
                {isSelected && (
                  <motion.div
                    layoutId="courtFilterActiveBg"
                    className="absolute inset-0 rounded-md bg-muted"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span
                  className={[
                    'relative z-10 transition-colors',
                    isSelected ? 'font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground',
                  ].join(' ')}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.995 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid overflow-hidden rounded-xl border border-border/70 bg-background lg:grid-cols-[360px_minmax(0,1fr)]"
      >
        <aside className="flex min-h-[620px] flex-col border-b border-border/70 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <p className="text-xs font-medium text-muted-foreground">
              {filteredCourts.length} {filteredCourts.length === 1 ? 'court' : 'courts'}
            </p>

            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                >
                  Clear
                  <X className="size-3" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredCourts.length === 0 ? (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex min-h-[300px] items-center justify-center px-6 text-center"
                >
                  <div>
                    <p className="text-sm font-medium">No courts found</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Try a different search or filter.
                    </p>
                  </div>
                </motion.div>
              ) : (
                filteredCourts.map((court, index) => (
                  <CourtListItem
                    key={court.id}
                    court={court}
                    matchesCount={getCourtMatches(court.id).length}
                    selected={selectedCourt?.id === court.id}
                    onClick={() => handleSelectCourt(court)}
                    index={index}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </aside>

        <CourtMap
          courts={filteredCourts}
          selectedCourt={selectedCourt}
          mapCenter={mapCenter}
          mapZoom={mapZoom}
          onSelectCourt={handleSelectCourt}
          getMatchCount={(id) => getCourtMatches(id).length}
        />
      </motion.div>

      {/* Drawer Details */}
      <Sheet open={Boolean(selectedCourt)} onOpenChange={(open) => !open && setSelectedCourt(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selectedCourt && (
            <CourtDetail
              court={selectedCourt}
              courtMatches={getCourtMatches(selectedCourt.id)}
            />
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}