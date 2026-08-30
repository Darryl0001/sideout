export interface Location {
  id: string;
  name: string;
  address?: string;
  courtType: 'indoor' | 'outdoor';
  latitude: number;
  longitude: number;
  imageUrl?: string;
  createdAt: string;
}

export type PlayerRank =
  | 'Bronze'
  | 'Silver'
  | 'Gold'
  | 'Platinum'
  | 'Diamond';

export interface PlayerStats {
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  rating: number;
  rank: PlayerRank;
}

export interface Player {
  id: string;
  slug: string;
  displayName: string;
  avatarUrl: string;
  createdAt: string;
  stats: PlayerStats;
}

export interface TeamMember {
  id: string;
  displayName: string;
  avatarUrl: string;
}

export interface Match {
  id: string;
  location: Location;
  matchType: 'singles' | 'doubles';
  team1Score: number;
  team2Score: number;
  playedAt: string;
  winningTeam: 1 | 2;
  team1: TeamMember[];
  team2: TeamMember[];
}

export type UserRole = 'guest' | 'moderator' | 'admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
}

export type PlayerSortOption =
  | 'rating'
  | 'winRate'
  | 'totalMatches'
  | 'nameAsc'
  | 'newest';

export type MatchTypeFilter =
  | 'all'
  | 'singles'
  | 'doubles';

export type SortOrder =
  | 'newest'
  | 'oldest';