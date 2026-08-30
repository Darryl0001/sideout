import { createContext, useContext, useState, type ReactNode, useCallback } from 'react';
import type { Match, Player, Location, PlayerStats, PlayerRank } from '@/types';
import { MOCK_MATCHES, MOCK_PLAYERS, MOCK_LOCATIONS } from '@/data/mockData';

interface DataContextType {
  matches: Match[];
  players: Player[];
  locations: Location[];
  addMatch: (match: Omit<Match, 'id'>) => void;
  updateMatch: (id: string, updatedFields: Partial<Match>) => void;
  deleteMatch: (id: string) => void;
  addPlayer: (player: Omit<Player, 'id' | 'stats' | 'createdAt'>) => void;
  updatePlayer: (id: string, updatedFields: Partial<Player>) => void;
  deletePlayer: (id: string) => void;
  addLocation: (location: Omit<Location, 'id' | 'createdAt'>) => void;
  updateLocation: (id: string, updatedFields: Partial<Location>) => void;
  deleteLocation: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function getRankFromRating(rating: number): PlayerRank {
  if (rating >= 1600) return 'Diamond';
  if (rating >= 1400) return 'Platinum';
  if (rating >= 1200) return 'Gold';
  if (rating >= 1000) return 'Silver';
  return 'Bronze';
}

function recalculatePlayerStats(playersList: Player[], matchesList: Match[]): Player[] {
  const statsMap: Record<string, { wins: number; losses: number; totalMatches: number }> = {};

  playersList.forEach((p) => {
    statsMap[p.id] = { wins: 0, losses: 0, totalMatches: 0 };
  });

  matchesList.forEach((match) => {
    const isTeam1Winner = match.winningTeam === 1;

    match.team1.forEach((p) => {
      if (!statsMap[p.id]) return;
      statsMap[p.id].totalMatches += 1;
      if (isTeam1Winner) statsMap[p.id].wins += 1;
      else statsMap[p.id].losses += 1;
    });

    match.team2.forEach((p) => {
      if (!statsMap[p.id]) return;
      statsMap[p.id].totalMatches += 1;
      if (!isTeam1Winner) statsMap[p.id].wins += 1;
      else statsMap[p.id].losses += 1;
    });
  });

  return playersList.map((player) => {
    const s = statsMap[player.id] || { wins: 0, losses: 0, totalMatches: 0 };
    const winRate = s.totalMatches > 0 ? (s.wins / s.totalMatches) * 100 : 0;
    
    const currentRating = player.stats?.rating ?? 1000;
    const currentRank = getRankFromRating(currentRating);

    const stats: PlayerStats = {
      totalMatches: s.totalMatches,
      wins: s.wins,
      losses: s.losses,
      winRate: Number(winRate.toFixed(1)),
      rating: currentRating,
      rank: currentRank,
    };

    return { ...player, stats };
  });
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [locations, setLocations] = useState<Location[]>(MOCK_LOCATIONS);
  const [players, setPlayers] = useState<Player[]>(() =>
    recalculatePlayerStats(MOCK_PLAYERS, MOCK_MATCHES)
  );

  const addMatch = useCallback((newMatchData: Omit<Match, 'id'>) => {
    const newMatch: Match = {
      ...newMatchData,
      id: `m-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    };

    setMatches((prevMatches) => {
      const updatedMatches = [newMatch, ...prevMatches];
      setPlayers((prevPlayers) => recalculatePlayerStats(prevPlayers, updatedMatches));
      return updatedMatches;
    });
  }, []);

  const updateMatch = useCallback((id: string, updatedFields: Partial<Match>) => {
    setMatches((prevMatches) => {
      const updatedMatches = prevMatches.map((match) =>
        match.id === id ? { ...match, ...updatedFields } : match
      );
      setPlayers((prevPlayers) => recalculatePlayerStats(prevPlayers, updatedMatches));
      return updatedMatches;
    });
  }, []);

  const deleteMatch = useCallback((id: string) => {
    setMatches((prevMatches) => {
      const updatedMatches = prevMatches.filter((match) => match.id !== id);
      setPlayers((prevPlayers) => recalculatePlayerStats(prevPlayers, updatedMatches));
      return updatedMatches;
    });
  }, []);

  const addPlayer = useCallback((newPlayerData: Omit<Player, 'id' | 'stats' | 'createdAt'>) => {
    const defaultRating = 1000;
    const newPlayer: Player = {
      ...newPlayerData,
      id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      stats: {
        totalMatches: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        rating: defaultRating,
        rank: getRankFromRating(defaultRating),
      },
    };

    setPlayers((prev) => [...prev, newPlayer]);
  }, []);

  const updatePlayer = useCallback((id: string, updatedFields: Partial<Player>) => {
    setPlayers((prev) =>
      prev.map((player) => {
        if (player.id !== id) return player;
        
        const updatedPlayer = { ...player, ...updatedFields };
        
        if (updatedFields.stats?.rating !== undefined) {
          updatedPlayer.stats.rank = getRankFromRating(updatedFields.stats.rating);
        }
        
        return updatedPlayer;
      })
    );

    if (updatedFields.displayName || updatedFields.avatarUrl) {
      setMatches((prevMatches) =>
        prevMatches.map((match) => ({
          ...match,
          team1: match.team1.map((p) =>
            p.id === id
              ? {
                  ...p,
                  displayName: updatedFields.displayName ?? p.displayName,
                  avatarUrl: updatedFields.avatarUrl ?? p.avatarUrl,
                }
              : p
          ),
          team2: match.team2.map((p) =>
            p.id === id
              ? {
                  ...p,
                  displayName: updatedFields.displayName ?? p.displayName,
                  avatarUrl: updatedFields.avatarUrl ?? p.avatarUrl,
                }
              : p
          ),
        }))
      );
    }
  }, []);

  const deletePlayer = useCallback((id: string) => {
    setPlayers((prev) => prev.filter((player) => player.id !== id));

    setMatches((prevMatches) => {
      const remainingMatches = prevMatches.filter(
        (m) => !m.team1.some((p) => p.id === id) && !m.team2.some((p) => p.id === id)
      );

      setPlayers((prevPlayers) => recalculatePlayerStats(prevPlayers, remainingMatches));
      return remainingMatches;
    });
  }, []);

  const addLocation = useCallback((newLocationData: Omit<Location, 'id' | 'createdAt'>) => {
    const newLocation: Location = {
      ...newLocationData,
      id: `loc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    setLocations((prev) => [...prev, newLocation]);
  }, []);

  const updateLocation = useCallback((id: string, updatedFields: Partial<Location>) => {
    setLocations((prevLocations) => {
      const updatedLocations = prevLocations.map((loc) =>
        loc.id === id ? { ...loc, ...updatedFields } : loc
      );

      setMatches((prevMatches) =>
        prevMatches.map((match) =>
          match.location.id === id
            ? { ...match, location: { ...match.location, ...updatedFields } }
            : match
        )
      );

      return updatedLocations;
    });
  }, []);

  const deleteLocation = useCallback((id: string) => {
    setLocations((prev) => prev.filter((loc) => loc.id !== id));
  }, []);

  return (
    <DataContext.Provider
      value={{
        matches,
        players,
        locations,
        addMatch,
        updateMatch,
        deleteMatch,
        addPlayer,
        updatePlayer,
        deletePlayer,
        addLocation,
        updateLocation,
        deleteLocation,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}