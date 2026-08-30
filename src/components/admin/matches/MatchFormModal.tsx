import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Match, Player, TeamMember, Location } from '@/types';
import { PlayerPicker } from './PlayerPicker';
import { Minus, Plus, AlertCircle, MapPin } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MatchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (matchData: Omit<Match, 'id'>) => void;
  availablePlayers: Player[];
  availableLocations: Location[];
  initialData?: Match | null;
}

export function MatchFormModal({
  isOpen,
  onClose,
  onSubmit,
  availablePlayers,
  availableLocations,
  initialData,
}: MatchFormModalProps) {
  const [matchType, setMatchType] = useState<'singles' | 'doubles'>('singles');
  const [team1, setTeam1] = useState<TeamMember[]>([]);
  const [team2, setTeam2] = useState<TeamMember[]>([]);
  const [team1Score, setTeam1Score] = useState(11);
  const [team2Score, setTeam2Score] = useState(8);
  const [locationId, setLocationId] = useState('');
  const [playedAt, setPlayedAt] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setMatchType(initialData.matchType);
      setTeam1(initialData.team1);
      setTeam2(initialData.team2);
      setTeam1Score(initialData.team1Score);
      setTeam2Score(initialData.team2Score);
      setLocationId(initialData.location.id);
      setPlayedAt(
        new Date(initialData.playedAt).toISOString().slice(0, 16)
      );
    } else {
      setMatchType('singles');
      setTeam1([]);
      setTeam2([]);
      setTeam1Score(11);
      setTeam2Score(8);
      setLocationId(availableLocations[0]?.id || '');
      setPlayedAt(new Date().toISOString().slice(0, 16));
    }

    setError(null);
  }, [initialData, isOpen, availableLocations]);

  const requiredPlayerCount = matchType === 'singles' ? 1 : 2;

  const disabledPlayerIds = [...team1, ...team2].map((player) => player.id);

  const handleMatchTypeChange = (value: string) => {
    setMatchType(value as 'singles' | 'doubles');
    setTeam1([]);
    setTeam2([]);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      team1.length < requiredPlayerCount ||
      team2.length < requiredPlayerCount
    ) {
      setError('Select all players for both sides.');
      return;
    }

    if (team1Score === team2Score) {
      setError('A pickleball match cannot end in a tie.');
      return;
    }

    const selectedLocation = availableLocations.find(
      (location) => location.id === locationId
    );

    if (!selectedLocation) {
      setError('Select a court location.');
      return;
    }

    onSubmit({
      matchType,
      team1,
      team2,
      team1Score,
      team2Score,
      winningTeam: team1Score > team2Score ? 1 : 2,
      location: selectedLocation,
      playedAt: new Date(playedAt).toISOString(),
    });

    onClose();
  };

  const team1Won = team1Score > team2Score;
  const team2Won = team2Score > team1Score;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-2xl border-border/60 bg-background p-0 shadow-2xl sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <DialogHeader className="flex flex-row items-center justify-between gap-4 border-b border-border/50 px-5 py-4 sm:px-6">
            <DialogTitle className="text-[15px] font-semibold tracking-tight">
              {initialData ? 'Edit match' : 'Log match'}
            </DialogTitle>

            <Tabs value={matchType} onValueChange={handleMatchTypeChange}>
              <TabsList className="h-8 rounded-lg bg-muted p-0.5">
                <TabsTrigger
                  value="singles"
                  className="h-7 rounded-md px-3 text-xs font-medium"
                >
                  Singles
                </TabsTrigger>

                <TabsTrigger
                  value="doubles"
                  className="h-7 rounded-md px-3 text-xs font-medium"
                >
                  Doubles
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </DialogHeader>

          <div className="space-y-7 px-5 py-5 sm:px-6 sm:py-6">
            {/* Error Message Alert */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/[0.04] px-3 py-2.5 text-xs text-destructive">
                    <AlertCircle className="size-3.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Teams */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Players
                </span>

                <span className="text-[11px] text-muted-foreground/60">
                  {matchType === 'singles' ? '1 vs 1' : '2 vs 2'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <PlayerPicker
                  label="Side A"
                  count={requiredPlayerCount}
                  availablePlayers={availablePlayers}
                  selectedMembers={team1}
                  onChange={setTeam1}
                  disabledPlayerIds={disabledPlayerIds}
                />

                <PlayerPicker
                  label="Side B"
                  count={requiredPlayerCount}
                  availablePlayers={availablePlayers}
                  selectedMembers={team2}
                  onChange={setTeam2}
                  disabledPlayerIds={disabledPlayerIds}
                />
              </div>
            </section>

            {/* Scoreboard */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Final score
                </span>

                <AnimatePresence mode="wait">
                  {team1Score !== team2Score && (
                    <motion.span
                      key={team1Won ? 'side-a' : 'side-b'}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="text-[11px] font-medium text-muted-foreground"
                    >
                      {team1Won ? 'Side A won' : 'Side B won'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/25 p-3">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                  {/* Side A */}
                  <ScoreControl
                    score={team1Score}
                    winner={team1Won}
                    decrement={() =>
                      setTeam1Score((value) => Math.max(0, value - 1))
                    }
                    increment={() =>
                      setTeam1Score((value) => value + 1)
                    }
                  />

                  <div className="px-3 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/50">
                    vs
                  </div>

                  {/* Side B */}
                  <ScoreControl
                    score={team2Score}
                    winner={team2Won}
                    align="right"
                    decrement={() =>
                      setTeam2Score((value) => Math.max(0, value - 1))
                    }
                    increment={() =>
                      setTeam2Score((value) => value + 1)
                    }
                  />
                </div>
              </div>
            </section>

            {/* Match Details */}
            <section className="space-y-3">
              <span className="text-xs font-medium text-muted-foreground">
                Match details
              </span>

              <div className="space-y-3">
                {/* Court */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-muted-foreground/70">
                    Court
                  </label>

                  <Select value={locationId} onValueChange={setLocationId}>
                    <SelectTrigger className="h-10 rounded-lg border-border/60 bg-muted/30 shadow-none">
                      <div className="flex items-center gap-2">
                        <MapPin className="size-3.5 text-muted-foreground" />
                        <SelectValue placeholder="Select court" />
                      </div>
                    </SelectTrigger>

                    <SelectContent className="rounded-lg">
                      {availableLocations.map((location) => (
                        <SelectItem
                          key={location.id}
                          value={location.id}
                          className="text-sm"
                        >
                          <div className="flex flex-col items-start">
                            <span>{location.name}</span>
                            <span className="text-[11px] text-muted-foreground">
                              {location.courtType}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Played */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="played-at"
                    className="text-[11px] font-medium text-muted-foreground/70"
                  >
                    Played
                  </label>

                  <Input
                    id="played-at"
                    type="datetime-local"
                    value={playedAt}
                    onChange={(e) => setPlayedAt(e.target.value)}
                    className="h-10 rounded-lg border-border/60 bg-muted/30 text-sm shadow-none"
                  />
                </div>
              </div>
            </section>
          </div>

          <DialogFooter className="border-t border-border/50 px-5 py-4 sm:px-6">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="h-9 rounded-lg px-3 text-sm"
            >
              Cancel
            </Button>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Button
                type="submit"
                className="h-9 rounded-lg px-4 text-sm font-medium"
              >
                {initialData ? 'Save match' : 'Log match'}
              </Button>
            </motion.div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface ScoreControlProps {
  score: number;
  winner: boolean;
  decrement: () => void;
  increment: () => void;
  align?: 'left' | 'right';
}

function ScoreControl({
  score,
  winner,
  decrement,
  increment,
  align = 'left',
}: ScoreControlProps) {
  const isRight = align === 'right';

  return (
    <div
      className={`flex items-center gap-2 ${
        isRight ? 'justify-end' : 'justify-start'
      }`}
    >
      <motion.div whileTap={{ scale: 0.88 }} transition={{ duration: 0.1 }}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={decrement}
          className="size-8 rounded-md text-muted-foreground hover:bg-background hover:text-foreground"
        >
          <Minus className="size-3.5" />
        </Button>
      </motion.div>

      <AnimatePresence mode="popLayout">
        <motion.span
          key={score}
          initial={{ opacity: 0, y: isRight ? -4 : 4, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: isRight ? 4 : -4, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`w-10 text-center font-mono text-3xl font-semibold tabular-nums tracking-tight ${
            winner ? 'text-foreground' : 'text-muted-foreground'
          }`}
        >
          {score}
        </motion.span>
      </AnimatePresence>

      <motion.div whileTap={{ scale: 0.88 }} transition={{ duration: 0.1 }}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={increment}
          className="size-8 rounded-md text-muted-foreground hover:bg-background hover:text-foreground"
        >
          <Plus className="size-3.5" />
        </Button>
      </motion.div>
    </div>
  );
}