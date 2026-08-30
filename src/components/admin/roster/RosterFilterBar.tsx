import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PlayerSortOption } from '@/types';

interface RosterFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: PlayerSortOption;
  onSortChange: (value: PlayerSortOption) => void;
}

export function RosterFilterBar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: RosterFilterBarProps) {
  return (
    <div className="flex w-full items-center gap-2">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60" />

        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search players..."
          className="h-9 rounded-lg border-border/60 bg-muted/30 pl-8 pr-3 text-xs shadow-none placeholder:text-muted-foreground/60 focus-visible:bg-background"
        />
      </div>

      <Select
        value={sortBy}
        onValueChange={(value) =>
          onSortChange(value as PlayerSortOption)
        }
      >
        <SelectTrigger className="h-9 w-[120px] shrink-0 rounded-lg border-border/60 bg-muted/30 px-2.5 text-xs font-medium shadow-none focus:ring-0">
          <SelectValue />
        </SelectTrigger>

        <SelectContent
          align="end"
          className="rounded-lg border-border/60"
        >
          <SelectItem
            value="winRate"
            className="rounded-md text-xs"
          >
            Win rate
          </SelectItem>

          <SelectItem
            value="totalMatches"
            className="rounded-md text-xs"
          >
            Matches
          </SelectItem>

          <SelectItem
            value="nameAsc"
            className="rounded-md text-xs"
          >
            Name
          </SelectItem> 

          <SelectItem
            value="newest"
            className="rounded-md text-xs"
          >
            Newest
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}