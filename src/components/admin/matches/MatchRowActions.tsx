import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Match } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MatchRowActionsProps {
  match: Match;
  onEdit: (match: Match) => void;
  onDelete: (matchId: string) => void;
}

export function MatchRowActions({ match, onEdit, onDelete }: MatchRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
          aria-label="Open match actions menu"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40 rounded-2xl p-1.5 bg-white border border-gray-200/80 shadow-md">
        <div className="text-xs font-semibold text-muted-foreground px-2 py-1">
          Actions
        </div>
        <DropdownMenuSeparator className="my-1 bg-gray-100" />

        <DropdownMenuItem
          onClick={() => onEdit(match)}
          className="rounded-xl cursor-pointer text-xs font-medium text-gray-700 hover:bg-gray-100 outline-none"
        >
          <Pencil className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDelete(match.id)}
          className="rounded-xl cursor-pointer text-xs font-medium text-red-600 focus:bg-red-50 focus:text-red-600 outline-none"
        >
          <Trash2 className="h-3.5 w-3.5 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}