import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { useData } from '@/context/DataContext';
import type { Match } from '@/types';
import {
  MatchFilterBar,
  type MatchTypeFilter,
  type SortOrder,
} from '@/components/admin/matches/MatchFilterBar';
import { MatchFormModal } from '@/components/admin/matches/MatchFormModal';
import { DeleteMatchModal } from '@/components/admin/matches/DeleteMatchModal';
import { Button } from '@/components/ui/button';
import { MatchHistoryList } from '@/components/admin/matches/MatchHistoryList';

export function AdminMatchManagementView() {
  const { matches, players, locations, addMatch, updateMatch, deleteMatch } = useData();

  // Filter & Search State
  const [filterType, setFilterType] = useState<MatchTypeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [matchToDeleteId, setMatchToDeleteId] = useState<string | null>(null);

  // Filter & Sort Logic
  const filteredMatches = useMemo(() => {
    return matches
      .filter((match) => {
        // Match Type Filter
        if (filterType !== 'all' && match.matchType !== filterType) {
          return false;
        }

        // Search Query (Player Names & Location)
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const allPlayers = [...match.team1, ...match.team2];
          const hasMatchingPlayer = allPlayers.some((p) =>
            p.displayName.toLowerCase().includes(query)
          );
          const hasMatchingLocation = match.location.name
            .toLowerCase()
            .includes(query);

          if (!hasMatchingPlayer && !hasMatchingLocation) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.playedAt).getTime();
        const timeB = new Date(b.playedAt).getTime();
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [matches, filterType, searchQuery, sortOrder]);

  // Handlers
  const handleOpenCreateModal = () => {
    setSelectedMatch(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (match: Match) => {
    setSelectedMatch(match);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (matchId: string) => {
    setMatchToDeleteId(matchId);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = (matchData: Omit<Match, 'id'>) => {
    if (selectedMatch) {
      updateMatch(selectedMatch.id, matchData);
      toast.success('Match updated', {
        description: 'The match details and scores have been updated.',
      });
    } else {
      addMatch(matchData);
      toast.success('Match logged', {
        description: 'New match record successfully logged to history.',
      });
    }
    setIsFormModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (matchToDeleteId) {
      deleteMatch(matchToDeleteId);
      toast.error('Match deleted', {
        description: 'The match record has been permanently removed.',
      });
      setMatchToDeleteId(null);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Match Management
          </h2>
        </div>

        <Button onClick={handleOpenCreateModal} className="shrink-0 gap-2">
          <Plus className="h-4 w-4" />
          <span>Log New Match</span>
        </Button>
      </div>

      {/* Search & Filter Toolbar */}
      <MatchFilterBar
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      {/* New Vertical Stack Match Cards */}
      <MatchHistoryList
        matches={filteredMatches}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
      />

      {/* Add / Edit Match Modal */}
      <MatchFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        availablePlayers={players}
        availableLocations={locations}
        initialData={selectedMatch}
      />

      {/* Delete Confirmation Modal */}
      <DeleteMatchModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}