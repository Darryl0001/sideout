import { useState, useMemo } from 'react';
import { Users, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { useData } from '@/context/DataContext';
import type { Player } from '@/types';
import {
  RosterFilterBar,
  type PlayerSortOption,
} from '@/components/admin/roster/RosterFilterBar';
import { PlayerCard } from '@/components/admin/roster/PlayerCard';
import { PlayerFormModal } from '@/components/admin/roster/PlayerFormModal';
import { DeletePlayerModal } from '@/components/admin/roster/DeletePlayerModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function AdminRosterView() {
  const { players, addPlayer, updatePlayer, deletePlayer } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<PlayerSortOption>('rating');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);

  const filteredPlayers = useMemo(() => {
    return players
      .filter((player) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
          player.displayName.toLowerCase().includes(query) ||
          player.slug.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return b.stats.rating - a.stats.rating;
          case 'winRate':
            return b.stats.winRate - a.stats.winRate;
          case 'totalMatches':
            return b.stats.totalMatches - a.stats.totalMatches;
          case 'nameAsc':
            return a.displayName.localeCompare(b.displayName);
          case 'newest':
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          default:
            return 0;
        }
      });
  }, [players, searchQuery, sortBy]);

  const handleOpenCreateModal = () => {
    setSelectedPlayer(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (player: Player) => {
    setSelectedPlayer(player);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (playerId: string) => {
    const target = players.find((p) => p.id === playerId) || null;
    setPlayerToDelete(target);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = (
    playerData: Omit<Player, 'id' | 'stats' | 'createdAt'>
  ) => {
    if (selectedPlayer) {
      updatePlayer(selectedPlayer.id, playerData);
      toast.success('Player updated', {
        description: `${playerData.displayName}'s profile has been updated.`,
      });
    } else {
      addPlayer(playerData);
      toast.success('Player created', {
        description: `${playerData.displayName} was added to the roster.`,
      });
    }
    setIsFormModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (playerToDelete) {
      deletePlayer(playerToDelete.id);
      toast.error('Player deleted', {
        description: `${playerToDelete.displayName} was removed from the roster.`,
      });
      setPlayerToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
        >
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Player Roster
          </h2>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <Button onClick={handleOpenCreateModal} className="shrink-0 gap-2">
            <Plus className="h-4 w-4" />
            <span>Add New Player</span>
          </Button>
        </motion.div>
      </div>

      {/* Filter Bar */}
      <RosterFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Player Grid / Empty State */}
      <AnimatePresence mode="wait">
        {filteredPlayers.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-dashed bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Users className="h-5 w-5" />
                </div>
                <div className="max-w-sm space-y-1">
                  <p className="text-sm font-bold text-foreground">
                    No players found
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    No roster results match your current filter or search criteria.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="player-grid"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.04,
                },
              },
            }}
            className="grid grid-cols-1 gap-4 pb-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredPlayers.map((player) => (
              <motion.div
                key={player.id}
                layout
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <PlayerCard
                  player={player}
                  onEdit={handleOpenEditModal}
                  onDelete={handleOpenDeleteModal}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <PlayerFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedPlayer}
      />

      <DeletePlayerModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        playerName={playerToDelete?.displayName}
      />
    </motion.div>
  );
}