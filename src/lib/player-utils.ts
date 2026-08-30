import type { PlayerRank } from '@/types/player';

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getRankStyle(rank: PlayerRank): string {
  switch (rank) {
    case 'Diamond':
      return 'text-cyan-600 dark:text-cyan-400';
    case 'Platinum':
      return 'text-emerald-600 dark:text-emerald-400';
    case 'Gold':
      return 'text-amber-600 dark:text-amber-400';
    case 'Silver':
      return 'text-slate-500 dark:text-slate-300';
    case 'Bronze':
    default:
      return 'text-orange-700 dark:text-orange-400';
  }
}