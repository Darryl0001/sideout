import { Match } from '@/types';
import { MatchRowActions } from './MatchRowActions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, Swords } from 'lucide-react';

interface MatchTableProps {
  matches: Match[];
  onEditMatch: (match: Match) => void;
  onDeleteMatch: (matchId: string) => void;
}

export function MatchTable({ matches, onEditMatch, onDeleteMatch }: MatchTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-gray-200/80 text-center">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
          <Swords className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">No matches recorded</h3>
        <p className="text-xs text-gray-500 max-w-xs mt-1">
          Log a match result to update community rankings, win rates, and player stats.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-gray-200/80 bg-white overflow-hidden shadow-xs">
      <Table>
        {/* Table Header */}
        <TableHeader className="bg-[#F4F4F5]">
          <TableRow className="hover:bg-transparent border-b border-gray-200/80">
            <TableHead className="px-4 py-3.5 text-sm font-medium text-gray-600">
              <div className="flex items-center gap-2">
                <span>Format</span>
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
              </div>
            </TableHead>
            <TableHead className="px-4 py-3.5 text-sm font-medium text-gray-600">
              <div className="flex items-center gap-2">
                <span>Team 1</span>
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
              </div>
            </TableHead>
            <TableHead className="px-4 py-3.5 text-sm font-medium text-gray-600 text-center w-[120px]">
              <div className="flex items-center justify-center gap-2">
                <span>Result</span>
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
              </div>
            </TableHead>
            <TableHead className="px-4 py-3.5 text-sm font-medium text-gray-600">
              <div className="flex items-center gap-2">
                <span>Team 2</span>
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
              </div>
            </TableHead>
            <TableHead className="px-4 py-3.5 text-sm font-medium text-gray-600 w-[180px]">
              <div className="flex items-center gap-2">
                <span>Date Played</span>
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
              </div>
            </TableHead>
            <TableHead className="w-[60px] px-4 py-3.5" />
          </TableRow>
        </TableHeader>

        {/* Table Body */}
        <TableBody>
          {matches.map((match) => {
            const isTeam1Winner = match.winningTeam === 1;
            const isTeam2Winner = match.winningTeam === 2;

            return (
              <TableRow
                key={match.id}
                className="hover:bg-gray-50/60 transition-colors border-b border-gray-100 last:border-none"
              >
                <TableCell className="px-4 py-4 text-sm text-gray-700 capitalize">
                  {match.matchType}
                </TableCell>

                <TableCell className="px-4 py-4 text-sm">
                  <span className={isTeam1Winner ? 'font-medium text-gray-900' : 'text-gray-600'}>
                    {match.team1.map((p) => p.displayName).join(' & ')}
                  </span>
                </TableCell>

                <TableCell className="px-4 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                  <span className={isTeam1Winner ? 'text-gray-900 font-semibold' : 'text-gray-500'}>
                    {match.team1Score}
                  </span>
                  <span className="mx-1.5 text-gray-400">-</span>
                  <span className={isTeam2Winner ? 'text-gray-900 font-semibold' : 'text-gray-500'}>
                    {match.team2Score}
                  </span>
                </TableCell>

                <TableCell className="px-4 py-4 text-sm">
                  <span className={isTeam2Winner ? 'font-medium text-gray-900' : 'text-gray-600'}>
                    {match.team2.map((p) => p.displayName).join(' & ')}
                  </span>
                </TableCell>

                <TableCell className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                  {formatDate(match.playedAt)}
                </TableCell>

                <TableCell className="px-4 py-4 text-right">
                  <MatchRowActions match={match} onEdit={onEditMatch} onDelete={onDeleteMatch} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}